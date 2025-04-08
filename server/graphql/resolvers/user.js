if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/user");
const { Order } = require("../../models/order");
const { Cart } = require("../../models/cart");
const { Subscriber } = require("../../models/subscriber.js");
const { sendMail, saveOtpVerificationRecord } = require("./sendMail");
const { sendEmailVerificationOtp } = require("./sendEmailVerification.js");
const {
  sendSubscriptionConfirmationEmail,
} = require("../resolvers/subscriber.js");
const { AppEnv } = require("../../models/appEnv.js");
const { transformUser, transformAddress } = require("./merge");
const { getUserId } = require("../../utils/getUserId");
const { PubSub } = require("graphql-subscriptions");
const { ObjectId } = require("mongodb");
const { sendNewMessage } = require("../../controllers/twilio.js");
const {
  sanitizeAndValidatePhoneNumber,
} = require("../../utils/phoneNumberValidator.js");
const { UserVerification } = require("../../models/userVerification");
const { Review } = require("../../models/review");
const { Rating } = require("../../models/rating");
const { Address } = require("../../models/address");
const { PaymentMethod } = require("../../models/paymentMethod");
const { QuestionAnswer } = require("../../models/questionAnswer");
const { Organization } = require("../../models/organization");
const { File } = require("../../models/file");
const { DeletionLog } = require("../../models/deletionLog");

const generateOtp = () => `${Math.floor(Math.random() * 900000 + 100000)}`;

const BRAND_NAME = `${process.env.BRAND_NAME}`;
const pubsub = new PubSub();
const user_Added = "userAdded";

// /**
//  * Handles OAuth Sign-in (Google & Facebook)
//  * @param {String} provider - "google" or "facebook"
//  * @param {String} providerId - Unique ID from Google or Facebook
//  * @param {String} email - User email
//  * @param {String} firstName - First name
//  * @param {String} lastName - Last name
//  * @param {String} avatar - Profile picture URL
//  * @returns {AuthData}
//  */
function generatePopulateQuery(options = {}) {
  const {
    limitOrders = false,
    limitAddresses = false,
    limitFavorites = false,
    limitWishList = false,
    limitSavedItems = false,
    limitOrderedItems = false,
  } = options;

  const query = [
    {
      path: "organization",
    },
    {
      path: "logo",
    },
    {
      path: "cart",
      populate: {
        path: "items.item",
      },
    },
    {
      path: "orders",
      populate: [
        {
          path: "items.item",
          model: "Item",
        },
        {
          path: "shippingAddress",
          model: "Address",
        },
        {
          path: "billingAddress",
          model: "Address",
        },
      ],
      options: limitOrders ? { sort: { createdAt: -1 }, limit: 20 } : {},
    },
    {
      path: "paymentMethods",
    },
    {
      path: "addresses",
      options: limitAddresses ? { limit: 20 } : {},
    },
    {
      path: "defaultAddress",
    },
    {
      path: "ratings",
    },
    {
      path: "reviews",
    },
    {
      path: "favorites",
      options: limitFavorites ? { limit: 20 } : {},
    },
    {
      path: "wishList",
      options: limitWishList ? { limit: 20 } : {},
    },
    {
      path: "savedItems",
      options: limitSavedItems ? { limit: 20 } : {},
    },
    {
      path: "viewedItems.item",
    },
    {
      path: "orderedItems.item",
      options: limitOrderedItems ? { limit: 20 } : {},
    },
  ];

  return query.map((q) => ({ ...q, model: "User" }));
}

async function getUserData({
  email,
  userId,
  cellNumber,
  googleId,
  facebookId,
}) {
  let filters = {};
  if (email) filters.email = email;
  else if (cellNumber)
    filters = {
      "cellNumber.cellNumber": cellNumber,
      "cellNumber.verified": true,
    };
  else if (userId) filters._id = userId;
  else if (googleId) filters.googleId = googleId;
  else if (facebookId) filters.facebookId = facebookId;

  const limit = parseInt(process.env.USER_ORDERS_PER_PAGE) || 10;

  // Get the total count of orders for the user
  const totalOrders = await Order.countDocuments({ user: userId });

  // Calculate the number of pages
  const numberOfOrderPages = Math.ceil(totalOrders / limit);

  // Fetch the user data
  const user = await User.findOne(filters)
    // organization
    .populate({
      path: "organization",
    })
    // logo
    .populate({
      path: "logo",
    })
    // cart
    .populate({
      path: "cart",
      populate: [{ path: "items.item" }],
    })
    // orders with pagination
    .populate({
      path: "orders",
      populate: [
        { path: "items.item" },
        {
          path: "billingAddress",
          model: "Address",
        },
        {
          path: "shippingAddress",
          model: "Address",
        },
      ],
      options: { sort: { createdAt: -1 }, limit: 20 },
    })
    // addresses
    .populate({
      path: "addresses",
      model: "Address",
      options: { limit: 20 },
    })
    // // paymentMethods
    // .populate({
    //   path: "paymentMethods",
    // })
    // defaultAddress
    .populate({
      path: "defaultAddress",
      model: "Address",
    })
    // ratings
    .populate({
      path: "ratings",
    })
    // reviews
    .populate({
      path: "reviews",
    })
    // favorites
    .populate({
      path: "favorites",
      options: { limit: 20 },
    })
    // wishList
    .populate({
      path: "wishList",
      options: { limit: 20 },
    })
    // savedItems
    .populate({
      path: "savedItems",
      options: { limit: 20 },
    })
    // viewedItems.item
    .populate({
      path: "viewedItems.item",
      options: { limit: 20 },
    })
    // orderedItems.item
    .populate({
      path: "orderedItems.item",
      options: { limit: 20 },
    })
    .exec();

  if (!user) {
    throw new Error("User not found!");
  }
  // Add the numberOfOrderPages to the user object
  user.numberOfOrderPages = numberOfOrderPages;
  return user;
}

