const { NoUnusedFragmentsRule } = require("graphql");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    rating: {
      type: Schema.Types.ObjectId,
      ref: "Rating",
      required: false,
    },
    caption: {
      type: String,
      required: false,
    },
    text: {
      type: String,
      required: false,
    },
    nickName: {
      type: String,
      required: false,
    },
    item: {
      type: Schema.Types.ObjectId,
      ref: "Item",
    },
    country: {
      type: String,
      required: false,
    },
    comments: [
      {
        text: {
          type: String,
          required: false,
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    foundHelpful: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Review = mongoose.model("Review", reviewSchema);
module.exports = { Review };
