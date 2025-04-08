const { BulkEmail } = require("../../models/bulkEmail");
const { User } = require("../../models/user");
const { Subscriber } = require("../../models/subscriber");
const { getUserId } = require("../../utils/getUserId");
const { sendMailBeta } = require("./sendMail");

const bulkEmailResolver = {
  Query: {
    bulkEmails: async (_parent, _args, { req }, _info) => {
      try {
        // Authorization logic if needed
        const userId = getUserId(req);
        if (!userId) {
          throw new Error("Unauthenticated!");
        }

        const user = await User.findById(userId);
        if (!(user.masterAdmin || user.admin)) {
          throw new Error(
            "Forbidden: You do not have permission to perform this action."
          );
        }

        // Fetch bulk emails from the database
        const bulkEmails = await BulkEmail.find();
        return bulkEmails.map((email) => ({
          ...email._doc,
          _id: email.id,
        }));
      } catch (error) {
        throw error;
      }
    },
    singleBulkEmail: async (_parent, { id }, { req }, _info) => {
      try {
        const userId = getUserId(req);
        if (!userId) {
          throw new Error("Unauthenticated!");
        }

        const user = await User.findById(userId);
        if (!(user.masterAdmin || user.admin)) {
          throw new Error(
            "Forbidden: You do not have permission to perform this action."
          );
        }

        const bulkEmail = await BulkEmail.findById(id);
        if (!bulkEmail) {
          throw new Error("Bulk email not found");
        }
        return bulkEmail;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    sendEmail: async (_parent, { bulkEmailInput }, { req }, _info) => {
      const { sender, pageId, htmlContent, emailGroup } = bulkEmailInput;

      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      const user = await User.findById(userId);
      if (!(user.masterAdmin || user.admin)) {
        throw new Error(
          "Forbidden: You do not have permission to perform this action."
        );
      }

      try {
        // Save email event in database
        const bulkEmail = new BulkEmail({
          sender,
          pageId,
          htmlContent,
          emailGroup,
        });
        await bulkEmail.save();

        // Fetch subscribers and filter out unsubscribed ones
        const subscribers = await Subscriber.find({
          userUnsubscribed: { $ne: true },
        });

        // Send email to each subscriber
        // for (const subscriber of subscribers) {
        const response = await sendMailBeta({
          email: "rahul.kanakath@gmail.com",
          subject: `Page HTML Export by ${sender}`,
          html: htmlContent,
          context: "bulkEmail",
        });

        if (response instanceof Error) {
          console.error(
            `Failed to send email to "rahul.kanakath@gmail.com"`,
            response.message
          );
        } else {
          console.log(`Email sent successfully to "rahul.kanakath@gmail.com"`);
        }
        // }

        return {
          success: true,
          message: "Emails sent successfully",
        };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          message: "Failed to send emails",
        };
      }
    },
  },
};

module.exports = { bulkEmailResolver };
