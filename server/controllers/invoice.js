// controllers/invoiceController.js
const { generateInvoice } = require("../utils/invoiceGenerator");
const { Order } = require("../models/order");
const { getS3Item } = require("../utils/s3Actions");

const downloadInvoiceController = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Generate the invoice if it doesn't already exist
    if (!order.invoiceUrl) {
      order.invoiceUrl = await generateInvoice(orderId);
      await order.save();
    }

    // Get signed URL from S3
    const signedUrl = await getS3Item(
      order.invoiceUrl,
      process.env.S3_BUCKET_NAME_INVOICE
    );

    res.status(200).json({ signedUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch invoice" });
  }
};

module.exports = {
  downloadInvoiceController,
};
