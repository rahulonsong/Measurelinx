// zoho controller
const crypto = require("crypto");
const { sendMailBeta } = require("../graphql/resolvers/sendMail");
const ejs = require("ejs");
const path = require("path");

const SECRET_TOKEN = process.env.ZOHO_SECRET_TOKEN; // Your secret token from Zoho

const renderEmailTemplate = async (email, bodyContent) => {
  const footerTemplate = path.join(__dirname, "../templates/footer.ejs");
  const footerHtml = await ejs.renderFile(footerTemplate, {
    logoUrl: process.env.BRAND_LOGO_IMAGE_URL,
    brandName: process.env.BRAND_NAME,
    brandWebsite: process.env.BRAND_WEBSITE,
    email: email,
    addressLine1: process.env.ADDRESS_LINE1,
    addressLine2: process.env.ADDRESS_LINE2,
    addressLine3: process.env.ADDRESS_LINE3,
    addressLine4: process.env.ADDRESS_LINE4,
  });

  return `${bodyContent}${footerHtml}`;
};

const handleZohoWebhook = async (req, res) => {
  const payload = JSON.stringify(req.body);
  const signature = req.headers["x-zoho-webhook-signature"];

  // Generate hash using the secret token
  const hash = crypto
    .createHmac("sha256", SECRET_TOKEN)
    .update(payload)
    .digest("hex");

  // Verify the signature
  if (hash === signature) {
    console.log("Webhook verified successfully.");

    // Process the webhook payload
    const { email, subject, bodyContent } = req.body; // Updated to receive bodyContent
    try {
      const emailHtml = await renderEmailTemplate(email, bodyContent);

      await sendMailBeta({
        email,
        subject,
        html: emailHtml,
        context: "zohoEmail",
      });
      res.status(200).send("Email sent successfully");
    } catch (error) {
      res.status(500).send(`Error sending email: ${error.message}`);
    }
  } else {
    console.log("Invalid webhook signature");
    res.status(403).send("Invalid webhook signature");
  }
};

module.exports = {
  handleZohoWebhook,
};
