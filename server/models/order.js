const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for each item being returned
const returnItemSchema = new Schema({
  itemId: {
    type: Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  returnInitiatedDate: {
    type: Date,
    default: Date.now, // Automatically set when the return is initiated
  },
  refundAmount: {
    type: Number,
    required: false,
  },
  refundStatus: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  },
  refundDate: {
    type: Date,
  },
});

// Schema for tracking individual refund sessions
const refundSessionSchema = new Schema({
  refundId: {
    type: String, // Stripe refund ID
    required: false,
  },
  refundDate: {
    type: Date,
    default: Date.now,
  },
  refundAmount: {
    type: Number,
    required: true,
  },
  paymentIntentId: {
    type: String,
    required: false,
  },
  items: [
    {
      itemId: {
        type: Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
  status: {
    type: String,
    enum: ["initiated", "processing", "completed", "failed"],
    default: "initiated",
  },
  // Added fields that were previously at returnDetails level
  returnStatus: {
    type: String,
    enum: ["initiated", "processing", "completed"],
    default: "initiated",
  },
  refundProcessed: {
    type: Boolean,
    default: false,
  },
  returnInitiatedDate: {
    type: Date,
    default: Date.now,
  },
});

// Main Order Schema
const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    deliveryEstimate: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      required: false,
    },
    discount: {
      type: Number,
      required: false,
    },
    orderDate: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: false,
    },
    orderStatus: {
      type: String,
      enum: [
        "pendingPayment",
        "paymentSuccess",
        "deliveryInProgress",
        "delivered",
        "canceled",
        "pending",
        "processing",
        "shipped",
        "returned", // Added new status for returned orders
      ],
      required: true,
    },
    canceled: {
      type: Boolean,
      required: true,
    },
    orderComplete: {
      type: Boolean,
      required: true,
    },
    items: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        returned: {
          type: Boolean,
          default: false,
        },
        returnedQuantity: {
          type: Number,
          default: 0,
        },
      },
    ],
    subTotal: {
      type: Number,
      required: true,
    },
    billingAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: false,
    },
    paymentFailureReason: {
      type: String,
      required: false,
    },
    promotion: {
      isPercentage: {
        type: Boolean,
        required: false,
      },
      value: {
        type: Number,
        required: false,
      },
    },
    promoCode: {
      type: String,
      required: false,
    },
    tax: {
      type: Number,
      required: true,
    },
    orderValue: {
      type: Number,
      required: true,
    },
    orderCurrency: {
      type: String,
      required: true,
      enum: ["cad", "inr"],
    },
    trackingNumber: {
      type: String,
      required: false,
    },
    remarks: {
      type: String,
      required: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    invoiceUrl: {
      type: String,
      required: false,
    },
    returnLabelUrl: {
      type: String,
      required: false,
    },

    // Added Return Details Field
    returnDetails: {
      items: [returnItemSchema], // Array of returned items with quantity, reason, and comment
      totalRefundAmount: {
        type: Number, // Calculate total refund amount based on returned items
        default: 0,
      },
      returnCharges: {
        type: Number, // Charges for the return process, if any
        default: 0,
      },
      returnLabelUrl: {
        type: String, // Keep for backward compatibility
        required: false,
      },
      returnLabelUrls: {
        type: [String], // Array to store multiple return label URLs
        default: [],
      },
      refundSessions: [refundSessionSchema], // Track individual refund sessions

      // These fields are now calculated based on refundSessions, but kept for backward compatibility
      refundProcessed: {
        type: Boolean,
        default: false,
      },
      refundDate: {
        type: Date,
      },
      returnStatus: {
        type: String,
        enum: ["initiated", "processing", "completed"],
        default: "initiated",
      },
      returnInitiatedDate: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = { Order };
