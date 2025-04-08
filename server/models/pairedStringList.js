const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pairedStringListSchema = new Schema(
  {
    pairedStringListName: {
      type: String,
      required: true,
      unique: true,
    },
    pairedStringList: [
      {
        key: {
          type: String,
          required: true,
        },
        stringValue: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const PairedStringList = mongoose.model(
  "PairedStringList",
  pairedStringListSchema
);
module.exports = { PairedStringList };
