const { Item } = require("../../models/item.js");
const { Supplier } = require("../../models/supplier.js");

// const { TagList } = require("../../models/tagList");

const { User } = require("../../models/user");

// const mongoose = require("mongoose");

const { getUserId } = require("../../utils/getUserId");

const supplierResolver = {
  Query: {
    suppliers: async (_parent, {}, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      try {
        const user = await User.findById(userId);
        if (!user.admin) {
          throw new Error("Unauthorized!");
        }
        const supplier = await Supplier.find();
        return supplier._doc;
      } catch (error) {
        throw error;
      }
    },
    singleSupplier: async (_parent, { supplierId }, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      try {
        const supplier = await Supplier.findById(supplierId)
          .populate({
            path: "items",
          })
          .populate({
            path: "orders",
          })
          .exec();
        if (!supplier) {
          throw new Error("Invalid Supplier!");
        }
        return supplier._doc;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    // Adding Supplier
    addSupplierData: async (_parent, { supplierInput }, { req }, _info) => {
      const userId = getUserId(req);

      // console.log("userId:", userId);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      // creating supplier in database
      const supplier = new Supplier({
        name: supplierInput.name,
        address: supplierInput.address,
        items: [],
        orders: [],
        user: userId,
      });
      let result;
      try {
        result = await supplier.save();
        // console.log("result:", result);
      } catch (error) {
        throw error;
      }
      return result._doc;
    },
    //updating supplier
    updateSupplierData: async (
      _parent,
      { supplierId, supplierInput },
      { req },
      _info
    ) => {
      const userId = getUserId(req);
      // console.log("userId:", userId);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      // Checking if user is authorized
      try {
        let supplier = await Supplier.findById(supplierId)
          .populate({
            path: "user",
          })
          .exec();
        // Checking if the user is the owner of this alpha Resource
        if (supplier.user._id.valueOf() !== userId) {
          throw new Error("Unauthorized!");
        }
      } catch (error) {
        throw error;
      }
      // Updating supplier
      updates = {};
      if (supplierInput !== undefined) {
        updates.name = supplierInput.name;
        updates.address = supplierInput.address;
      }

      try {
        const supplier = await Supplier.findByIdAndUpdate(
          supplierId,
          {
            $set: updates,
          },
          { new: true }
        );
        return supplier._doc;
      } catch (error) {
        throw error;
      }
    },
    addNewFieldsSupplier: async (_parent, {}, { req }, _info) => {
      // Checking if Authenticated
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      try {
        const user = await User.findById(userId);
        if (!user.admin) {
          throw new Error("Unauthorized!");
        }
        // Adding new fields to User model
        await User.updateMany(
          {},
          {
            $set: {
              // isPrimeMember: false,
              // isOnTrial: false,
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

module.exports = { supplierResolver };
