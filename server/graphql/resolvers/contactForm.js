if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { ContactForm } = require("../../models/contactForm.js");
const { generateReferenceNumber } = require("../../utils/generateRefNumber.js");
const { sendMailBeta } = require("./sendMail");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

const crmEmail = `${process.env.CLIENT_REQUEST_HANDLER_EMAIL}`;

const addContactFormSubmission = async (_parent, args, _context, _info) => {
  const {
    firstName,
    lastName,
    country,
    isdCode,
    phoneNumber,
    email,
    message,
    category,
    contactType,
    user,
  } = args.contactFormInput;
  // GENERTING A REFERENCE NUMBER
  const refNumber = generateReferenceNumber();
  const contactForm = new ContactForm({
    firstName,
    lastName,
    country,
    isdCode,
    phoneNumber,
    email,
    message,
    category,
    contactType,
    refNumber,
    isRead: false,
    user,
  });

  try {
    // Saving in database
    const result = await contactForm.save();

    if (contactType === "Request") {
      const text = `${refNumber}:Your message has been received`;
      const text2 = `${refNumber}:Message from ${firstName} ${lastName}: ${message}`;
      const context = "contactRequest";

      const emailTemplate = fs.readFileSync(
        path.join(__dirname, "../../templates/requestReceived.ejs"),
        "utf-8"
      );

      const emailTemplate2 = fs.readFileSync(
        path.join(__dirname, "../../templates/customerMessage.ejs"),
        "utf-8"
      );

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
        category,
        url: process.env.BRAND_WEBSITE,
        logo: process.env.BRAND_LOGO_IMAGE_URL,
      });

      // Sending copy of request to customer when contactType is Request
      const emailOptions = {
        email: email,
        subject: `Your request has been received [#${refNumber}]`,
        text,
        html,
        context,
      };
      await sendMailBeta(emailOptions);

      // receiving customer message  for processing
      const emailOptions2 = {
        email: crmEmail,
        subject: `${category} - Message from ${firstName} ${lastName} [#${refNumber}]`,
        text: text2,
        html: html2,
        context,
      };
      await sendMailBeta(emailOptions2);
    }

    return { refNumber, user };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const contactFormResolver = {
  Mutation: {
    addContactFormSubmission,
  },
};

module.exports = { contactFormResolver };
