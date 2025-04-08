const { Payment } = require("../../models/payment.js");
// const { PaymentMethod } = require("../../models/paymentMethod");
const { PromoCode } = require("../../models/promoCode");
const { User } = require("../../models/user");
const { Item } = require("../../models/item");
const { getS3Item } = require("../../utils/s3Actions.js");
const {
  generateReceiptNumber,
} = require("../../utils/generateReceiptNumber.js");
const { createOrder } = require("../../utils/createOrder");
const { getUserId } = require("../../utils/getUserId");
const {
  createPaymentUrl,
  createCoupon,
  getTaxRates,
  // createCustomer,
  // searchCustomerByEmail,
  // createSourceAndAttachToCustomer,
  // chargeCustomerWithSource,
  // createStripeToken,
  // chargeWithToken,
  // addPaymentMethod,
} = require("../../utils/stripe");

// Add Razorpay import
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const validatePromoCode = async (promoCodeString) => {
  const currentDate = new Date();
  const promoCode = await PromoCode.findOne({
    code: promoCodeString.toUpperCase(),
  });

  if (!promoCode) {
    // Promo code not found in database
    return { valid: false };
  }

  // Check if max redemptions reached
  if (
    promoCode.maxRedemptions &&
    promoCode.redeemed >= promoCode.maxRedemptions
  ) {
    return false;
  }
  // Check if promo code is expired
  if (
    new Date(promoCode.validTo) < currentDate ||
    new Date(promoCode.validFrom) > currentDate
  ) {
    return { valid: false };
  }
  promoCode.redeemed++;
  await promoCode.save();
  return {
    valid: true,
    discountType: promoCode.discountType,
    discountValue: promoCode.discountValue,
  };
};
const createRazorpayOrder = async (
  amount,
  currency = "INR",
  user,
  newOrder
) => {
  const options = {
    amount, // Razorpay expects the amount in the smallest currency unit (e.g., paise)
    currency,
    receipt: generateReceiptNumber(), // Use the receipt number generator function
    notes: {
      email: user.email,
      orderId: newOrder._id,
      // You can add more notes here if needed
    },
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    return order;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw new Error("Error in creating Razorpay order");
  }
};
// Calculate total amount for payment gateway - match frontend calculation exactly
const calculateTotalAmount = async (orderInput) => {
  let quantifiedItems = [...orderInput.items];
  let totalAmount = 0;

  for (const q_item of quantifiedItems) {
    const item = await Item.findById(q_item.item);

    if (!item) {
      throw new Error("Item not found");
    }

    // Match the frontend calculation exactly based on currency
    if (process.env.CURRENCY === "cad") {
      // For CAD: Apply discount only (no tax in item price)
      // Exactly matching frontend calculation
      const itemPrice =
        Math.round(item.price.value * (1 - item.discount / 100) * 100) / 100;

      // Calculate the total for all items of this type
      const itemTotal = Math.round(itemPrice * q_item.quantity * 100) / 100;

      // Add to running total
      totalAmount += itemTotal;
    } else {
      // For INR: Apply both tax and discount at the item level
      // Exactly matching frontend calculation
      const itemPrice =
        Math.round(
          item.price.value *
            (1 + item.tax / 100) *
            (1 - item.discount / 100) *
            100
        ) / 100;

      // Calculate the total for all items of this type
      const itemTotal = Math.round(itemPrice * q_item.quantity * 100) / 100;

      // Add to running total
      totalAmount += itemTotal;
    }
  }

  // Final rounding - match frontend
  totalAmount = Math.round(totalAmount * 100) / 100;

  // Convert to cents for payment processing
  return Math.round(totalAmount * 100);
};

