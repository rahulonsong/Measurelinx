const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const menuSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    position: {
      type: Number,
      required: false,
    },
    isSideMenu: {
      type: Boolean,
      required: false,
    },
    isTopMenu: {
      type: Boolean,
      required: false,
    },
    isBottomMenu: {
      type: Boolean,
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
    menuType: {
      type: String,
      required: true,
      enum: ["single", "double", "triple"],
    },
    routeParam: {
      type: String,
      required: false,
    },
    subMenus: [
      {
        name: {
          type: String,
          required: true,
        },
        routeParam: {
          type: String,
          required: false,
        },

        subTitles: [
          {
            name: {
              type: String,
              required: true,
            },
            routeParam: {
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
const Menu = mongoose.model("Menu", menuSchema);
module.exports = { Menu };
