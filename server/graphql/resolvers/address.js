const { Address } = require("../../models/address.js");

// const { TagList } = require("../../models/tagList");

const { User } = require("../../models/user");

const { Cart } = require("../../models/cart");

// const shortid = require("shortid");

const mongoose = require("mongoose");

const { getUserId } = require("../../utils/getUserId");

const addressResolver = {
  Query: {
    addressesByUser: async (_parent, {}, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      try {
        // Filtering out disabled addresss
        const addresses = await Address.find({
          user: userId,
        });
        return addresses.map((address) => address._doc);
      } catch (error) {
        throw error;
      }
    },
    singleAddress: async (_parent, { addressId }, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      try {
        const address = await Address.find({
          _id: addressId,
          user: userId,
        })[0];
        if (!address) {
          throw new Error("Invalid address!");
        }
        return address._doc;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    // Adding Address
    addAddressData: async (_parent, { addressInput }, { req }, _info) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      if (
        (addressInput.phoneNumber.category === "Mobile" &&
          !addressInput.phoneNumber.mobileNumber) ||
        (addressInput.phoneNumber.category === "Landline" &&
          (!addressInput.phoneNumber.areaCode ||
            !addressInput.phoneNumber.localNumber))
      ) {
        throw new Error("Invalid Phone Number format!");
      }
      // Creating address Model in database
      const address = new Address({
        category: addressInput.category,
        addresseeFirst: addressInput.addresseeFirst,
        addresseeLast: addressInput.addresseeLast,
        line1: addressInput.line1,
        line2: addressInput.line2,
        landmark: addressInput.landmark,
        stateProvince: addressInput.stateProvince,
        cityTown: addressInput.cityTown,
        country: addressInput.country,
        postalCode: addressInput.postalCode,
        phoneNumber: addressInput.phoneNumber,
        user: userId,
      });
      try {
        const result = await address.save();

        // Saving address to user addresses
        let user = await User.findById(userId);
        user.addresses.push(result._id);
        if (!user.defaultAddress) user.defaultAddress = result._id;
        await user.save();
        // console.log("result:", result);
        // returning address data
        return result._doc;
      } catch (error) {
        throw error;
      }
    },
    //updating address
    updateAddressData: async (
      _parent,
      { addressId, addressInput },
      { req },
      _info
    ) => {
      const userId = getUserId(req);
      // console.log("userId:", userId);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      // Checking permissions
      let existingItem;
      try {
        existingItem = await Address.findById(addressId)
          .populate({
            path: "user",
          })
          .exec();
        if (existingItem.user._id.valueOf() !== userId) {
          throw new Error("Unauthorized!");
        }
      } catch (error) {
        throw error;
      }

      // Setting updates
      updates = {};
      if (addressInput !== undefined) {
        updates.category = addressInput.category;
        updates.addresseeFirst = addressInput.addresseeFirst;
        updates.addresseeLast = addressInput.addresseeLast;
        updates.line1 = addressInput.line1;
        updates.line2 = addressInput.line2;
        updates.landmark = addressInput.landmark;
        updates.stateProvince = addressInput.stateProvince;
        updates.cityTown = addressInput.cityTown;
        updates.country = addressInput.country;
        updates.postalCode = addressInput.postalCode;
        updates.phoneNumber = addressInput.phoneNumber;
      }

      // Updating database
      try {
        const address = await Address.findByIdAndUpdate(
          addressId,
          {
            $set: updates,
          },
          { new: true }
        );

        return address._doc;
      } catch (error) {
        throw error;
      }
    },
    // deleting a address
    deleteAddressData: async (_parent, { addressId }, { req }, _info) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      try {
        let address = await Address.findById(addressId)
          .populate({
            path: "user",
          })
          .exec();
        // Checking if the user is the owner of this address Model
        if (address.user._id.valueOf() !== userId) {
          throw new Error("Unauthorized!");
        }
        // Deleting shipping and billing addresses from the cart if matching
        const userCarts = await Cart.find({
          $or: [{ shippingAddress: addressId }, { billingAddress: addressId }],
        });

        // Iterating over each cart to check and update the addresses
        for (const cart of userCarts) {
          let isUpdated = false; // Flag to track if the cart needs to be saved

          if (cart.shippingAddress == addressId) {
            cart.shippingAddress = null;
            isUpdated = true; // Marking cart as updated
          }

          if (cart.billingAddress == addressId) {
            cart.billingAddress = null;
            isUpdated = true; // Marking cart as updated
          }

          // Save the cart if it was updated
          if (isUpdated) {
            await cart.save();
          }
        }
        await Address.deleteOne({ _id: addressId });

        // Deleting address from user addresses
        await User.updateOne(
          { _id: userId },
          {
            $pull: {
              addresses: mongoose.Types.ObjectId(addressId),
            },
          },
          { multi: true }
        );
        return {
          message: `Address was deleted successfully`,
        };
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { addressResolver };