const paymentResolver = {
  Query: {
    paymentsByUser: async (_parent, {}, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      // executing
      try {
        // Filtering out user specific payments
        const payments = await Payment.find({
          user: userId,
        });
        return payments.map((payment) => payment._doc);
      } catch (error) {
        throw error;
      }
    },
    singlePayment: async (_parent, { paymentId }, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      try {
        const payment = await Payment.find({
          _id: paymentId,
          user: userId,
        })[0];
        if (!payment) {
          throw new Error("Invalid payment!");
        }
        return payment._doc;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    // Adding payment
    generateStripePaymentUrlData: async (
      _parent,
      { orderInput },
      { req },
      _info
    ) => {
      const userId = getUserId(req);
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      try {
        // Step 1: Calculate subtotal (already in cents from calculateTotalAmount)
        let subTotal = await calculateTotalAmount(orderInput);

        // Step 2: Validate promo code and calculate discount
        let promoCodeInfo,
          discount = 0;
        if (orderInput.promoCode) {
          promoCodeInfo = await validatePromoCode(orderInput.promoCode);
          if (promoCodeInfo && promoCodeInfo.valid) {
            if (promoCodeInfo.discountType === "percent") {
              // Match frontend calculation exactly
              const subTotalInDollars = subTotal / 100; // Convert to dollars for calculation
              discount =
                Math.round(
                  ((subTotalInDollars * promoCodeInfo.discountValue) / 100) *
                    100
                ) / 100;
              // Convert back to cents
              discount = Math.round(discount * 100);
            } else {
              // For amount discount - convert to cents
              discount = Math.round(promoCodeInfo.discountValue * 100);
            }
          }
        }

        // Step 3: Apply discount
        let subtotalAfterDiscount = subTotal - discount;

        // Step 4: Apply regional tax if applicable - calculate tax BEFORE delivery fee
        let taxAmount = 0;
        if (process.env.CURRENCY !== "inr") {
          // For CAD: Apply tax to (subtotal - discount) BEFORE adding shipping
          const taxRate = parseFloat(process.env.TAX_COUNTRY) / 100;
          // Use Math.round instead of Math.ceil to match frontend calculation exactly
          taxAmount = Math.round(subtotalAfterDiscount * taxRate);
        }

        // Add tax to get taxed subtotal
        let taxedSubtotal = subtotalAfterDiscount + taxAmount;

        // Step 5: Add delivery fee AFTER tax calculation
        let deliveryFee = parseInt(process.env.DEFAULT_DELIVERY_FEE) * 100;
        let totalPrice = taxedSubtotal + deliveryFee;

        // Ensure totalPrice is a precise integer value
        totalPrice = Math.round(totalPrice);

        // Step 6: Prepare additional information for order creation
        let additionalInfo = {
          subTotal,
          deliveryFee,
          discount,
          taxAmount, // Add the ceiling-rounded tax amount
          totalPrice,
          userId,
        };

        // Step 7: Create the order in the database
        const newOrder = await createOrder(orderInput, additionalInfo);

        // Step 8: Prepare line items for Stripe
        let line_Items = [];
        let taxRates = await getTaxRates();
        let hstRate = taxRates.data.find(
          (tax) => tax.description === "Harmonized Sales Tax"
        );

        // Note: Since we're now using the exact tax amount in the order creation,
        // we're maintaining consistency by using Stripe's tax_rates system
        // which will calculate the same amount with the standard rounding approach
        for (const q_item of orderInput.items) {
          const item = await Item.findById(q_item.item);
          if (!item) {
            throw new Error("Item not found");
          }

          // Fetch the item's default image dynamically
          let defaultImage = "";
          if (item.images && item.images.length) {
            defaultImage = await getS3Item(
              item.images[0].filename,
              process.env.S3_BUCKET_NAME_ITEM
            );
          }

          // Match frontend calculation for item price
          const amount = Math.round(
            item.price.value * (1 - item.discount / 100) * 100
          );

          // Prepare the line item for Stripe
          line_Items.push({
            name: item.name,
            description: item.description,
            amount: amount,
            currency: process.env.CURRENCY,
            quantity: q_item.quantity,
            images: defaultImage ? [defaultImage] : [],
            tax_rates: process.env.CURRENCY !== "inr" ? [hstRate?.id] : null,
          });
        }

        // Step 9: Prepare discounts for Stripe
        let discounts = [];
        if (promoCodeInfo && promoCodeInfo.valid) {
          const couponInput = {
            type: promoCodeInfo.discountType,
            value: promoCodeInfo.discountValue,
            duration: "once",
            name: orderInput.promoCode,
          };
          const coupon = await createCoupon(couponInput);
          discounts.push({ coupon: coupon.id });
        }

        // Step 10: Generate Stripe payment URL
        const paymentUrl = await createPaymentUrl(
          line_Items,
          discounts,
          deliveryFee,
          user.email,
          newOrder._id.toString()
        );

        // Return the payment URL
        return { url: paymentUrl };
      } catch (error) {
        console.error("Error generating Stripe payment URL:", error);
        throw new Error("Error processing payment");
      }
    },
    // updating an payment
    updatePaymentData: async (
      _parent,
      { paymentId, paymentUpdateInput },
      { req },
      _info
    ) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      try {
        let payment = await Payment.findById(paymentId)
          .populate({
            path: "user",
          })
          .exec();
        let updates = {};
        // updating the payment
        if (paymentInput !== undefined) {
          updates.status = paymentUpdateInput.status;
          updates.date = paymentUpdateInput.date;
        }
        let revisedPayment = await Payment.findByIdAndUpdate(
          paymentId,
          {
            $set: updates,
          },
          { new: true }
        );
        return {
          message: `Payment with payment number #${revisedPayment._id} was updated successfully`,
        };
      } catch (error) {
        throw error;
      }
    },
    // Generating Razor payment URL
    generateRazorPaymentUrlData: async (
      _parent,
      { orderInput },
      { req },
      _info
    ) => {
      const userId = getUserId(req);
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      try {
        let totalPrice = await calculateTotalAmount(orderInput); // Updated function
        let currency = "INR"; // Set the currency

        let promoCodeInfo;
        let customerEmail = user.email;
        if (orderInput.promoCode) {
          promoCodeInfo = await validatePromoCode(orderInput.promoCode);
        }
        let deliveryFee = parseInt(process.env.DEFAULT_DELIVERY_FEE) * 100;

        let subTotal = totalPrice;
        let discount;
        if (promoCodeInfo && promoCodeInfo.valid) {
          if (promoCodeInfo.discountType === "percent") {
            discount = Math.round(
              subTotal * (promoCodeInfo.discountValue / 100)
            );
          } else {
            discount = promoCodeInfo.discountValue * 100; // assuming the discount value is in major units
          }
        }

        if (discount) {
          totalPrice -= discount;
        }

        if (process.env.CURRENCY !== "inr") {
          totalPrice = Math.round(
            totalPrice * (1 + process.env.TAX_COUNTRY / 100)
          );
        }

        if (deliveryFee) {
          totalPrice += deliveryFee;
        }

        totalPrice = parseInt(totalPrice);

        let additionalInfo = {
          subTotal,
          deliveryFee,
          discount,
          totalPrice,
          userId,
        };

        const newOrder = await createOrder(orderInput, additionalInfo);
        const razorpayOrder = await createRazorpayOrder(
          totalPrice,
          currency,
          user,
          newOrder
        );

        const razorPayInfo = {
          key: process.env.RAZORPAY_KEY_ID,
          image: process.env.BRAND_LOGO_IMAGE_URL,
          order_id: razorpayOrder.id,
          amount: totalPrice,
          currency: process.env.ACTIVECURRENCY,
          name: process.env.BRAND_NAME,
          theme: {
            color: process.env.RAZORPAY_THEME_COLOR,
          },
        };

        return razorPayInfo;
      } catch (error) {
        console.log("Error in processing payment:", error);
        throw new Error("Error in processing payment");
      }
    },
  },
};

module.exports = { paymentResolver };
