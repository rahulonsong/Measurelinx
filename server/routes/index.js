// routes/index.js
const express = require("express");
const bodyParser = require("body-parser");
const { verifyToken } = require("../utils/verifyToken");
const router = express.Router();
const downloadController = require("../controllers/download");
const uploadController = require("../controllers/upload");
const paymentController = require("../controllers/payment");
const twilioController = require("../controllers/twilio");
const dialogflowController = require("../controllers/dialogFlow");
const invoiceController = require("../controllers/invoice");
const zohoController = require("../controllers/zoho");
const returnLabelController = require("../controllers/returnLabel");
const { generateToken } = require("../utils/twilio");
const multer = require("multer");

const storage = multer.memoryStorage();
const uploadNew = multer({ storage: storage });

// Downloading Calendar
router.get("/download/calendar", downloadController.calendarDownload);

// Uploading Item image
router.post(
  "/upload/itemimage",
  verifyToken,
  uploadNew.single("image"),
  (req, res, next) => {
    req.context = "item";
    next();
  },
  uploadController.uploadImage
);

// Uploading Item model image
router.post(
  "/upload/itemmodelimage",
  verifyToken,
  uploadNew.single("image"),
  (req, res, next) => {
    req.context = "itemModel";
    next();
  },
  uploadController.uploadImage
);

// Uploading logo
router.post(
  "/upload/logo",
  verifyToken,
  uploadNew.single("image"),
  (req, res, next) => {
    req.context = "logo";
    next();
  },
  uploadController.uploadImage
);

// Uploading Profile Pic
router.post(
  "/upload/profilepic",
  verifyToken,
  uploadNew.single("image"),
  (req, res, next) => {
    req.context = "profilePic";
    next();
  },
  uploadController.uploadImage
);

// Uploading Resource Pic
router.post(
  "/upload/resourceimage",
  verifyToken,
  uploadNew.single("image"),
  (req, res, next) => {
    req.context = "resource";
    next();
  },
  uploadController.uploadImage
);

// Accepting payments from stripe
router.post("/stripe/webhook", paymentController.handlePaymentWebhook);
// Accepting payments from Razorpay
router.post("/razorpay/webhook", paymentController.handlePaymentWebhook);
// Handling refunds from Stripe
router.post(
  "/stripe/refund-webhook",
  express.raw({ type: "application/json" }),
  returnLabelController.handleStripeRefundWebhookController
);

// Twilio token
router.post("/token", (req, res) => {
  const identity = req.body.identity;
  const token = generateToken(identity);
  res.send({
    identity: identity,
    token: token,
  });
});

// Twilio Incoming SMS
router.post(
  "/twilio/incoming-sms",
  express.urlencoded({ extended: false }),
  twilioController.sendMessage
);

// Twilio Outgoing WhatsApp message template
router.post(
  "/twilio/outgoing-whatsapp-message-template",
  express.urlencoded({ extended: false }),
  twilioController.sendWhatsAppMessageTemplate
);

// Dialogflow webhook route
router.post("/dialogflow/webhook", dialogflowController.processRequest);

// Downloading Invoice with authentication
router.get(
  "/download/invoice/:orderId",
  verifyToken,
  invoiceController.downloadInvoiceController
);

// Return label routes
router.get(
  "/download/return-label/:orderId",
  verifyToken,
  returnLabelController.downloadReturnLabelController
);

router.get(
  "/download/return-label/:orderId/:labelIndex",
  verifyToken,
  returnLabelController.downloadReturnLabelController
);

router.get(
  "/return-labels/:orderId",
  verifyToken,
  returnLabelController.getReturnLabelsController
);

router.post(
  "/generate/return-label/:orderId",
  verifyToken,
  returnLabelController.generateReturnLabelController
);

// Process return refund (admin only)
router.post(
  "/process/return-refund/:orderId",
  verifyToken,
  returnLabelController.processReturnRefundController
);

// Zoho webhook route
router.post("/zoho-email-webhook", zohoController.handleZohoWebhook);

module.exports = router; // export to use in server.js
