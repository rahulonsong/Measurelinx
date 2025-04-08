const { PairedNumberList } = require("../../models/pairedNumberList");

const { User } = require("../../models/user");

// const { transformAlphaResource } = require("./merge");

// const mongoose = require("mongoose");

const { getUserId } = require("../../utils/getUserId");

const pairedNumberListResolver = {
  Query: {
    pairedNumberLists: async (_parent, {}, { req }, _info) => {
      const userId = getUserId(req);

      // console.log("userId:", userId);
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
        const lists = await PairedNumberList.find();
        if (!lists.length) {
          throw new Error("No lists found!");
        }
        return lists.map((list) => list._doc);
      } catch (error) {
        throw error;
      }
    },
    singlePairedNumberList: async (
      _parent,
      { pairedNumberListName },
      { req },
      _info
    ) => {
      // const userId = getUserId(req);

      // console.log("userId:", userId);
      // if (!userId) {
      //   throw new Error("Unauthenticated!");
      // }

      try {
        const pairedNumberList = await PairedNumberList.findOne({
          pairedNumberListName: pairedNumberListName,
        });
        if (!pairedNumberList) {
          throw new Error(
            "Something went wrong while finding the list. We are working on it to fix this"
          );
        }
        return pairedNumberList._doc;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    // Adding Tag List
    addPairedNumberList: async (
      _parent,
      { pairedNumberListInput },
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
      if (!user.admin && !user.masterAdmin) {
        throw new Error("Access Forbidden!");
      }
      // Trimming PairedNumbers to remove white spaces
      let refinedPairedNumberList = [];
      pairedNumberListInput.pairedNumberList.forEach((el) => {
        refineNumberList.push({
          key: el.key.trim(),
          numberValue: el.numberValue.trim(),
        });
      });
      const pairedNumberList = new PairedNumberList({
        pairedNumberListName: pairedNumberListInput.pairedNumberListName,
        pairedNumberList: refinedPairedNumberList,
      });

      try {
        const result = await pairedNumberList.save();
        // console.log("result:", result);
        return result._doc;
      } catch (error) {
        throw error;
      }
    },
    //updating PairedNumberList
    updatePairedNumberList: async (
      _parent,
      { pairedNumberListId, pairedNumberListInput },
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

      let currentPairedNumberList = await PairedNumberList.findById(
        pairedNumberListId
      );
      if (!currentPairedNumberList) {
        throw new Error("Unknon List!");
      }
      let refinedPairedNumberList = [];
      pairedNumberListInput.pairedNumberList.forEach((el) => {
        refinedPairedNumberList.push({
          key: el.key.trim(),
          numberValue: el.numberValue.trim(),
        });
      });

      const updates = {};
      if (pairedNumbersInput !== undefined) {
        updates.pairedNumberList = [...refinedPairedNumberList];
        updates.pairedNumberListName =
          currentPairedNumberList.pairedNumberListName;
      }

      try {
        const pairedNumberList = await PairedNumberList.findByIdAndUpdate(
          pairedNumberListId,
          {
            $set: updates,
          },
          { new: true }
        );

        return pairedNumberList._doc;
      } catch (error) {
        throw error;
      }
    },
    // Adding pairedNumbers
    addPairedNumbers: async (
      _parent,
      { pairedNumberListId, pairedNumbersInput },
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

      const existingPairedNumberList = await PairedNumberList.findById(
        pairedNumberListId
      );
      const listOfPairedNumbers = existingPairedNumberList.pairedNumberList;
      // Trimming PairedNumbers to remove white spaces
      let refinedPairedNumberList = [
        ...existingPairedNumberList.pairedNumberList,
      ];
      pairedNumbersInput.pairedNumbers.forEach((el) => {
        refinedPairedNumberList.push({
          key: el.key.trim(),
          numberValue: el.numberValue.trim(),
        });
      });
      let newListOfPairedNumbers = [
        ...new Set([...listOfPairedNumbers, ...refinedPairedNumberList]),
      ];

      let updates = {};
      updates.pairedNumberList = [...newListOfPairedNumbers];
      updates.pairedNumberListName =
        existingPairedNumberList.pairedNumberListName;

      try {
        const pairedNumberList = await PairedNumberList.findByIdAndUpdate(
          pairedNumberListId,
          {
            $set: updates,
          },
          { new: true }
        );

        return pairedNumberList._doc;
      } catch (error) {
        throw error;
      }
    },
    // deleting a PairedNumberList
    deletePairedNumberList: async (
      _parent,
      { pairedNumberListId },
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
        let pairedNumberList = await PairedNumberList.findById(
          pairedNumberListId
        );
        // Checking if the user is the owner of this alpha Resource
        // if (alphaResource.user._id.valueOf() !== userId) {
        //   throw new Error("Unauthorized!");
        // }
        await PairedNumberList.deleteOne({ _id: pairedNumberListId });

        return {
          message: `Tag List with ID ${pairedNumberListId} was deleted successfully`,
        };
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { pairedNumberListResolver };
