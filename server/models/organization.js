const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const organizationSchema = new Schema(
  {
    organizationName: {
      type: String,
      required: true,
      unique: true,
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
const Organization = mongoose.model("Organization", organizationSchema);
module.exports = { Organization };
