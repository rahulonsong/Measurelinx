const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DeletionLog } = require("./deletionLog");

const userSchema = new Schema(
  {
    googleId: {
      type: String,
      required: false, // Only required if the user logs in with Google
      sparse: true,
      index: {
        unique: true,
        sparse: true,
        partialFilterExpression: {
          googleId: { $exists: true },
          isDeleted: false,
        },
      },
    },
    facebookId: {
      type: String,
      required: false, // Only required if the user logs in with Facebook
      sparse: true,
      index: {
        unique: true,
        sparse: true,
        partialFilterExpression: {
          facebookId: { $exists: true },
          isDeleted: false,
        },
      },
    },
    email: {
      type: String,
      required: false, // Required for password-based sign-up, optional for OAuth
      sparse: true,
      index: {
        unique: true,
        sparse: true,
        partialFilterExpression: {
          email: { $exists: true },
          isDeleted: false,
        },
      },
    },
    password: {
      type: String,
      required: function () {
        // Don't require password for OAuth users or deleted users
        return !this.isDeleted && !this.googleId && !this.facebookId;
      },
    },
    firstName: {
      type: String,
      required: false, // Not always provided by Google/Facebook
    },
    lastName: {
      type: String,
      required: false, // Not always provided by Google/Facebook
    },
    verified: {
      type: Boolean,
      required: true,
      default: false, // Default to false until email or OAuth verification
    },
    masterAdmin: {
      type: Boolean,
      required: false,
    },
    admin: {
      type: Boolean,
      required: false,
    },
    isPrimeMember: {
      type: Boolean,
      required: false,
    },
    avatar: {
      type: String, // Stores profile picture (Google, Facebook, or manually uploaded)
      required: false,
    },
    cellNumber: {
      countryCode: {
        type: String,
        required: false,
      },
      number: {
        type: String,
        required: false,
        validate: {
          validator: function (v) {
            // Allow null/empty when user is deleted
            if (this.isDeleted) return true;
            return v === "" || /^\d{10,15}$/.test(v);
          },
          message: (props) => `${props.value} is not a valid phone number!`,
        },
      },
      cellNumber: {
        type: String,
        required: false,
      },
      verified: {
        type: Boolean,
        default: false,
      },
    },
    currentPasswords: [
      {
        type: String,
        required: function () {
          return !this.googleId && !this.facebookId;
        },
      },
    ],
    defaultAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },
    addresses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
    },
    wishList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    savedItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    viewedItems: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: "Item",
        },
        viewedDate: {
          type: Date,
          required: false,
        },
      },
    ],
    orderedItems: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: "Item",
        },
        orderDate: {
          type: Date,
          required: false,
        },
      },
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    paymentMethods: [
      {
        type: Schema.Types.ObjectId,
        ref: "PaymentMethod",
      },
    ],
    resourceCreator: {
      type: Boolean,
      required: false,
    },
    isOnTrial: {
      type: Boolean,
      required: true,
    },
    trialExpiryDaysNumber: {
      type: Number,
      required: true,
    },
    anadezMainExecutions: {
      type: Number,
      required: true,
    },
    maximumFreeExecutions: {
      type: Number,
      required: true,
    },
    maximumFreeProjects: {
      type: Number,
      required: true,
    },
    trialStartDate: {
      type: String,
      required: true,
    },
    numberOfTrialsOffered: {
      type: Number,
      required: true,
    },
    createdProjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    questionAnswers: [
      {
        type: Schema.Types.ObjectId,
        ref: "QuestionAnswer",
      },
    ],
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
    logo: {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
    ratings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Rating",
      },
    ],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    subscription: {
      userUnsubscribed: {
        type: Boolean,
        required: false,
      },
      subscribed: {
        type: Boolean,
        required: false,
      },
    },
    isDarkTheme: {
      type: Boolean,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletionReason: {
      type: String,
      default: null,
    },
    dataAnonymized: {
      type: Boolean,
      default: false,
    },
    originalEmail: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add a middleware to handle soft deletes
userSchema.pre("find", function () {
  // Add isDeleted: false to query conditions if not explicitly querying for deleted users
  if (!this.getQuery().hasOwnProperty("isDeleted")) {
    this.where({ isDeleted: false });
  }
});

userSchema.pre("findOne", function () {
  if (!this.getQuery().hasOwnProperty("isDeleted")) {
    this.where({ isDeleted: false });
  }
});

userSchema.methods.softDelete = async function (deletionReason) {
  try {
    // First, fetch the complete user document to ensure we have all data
    const user = await User.findById(this._id);
    if (!user) {
      throw new Error("User not found for deletion");
    }

    // Debug logging
    console.log("Starting soft delete process for user:", {
      userId: user._id,
      currentEmail: user.email,
      googleId: user.googleId,
      facebookId: user.facebookId,
    });

    // Determine original email with strict validation
    let originalEmail = user.email;
    if (!originalEmail || originalEmail.trim() === "") {
      originalEmail = `deleted_${user._id}@deleted.account`;
    }
    console.log("Determined originalEmail:", originalEmail);

    // Create deletion log first
    try {
      const deletionLog = await DeletionLog.create({
        userId: user._id,
        originalEmail: originalEmail,
        deletedAt: new Date(),
        type: "user_account",
        reason: deletionReason || "User requested account deletion",
      });
      console.log("DeletionLog created successfully:", deletionLog);
    } catch (logError) {
      console.error("Error creating DeletionLog:", logError);
      throw logError;
    }

    // Prepare update object
    const updateObj = {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        deletionReason: deletionReason || "User requested account deletion",
        dataAnonymized: true,
        originalEmail: originalEmail,
        email: `deleted_${user._id}@deleted.account`,
        password: null,
        cellNumber: {
          countryCode: null,
          number: null,
          cellNumber: null,
          verified: false,
        },
      },
      $unset: {
        googleId: "",
        facebookId: "",
      },
    };

    // Update user document
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        updateObj,
        {
          new: true,
          runValidators: false,
        }
      );
      console.log("User document updated successfully");

      if (!updatedUser) {
        throw new Error("Failed to update user during soft delete");
      }
    } catch (updateError) {
      console.error("Error updating user:", updateError);
      throw updateError;
    }
  } catch (error) {
    console.error("Soft delete process failed:", error);
    throw error;
  }
};

// Ensure the model isn't recompiled when reloading in development
const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = { User };
