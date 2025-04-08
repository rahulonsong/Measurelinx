const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percent", "amount"],
      default: "percent",
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTo: {
      type: Date,
      required: true,
    },
    maxRedemptions: {
      type: Number,
      required: true,
      min: 0,
    },
    redeemed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
const PromoCode = mongoose.model("PromoCode", promoCodeSchema);
module.exports = { PromoCode };
