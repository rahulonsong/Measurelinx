const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true,
    },
    categoryImage: {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
    number: {
      type: Number,
      required: true,
      unique: true,
    },
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    resolution: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    dateResolved: {
      type: Date,
      required: false,
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    attachments: {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
    comments: [
      {
        commentData: {
          type: String,
          required: false,
        },
        commenter: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    history: [
      {
        changes: [
          {
            attribute: {
              type: String,
              required: false,
            },
            originalValue: {
              type: String,
              required: false,
            },
            newValue: {
              type: String,
              required: false,
            },
          },
        ],
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        dateChanged: {
          type: Date,
          required: false,
        },
      },
    ],

    watchers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    labels: [
      {
        type: String,
        required: false,
      },
    ],
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    resources: [
      {
        type: Schema.Types.ObjectId,
        ref: "AlphaResource",
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = { Ticket };
