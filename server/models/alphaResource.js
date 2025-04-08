const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const alphaResourceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    contentIntro: {
      type: String,
      required: true,
    },
    content: [
      {
        contentDetail: {
          type: String,
          required: false,
        },
        imageRequired: {
          type: Boolean,
          required: true,
        },
        imageLink: {
          type: String,
          required: false,
        },
        imageOnLeft: {
          type: Boolean,
          required: false,
        },
        filename: {
          type: String,
          required: false,
        },
        contentTable: {
          tableDescription: {
            type: String,
            required: false,
          },
          tableRequired: {
            type: Boolean,
            required: false,
          },
          tableHeaders: [
            {
              text: {
                type: String,
                required: false,
              },
              align: {
                type: String,
                required: false,
              },
              sortable: {
                type: Boolean,
                required: false,
              },
              value: {
                type: String,
                required: false,
              },
            },
          ],
          tableItems: [
            {
              header1: {
                type: String,
                required: false,
              },
              header2: {
                type: String,
                required: false,
              },

              header3: {
                type: String,
                required: false,
              },

              header4: {
                type: String,
                required: false,
              },

              header5: {
                type: String,
                required: false,
              },

              header6: {
                type: String,
                required: false,
              },

              header7: {
                type: String,
                required: false,
              },

              header8: {
                type: String,
                required: false,
              },

              header9: {
                type: String,
                required: false,
              },

              header10: {
                type: String,
                required: false,
              },

              header11: {
                type: String,
                required: false,
              },

              header12: {
                type: String,
                required: false,
              },

              header13: {
                type: String,
                required: false,
              },

              header14: {
                type: String,
                required: false,
              },

              header15: {
                type: String,
                required: false,
              },

              header16: {
                type: String,
                required: false,
              },

              header17: {
                type: String,
                required: false,
              },

              header18: {
                type: String,
                required: false,
              },

              header19: {
                type: String,
                required: false,
              },

              header20: {
                type: String,
                required: false,
              },

              header21: {
                type: String,
                required: false,
              },

              header22: {
                type: String,
                required: false,
              },

              header23: {
                type: String,
                required: false,
              },

              header24: {
                type: String,
                required: false,
              },

              header25: {
                type: String,
                required: false,
              },

              header26: {
                type: String,
                required: false,
              },

              header27: {
                type: String,
                required: false,
              },

              header28: {
                type: String,
                required: false,
              },

              header29: {
                type: String,
                required: false,
              },

              header30: {
                type: String,
                required: false,
              },
            },
          ],
        },
      },
    ],
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    references: {
      type: Array,
      required: false,
    },
    tags: {
      type: Array,
      required: false,
    },
    resourceRouteParam: {
      type: String,
      required: true,
      unique: true,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
    published: {
      type: Boolean,
      required: true,
    },
    isPageConstructor: {
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
const AlphaResource = mongoose.model("AlphaResource", alphaResourceSchema);
module.exports = { AlphaResource };
