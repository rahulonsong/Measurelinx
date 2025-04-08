const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentMethodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cardNumber: {
      type: String,
      required: true,
      unique: false,
    },
    expirationMonth: {
      type: String,
      required: true,
    },
    expirationYear: {
      type: String,
      required: true,
    },
    defaultCard: {
      type: Boolean,
      required: false,
    },
    sourceId: {
      type: String,
      required: true,
    },
    // cvv: {
    //   type: String,
    //   required: true,
    // },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const PaymentMethod = mongoose.model("PaymentMethod", paymentMethodSchema);
module.exports = { PaymentMethod };
