const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriberSchema = new Schema(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contactNumber: {
      type: String,
      required: false,
    },
    userUnsubscribed: {
      type: Boolean,
      required: false,
    },
    reasonForUnsubscribing: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
const Subscriber = mongoose.model("Subscriber", subscriberSchema);
module.exports = { Subscriber };
