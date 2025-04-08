const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pageCreatorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
    isItemPage: {
      type: Boolean,
      required: false,
    },
    hasBreadCrumbs: {
      type: Boolean,
      required: false,
    },
    breadCrumbs: [
      {
        text: {
          type: String,
          required: false,
        },
        to: {
          type: String,
          required: false,
        },
        disabled: {
          type: Boolean,
          required: false,
        },
      },
    ],
    routeParam: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: false,
    },
    pageRows: [
      {
        numberOfCols: {
          type: String,
          required: true,
          enum: ["single", "double", "triple"],
        },
        rowType: {
          type: String,
          enum: ["leftProminent", "rightProminent", "equal"],
          default: "equal",
          required: false,
        },
        col1: {
          title: {
            type: String,
            required: false,
          },
          exists: {
            type: Boolean,
            required: true,
          },
          navigation: {
            isEnabled: {
              type: Boolean,
              required: false,
            },
            component: {
              type: String,
              required: false,
              enum: ["Resource", "Item"],
            },
            routeParam: {
              type: String,
              required: false,
            },
          },
          height: {
            type: Number,
            required: false,
          },
          width: {
            type: Number,
            required: false,
          },
          resource: {
            type: Schema.Types.ObjectId,
            ref: "AlphaResource",
          },
        },
        col2: {
          title: {
            type: String,
            required: false,
          },
          exists: {
            type: Boolean,
            required: true,
          },
          navigation: {
            isEnabled: {
              type: Boolean,
              required: false,
            },
            component: {
              type: String,
              required: false,
            },
            routeParam: {
              type: String,
              required: false,
            },
          },
          height: {
            type: Number,
            required: false,
          },
          width: {
            type: Number,
            required: false,
          },
          resource: {
            type: Schema.Types.ObjectId,
            ref: "AlphaResource",
          },
        },
        col3: {
          title: {
            type: String,
            required: false,
          },
          exists: {
            type: Boolean,
            required: true,
          },
          navigation: {
            isEnabled: {
              type: Boolean,
              required: false,
            },
            component: {
              type: String,
              required: false,
            },
            routeParam: {
              type: String,
              required: false,
            },
          },
          height: {
            type: Number,
            required: false,
          },
          width: {
            type: Number,
            required: false,
          },
          resource: {
            type: Schema.Types.ObjectId,
            ref: "AlphaResource",
          },
        },
        hasButton: {
          type: Boolean,
          required: false,
        },
        buttonParameters: {
          text: { type: String, required: false },
          targetType: { type: String, required: false },
          routeParam: { type: String, required: false },
        },
      },
    ],
    itemDetails: {
      category: {
        type: String,
        required: false,
      },
      subCategory: {
        type: String,
        required: false,
      },
      group: {
        type: String,
        required: false,
      },
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
const PageCreator = mongoose.model("PageCreator", pageCreatorSchema);
module.exports = { PageCreator };
