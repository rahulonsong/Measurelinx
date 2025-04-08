if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { UserVerification } = require("../../models/userVerification.js");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

// Email configuration constants
const O_AUTH2_EMAIL = process.env.O_AUTH2_EMAIL;
const BRAND_NAME = process.env.BRAND_NAME;
const OTP_EXPIRY = parseInt(process.env.OTP_EXPIRY);
const SALT_ROUNDS_OTP = parseInt(process.env.SALT_ROUNDS_OTP);
const ZOHO_APP_PASSWORD = process.env.ZOHO_APP_PASSWORD;

// SMTP configuration
const SMTP_HOST = process.env.SMTP_HOST || "smtppro.zoho.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465");
const SMTP_SECURE = process.env.SMTP_PORT === "465" || true;
const SMTP_USER = process.env.SMTP_USER || O_AUTH2_EMAIL;
const SMTP_PASS = process.env.SMTP_PASS || ZOHO_APP_PASSWORD;

const saveOtpVerificationRecord = async ({
  userId,
  email,
  otp,

  context,
  cellNumber,
}) => {
  try {
    const hashedOtp = await bcrypt.hash(otp, SALT_ROUNDS_OTP);
    const newUserVerification = new UserVerification({
      userId: userId ? userId : "",
      email: email ? email : "",
      cellNumber: cellNumber ? cellNumber : "",
      otp: hashedOtp,
      context,
      expiresAt: new Date(Date.now() + OTP_EXPIRY).toISOString(),
    });

    const promises = [];
    if (userId) promises.push(UserVerification.deleteMany({ userId }));
    if (email) promises.push(UserVerification.deleteMany({ email }));
    if (context === "authenticationByPhone") {
      promises.push(UserVerification.deleteMany({ cellNumber }));
    }

    if (promises.length > 0) {
      await Promise.all(promises);
    }

    await newUserVerification.save();
  } catch (error) {
    throw error;
  }
};

// Function to send OTP and save verification record
const sendMail = async ({
  email,
  userId,
  subject,
  html,
  text,
  template,
  templateData,
  otp,
  context,
  skipOtpRecord = false,
}) => {
  try {
    // Validate inputs
    if (!email || !subject || (!html && !text && !template) || !context) {
      throw new Error("The email options not provided");
    }

    // Render template if provided
    let emailHtml = html;
    if (template) {
      const templatePath = path.join(
        __dirname,
        "../../templates",
        `${template}.ejs`
      );

      if (fs.existsSync(templatePath)) {
        emailHtml = await ejs.renderFile(templatePath, templateData);
      } else {
        throw new Error(`Email template '${template}' not found`);
      }
    }

    // Create transporter with Zoho SMTP configuration
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    // Prepare email options
    let mailOptions = {
      from: `${BRAND_NAME} <${O_AUTH2_EMAIL}>`,
      to: email,
      text: text || "", // Plain text content
      html: emailHtml, // HTML content
      subject, // Email subject
    };

    // Save OTP verification record in the database if OTP is provided and not skipped
    if (otp && !skipOtpRecord) {
      await saveOtpVerificationRecord({ userId, email, otp, context });
    }

    // Send the email
    await transport.sendMail(mailOptions);
    console.log(`Email sent to ${email} successfully.`);
  } catch (error) {
    console.error("Error occurred while sending email:", error.message);
    return error;
  }
};

// General email sending function
const sendMailBeta = async ({
  email,
  subject,
  html,
  text,
  template,
  templateData,
  context,
}) => {
  try {
    // Validate inputs
    if (!email || !subject || (!html && !text && !template) || !context) {
      throw new Error("The email options not provided");
    }

    // Render template if provided
    let emailHtml = html;
    if (template) {
      const templatePath = path.join(
        __dirname,
        "../../templates",
        `${template}.ejs`
      );

      if (fs.existsSync(templatePath)) {
        emailHtml = await ejs.renderFile(templatePath, templateData);
      } else {
        throw new Error(`Email template '${template}' not found`);
      }
    }

    // Create transporter with Zoho SMTP configuration
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    // Prepare email options
    let mailOptions = {
      from: `${BRAND_NAME} <${O_AUTH2_EMAIL}>`,
      to: email,
      text: text || "", // Plain text content
      html: emailHtml, // HTML content
      subject, // Email subject
    };

    // Send the email
    await transport.sendMail(mailOptions);
    console.log(`Email sent to ${email} successfully.`);
  } catch (error) {
    console.error("Error occurred while sending email:", error.message);
    return error;
  }
};

module.exports = {
  sendMail,
  sendMailBeta,
  saveOtpVerificationRecord,
};
