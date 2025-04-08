const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userVerificationSchema = new Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    cellNumber: {
      type: String,
      required: false,
    },
    otp: {
      type: String,
      required: true,
    },
    context: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const UserVerification = mongoose.model(
  "UserVerification",
  userVerificationSchema
);
module.exports = { UserVerification };
