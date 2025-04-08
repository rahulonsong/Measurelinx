// dialogflowController.js
const { generateReferenceNumber } = require("../utils/generateRefNumber.js");
const { sendMailBeta } = require("../graphql/resolvers/sendMail.js");
const { sendNewMessage } = require("../controllers/twilio.js");
const { isValidEmail } = require("../utils/emailValidator.js");
const {
  sanitizeAndValidatePhoneNumber,
} = require("../utils/phoneNumberValidator.js");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

const {
  createSubscriberFromChat,
} = require("../graphql/resolvers/subscriber.js");

async function processRequest(req, res) {
  const parameters = req.body.queryResult.parameters;
  const {
    name: { name },
    email,
    contactNumber,
    message,
  } = parameters;

  // Add your logic here based on the intent and parameters
  // Add user to subscription list
  createSubscriberFromChat({ name, email, contactNumber });

  // Setting message for customer
  const messageForUser = `Hello ${
    parameters.name.name.split(" ")[0]
  }! Thank you for contacting us. One of our ${
    process.env.BRAND_NAME
  } representatives will reach out to you shortly.`;

  // sending response to user via chat
  const responseToUser = {
    fulfillmentText: messageForUser,
  };

  // checking for a valid email
  if (email && isValidEmail(email)) {
    // Sending email
    const emailTemplate = fs.readFileSync(
      path.join(__dirname, "../templates/chatRequestReceived.ejs"),
      "utf-8"
    );

    const emailTemplate2 = fs.readFileSync(
      path.join(__dirname, "../templates/chatCustomerMessage.ejs"),
      "utf-8"
    );

    const refNumber = generateReferenceNumber();
    const firstName = name.split(" ")[0];
    const lastName = name.split(" ")[1] || "";
    const context = "contactRequest";

    const html = ejs.render(emailTemplate, {
      firstName,
      refNumber,
      message,
      url: process.env.BRAND_WEBSITE,
      logo: process.env.BRAND_LOGO_IMAGE_URL,
    });

    const html2 = ejs.render(emailTemplate2, {
      firstName,
      refNumber,
      message,
      customerName: `${firstName} ${lastName}`,
      contactNumber,
      email,
      url: process.env.BRAND_WEBSITE,
      logo: process.env.BRAND_LOGO_IMAGE_URL,
    });

    // Sending copy of request to customer when contactType is Request
    const emailOptions = {
      email: email,
      subject: `Your request has been received [#${refNumber}]`,
      html,
      context,
    };
    await sendMailBeta(emailOptions);

    // receiving customer message  for processing
    const emailOptions2 = {
      email: `${process.env.CLIENT_REQUEST_HANDLER_EMAIL}`,
      subject: `Message from ${firstName} ${lastName} [#${refNumber}]`,
      html: html2,
      context,
    };
    await sendMailBeta(emailOptions2);

    res.json(responseToUser);
  }
  // checking for a valid phone number and send a message
  if (contactNumber && sanitizeAndValidatePhoneNumber(contactNumber).isValid) {
    // send a text message
    await sendNewMessage({
      body: messageForUser,
      to: sanitizeAndValidatePhoneNumber(contactNumber).sanitizedNumber,
    });
  }
}

module.exports = {
  processRequest,
};
