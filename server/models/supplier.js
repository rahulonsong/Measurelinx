const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const supplierSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      enum: ["Canada", "India"],
      required: true,
    },
    brandName: {
      type: String,
      required: false,
    },
    addresses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    phoneNumber: {
      countryCode: {
        type: String,
        required: true,
      },
      localNumber: {
        type: String,
        required: true,
      },
    },
    email: {
      type: String,
      required: true,
    },
    typeOfAccount: {
      type: String,
      enum: ["individual", "professional"],
      required: true,
    },
    identificationDoc: {
      typeOfId: {
        type: String,
        enum: ["passport", "drivingLicense", "aadhaar", "identificationDoc"],
        required: true,
      },
      idNumber: {
        type: String,
        required: true,
      },

      file: {
        type: Schema.Types.ObjectId,
        ref: "File",
      },
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    idVerified: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = { Supplier };
