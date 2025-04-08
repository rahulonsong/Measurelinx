// subscriber resolver
// const { Item } = require("../../models/item.js");

const { Subscriber } = require("../../models/subscriber.js");
const { User } = require("../../models/user");
const { sendMailBeta } = require("./sendMail");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
// const { User } = require("../../models/user");

// const mongoose = require("mongoose");

// const { getUserId } = require("../../utils/getUserId");

const sendSubscriptionConfirmationEmail = async (email) => {
  // Sending Subscription confirmation email
  const text = `Thank you for subscribing to ${process.env.BRAND_NAME}.`;
  const context = "subscriptionConfirmation";

  // Determine the correct base URL based on environment
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.BRAND_WEBSITE || process.env.VUE_APP_BASE_URL
      : process.env.VUE_APP_BASE_URL_DEV || "http://localhost:8080";

  // Load the EJS template from another folder
  const emailTemplate = fs.readFileSync(
    path.join(__dirname, "../../templates/subscriptionConfirmation.ejs"),
    "utf-8"
  );

  // Render the EJS template with your data
  const html = ejs.render(emailTemplate, {
    url: baseUrl,
    email: email, // Pass the email to the template
  });

  // <a sb-type="UNSUBSCRIBE" href="{{${process.env.VUE_APP_BASE_URL}/unsubscribe/${email}}}" style="font-family:Arial, Helvetica, sans-serif;color:#333333;font-size:11px;"></a>
  emailOptions = Object.assign(
    {},
    {
      email,
      subject: `Thank you for subscribing to Papiloom newsletters`,
      text,
      html,
      context,
    }
  );
  try {
    await sendMailBeta(emailOptions);
    console.log("Email sent!");
  } catch (error) {
    throw error;
  }
};
const createSubscriberFromChat = async ({ name, email, contactNumber }) => {
  // creating subscriber in database
  if (email || contactNumber) {
    if (email) {
      // check for user
      const user = await User.findOne({ email });
      const subscriber = await Subscriber.findOne({ email });
      if (user !== null || subscriber !== null) {
        // User or subscriber exists
        return;
      }
    }

    const firstName = name.split(" ")[0];
    const lastName = name.split(" ")[1] || "";
    const subscriber = new Subscriber({
      firstName: firstName,
      lastName: lastName,
      email: email.toLowerCase(),
      contactNumber,
      userUnsubscribed: false,
      reasonForUnsubscribing: "",
    });

    let result;
    result = await subscriber.save();
  }
};

const subscriberResolver = {
  Query: {
    subscribers: async (_parent, {}, { req }, _info) => {
      // Authenticating
      // const userId = getUserId(req);
      // if (!userId) {
      //   throw new Error("Unauthenticated!");
      // }
      try {
        // Filtering out disabled subscribers
        const subscribers = await Subscriber.find();
        return subscribers.map((sub) => sub._doc);
      } catch (error) {
        throw error;
      }
    },
    singleSubscriber: async (_parent, { subscriberId }, { req }, _info) => {
      try {
        const subscriber = await Subscriber.findById(subscriberId);
        if (!subscriber) {
          throw new Error("Invalid Subscriber!");
        }
        return subscriber._doc;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    // Adding Subscriber
    addSubscriberData: async (_parent, { subscriberInput }, { req }, _info) => {
      const email = subscriberInput.email.toLowerCase();
      // Check if subscriber exists for the user and item
      const existingSubscribers = await Subscriber.find({
        email,
      });
      // subscriberInputCheck for prior subscription
      if (existingSubscribers.length) {
        if (!existingSubscribers[0].userUnsubscribed) {
          return { message: "You're already subscribed!" };
        } else {
          let subscriber = await Subscriber.findOne({
            email,
          });
          // Checking if the user is the owner of this alpha Resource
          if (!subscriber) {
            return {
              message: `You have not subscribed to ${process.env.BRAND_NAME}!`,
            };
          } else {
            // User Resubscribing
            subscriber.userUnsubscribed = false;
            subscriber.firstName = subscriberInput.firstName;
            subscriber.lastName = subscriberInput.lastName;
            subscriber.reasonForUnsubscribing = "";
            await subscriber.save();
            // checking if user exists and is already subscribed
            let user = await User.findOne({ email });
            if (user && !user.subscription.subscribed) {
              user.subscription.subscribed = true;
              user.subscription.userUnsubscribed = false;
              await user.save();
            }
            await sendSubscriptionConfirmationEmail(email);
            return {
              message: `Thank you. You are now subscribed to ${process.env.BRAND_NAME}.`,
            };
          }
        }
      }
      // creating subscriber in database
      const subscriber = new Subscriber({
        firstName: subscriberInput.firstName,
        lastName: subscriberInput.lastName,
        email: subscriberInput.email.toLowerCase(),
        userUnsubscribed: false,
        reasonForUnsubscribing: "",
      });
      let result;
      try {
        result = await subscriber.save();
        await sendSubscriptionConfirmationEmail(email);
        // console.log("result:", result);
      } catch (error) {
        throw error;
      }

      // returning subscriber
      return {
        message: `You're subscribed! Thanks for subscribing to ${process.env.BRAND_NAME}.`,
      };
    },
    //updating subscriber
    updateSubscriberData: async (
      _parent,
      { subscriberEmail, reasonForUnsubscribing },
      { req },
      _info
    ) => {
      // Checking if subscriber email is preset
      try {
        let subscriber = await Subscriber.findOne({ email: subscriberEmail });
        // Checking if the user is the owner of this alpha Resource
        if (!subscriber) {
          return {
            message: `You have not subscribed to ${process.env.BRAND_NAME}!`,
          };
        } else {
          // User Unsubscribing
          subscriber.userUnsubscribed = true;
          subscriber.reasonForUnsubscribing = reasonForUnsubscribing;
          await subscriber.save();
          // checking if user exists and is already subscribed
          const user = await User.findOne({ email: subscriberEmail });
          if (user) {
            user.subscription.subscribed = false;
            user.subscription.userUnsubscribed = true;
            await user.save();
          }
          return {
            message: "You have been unsubscribed",
          };
        }
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = {
  subscriberResolver,
  sendSubscriptionConfirmationEmail,
  createSubscriberFromChat,
};
