const mongoose = require("mongoose");

const userSearchSchema = new mongoose.Schema(
  {
    searchText: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      default: new Date().toISOString(),
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    countries: [
      {
        type: String,
        required: false,
        trim: true,
      },
    ],
    regions: [
      {
        type: String,
        required: false,
        trim: true,
      },
    ],
    cities: [
      {
        type: String,
        required: false,
        trim: true,
      },
    ],
    context: {
      type: String,
      enum: ["items"],
      default: "items",
    },
    occurrence: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

const UserSearch = mongoose.model("UserSearch", userSearchSchema);

module.exports = { UserSearch };
