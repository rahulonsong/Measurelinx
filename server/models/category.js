const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
    published: {
      type: Boolean,
      required: true,
    },
    categoryType: {
      type: String,
      required: true,
      enum: ["single", "double", "triple"],
    },
    subCategories: [
      {
        name: {
          type: String,
          required: true,
        },

        subTitles: [
          {
            name: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const Category = mongoose.model("Category", categorySchema);
module.exports = { Category };
