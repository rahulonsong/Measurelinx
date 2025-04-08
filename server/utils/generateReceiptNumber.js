const generateReceiptNumber = () => {
  const prefix = "RP"; // "RP" stands for RazorPay
  const timestamp = Date.now(); // Gets the current timestamp
  const uniquePart = Math.random().toString(36).substring(2, 15); // Generates a random string

  return `${prefix}-${timestamp}-${uniquePart}`;
};

module.exports = {
  generateReceiptNumber,
};