// Add new function to send welcome email with verification link
const sendWelcomeEmailWithVerification = async (email, userId, otp) => {
  try {
    // Use the appropriate URL based on environment
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.VUE_APP_BASE_URL
        : process.env.VUE_APP_BASE_URL_DEV;

    // Update to use the existing route format for email verification with token
    const verificationLink = `${baseUrl}/verify-email/${userId}/${otp}`;
    const supportLink = `${baseUrl}/contact`;

    // Current year for copyright
    const year = new Date().getFullYear();

    // First, hash the OTP
    const hashedOtp = await bcrypt.hash(
      otp,
      parseInt(process.env.SALT_ROUNDS_OTP)
    );

    // Delete any existing verification records for this user
    await UserVerification.deleteMany({ userId });
    await UserVerification.deleteMany({ email });

    // Create a new verification record with both userId and email
    const newUserVerification = new UserVerification({
      userId,
      email,
      otp: hashedOtp,
      context: "emailVerification",
      expiresAt: new Date(
        Date.now() + parseInt(process.env.OTP_EXPIRY)
      ).toISOString(),
    });

    await newUserVerification.save();

    // Now send the email with the OTP
    await sendMail({
      email,
      userId,
      subject: `Welcome to ${BRAND_NAME} - Verify Your Email`,
      template: "welcomeEmail", // Use the new welcome email template
      templateData: {
        brandName: BRAND_NAME,
        verificationLink,
        supportLink,
        otp,
        year,
      },
      context: "emailVerification",
      skipOtpRecord: true, // Skip creating duplicate OTP record
    });

    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
};

const userResolver = {
  Mutation: {
    createUser: async (_parent, { userInput }, _context, _info) => {
      try {
        const {
          email,
          password,
          firstName,
          lastName,
          googleId,
          facebookId,
          avatar,
          subscribedToNewsletter = true, // Default to true if not provided
        } = userInput;

        // Check if the user already exists
        let existingUser = await User.findOne({ email });

        if (existingUser) {
          // If the user exists but has a Google or Facebook ID, allow login
          if (
            (googleId && existingUser.googleId === googleId) ||
            (facebookId && existingUser.facebookId === facebookId)
          ) {
            return {
              userId: existingUser._id,
            };
          } else {
            throw new Error("User already exists with this email.");
          }
        }

        // If using Google or Facebook, auto verify
        const isOAuthUser = googleId || facebookId;
        let hashedPassword = null;

        if (!isOAuthUser) {
          // Hash password for regular email-password signups
          hashedPassword = await bcrypt.hash(
            password,
            parseInt(process.env.JWT_HASH_COUNT)
          );
        }

        let user = new User({
          email,
          password: hashedPassword,
          firstName,
          lastName,
          googleId,
          facebookId,
          avatar: avatar || "",
          verified: isOAuthUser, // Auto verify OAuth users
          currentPasswords: hashedPassword ? [hashedPassword] : [],
          numberOfTrialsOffered: process.env.NUMBER_OF_TRIALS_OFFERED,
          trialStartDate: new Date(),
          maximumFreeProjects: process.env.MAXIMUM_FREE_PROJECTS,
          maximumFreeExecutions: process.env.MAXIMUM_FREE_EXECUTIONS,
          anadezMainExecutions: process.env.ANADEZ_MAIN_EXECUTIONS,
          trialExpiryDaysNumber: process.env.TRIAL_EXPIRY_DAYS_NUMBER,
          isOnTrial: process.env.IS_ON_TRIAL,
          resourceCreator: false,
          isPrimeMember: false,
          admin: false,
          masterAdmin: false,
          organization: null,
          logo: null,
          anadezMainExecutions: 0,
          isOnTrial: false,
          isPrimeMember: false,
          questionAnswers: [],
          resourceCreator: false,
          addresses: [],
          avatar: "",
          orders: [],
          paymentMethods: [],
          ratings: [],
          reviews: [],
          cart: null,
          defaultAddress: null,
          savedItems: [],
          wishList: [],
          favorites: [],
          viewedItems: [],
          orderedItems: [],
          subscription: {
            subscribed: subscribedToNewsletter,
            userUnsubscribed: !subscribedToNewsletter,
          },
          cellNumber: {
            countryCode: "",
            number: "",
            verified: false,
            cellNumber: "",
          },
        });

        const user_result = await user.save();
        const userId = user_result._doc._id;
        // Ensure the user object is fully saved
        user = await User.findById(userId);
        await user.save();

        // Add email to subscriber list (Only for non-OAuth users)
        if (!isOAuthUser) {
          // Only add to subscriber list if they explicitly opted in
          if (subscribedToNewsletter) {
            // Create subscriber record
            const subscriber = new Subscriber({
              email,
              firstName,
              lastName,
            });

            await subscriber.save();
            await sendSubscriptionConfirmationEmail(email);

            console.log(`User ${email} subscribed to newsletter`);
          } else {
            console.log(`User ${email} opted out of newsletter subscription`);
          }

          // Set subscription status based on checkbox
          user.subscription = {
            subscribed: subscribedToNewsletter,
            userUnsubscribed: !subscribedToNewsletter,
          };
          await user.save();

          // Generate OTP for verification
          const otp = generateOtp();

          // First, hash the OTP
          const hashedOtp = await bcrypt.hash(
            otp,
            parseInt(process.env.SALT_ROUNDS_OTP)
          );

          // Delete any existing verification records for this user
          await UserVerification.deleteMany({ userId });
          await UserVerification.deleteMany({ email });

          // Create a new verification record with both userId and email
          const newUserVerification = new UserVerification({
            userId,
            email,
            otp: hashedOtp,
            context: "emailVerification",
            expiresAt: new Date(
              Date.now() + parseInt(process.env.OTP_EXPIRY)
            ).toISOString(),
          });

          await newUserVerification.save();

          // Send welcome email with verification link instead of the old verification email
          await sendWelcomeEmailWithVerification(email, userId, otp);
        }

        // Publish user creation event
        pubsub.publish(user_Added, {
          userAdded: {
            email: user_result._doc.email,
            firstName: user_result._doc.firstName,
          },
        });

        // updating user with cart
        user = await User.findById(userId);
        await user.save();

        return {
          userId: userId,
        };
      } catch (err) {
        throw err;
      }
    },
    // This function replaces both old and new verifyUser functions to ensure verification happens properly
    verifyUser: async (_parent, { userOtpInput }, { req, res }, _info) => {
      try {
        console.log("Starting verifyUser with input:", userOtpInput);
        const userId = userOtpInput.userId;
        const otp = userOtpInput.otp;
        const context = userOtpInput.context || "emailVerification";

        // Checking if id and otp are valid
        if (!userId || !otp) {
          throw new Error("Unauthenticated! Missing userId or OTP.");
        }

        // Retrieve user from database
        let user = await User.findById(userId);
        console.log("Found user:", user ? "Yes" : "No");

        if (!user) {
          throw new Error("User not found.");
        }

        // **New Condition**: If the user is already verified via Google/Facebook, bypass OTP verification
        if (user.googleId || user.facebookId) {
          console.log("Skipping OTP verification for social login user.");
          return {
            user,
            token: null, // No need for a new token here
            tokenExpiration: null,
          };
        }

        // Try to find OTP verification records by userId first, then by email if not found
        let userOtpVerificationRecords = await UserVerification.find({
          userId,
          context,
        });
        console.log(
          "Found records by userId:",
          userOtpVerificationRecords.length
        );

        // If not found by userId, try email
        if (!userOtpVerificationRecords || !userOtpVerificationRecords.length) {
          userOtpVerificationRecords = await UserVerification.find({
            email: user.email,
            context,
          });
          console.log(
            "Found records by email:",
            userOtpVerificationRecords.length
          );
        }

        // Check if user is already verified and has no verification records
        if (
          (!userOtpVerificationRecords || !userOtpVerificationRecords.length) &&
          user.verified
        ) {
          console.log(
            "User is already verified and has no verification records"
          );

          // If user is already verified, just return the user data to create a seamless experience
          // ✅ Fetch User Data for Response
          const userResult = await getUserData({ userId });

          console.log("Return already verified user data");

          // Generate JWT Token
          const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_KEY,
            { expiresIn: process.env.JWT_EXPIRATION }
          );

          // ✅ Store Token in Cookies
          if (res && res.cookie) {
            res.cookie("papiloomToken", token, {
              httpOnly: false,
              secure: process.env.NODE_ENV === "production",
              sameSite: "Lax",
            });

            res.cookie(
              "papiloomTokenExpiryTime",
              new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax",
              }
            );
          }

          // ✅ Get App Env Variables
          const appEnv = await AppEnv.findOne();

          // ✅ Transform User Data
          const modifiedUser = await transformUser(userResult._doc, appEnv);
          if (userResult.numberOfOrderPages) {
            modifiedUser.numberOfOrderPages = userResult.numberOfOrderPages;
          }

          return {
            user: modifiedUser,
            token: token,
            tokenExpiration: process.env.JWT_EXPIRATION_DAYS,
          };
        }

        if (!userOtpVerificationRecords || !userOtpVerificationRecords.length) {
          console.log("No verification records found for user");
          throw new Error(
            "No records of the session or the user has already been verified. Please try again with a new OTP"
          );
        }

        // User OTP record exists
        const { expiresAt } = userOtpVerificationRecords[0];
        const hashedOtp = userOtpVerificationRecords[0].otp;

        // Parse expiresAt to a Date object
        const expiresAtDate = new Date(expiresAt);
        console.log(
          "OTP expires at:",
          expiresAtDate,
          "Current time:",
          new Date()
        );

        if (expiresAtDate < Date.now()) {
          // User OTP record has expired
          await UserVerification.deleteMany({ userId, context });
          await UserVerification.deleteMany({ email: user.email, context });
          throw new Error("OTP has expired. Please request again.");
        }

        // Verify OTP
        const isValidOtp = await bcrypt.compare(otp, hashedOtp);
        console.log("OTP validation result:", isValidOtp);

        if (!isValidOtp) {
          throw new Error("Incorrect OTP. Please try with a fresh OTP.");
        }

        // ✅ Mark User as Verified - ensuring update happens
        console.log("Setting verified flag to true for user", userId);
        const updateResult = await User.updateOne(
          { _id: userId },
          { $set: { verified: true } }
        );
        console.log("User marked as verified, update result:", updateResult);

        // ✅ Clean up verification records
        await UserVerification.deleteMany({ userId, context });
        await UserVerification.deleteMany({ email: user.email, context });

        // ✅ Re-fetch User to Ensure Data Integrity
        let newUser = await User.findById(userId);
        console.log("After update, user verified status:", newUser.verified);

        // ✅ Ensure the User Has a Cart
        let userCart = await Cart.findOne({ user: userId });

        if (!userCart) {
          console.log("Creating cart for new user:", newUser.email);

          userCart = new Cart({
            items: [],
            subTotal: 0,
            promotion: 0,
            promoCode: "",
            billingAddress: null,
            shippingAddress: null,
            paymentMethod: null,
            tax: process.env.TAX_COUNTRY,
            total: 0,
            currency: process.env.ACTIVECURRENCY,
            user: userId,
          });

          let savedCart = await userCart.save();

          // ✅ Properly Assign Cart to User
          newUser.cart = savedCart._id;
          await newUser.save();
        } else {
          console.log("Cart already exists for user:", newUser.email);
        }

        // ✅ Re-fetch User After Cart Assignment
        newUser = await User.findById(userId).populate("cart");

        if (!newUser.cart) {
          throw new Error("Cart linking failed! User cart is still null.");
        }

        console.log("User cart successfully linked:", newUser.cart);

        // ✅ Fetch User Data for Response
        const userResult = await getUserData({ userId });

        console.log("Final user verified status:", userResult.verified);

        // Generate JWT Token
        const token = jwt.sign(
          { userId: newUser._id, email: newUser.email },
          process.env.JWT_KEY,
          { expiresIn: process.env.JWT_EXPIRATION }
        );

        // ✅ Store Token in Cookies
        if (res && res.cookie) {
          res.cookie("papiloomToken", token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
          });

          res.cookie(
            "papiloomTokenExpiryTime",
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            {
              httpOnly: false,
              secure: process.env.NODE_ENV === "production",
              sameSite: "Lax",
            }
          );
        }

        // ✅ Get App Env Variables
        const appEnv = await AppEnv.findOne();

        // ✅ Transform User Data
        const modifiedUser = await transformUser(userResult._doc, appEnv);
        if (userResult.numberOfOrderPages) {
          modifiedUser.numberOfOrderPages = userResult.numberOfOrderPages;
        }

        console.log("Verification completed successfully");
        return {
          user: modifiedUser,
          token: token,
          tokenExpiration: process.env.JWT_EXPIRATION_DAYS,
        };
      } catch (error) {
        console.error("Verification error:", error.message);
        throw error;
      }
    },
    // Verify user for password reset
    verifyUserForPasswordReset: async (
      _parent,
      { resetPasswordOtpInput },
      { req },
      _info
    ) => {
      try {
        const email = resetPasswordOtpInput.email;
        const otp = resetPasswordOtpInput.otp;

        // Checking if email and OTP are provided
        if (!email || !otp) {
          throw new Error("Unauthenticated!");
        }

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("User not found!");
        }

        // **New Condition: Prevent Google/Facebook users from resetting password**
        if (user.googleId || user.facebookId) {
          throw new Error(
            "This account is linked to Google or Facebook. Please reset your password via your provider."
          );
        }

        // Find the OTP record
        const userOtpVerificationRecords = await UserVerification.find({
          email,
        })
          .sort({ expiresAt: -1 }) // Sort in descending order based on expiresAt
          .exec();

        if (!userOtpVerificationRecords.length) {
          throw new Error(
            "No records of the session or the user has already been verified. Please try again with a new OTP."
          );
        }

        // User OTP record exists
        const { expiresAt } = userOtpVerificationRecords[0];
        const hashedOtp = userOtpVerificationRecords[0].otp;

        // Parse expiresAt to a Date object
        const expiresAtDate = new Date(expiresAt);

        if (expiresAtDate < Date.now()) {
          // OTP record has expired
          await UserVerification.deleteMany({ email });
          throw new Error("OTP has expired. Please request again.");
        }

        // Verify OTP
        const isValidOtp = await bcrypt.compare(otp, hashedOtp);

        if (!isValidOtp) {
          throw new Error("Incorrect OTP. Please try with a fresh OTP.");
        }

        // Valid OTP - Allow password reset
        return {
          isVerified: isValidOtp,
          userId: user._id,
        };
      } catch (error) {
        throw error;
      }
    },
    // verify user
    resetPassword: async (
      _parent,
      { resetPasswordInput },
      { req, res },
      _info
    ) => {
      try {
        const userId = resetPasswordInput.userId;
        const newPassword = resetPasswordInput.newPassword;

        // Checking if userId and newPassword are provided
        if (!userId || !newPassword) {
          throw new Error("Unauthenticated!");
        }

        // Fetch user details
        const user = await User.findById(userId);

        if (!user) {
          throw new Error("User not found!");
        }

        // **New Condition: Prevent Google/Facebook users from resetting password**
        if (user.googleId || user.facebookId) {
          throw new Error(
            "This account is linked to Google or Facebook. Please reset your password via your provider."
          );
        }

        // Check if OTP verification record exists
        const userOtpVerificationRecords = await UserVerification.find({
          userId,
        });

        if (!userOtpVerificationRecords.length) {
          throw new Error(
            "No records of the session or the user has already been verified. Please try again with a new OTP."
          );
        }

        // Checking if this is one of the previous passwords
        let currentPasswords = user.currentPasswords;
        let matchFound = false;

        for (const hashedPassword of currentPasswords) {
          matchFound = await bcrypt.compare(newPassword, hashedPassword);
          if (matchFound) {
            throw new Error(
              "Choose a password that is different from the previous password"
            );
          }
        }

        // Hashing the new password
        let newHashedPassword = await bcrypt.hash(
          newPassword,
          parseInt(process.env.JWT_HASH_COUNT)
        );

        // Saving new password to user
        user.password = newHashedPassword;
        user.currentPasswords.push(newHashedPassword);
        await user.save();

        // Deleting any verification records
        await UserVerification.deleteMany({ userId });

        // Fetching updated user data
        const userResult = await getUserData({
          userId,
          cellNumber: null,
        });

        // Creating JWT
        const token = jwt.sign(
          { userId: userResult._doc._id, email: userResult._doc.email },
          process.env.JWT_KEY,
          { expiresIn: process.env.JWT_EXPIRATION }
        );

        // Setting cookies for JWT
        res.cookie("papiloomToken", token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production", // Ensure secure is only set in production
          sameSite: "Lax",
        });

        res.cookie(
          "papiloomTokenExpiryTime",
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
          }
        );

        // Getting App Env variables
        const appEnv = await AppEnv.find()[0];

        // Transform user data
        const modifiedUser = await transformUser(userResult._doc, appEnv);

        // Set the limit for orders per page
        const limit = parseInt(process.env.USER_ORDERS_PER_PAGE) || 10;

        // Get the total count of orders for the user
        const totalOrders = await Order.countDocuments({ user: userId });

        // Calculate the number of pages
        const numberOfOrderPages = Math.ceil(totalOrders / limit);

        if (numberOfOrderPages) {
          modifiedUser.numberOfOrderPages = numberOfOrderPages;
        }

        // Return updated user data and token
        return {
          user: modifiedUser,
          token: token,
          tokenExpiration: process.env.JWT_EXPIRATION_DAYS,
        };
      } catch (error) {
        throw error;
      }
    },
    // sending OTP
    sendOtp: async (_parent, { sendOtpInput }, { req }, _info) => {
      try {
        let userId = sendOtpInput.userId;
        let email = sendOtpInput.email;
        const context = sendOtpInput.context;

        // Validate input
        if ((!userId && !email) || !context) {
          throw new Error("User information not provided");
        }

        let user;
        if (userId) {
          user = await User.findById(userId);
          email = user?.email;
        } else if (email) {
          user = await User.findOne({ email });
          userId = user?._id;
        }

        // **New Condition: Prevent Google/Facebook users from receiving OTPs**
        if (user?.googleId || user?.facebookId) {
          throw new Error(
            "This account is linked to Google or Facebook. Please use your provider to authenticate."
          );
        }

        // Generate OTP
        const otp = `${Math.floor(Math.random() * 900000 + 100000)}`;
        let text;
        let html;

        // Setting Email Options
        let emailOptions;
        switch (context) {
          case "emailVerification":
            // Use the welcome email template for verification
            // Use the appropriate URL based on environment
            const baseUrl =
              process.env.NODE_ENV === "production"
                ? process.env.VUE_APP_BASE_URL
                : process.env.VUE_APP_BASE_URL_DEV;

            const verificationLink = `${baseUrl}/verify-email/${userId}/${otp}`;
            const supportLink = `${baseUrl}/contact-us`;
            const year = new Date().getFullYear();

            // First, hash the OTP
            const hashedOtp = await bcrypt.hash(
              otp,
              parseInt(process.env.SALT_ROUNDS_OTP)
            );

            // Delete any existing verification records for this user
            await UserVerification.deleteMany({ userId });
            await UserVerification.deleteMany({ email });

            // Create a new verification record with both userId and email
            const newUserVerification = new UserVerification({
              userId,
              email,
              otp: hashedOtp,
              context: "emailVerification",
              expiresAt: new Date(
                Date.now() + parseInt(process.env.OTP_EXPIRY)
              ).toISOString(),
            });

            await newUserVerification.save();

            emailOptions = {
              email,
              userId,
              subject: `Verify Your Email - ${BRAND_NAME}`,
              template: "welcomeEmail",
              templateData: {
                brandName: BRAND_NAME,
                verificationLink,
                supportLink,
                otp,
                year,
              },
              context,
              skipOtpRecord: true, // Skip creating duplicate OTP record
            };
            break;

          case "resetPassword":
            text = `Use the OTP ${otp} to reset your password. This OTP will expire in one hour.`;
            html = `<p>Use the OTP ${otp} to reset your password. This OTP will expire in one hour.</p>`;
            emailOptions = {
              email,
              userId,
              subject: `Reset Password`,
              text,
              html,
              otp,
              context,
            };
            break;

          default:
            throw new Error("Invalid OTP request.");
        }

        // Send the OTP via email
        await sendMail(emailOptions);

        return {
          message: "OTP was sent successfully!",
        };
      } catch (error) {
        throw error;
      }
    },
    // Send OTP for registering or authenticating phone number
    sendPhoneOtp: async (_parent, { cellNumberInput }, { req }, _info) => {
      let { countryCode, number, context } = cellNumberInput;

      // ✅ Validate and sanitize phone number
      const phoneValidation = sanitizeAndValidatePhoneNumber(
        number,
        countryCode
      );
      if (!phoneValidation.isValid) {
        throw new Error("Invalid phone number");
      }
      const fullNumber = phoneValidation.sanitizedNumber;

      let user = null;
      let userId = null;

      if (context === "authenticationByPhone") {
        // ✅ Authentication: Find user by verified phone number
        user = await User.findOne({
          "cellNumber.cellNumber": fullNumber,
          "cellNumber.verified": true,
        });

        if (!user) {
          throw new Error(
            "This phone number is not registered. Please register the number for authentication."
          );
        }

        userId = user._id; // Ensure we have userId for later use
      } else if (context === "phoneVerification") {
        // ✅ Phone verification: Retrieve user from token (if available)
        userId = getUserId(req);
        if (!userId) throw new Error("Unauthenticated request");

        user = await User.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }
      } else {
        throw new Error("Invalid context provided");
      }

      // ✅ Generate OTP
      const otp = generateOtp();

      // ✅ Construct message based on context
      const message = `${otp} is your OTP for ${process.env.BRAND_NAME} ${
        context === "authenticationByPhone" ? "authentication" : "verification"
      }. Don't share it.`;

      try {
        // ✅ Send OTP via Twilio
        await sendNewMessage({ to: `${fullNumber}`, body: message });

        // ✅ Delete existing verification records for this context
        await UserVerification.deleteMany(
          context === "authenticationByPhone"
            ? { cellNumber: fullNumber, context }
            : { userId, context }
        );

        // ✅ Save OTP to the database
        await saveOtpVerificationRecord({
          userId,
          otp,
          context,
          cellNumber: fullNumber,
        });

        // ✅ If phone verification, update user's phone number (unverified)
        if (context === "phoneVerification") {
          user.cellNumber = {
            countryCode,
            number,
            cellNumber: fullNumber,
            verified: false,
          };
          await user.save();
        }

        return { message: "OTP sent successfully" };
      } catch (error) {
        throw new Error("Failed to send OTP");
      }
    },
    updateUser: async (_parent, { userUpdateInput }, { req, res }, _info) => {
      // Checking if Authenticated
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      let newHashedPassword;

      try {
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("No user found!");
        }

        // **Prevent Google/Facebook users from updating passwords manually**
        if ((user.googleId || user.facebookId) && userUpdateInput.newPassword) {
          throw new Error(
            "This account is linked to Google or Facebook. Please update your password through Google/Facebook settings."
          );
        }

        // Checking old password match with database record
        // Executed only when user requests for password change
        if (userUpdateInput.oldPassword !== undefined) {
          // Plain password from client
          const plainTextPassword = userUpdateInput.oldPassword;
          // Hashed password from database
          const hashedPassword = user.password;
          // Comparing both passwords
          const passwordMatched = await bcrypt.compare(
            plainTextPassword,
            hashedPassword
          );
          if (!passwordMatched) {
            throw new Error("The old password is incorrect.");
          }
          newHashedPassword = await bcrypt.hash(
            userUpdateInput.newPassword,
            parseInt(process.env.JWT_HASH_COUNT)
          );
        }

        // Preparing updates for the database
        const updates = {};
        // Updating password (Only for email/password users)
        if (userUpdateInput.newPassword !== undefined)
          updates.password = newHashedPassword;
        // Updating first name
        if (userUpdateInput.firstName !== undefined)
          updates.firstName = userUpdateInput.firstName;
        // Updating last name
        if (userUpdateInput.lastName !== undefined)
          updates.lastName = userUpdateInput.lastName;

        // Updating user database and getting result
        const result = await User.findByIdAndUpdate(
          userId,
          {
            $set: updates,
          },
          { new: true }
        )
          .populate({
            path: "organization",
          })
          // logo
          .populate({
            path: "logo",
          })
          // cart
          .populate({
            path: "cart",
            populate: {
              path: "items.item",
            },
          })
          // orders
          .populate({
            path: "orders",
            populate: [
              {
                path: "items.item",
                model: "Item",
              },
              {
                path: "shippingAddress",
                model: "Address",
              },
              {
                path: "billingAddress",
                model: "Address",
              },
            ],
            options: { sort: { createdAt: -1 }, limit: 20 },
          })
          // paymentMethods
          // .populate({
          //   path: "paymentMethods",
          // })
          // addresses
          .populate({
            path: "addresses",
            options: { limit: 20 },
          })
          // defaultAddress
          .populate({
            path: "defaultAddress",
          })
          // ratings
          .populate({
            path: "ratings",
          })
          // reviews
          .populate({
            path: "reviews",
          })
          // favorites
          .populate({
            path: "favorites",
            options: { limit: 20 },
          })
          // wishList
          .populate({
            path: "wishList",
            options: { limit: 20 },
          })
          // savedItems
          .populate({
            path: "savedItems",
            options: { limit: 20 },
          })
          // viewedItems.item
          .populate({
            path: "viewedItems.item",
          })
          // orderedItems.item
          .populate({
            path: "orderedItems.item",
            options: { limit: 20 },
          })
          .exec();

        const email = result.email;
        // generating JWT token
        const token = jwt.sign({ userId, email }, process.env.JWT_KEY, {
          expiresIn: process.env.JWT_EXPIRATION,
        });

        res.cookie("papiloomToken", token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production", // Ensure secure is only set in production
          sameSite: "Lax",
        });

        res.cookie(
          "papiloomTokenExpiryTime",
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
          }
        );

        // getting App Env
        const appEnv = await AppEnv.find()[0];
        const modifiedUser = await transformUser(result._doc, appEnv);

        // Set the limit for orders per page
        const limit = parseInt(process.env.USER_ORDERS_PER_PAGE) || 10;

        // Get the total count of orders for the user
        const totalOrders = await Order.countDocuments({ user: userId });

        // Calculate the number of pages
        const numberOfOrderPages = Math.ceil(totalOrders / limit);

        if (numberOfOrderPages) {
          modifiedUser.numberOfOrderPages = numberOfOrderPages;
        }
        // Returning new Auth Data
        return {
          user: { ...modifiedUser, password: null, _id: result._id },
          token: token,
          tokenExpiration: process.env.JWT_EXPIRATION_DAYS,
        };
      } catch (err) {
        throw err;
      }
    },
    updateUserProperties: async (
      _parent,
      { userPropertiesInput },
      { req },
      _info
    ) => {
      // Checking if Authenticated
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      try {
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("No user found!");
        }

        // Preparing updates for the database
        const updates = {};

        // Updating theme (only UI properties)
        if (userPropertiesInput.isDarkTheme !== undefined) {
          updates.isDarkTheme = userPropertiesInput.isDarkTheme;
        }

        // Ensuring that only UI-related updates are applied
        const result = await User.findByIdAndUpdate(
          userId,
          { $set: updates },
          { new: true }
        );

        // Returning Success message
        return {
          message: "User UI properties updated successfully!",
        };
      } catch (err) {
        throw err;
      }
    },
    addNewFieldsUser: async (_parent, {}, { req }, _info) => {
      // Checking if Authenticated
      const userId = getUserId(req);
      const user = await User.findById(userId);
      if (!userId || (user && !user.admin)) {
        throw new Error("Unauthenticated!");
      }
      try {
        // Adding new fields to User model
        await User.updateMany(
          {},
          {
            $set: {
              // isPrimeMember: false,
              // isOnTrial: false,
              // trialExpiryDaysNumber: 7,
              // anadezMainExeuctions: 0,
              // trialStartDate: new Date().toISOString(),
              // numberOfTrialsOffered: 0,
              // maximumFreeExecutions: 10,
              // maximumFreeProjects: 5,
              // resourceCreator: false,
              // admin: false,
              // masterAdmin: false,
              // addresses: [],
              // orders: [],
              // paymentMethods: [],
              // avatar: "",
              // ratings: [],
              // reviews: [],
              // favorites: [],
              // viewedItems: [],
              // orderedItems: [],
              // verified: true,
              // subscription: {
              //   subscribed: false,
              //   userUnsubscribed: false,
              // },
              // cellNumber: {
              //   // countryCode: "",
              //   // number: "",
              //   // verified: false,
              //   // cellNumber:"",
              // },
              // "cellNumber.cellNumber": "",

              // Add new soft delete fields with default values
              isDeleted: false,
              deletedAt: null,
              deletionReason: null,
              dataAnonymized: false,
              originalEmail: null,
            },
          },
          {
            upsert: false,
            multi: true,
            // Only set fields that don't already exist
            setDefaultsOnInsert: true,
          }
        );

        // Returning Success message
        return {
          message: "New fields Added successfully!",
        };
      } catch (err) {
        throw err;
      }
    },
    updateItemArrayData: async (
      _parent,
      { itemId, operation, arrayType },
      { req },
      _info
    ) => {
      // Checking if Authenticated
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      if (!(itemId && operation && arrayType)) {
        throw new Error("Invalid Input!");
      }

      try {
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("No user found!");
        }

        // Validate the arrayType
        const validArrayTypes = ["favorites", "savedItems", "wishList"];
        if (!validArrayTypes.includes(arrayType)) {
          throw new Error("Invalid array type!");
        }

        // Ensure the field exists in the user's document
        if (!user[arrayType]) {
          user[arrayType] = [];
        }

        switch (operation) {
          case "add":
            if (!user[arrayType].includes(itemId)) {
              user[arrayType].push(itemId);
            }
            break;

          case "remove":
            user[arrayType] = user[arrayType].filter(
              (id) => id.toString() !== itemId
            );
            break;

          default:
            throw new Error("Invalid operation. Use 'add' or 'remove'.");
        }

        await user.save();

        return {
          message: `Item successfully ${
            operation === "add" ? "added to" : "removed from"
          } ${arrayType}.`,
        };
      } catch (err) {
        throw err;
      }
    },
    deleteUserAccount: async (_parent, { userId }, { req }, _info) => {
      try {
        const authenticatedUserId = getUserId(req);
        if (!authenticatedUserId) {
          throw new Error("Unauthenticated!");
        }

        if (authenticatedUserId !== userId) {
          throw new Error("Not authorized to delete this account!");
        }

        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User not found!");
        }

        console.log("Starting account deletion process for user:", userId);

        await user.softDelete("User requested account deletion");

        console.log("Account deletion completed successfully");

        return {
          message: "User account has been successfully deactivated",
        };
      } catch (error) {
        console.error("Error in deleteUserAccount:", error);
        throw error;
      }
    },
    // verify user phone
    verifyUserPhone: async (_parent, { userOtpInput }, { req, res }, _info) => {
      try {
        const userId = userOtpInput.userId;
        const otp = userOtpInput.otp;
        const context = userOtpInput.context || "phoneVerification";
        const cellNumber = userOtpInput.cellNumber;

        console.log(
          "Starting verifyUserPhone with input:",
          JSON.stringify({
            userId,
            otp,
            context,
            cellNumber: cellNumber ? "provided" : "not provided",
          })
        );

        // Authentication by phone number
        if (context === "authenticationByPhone") {
          if (!otp || !cellNumber) {
            throw new Error(
              "OTP and phone number are required for authentication"
            );
          }

          // Find verification record by cell number
          const userOtpVerificationRecord = await UserVerification.findOne({
            cellNumber,
            context,
          });

          if (!userOtpVerificationRecord) {
            throw new Error(
              "No verification record found. Please request a new OTP."
            );
          }

          // Check if OTP has expired
          const expiresAt = new Date(userOtpVerificationRecord.expiresAt);
          if (expiresAt < new Date()) {
            await UserVerification.deleteMany({ cellNumber, context });
            throw new Error("OTP has expired. Please request a new one.");
          }

          // Verify OTP
          const hashedOtp = userOtpVerificationRecord.otp;
          const isValidOtp = await bcrypt.compare(otp, hashedOtp);

          if (!isValidOtp) {
            throw new Error("Invalid OTP. Please try again.");
          }

          // OTP is valid, find the user with this verified phone number
          const user = await User.findOne({
            "cellNumber.cellNumber": cellNumber,
            "cellNumber.verified": true,
          });

          if (!user) {
            throw new Error("No user found with this verified phone number.");
          }

          // Clean up the verification record
          await UserVerification.deleteMany({ cellNumber, context });

          // Generate JWT token for authentication
          const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_KEY,
            { expiresIn: process.env.JWT_EXPIRATION }
          );

          // Set cookies
          if (res && res.cookie) {
            res.cookie("papiloomToken", token, {
              httpOnly: false,
              secure: process.env.NODE_ENV === "production",
              sameSite: "Lax",
            });

            res.cookie(
              "papiloomTokenExpiryTime",
              new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax",
              }
            );
          }

          // Get complete user data with properly transformed fields
          const userData = await getUserData({ userId: user._id });
          const appEnv = await AppEnv.findOne();
          const modifiedUser = await transformUser(userData._doc, appEnv);

          console.log("Phone authentication successful for user:", user._id);

          return {
            message: "Phone number authenticated successfully",
            loginData: {
              userId: user._id,
              user: modifiedUser,
              token: token,
              tokenExpiration: process.env.JWT_EXPIRATION_DAYS,
            },
          };
        }
        // Phone verification for existing user
        else if (context === "phoneVerification") {
          if (!userId || !otp) {
            throw new Error("User ID and OTP are required for verification");
          }

          // Find the user
          const user = await User.findById(userId);
          if (!user) {
            throw new Error("User not found");
          }

          // Get the phone number from the user record
          const userCellNumber = user.cellNumber?.cellNumber;
          if (!userCellNumber) {
            throw new Error("No phone number found for this user");
          }

          // Find verification record
          const userOtpVerificationRecord = await UserVerification.findOne({
            userId,
            context,
          });

          if (!userOtpVerificationRecord) {
            throw new Error(
              "No verification record found. Please request a new OTP."
            );
          }

          // Check if OTP has expired
          const expiresAt = new Date(userOtpVerificationRecord.expiresAt);
          if (expiresAt < new Date()) {
            await UserVerification.deleteMany({ userId, context });
            throw new Error("OTP has expired. Please request a new one.");
          }

          // Verify OTP
          const hashedOtp = userOtpVerificationRecord.otp;
          const isValidOtp = await bcrypt.compare(otp, hashedOtp);

          if (!isValidOtp) {
            throw new Error("Invalid OTP. Please try again.");
          }

          // OTP is valid, update user's phone verification status
          user.cellNumber.verified = true;
          await user.save();

          // Clean up the verification record
          await UserVerification.deleteMany({ userId, context });

          console.log("Phone verification successful for user:", userId);

          // Get complete user data with properly transformed fields
          const userData = await getUserData({ userId: user._id });
          const appEnv = await AppEnv.findOne();
          const modifiedUser = await transformUser(userData._doc, appEnv);

          return {
            message: "Phone number verified successfully",
            loginData: {
              userId: user._id,
              user: modifiedUser,
              token: null,
              tokenExpiration: null,
            },
          };
        } else {
          throw new Error("Invalid context provided");
        }
      } catch (error) {
        console.error("Error in verifyUserPhone:", error);
        throw error;
      }
    },
  },
  Query: {
    /**
     * Handles Standard Email/Password Login
     */
    login: async (_parent, { email, password }, { res }, _info) => {
      try {
        if (!email || !password) {
          throw new Error("Email and password are required!");
        }

        let user = await User.findOne({ email });

        if (!user) {
          throw new Error("User not found!");
        }

        // Log user object to see if password exists
        // console.log("User data:", user);

        // If user signed in via OAuth, prevent password login
        if (user.googleId || user.facebookId) {
          throw new Error("Please log in using Google or Facebook.");
        }

        if (!user.verified) {
          // Generate a new OTP for verification
          const otp = generateOtp();

          // First, hash the OTP
          const hashedOtp = await bcrypt.hash(
            otp,
            parseInt(process.env.SALT_ROUNDS_OTP)
          );

          // Delete any existing verification records for this user
          await UserVerification.deleteMany({ userId: user._id });
          await UserVerification.deleteMany({ email });

          // Create a new verification record with both userId and email
          const newUserVerification = new UserVerification({
            userId: user._id,
            email,
            otp: hashedOtp,
            context: "emailVerification",
            expiresAt: new Date(
              Date.now() + parseInt(process.env.OTP_EXPIRY)
            ).toISOString(),
          });

          await newUserVerification.save();

          // Send welcome email with verification link
          await sendWelcomeEmailWithVerification(email, user._id, otp);

          return {
            userId: user._id,
            message: "Please verify your email before logging in.",
          };
        }

        user = await getUserData({
          email,
          cellNumber: null,
          userId: null,
        });

        // console.log("User after getUserData:", user);

        if (!user.password) {
          throw new Error(
            "Password not found for this user. Please use Google/Facebook login."
          );
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
          throw new Error("Invalid credentials!");
        }

        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_KEY,
          { expiresIn: process.env.JWT_EXPIRATION }
        );

        res.cookie("papiloomToken", token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
        });

        res.cookie(
          "papiloomTokenExpiryTime",
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
          }
        );

        const appEnv = await AppEnv.findOne();
        const modifiedUser = await transformUser(user._doc, appEnv);

        if (user.numberOfOrderPages) {
          modifiedUser.numberOfOrderPages = user.numberOfOrderPages;
        }

        return {
          userId: user._id,
          user: { ...modifiedUser, password: null, _id: user.id },
          token: token,
          tokenExpiration: process.env.JWT_EXPIRATION_DAYS,
        };
      } catch (error) {
        console.error("Login Error:", error);
        throw error;
      }
    },
    getCurrentUser: async (_parent, _args, { req }, _info) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      const user = await getUserData({ userId, cellNumber: null });
      if (!user) {
        throw new Error("User not found!");
      }
      // getting App Env
      const appEnv = await AppEnv.find()[0];
      const modifiedUser = await transformUser(user._doc, appEnv);
      if (user.numberOfOrderPages) {
        modifiedUser.numberOfOrderPages = user.numberOfOrderPages;
      }
      return {
        ...modifiedUser,
        password: null,
        _id: user.id,
      };
      // return user;
    },
    /**
     * Returns Application Environment Variables
     */
    getAppEnv: async (_parent, {}, _context, _info) => {
      try {
        // const userId = getUserId(req);
        // if (!userId) {
        //   throw new Error("Unauthenticated!");
        // }
        const appEnv = AppEnv.find()[0];
        // if (!appEnv) throw new Error("Something went wrong");
        return appEnv ? appEnv._doc : {};
      } catch (error) {
        throw error;
      }
    },
  },

  Subscription: {
    userAdded: {
      subscribe: () => {
        return pubsub.asyncIterator([user_Added]);
      },
    },
  },
};

module.exports = { userResolver };
