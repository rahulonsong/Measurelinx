const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    context: {
      type: String,
      enum: [
        "resource",
        "logo",
        "avatar",
        "item",
        "itemModel",
        "identificationDoc",
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const File = mongoose.model("File", fileSchema);
module.exports = { File };
