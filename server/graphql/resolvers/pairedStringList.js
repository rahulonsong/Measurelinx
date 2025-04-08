const { PairedStringList } = require("../../models/pairedStringList");

const { User } = require("../../models/user");

// const { transformAlphaResource } = require("./merge");

// const mongoose = require("mongoose");

const { getUserId } = require("../../utils/getUserId");

const pairedStringListResolver = {
  Query: {
    pairedStringLists: async (_parent, _args, { req }, _info) => {
      const userId = getUserId(req);

      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      if (userId) {
        const user = await User.findById(userId);
        if (!user.masterAdmin && !user.admin) {
          throw new Error("Forbidden!");
        }
      }

      try {
        const pairedStringLists = await PairedStringList.find();
        return pairedStringLists.map((list) => list._doc);
      } catch (error) {
        throw error;
      }
    },
    singlePairedStringList: async (
      _parent,
      { pairedStringListName },
      { req },
      _info
    ) => {
      // const userId = getUserId(req);

      // // console.log("userId:", userId);
      // if (!userId) {
      //   throw new Error("Unauthenticated!");
      // }

      try {
        const pairedStringList = await PairedStringList.findOne({
          pairedStringListName: pairedStringListName,
        });

        if (!pairedStringList) {
          throw new Error(
            "Something went wrong while finding the list. We are working on it to fix this"
          );
        }

        return pairedStringList._doc;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    // Adding Tag List
    addPairedStringList: async (
      _parent,
      { pairedStringListInput },
      { req },
      _info
    ) => {
      const userId = getUserId(req);

      // console.log("userId:", userId);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      // Getting user
      const user = await User.findById(userId);
      // Checkjing if user has rights to manage resource
      if (!user.resourceCreator) {
        throw new Error("Access Forbidden!");
      }
      // Trimming PairedStrings to remove white spaces
      let refinedPairedStringList = [];
      pairedStringListInput.pairedStringList.forEach((el) => {
        refinedPairedStringList.push({
          key: el.key.trim(),
          stringValue: el.stringValue.trim(),
        });
      });
      const pairedStringList = new PairedStringList({
        pairedStringListName: pairedStringListInput.pairedStringListName,
        pairedStringList: refinedPairedStringList,
      });

      try {
        const result = await pairedStringList.save();
        // console.log("result:", result);
        return result._doc;
      } catch (error) {
        throw error;
      }
    },
    //updating PairedStringList
    updatePairedStringList: async (
      _parent,
      { pairedStringListId, pairedStringListInput },
      { req },
      _info
    ) => {
      // Retrieve the user ID from the request
      const userId = getUserId(req);

      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      // Get the user
      const user = await User.findById(userId);

      // Check if the user has rights to manage the resource
      if (!user.resourceCreator) {
        throw new Error("Access Forbidden!");
      }

      // Get the current PairedStringList
      let currentPairedStringList = await PairedStringList.findById(
        pairedStringListId
      );

      if (!currentPairedStringList) {
        throw new Error("Unknown List!");
      }

      // Refine the PairedStringList input
      let refinedPairedStringList = pairedStringListInput.pairedStringList.map(
        (el) => ({
          key: el.key.trim(),
          stringValue: el.stringValue.trim(),
        })
      );

      const updates = {
        pairedStringList: refinedPairedStringList,
        pairedStringListName: currentPairedStringList.pairedStringListName,
      };

      try {
        const updatedPairedStringList =
          await PairedStringList.findByIdAndUpdate(
            pairedStringListId,
            { $set: updates },
            { new: true }
          );

        return updatedPairedStringList;
      } catch (error) {
        throw new Error(`Error updating PairedStringList: ${error.message}`);
      }
    },
    // Adding pairedStrings
    addPairedStrings: async (
      _parent,
      { pairedStringListId, pairedStringsInput },
      { req },
      _info
    ) => {
      const userId = getUserId(req);
      // console.log("userId:", userId);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      // Getting user
      const user = await User.findById(userId);
      // Checkjing if user has rights to manage resource
      if (!user.resourceCreator) {
        throw new Error("Access Forbidden!");
      }

      const existingPairedStringList = await PairedStringList.findById(
        pairedStringListId
      );
      const listOfPairedStrings = existingPairedStringList.pairedStringList;
      // Trimming PairedStrings to remove white spaces
      let refinedPairedStringList = [
        ...existingPairedStringList.pairedStringList,
      ];
      pairedStringsInput.pairedStrings.forEach((el) => {
        refinedPairedStringList.push({
          key: el.key.trim(),
          stringValue: el.stringValue.trim(),
        });
      });
      let newListOfPairedStrings = [
        ...new Set([...listOfPairedStrings, ...refinedPairedStringList]),
      ];

      let updates = {};
      updates.pairedStringList = [...newListOfPairedStrings];
      updates.pairedStringListName =
        existingPairedStringList.pairedStringListName;

      try {
        const pairedStringList = await PairedStringList.findByIdAndUpdate(
          pairedStringListId,
          {
            $set: updates,
          },
          { new: true }
        );

        return pairedStringList._doc;
      } catch (error) {
        throw error;
      }
    },
    // deleting a PairedStringList
    deletePairedStringList: async (
      _parent,
      { pairedStringListId },
      { req },
      _info
    ) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      // Getting user
      const user = await User.findById(userId);
      // Checkjing if user has rights to manage resource
      if (!user.resourceCreator) {
        throw new Error("Access Forbidden!");
      }
      try {
        let pairedStringList = await PairedStringList.findById(
          pairedStringListId
        );
        // Checking if the user is the owner of this alpha Resource
        // if (alphaResource.user._id.valueOf() !== userId) {
        //   throw new Error("Unauthorized!");
        // }
        await PairedStringList.deleteOne({ _id: pairedStringListId });

        return {
          message: `Tag List with ID ${pairedStringListId} was deleted successfully`,
        };
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { pairedStringListResolver };
