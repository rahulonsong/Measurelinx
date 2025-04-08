const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactFormSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    refNumber: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      enum: ["India", "USA", "Canada", "Mexico", "Australia", "Japan"],
      required: true,
    },
    isdCode: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    contactType: {
      type: String,
      enum: ["Request", "Feedback"],
      required: true,
    },
    category: {
      type: String,
      required: false,
      enum: ["Sales", "Feedback", "Support", "Other"],
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const ContactForm = mongoose.model("ContactForm", contactFormSchema);
module.exports = { ContactForm };
