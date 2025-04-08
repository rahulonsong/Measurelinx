const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deletionLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    originalEmail: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "Original email cannot be empty",
      },
    },
    deletedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    type: {
      type: String,
      required: true,
      enum: ["user_account", "organization", "resource"],
    },
    reason: {
      type: String,
      required: false,
      default: "User requested account deletion",
    },
    restoredAt: {
      type: Date,
      default: null,
    },
    restoredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Add a pre-save hook to ensure originalEmail is not empty
deletionLogSchema.pre("save", function (next) {
  if (!this.originalEmail || this.originalEmail.trim() === "") {
    this.originalEmail = `unknown_${this.userId}@deleted.account`;
  }
  next();
});

const DeletionLog =
  mongoose.models.DeletionLog ||
  mongoose.model("DeletionLog", deletionLogSchema);
module.exports = { DeletionLog };
