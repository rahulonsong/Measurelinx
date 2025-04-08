const { sendMail } = require("./sendMail"); // Ensure correct import

/**
 * ✅ Sends an Email Verification OTP
 * @param {string} userId - The ID of the user
 * @throws {Error} If user is not found or email sending fails
 */
const sendEmailVerificationOtp = async (email, userId) => {
  try {
    // ✅ Generate OTP (6-digit random number)
    const otp = `${Math.floor(Math.random() * 900000 + 100000)}`;

    // ✅ Email Content
    const text = `Use the OTP ${otp} to verify your email. This OTP will expire in one hour.`;
    const html = `<p>Use the OTP <strong>${otp}</strong> to verify your email. This OTP will expire in one hour.</p>`;
    const context = "emailVerification";

    // ✅ Email Options
    const emailOptions = {
      email: email,
      userId: userId,
      subject: `Email Verification`,
      text,
      html,
      otp,
      context,
    };

    // ✅ Send Email
    await sendMail(emailOptions);
    console.log(`✅ OTP Sent to ${email}: ${otp}`);

    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("❌ Error in sendEmailVerificationOtp:", error);
    throw new Error("Failed to send OTP email.");
  }
};

module.exports = { sendEmailVerificationOtp };
