const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define arrayLimit validation function
function arrayLimit(val) {
  return val.length <= 10; // Example: limit the array to 10 elements
}

const itemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    isSizeApplicable: {
      type: Boolean,
      required: false,
    },
    size: {
      type: String,
      required: false,
      enum: ["small", "medium", "large", "XL", "XXL", "universal"],
    },
    isColorApplicable: {
      type: Boolean,
      required: false,
    },
    color: {
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
        "white", // Added white to the list of colors
        null,
      ],
    },
    colorOptions: {
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
    length: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    defaultImage: {
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
    price: {
      value: {
        type: Number,
        required: false,
      },
      currency: {
        type: String,
        required: false,
      },
    },
    tax: {
      type: Number,
      required: false,
    },
    discount: {
      type: Number,
      required: false,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    stock: {
      type: Number,
      required: false,
    },
    maximumOrderQuantity: {
      type: Number,
      required: false,
    },
    model: {
      type: Schema.Types.ObjectId,
      ref: "ItemModel",
      required: true,
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
        specUnit: {
          type: String,
          required: false,
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
    rating: {
      rateCount: {
        type: Number,
        required: false,
      },
      rateCount1: {
        type: Number,
        required: false,
      },
      rateCount2: {
        type: Number,
        required: false,
      },
      rateCount3: {
        type: Number,
        required: false,
      },
      rateCount4: {
        type: Number,
        required: false,
      },
      rateCount5: {
        type: Number,
        required: false,
      },
      rateAvg: {
        type: Number,
        required: false,
      },
      ratings: [
        {
          type: Schema.Types.ObjectId,
          ref: "Rating",
        },
      ],
    },
    customerQuestions: [
      {
        question: {
          type: String,
          required: false,
        },
        answer: {
          type: String,
          required: false,
        },
      },
    ],
    featuresDetails: [
      {
        caption: {
          type: String,
          required: false,
        },
        description: {
          type: String,
          required: false,
        },
      },
    ],
    additionalInfo: {
      type: String,
      required: false,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
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
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
    },
    viewsCount: {
      type: Number,
      required: false,
    },
    historicalOrderCount: {
      type: Number,
      required: false,
    },
  },
  // time stamps
  {
    timestamps: true,
  }
);
// indexing
itemSchema.index({ name: "text", description: "text", category: "text" });
const Item = mongoose.model("Item", itemSchema);
module.exports = { Item };
