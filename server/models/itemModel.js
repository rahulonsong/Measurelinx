const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define arrayLimit validation function
function arrayLimit(val) {
  return val.length <= 10; // Example: limit the array to 10 elements
}

const itemModelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
    catId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: false,
    },
    group: {
      type: String,
      required: false,
    },
    images: [
      {
        imageRequired: {
          type: Boolean,
          required: true,
        },
        imageLink: {
          type: String,
          required: false,
        },
        filename: {
          type: String,
          required: false,
        },
      },
    ],
    colors: {
      type: [
        {
          type: String,
          required: false,
          enum: [
            "red",
            "pink",
            "purple",
            "deep-purple",
            "indigo",
            "blue",
            "light-blue",
            "cyan",
            "teal",
            "green",
            "light-green",
            "lime",
            "yellow",
            "amber",
            "orange",
            "deep-orange",
            "brown",
            "grey",
            "blue-grey",
            "black",
            "white", // Ensuring alignment with Vuetify's color palette, including white and black
          ],
        },
      ],
      validate: [arrayLimit, "{PATH} exceeds the limit of 10"], // Optional: if you want to limit the number of colors
    },
    specs: [
      {
        specName: {
          type: String,
          required: true,
        },
        specDescription: {
          type: String,
          required: false,
        },
        specValueType: {
          type: String,
          required: false,
          enum: [
            "value",
            "text",
            "value with unit",
            "options",
            "value options",
            "options with unit",
          ],
        },
        specValue: {
          type: Number,
          required: false,
        },
        specText: {
          type: String,
          required: false,
        },
        specValueSelect: {
          type: Number,
          required: false,
        },
        specTextSelect: {
          type: String,
          required: false,
        },
        specUnitOptions: {
          type: Array,
          required: false,
        },
        specUnitSelect: {
          type: String,
          required: false,
        },
        specValueOptions: {
          type: Array,
          required: false,
        },
        specTextOptions: {
          type: Array,
          required: false,
        },
      },
    ],
    tags: {
      type: Array,
      required: false,
    },
    routeParam: {
      type: String,
      required: true,
    },
    published: {
      type: Boolean,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const ItemModel = mongoose.model("ItemModel", itemModelSchema);
module.exports = { ItemModel };
