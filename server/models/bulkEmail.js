const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bulkEmailSchema = new Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    pageId: {
      type: String,
      required: true,
    },
    htmlContent: {
      type: String,
      required: true,
    },
    emailGroup: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BulkEmail = mongoose.model("BulkEmail", bulkEmailSchema);
module.exports = { BulkEmail };
