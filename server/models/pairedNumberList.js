const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pairedNumberListSchema = new Schema(
  {
    pairedNumberListName: {
      type: String,
      required: true,
      unique: true,
    },
    pairedNumberList: [
      {
        key: {
          type: Number,
          required: true,
        },
        numberValue: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const PairedNumberList = mongoose.model(
  "PairedNumberList",
  pairedNumberListSchema
);
module.exports = { PairedNumberList };
