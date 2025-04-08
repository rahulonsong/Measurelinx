const { PaymentMethod } = require("../models/paymentMethod.js");
const { transformPaymentMethod } = require("../graphql/resolvers/merge");

// const { User } = require("../models/user");

const stripe = require("stripe")(process.env.STRIPE_KEY);

const createPaymentUrl = async (
  line_Items,
  discounts,
  deliveryFee,
  customerEmail,
  orderId // Pass the order ID here
) => {
  try {
    // Get the base URL based on environment
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.VUE_APP_BASE_URL
        : process.env.VUE_APP_BASE_URL_DEV;

    // Create a Stripe Checkout Session
    const stripeInputs = {
      payment_method_types: ["card"],
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: deliveryFee, // Already in cents
              currency: process.env.CURRENCY || "usd",
            },
            display_name: "Delivery Fee",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 7 },
              maximum: { unit: "business_day", value: 10 },
            },
          },
        },
      ],
      discounts: discounts,
      line_items: line_Items.map((item) => ({
        ...item,
        amount: Math.round(item.amount), // Ensure the amount is an integer
      })),
      customer_email: customerEmail,
      payment_intent_data: {
        metadata: {
          orderId: orderId, // Correctly add orderId to payment intent metadata
        },
      },
      mode: "payment",
      success_url: `${baseUrl}/orderconfirmation?fromPayment=true`,
      cancel_url: `${baseUrl}/orderfailed`,
    };

    const session = await stripe.checkout.sessions.create(stripeInputs);
    // console.log("Stripe Session Created:", session.id);
    return session.url; // Return the session URL for redirect
  } catch (error) {
    console.error("Stripe Error:", error);
    throw error; // Rethrow the error for better debugging
  }
};

const createCoupon = async (couponInput) => {
  try {
    let coupon;
    if (couponInput.type === "percent") {
      if (couponInput.duration === "once") {
        coupon = await stripe.coupons.create({
          percent_off: couponInput.value, // % off
          duration: couponInput.duration,
          name: couponInput.name,
        });
      } else {
        coupon = await stripe.coupons.create({
          percent_off: couponInput.value, // % off
          duration: couponInput.duration,
          duration_in_months: couponInput.durationInMonths,
          name: couponInput.name,
        });
      }
    } else {
      if (couponInput.duration === "once") {
        // Creating a coupon with amount_off
        coupon = await stripe.coupons.create({
          amount_off: couponInput.value, // $ off
          currency: process.env.CURRENCY,
          duration: couponInput.duration,
          name: couponInput.name,
        });
      } else {
        // Creating a coupon with amount_off
        coupon = await stripe.coupons.create({
          amount_off: couponInput.value, // $ off
          currency: process.env.CURRENCY,
          duration: couponInput.duration,
          duration_in_months: couponInput.durationInMonths,
          name: couponInput.name,
        });
      }
    }
    return coupon;
  } catch (error) {
    // console.log(error);
    throw error;
  }
};

