const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categoryListSchema = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
    },
    categoryList: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const CategoryList = mongoose.model("CategoryList", categoryListSchema);
module.exports = { CategoryList };
