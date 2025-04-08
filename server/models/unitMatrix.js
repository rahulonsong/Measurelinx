const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const unitMatrixSchema = new Schema(
  {
    propertyName: {
      type: String,
      required: false,
      unique: true,
    },
    type: {
      type: String,
      required: false,
    },
    defaultUnit: {
      type: String,
      required: false,
    },
    conversionMatrix: [
      {
        unit: {
          type: String,
          required: false,
        },
        value: {
          type: Number,
          required: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const UnitMatrix = mongoose.model("UnitMatrix", unitMatrixSchema);
module.exports = { UnitMatrix };
