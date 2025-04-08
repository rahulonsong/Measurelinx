const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    addresseeFirst: {
      type: String,
      required: true,
    },
    addresseeLast: {
      type: String,
      required: true,
    },
    line1: {
      type: String,
      required: true,
    },
    line2: {
      type: String,
      required: false,
    },
    landmark: {
      type: String,
      required: false,
    },
    stateProvince: {
      type: String,
      required: true,
    },
    cityTown: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    phoneNumber: {
      category: {
        type: String,
        required: true,
      },
      countryCode: {
        type: String,
        required: true,
      },
      areaCode: {
        type: String,
        required: false,
      },
      localNumber: {
        type: String,
        required: false,
      },
      mobileNumber: {
        type: String,
        required: false,
      },
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
const Address = mongoose.model("Address", addressSchema);
module.exports = { Address };