const getTaxRates = async () => {
  try {
    const taxRates = await stripe.taxRates.list({
      limit: 3,
    });
    return taxRates;
  } catch (error) {
    console.error(error);
    return error;
  }
};
const createCustomer = async (email) => {
  try {
    const customer = await stripe.customers.create({
      email: email,
    });
    return customer;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const searchCustomerByEmail = async (email) => {
  try {
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      return customers.data[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return error;
  }
};

const retrieveCustomer = async (customerId) => {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const createStripeToken = async (card) => {
  try {
    const token = await stripe.tokens.create({
      card: card,
    });

    return token;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const chargeCustomerThroughCustomerID = async (
  customerId,
  amount,
  currency
) => {
  try {
    const charge = await stripe.charges.create({
      amount: amount,
      currency: currency,
      customer: customerId,
    });

    return charge;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const chargeWithToken = async (token, amount, currency, description) => {
  try {
    const charge = await stripe.charges.create({
      amount: amount,
      currency: currency,
      source: token,
      description: description,
    });

    // console.log(`Successfully charged with token ${token}:`, charge);
    return charge;
  } catch (error) {
    console.error(`Error charging with token ${token}:`, error);
  }
};

const addSourceToCustomer = async (customerId, sourceToken) => {
  try {
    const customer = await stripe.customers.update(customerId, {
      source: sourceToken,
    });
    // console.log("Source added to customer:", customer.id);
  } catch (error) {
    console.error("Error adding source to customer:", error.message);
  }
};

const createSource = async (cardDetails) => {
  try {
    const source = await stripe.sources.create({
      type: "card",
      card: cardDetails,
      currency: process.env.CURRENCY,
    });
    return source;
  } catch (error) {
    // console.log("Error creating source:", error);
    throw error;
  }
};

const findSource = async (sourceId) => {
  try {
    const source = await stripe.sources.retrieve(sourceId);
    return source;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const findCard = async (customerId, cardNumber) => {
  try {
    let card = null;
    const cards = await stripe.customers.listSources(customerId, {
      object: "card",
      limit: 5,
    });
    // handle errors or use the sources here
    for (let i = 0; i < cards.data.length; i++) {
      if (cards.data[i].last4 === cardNumber.substring(cardNumber.length - 4)) {
        card = cards.data[i];
        return card;
      }
    }
    return card;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const deleteCard = async (customerId, cardId) => {
  try {
    let deletedCard = await stripe.customers.deleteSource(customerId, cardId);
    // handle errors or use the sources here
    return deletedCard;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const updateSource = async (customerId, cardId, cardDetails) => {
  try {
    const source = await stripe.customers.updateSource(customerId, cardId, {
      exp_month: cardDetails.exp_month,
      exp_year: cardDetails.exp_year,
      name: cardDetails.name,
    });
    return source;
  } catch (error) {
    // console.log("Error updating source:", error);
    throw error;
  }
};

const createSourceAndAttachToCustomer = async (customerId, token) => {
  try {
    const source = await stripe.customers.createSource(customerId, {
      source: token,
    });
    return source;
  } catch (error) {
    // console.log("Error creating source:", error);
    throw error;
  }
};

const chargeCustomerWithSource = async (customerId, sourceId, amount) => {
  try {
    const charge = await stripe.charges.create({
      amount: amount,
      currency: "cad",
      customer: customerId,
      source: sourceId,
      description: "Example charge",
    });

    // console.log(
    //   `Successfully charged customer ${customerId} with source ${sourceId}:`,
    //   charge
    // );
    return charge;
  } catch (error) {
    console.error(
      `Error charging customer ${customerId} with source ${sourceId}:`,
      error
    );
  }
};

const getCustomersList = async (limit) => {
  try {
    const customers = await stripe.customers.list({
      limit: limit,
    });
    return customers.data;
  } catch (error) {
    // console.log("Error retrieving customers list:", error);
    throw error;
  }
};

const addPaymentMethod = async (cardDetails, name, sourceId, user) => {
  // Check for duplicate records
  let existingPaymentmethods = await PaymentMethod.find({
    cardNumber: paymentMethodInput.cardNumber,
  });
  // console.log("existingResources:", existingResources);
  if (existingPaymentmethods.length) {
    throw new Error(
      "This card has already been added under your payment methods! If you woulud like to update expiry details, please choose update payment method option"
    );
  }

  // Get customer with mathcing email
  let customer = searchCustomerByEmail(user.email);
  // If stripe customer is not present, create one
  // const customer = retrieveCustomer(customerInfo);
  let charge;
  let source;

  // Creating paymentMethod Model in database
  const paymentMethod = new PaymentMethod({
    name: name,
    cardNumber: cardDetails.number,
    expirationMonth: cardDetails.exp_month,
    expirationYear: cardDetails.exp_year,
    defaultCard: false,
    // cvv: paymentMethodInput.cvv,
    user: user._id,
  });
  try {
    const result = await paymentMethod.save();
    const createdPaymentMethod = transformPaymentMethod(result);
    user.paymentMethods.push(createdPaymentMethod);
    await user.save();
    // console.log("result:", result);
    return createdPaymentMethod;
  } catch (error) {
    throw error;
  }
};

// NEW FUNCTION: Process refund for returned items with metadata
const processReturnRefund = async (
  paymentIntentId,
  amount,
  orderId,
  returnedItems
) => {
  try {
    console.log(
      `Processing return refund for order ${orderId}, amount: ${amount}`
    );

    // Prepare metadata about the returned items
    const returnItemIds = returnedItems.map((item) => item.itemId).join(",");
    const returnQuantities = returnedItems
      .map((item) => item.quantity)
      .join(",");
    const returnReasons = returnedItems
      .map((item) => encodeURIComponent(item.reason))
      .join("|");

    // Create the refund with detailed metadata
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: Math.round(amount * 100), // Convert to cents
      metadata: {
        orderId: orderId,
        returnItemIds: returnItemIds,
        returnQuantities: returnQuantities,
        returnReasons: returnReasons,
        returnDate: new Date().toISOString(),
        isReturn: "true",
      },
    });

    // console.log(`Refund processed successfully: ${refund.id}`);
    return refund;
  } catch (error) {
    console.error(`Error processing refund: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createPaymentUrl,
  getTaxRates,
  createCoupon,
  createCustomer,
  searchCustomerByEmail,
  findSource,
  findCard,
  deleteCard,
  createSource,
  updateSource,
  createSourceAndAttachToCustomer,
  addSourceToCustomer,
  chargeCustomerWithSource,
  retrieveCustomer,
  createStripeToken,
  chargeCustomerThroughCustomerID,
  chargeWithToken,
  getCustomersList,
  addPaymentMethod,
  processReturnRefund,
};
