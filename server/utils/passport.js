const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { Cart } = require("../models/cart");
require("dotenv").config();

// ✅ Ensure JWT_KEY is set
if (!process.env.JWT_KEY) {
  throw new Error("❌ Missing JWT_KEY in environment variables.");
}

// ✅ Dynamic callback URLs
const GOOGLE_CALLBACK_URL =
  process.env.NODE_ENV === "production"
    ? process.env.OAUTH_CLIENT_URL_PRODUCTION + "/auth/google/callback"
    : process.env.GOOGLE_CLIENT_URL_DEVELOPMENT + "/auth/google/callback";

// console.log("GOOGLE_CALLBACK_URL", GOOGLE_CALLBACK_URL);

const FACEBOOK_CALLBACK_URL =
  process.env.NODE_ENV === "production"
    ? process.env.OAUTH_CLIENT_URL_PRODUCTION + "/auth/facebook/callback"
    : process.env.FACEBOOK_CLIENT_URL_DEVELOPMENT + "/auth/facebook/callback";

// Get avatar URL based on provider
function getAvatarUrl(provider, profile) {
  if (provider === "facebook") {
    return `https://graph.facebook.com/${profile.id}/picture?type=large`;
  } else if (provider === "google") {
    return profile.photos?.length ? profile.photos[0].value : "";
  }
  return "";
}

/** ✅ Common Function to Handle OAuth User Login/Signup */
async function findOrCreateOAuthUser({ provider, profile }) {
  try {
    const email =
      profile.emails && profile.emails.length
        ? profile.emails[0].value
        : `${profile.id}@${provider}.com`;

    const providerId = profile.id;
    const providerField = `${provider}Id`;

    // First, try to find an active user
    let user = await User.findOne({
      $or: [
        { email, isDeleted: false },
        { [providerField]: providerId, isDeleted: false },
      ],
    });

    // If no active user found, check for a deleted user
    if (!user) {
      const deletedUser = await User.findOne({
        $or: [{ email }, { [providerField]: providerId }],
        isDeleted: true,
      });

      if (deletedUser) {
        // Reactivate the user with new data
        user = await User.findByIdAndUpdate(
          deletedUser._id,
          {
            $set: {
              [providerField]: providerId,
              email,
              firstName: profile.name?.givenName || provider,
              lastName: profile.name?.familyName || "User",
              avatar: getAvatarUrl(provider, profile),
              verified: true,
              isDeleted: false,
              deletedAt: null,
              deletionReason: null,
              dataAnonymized: false,
              isOnTrial: process.env.IS_ON_TRIAL === "true",
              trialStartDate: new Date().toISOString().split("T")[0],
              trialExpiryDaysNumber: parseInt(
                process.env.TRIAL_EXPIRY_DAYS_NUMBER
              ),
              numberOfTrialsOffered: parseInt(
                process.env.NUMBER_OF_TRIALS_OFFERED
              ),
              anadezMainExecutions: parseInt(
                process.env.ANADEZ_MAIN_EXECUTIONS
              ),
              maximumFreeExecutions: parseInt(
                process.env.MAXIMUM_FREE_EXECUTIONS
              ),
              maximumFreeProjects: parseInt(process.env.MAXIMUM_FREE_PROJECTS),
            },
          },
          { new: true }
        );

        // Create new cart if needed
        if (!user.cart) {
          const cart = new Cart({
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
            user: user._id,
          });
          const cart_result = await cart.save();
          user.cart = cart_result._id;
          await user.save();
        }
      } else {
        // Create new user if no existing user found
        user = new User({
          [providerField]: providerId,
          email,
          firstName: profile.name?.givenName || provider,
          lastName: profile.name?.familyName || "User",
          avatar: getAvatarUrl(provider, profile),
          verified: true,
          isOnTrial: process.env.IS_ON_TRIAL === "true",
          trialStartDate: new Date().toISOString().split("T")[0],
          trialExpiryDaysNumber: parseInt(process.env.TRIAL_EXPIRY_DAYS_NUMBER),
          numberOfTrialsOffered: parseInt(process.env.NUMBER_OF_TRIALS_OFFERED),
          anadezMainExecutions: parseInt(process.env.ANADEZ_MAIN_EXECUTIONS),
          maximumFreeExecutions: parseInt(process.env.MAXIMUM_FREE_EXECUTIONS),
          maximumFreeProjects: parseInt(process.env.MAXIMUM_FREE_PROJECTS),
          resourceCreator: false,
          isPrimeMember: false,
          admin: false,
          masterAdmin: false,
          subscription: { subscribed: true, userUnsubscribed: false },
        });

        const cart = new Cart({
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
          user: user._id,
        });

        const cart_result = await cart.save();
        user.cart = cart_result._id;
        await user.save();
      }
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_KEY,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    return { user, token };
  } catch (error) {
    console.error(`OAuth Error (${provider}):`, error);
    throw error;
  }
}

// ✅ Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      scope: ["profile", "email"],
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const result = await findOrCreateOAuthUser({
          provider: "google",
          profile,
        });
        // console.log("✅ Google Auth Success result:", result);

        return done(null, result);
      } catch (error) {
        console.error("❌ Google Auth Error:", error);
        return done(error, false);
      }
    }
  )
);

// ✅ Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "emails", "name", "picture.type(large)"],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const result = await findOrCreateOAuthUser({
          provider: "facebook",
          profile,
        });
        return done(null, result);
      } catch (error) {
        console.error("❌ Facebook Auth Error:", error);
        return done(error, false);
      }
    }
  )
);

// ✅ Optimize session handling
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
