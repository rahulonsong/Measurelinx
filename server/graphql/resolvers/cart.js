const { Cart } = require("../../models/cart");

// const { TagList } = require("../../models/tagList");

// const { User } = require("../../models/user");

// const shortid = require("shortid");

// const mongoose = require("mongoose");

const { transformCart } = require("../resolvers/merge");

const { getUserId } = require("../../utils/getUserId");

const cartResolver = {
  Query: {
    userCart: async (_parent, {}, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      try {
        const cart = await Cart.find({
          user: userId,
        })[0];
        if (!cart) {
          throw new Error("Invalid request!");
        }
        return cart._doc;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    // Adding Cart
    addUpdateCartData: async (
      _parent,
      { cartInput, context },
      { req },
      _info
    ) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      let cart;
      let result;
      // console.log("cart Input:", cartInput);
      switch (context) {
        case "create":
          // Creating cart Model in database
          cart = new Cart({
            items: cartInput.items,
            subTotal: cartInput.subTotal,
            promotion: cartInput.promotion,
            promoCode: cartInput.promoCode,
            billingAddress: cartInput.billingAddress,
            shippingAddress: cartInput.shippingAddress,
            tax: cartInput.tax,
            total: cartInput.total,
            currency: cartInput.currency,
            user: cartInput.user,
          });

          try {
            result = await cart.save();
            // console.log("result:", result);
          } catch (error) {
            throw error;
          }
          break;
        case "update":
          updates = {};
          if (cartInput !== undefined) {
            updates.items = cartInput.items;
            updates.subTotal = cartInput.subTotal;
            updates.promotion = cartInput.promotion;
            updates.promoCode = cartInput.promoCode;
            updates.billingAddress = cartInput.billingAddress;
            updates.shippingAddress = cartInput.shippingAddress;
            updates.paymentMethod = cartInput.paymentMethod;
            updates.tax = cartInput.tax;
            updates.total = cartInput.total;
            updates.currency = cartInput.currency;
            updates.user = cartInput.user;
          }
          try {
            result = await Cart.findByIdAndUpdate(
              cartInput.cartId,
              {
                $set: updates,
              },
              { new: true }
            )
              .populate({
                path: "items.item",
              })
              .exec();
          } catch (error) {
            throw error;
          }
          break;
        default:
          break;
      }
      // console.log("result:", result._doc);
      const modifiedCart = await transformCart(result._doc);
      return modifiedCart;
      // return result;
    },
    // canceling an cart
    clearCartData: async (_parent, { cartId }, { req }, _info) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      try {
        const cart = await Cart.find({
          user: userId,
        })[0];
        if (!cart) {
          throw new Error("Invalid Request!");
        }
        let updates = {};
        // clearing the cart
        updates.items = [];
        updates.promotion = null;
        updates.promoCode = "";
        updates.billingAddress = null;
        updates.shippingAddress = null;
        updates.paymentMethod = null;
        updates.subTotal = null;
        updates.tax = null;
        updates.total = null;
        await Cart.findByIdAndUpdate(
          cartId,
          {
            $set: updates,
          },
          { new: true }
        );
        return {
          message: `Cart was cleared successfully`,
        };
      } catch (error) {
        throw error;
      }
    },
    // addd newe fields
    addNewFieldsCart: async (_parent, {}, { req }, _info) => {
      // Checking if Authenticated
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      try {
        // await AlphaResource.updateMany(
        //   {},
        //   {
        //     $set: {
        //       // viewsCount: 0,
        //       // historicalOrderCount: 0,
        //       // maximumOrderQuantity: 5,
        //       isPageConstructor: false,
        //     },
        //   },
        //   { upsert: false, multi: true }
        // );
        // overwrite existing fields
        await Cart.updateMany(
          {},
          {
            $set: {
              promotion: {
                isPercentage: null,
                value: null,
              },
            },
          },
          { upsert: false, multi: true }
        );

        // Returning Success message
        return {
          message: "New fields Added successfully!",
        };
      } catch (err) {
        throw err;
      }
    },
  },
};

module.exports = { cartResolver };
