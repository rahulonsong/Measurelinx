const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appEnvSchema = new Schema(
  {
    currentSale: {
      type: String,
      required: false,
    },
    saleImages: [
      {
        type: Schema.Types.ObjectId,
        ref: "File",
      },
    ],
    siteWideDiscount: {
      type: Number,
      required: false,
    },
    dealExpiry: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const AppEnv = mongoose.model("AppEnv", appEnvSchema);
module.exports = { AppEnv };
