const { Order } = require("../models/order");
const { User } = require("../models/user");
const { getUserId } = require("./getUserId");
const { v4: uuidv4 } = require("uuid");
const { Cart } = require("../models/cart");

// Function to generate a 4-digit number based on the current date
const generateDateBasedNumber = () => {
  // Define an epoch date (e.g., when your service started or any fixed date)
  const epoch = new Date("2022-01-01"); // YYYY-MM-DD

  // Get today's date (without time)
  const today = new Date(new Date().toISOString().split("T")[0]);

  // Calculate the difference in days
  const diffTime = Math.abs(today - epoch);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Convert days to a 4-digit number, cycle if exceeds 9999
  const dateNumber = diffDays % 10000; // ensures it is always 4 digits or less

  // Return as a 4-digit string
  return dateNumber.toString().padStart(4, "0");
};

const generatePurchaseOrderNumber = async () => {
  // Generate the 4-digit number based on the date
  const dateBasedNumber = generateDateBasedNumber();

  // Fetch the last order to get the last sequence number
  const lastOrder = await Order.findOne().sort({ createdAt: -1 }).limit(1);
  let nextSeqNumber = 1; // Start from 1 if no orders

  if (lastOrder) {
    // Extract the sequence number and increment it
    const lastSeq = parseInt(lastOrder.orderNumber.split("-")[1]);
    nextSeqNumber = lastSeq + 1;
  }

  // Ensure the sequence number is a string of exactly 6 digits
  const seqString = nextSeqNumber.toString().padStart(6, "0");

  // Combine date number and sequence number
  const orderNumber = `${dateBasedNumber}-${seqString}`;

  return orderNumber;
};

const createOrder = async (orderInput, additionalInfo) => {
  try {
    const orderNumber = await generatePurchaseOrderNumber();

    // Extract all values in cents
    const subTotalCents = additionalInfo.subTotal;
    const deliveryFeeCents = additionalInfo.deliveryFee || 0;
    const discountCents = additionalInfo.discount || 0;
    const taxAmountCents = additionalInfo.taxAmount || 0;

    // Calculate total price the same way as frontend
    const orderValueCents =
      subTotalCents - discountCents + deliveryFeeCents + taxAmountCents;

    // Convert to dollars with 2 decimal places for storage
    const subTotal = (subTotalCents / 100).toFixed(2);
    const deliveryFee = (deliveryFeeCents / 100).toFixed(2);
    const discount = (discountCents / 100).toFixed(2);
    const taxAmount = (taxAmountCents / 100).toFixed(2);
    const orderValue = (orderValueCents / 100).toFixed(2);

    const order = new Order({
      deliveryEstimate: 7,
      deliveryFee: deliveryFee,
      discount: discount,
      orderValue: orderValue,
      orderNumber: orderNumber,
      subTotal: subTotal,
      taxAmount: taxAmount,
      items: orderInput.items,
      promotion: orderInput.promotion,
      promoCode: orderInput.promoCode,
      billingAddress: orderInput.billingAddress,
      shippingAddress: orderInput.shippingAddress,
      tax: process.env.TAX_COUNTRY,
      orderCurrency: process.env.CURRENCY,
      orderStatus: "pendingPayment",
      canceled: false,
      orderComplete: false,
      orderDate: new Date().toISOString(),
      user: additionalInfo.userId,
    });

    const orderResult = await order.save();
    // Get current user
    let user = await User.findById(additionalInfo.userId);
    // Clear the user cart for a fresh order
    await Cart.updateOne({ _id: user.cart }, { $set: { items: [] } });
    if (!user) {
      throw new Error("User not found");
    }

    user.orders.push(orderResult._id);
    // saving user
    await user.save();

    return orderResult;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order. Please try again later.");
  }
};

module.exports = {
  createOrder,
  generatePurchaseOrderNumber,
};
