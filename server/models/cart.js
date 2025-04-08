const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    items: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },
    billingAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },
    paymentMethod: {
      type: Schema.Types.ObjectId,
      ref: "PaymentMethod",
      required: false,
    },
    promotion: {
      isPercentage: {
        type: Boolean,
        required: false,
      },
      value: {
        type: Number,
        required: false,
      },
    },
    promoCode: {
      type: String,
      required: false,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
module.exports = { Cart };
