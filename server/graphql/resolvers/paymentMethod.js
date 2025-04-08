const { PaymentMethod } = require("../../models/paymentMethod.js");
const { transformPaymentMethod } = require("../resolvers/merge");
// const { TagList } = require("../../models/tagList");

const { User } = require("../../models/user");

// const shortid = require("shortid");

const mongoose = require("mongoose");

const { getUserId } = require("../../utils/getUserId");

const {
  createCustomer,
  searchCustomerByEmail,
  createSourceAndAttachToCustomer,
  createStripeToken,
  findCard,
  deleteCard,
  updateSource,
} = require("../../utils/stripe");

const paymentMethodResolver = {
  Query: {
    paymentMethodsByUser: async (_parent, {}, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      try {
        // Filtering out user specific paymentMethods
        const paymentMethods = await PaymentMethod.find({
          user: userId,
        });
        return paymentMethods.map((method) => method._doc);
      } catch (error) {
        throw error;
      }
    },
    singlePaymentMethod: async (
      _parent,
      { paymentMethodId },
      { req },
      _info
    ) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      try {
        const paymentMethod = await PaymentMethod.find({
          _id: paymentMethodId,
          user: userId,
        })[0];
        if (!paymentMethod) {
          throw new Error("Invalid payment Method!");
        }
        return paymentMethod._doc;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    // Adding <paymentMethod></paymentMethod>
    addPaymentMethodData: async (
      _parent,
      { paymentMethodInput },
      { req },
      _info
    ) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      let user = await User.findById(userId);
      // Check for duplicate records
      let existingPaymentmethods = await PaymentMethod.find({
        cardNumber: paymentMethodInput.cardNumber,
      });
      // console.log("existingResources:", existingResources);
      if (existingPaymentmethods.length) {
        throw new Error(
          "This card has already been added under your payment methods! If you woulud like to update expiry details, please choose update payment method option"
        );
      }

      // Creating Stripe source and custienr (if not already present)
      // CHeck if there is a stripe customer
      // Get customer with mathcing email
      let customer = await searchCustomerByEmail(user.email);
      let source;
      let token;
      let cardDetails = {
        name: paymentMethodInput.name,
        number: paymentMethodInput.cardNumber,
        exp_month: parseInt(paymentMethodInput.expirationMonth),
        exp_year: parseInt(paymentMethodInput.expirationYear),
        cvc: parseInt(paymentMethodInput.cvv),
      };
      // If existing stripe customer, create a source and attach it to the customer
      if (customer && customer.id) {
        token = await createStripeToken(cardDetails);
        source = await createSourceAndAttachToCustomer(customer.id, token.id);
      }
      // If customer is not existing, cerate a source, create a stripe customer basedon source and add source to the customer
      else {
        const newCustomer = await createCustomer(user.email);
        token = await createStripeToken(cardDetails);
        source = await createSourceAndAttachToCustomer(
          newCustomer.id,
          token.id
        );
      }
      // Creating paymentMethod Model in database
      const paymentMethod = new PaymentMethod({
        name: paymentMethodInput.name,
        cardNumber: paymentMethodInput.cardNumber,
        expirationMonth: paymentMethodInput.expirationMonth,
        expirationYear: paymentMethodInput.expirationYear,
        defaultCard: paymentMethodInput.defaultCard,
        sourceId: source.id,
        // cvv: paymentMethodInput.cvv,
        user: paymentMethodInput.user,
      });

      try {
        const result = await paymentMethod.save();
        const createdPaymentMethod = transformPaymentMethod(result);
        let user = await User.findById(userId);
        if (!user) {
          throw new Error("User not found!");
        }
        user.paymentMethods.push(createdPaymentMethod);
        await user.save();
        // console.log("result:", result);
        return createdPaymentMethod._doc;
      } catch (error) {
        throw error;
      }
    },
    // updating an paymentMethod
    updatePaymentMethodData: async (
      _parent,
      { paymentMethodId, paymentMethodInput },
      { req },
      _info
    ) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      const user = await User.findById(userId);
      try {
        let paymentMethod = await PaymentMethod.findById(paymentMethodId)
          .populate({
            path: "user",
          })
          .exec();
        // Checking if the user is the owner of this alpha Resource
        if (paymentMethod.user._id.valueOf() !== userId) {
          throw new Error("Unauthorized!");
        }
        let cardDetails = {
          name: paymentMethodInput.name,
          exp_month: paymentMethodInput.expirationMonth,
          exp_year: paymentMethodInput.expirationYear,
        };
        // Getting Customer
        let customer = await searchCustomerByEmail(user.email);
        let customerId = customer.id;
        if (customer) {
          // Updating Stripe Source with exp_year, name and exp_month
          let source = await findCard(
            customer.id,
            paymentMethodInput.cardNumber
          );
          // Updating source
          await updateSource(customerId, source.id, cardDetails);
        } else {
          throw new Error(
            "Something is not right. Unable to update the payment method"
          );
        }
        let updates = {};
        // updating the paymentMethod
        if (paymentMethodInput !== undefined) {
          updates.name = paymentMethodInput.name;
          updates.cardNumber = paymentMethodInput.cardNumber;
          updates.expirationMonth = paymentMethodInput.expirationMonth;
          updates.expirationYear = paymentMethodInput.expirationYear;
          updates.defaultCard = paymentMethodInput.defaultCard;
          // updates.cvv = paymentMethodInput.cvv;
        }
        let revisedPaymentMethod = await PaymentMethod.findByIdAndUpdate(
          paymentMethodId,
          {
            $set: updates,
          },
          { new: true }
        );
        return revisedPaymentMethod._doc;
      } catch (error) {
        throw error;
      }
    },
    // deleting a payment method
    deletePaymentMethodData: async (
      _parent,
      { paymentMethodId },
      { req },
      _info
    ) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      // Get user
      let user = await User.findById(userId);

      try {
        let paymentMethod = await PaymentMethod.findById(
          paymentMethodId
        ).exec();
        // console.log("paymentMethod:", paymentMethod);
        // Checking if the user is the owner of this payment method
        if (paymentMethod.user._id.valueOf() !== userId) {
          throw new Error("Unauthorized!");
        }
        // Get Stripe Customer
        let customer = await searchCustomerByEmail(user.email);
        // Get card Id
        let card = await findCard(customer.id, paymentMethod.cardNumber);
        // Delete card from Stripe
        await deleteCard(customer.id, card.id);
        // Deleting card from database;
        await PaymentMethod.deleteOne({ _id: paymentMethodId });

        await User.updateOne(
          { _id: userId },
          {
            $pull: {
              paymentMethods: mongoose.Types.ObjectId(paymentMethodId),
            },
          },
          { multi: true }
        );
        return {
          message: `Payment Method with ID ${paymentMethodId} was deleted successfully`,
        };
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { paymentMethodResolver };
