const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagListSchema = new Schema(
  {
    listName: {
      type: String,
      required: true,
      unique: true,
    },
    tagList: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const TagList = mongoose.model("TagList", tagListSchema);
module.exports = { TagList };
