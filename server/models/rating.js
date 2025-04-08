const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingSchema = new Schema(
  {
    value: {
      type: Number,
      required: false,
    },
    item: {
      type: Schema.Types.ObjectId,
      ref: "Item",
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
const Rating = mongoose.model("Rating", ratingSchema);
module.exports = { Rating };
