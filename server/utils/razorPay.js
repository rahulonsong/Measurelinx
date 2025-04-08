const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (amount, currency = "INR") => {
  // Create order logic
};

const verifyPaymentSignature = (order, payment, signature) => {
  // Verify payment signature logic
};

// Add other utility functions as needed
// ...

module.exports = {
  createOrder,
  verifyPaymentSignature,
  // Other exports as needed
};
