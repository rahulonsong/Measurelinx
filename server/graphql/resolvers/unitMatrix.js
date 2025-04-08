const { UnitMatrix } = require("../../models/unitMatrix.js");

const { User } = require("../../models/user");

// const mongoose = require("mongoose");

const { getUserId } = require("../../utils/getUserId");

const unitMatrixResolver = {
  Query: {
    unitMatrices: async (_parent, {}, { req }, _info) => {
      // Authenticating
      // const userId = getUserId(req);
      // if (!userId) {
      //   throw new Error("Unauthenticated!");
      // }
      try {
        const unitMatrices = await UnitMatrix.find();
        return unitMatrices.map((matrix) => matrix._doc);
      } catch (error) {
        throw error;
      }
    },
    singleUnitMatrix: async (_parent, { unitMatrixId }, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      try {
        const unitMatrix = await UnitMatrix.findById(unitMatrixId);
        if (!unitMatrix) {
          throw new Error("Invalid Unit set!");
        }
        return unitMatrix._doc;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    // Adding unit set
    addUnitMatrixData: async (_parent, { unitMatrixInput }, { req }, _info) => {
      const userId = getUserId(req);
      // console.log("userId:", userId);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      // console.log("Unit Matrix input:", unitMatrixInput);
      const unitMatrix = new UnitMatrix({
        propertyName: unitMatrixInput.propertyName,
        type: unitMatrixInput.type,
        defaultUnit: unitMatrixInput.defaultUnit,
        conversionMatrix: unitMatrixInput.conversionMatrix,
      });

      try {
        const result = await unitMatrix.save();
        // console.log("reuslt:", result);
        return result._doc;
      } catch (error) {
        throw error;
      }
    },
    //updating unitMatrix
    updateUnitMatrixData: async (
      _parent,
      { unitMatrixId, unitMatrixInput },
      { req },
      _info
    ) => {
      const userId = getUserId(req);
      // console.log("userId:", userId);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      const updates = {};
      if (unitMatrixInput !== undefined) {
        updates.propertyName = unitMatrixInput.propertyName;
        updates.type = unitMatrixInput.type;
        updates.defaultUnit = unitMatrixInput.defaultUnit;
        updates.conversionMatrix = unitMatrixInput.conversionMatrix;
      }

      try {
        const unitMatrix = await UnitMatrix.findByIdAndUpdate(
          unitMatrixId,
          {
            $set: updates,
          },
          { new: true }
        );

        return unitMatrix._doc;
      } catch (error) {
        throw error;
      }
    },
    // deleting a unitMatrix
    deleteUnitMatrixData: async (_parent, { unitMatrixId }, { req }, _info) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      try {
        const user = await User.find(userId);
        // Checking if master Admin
        if (!user.masterAdmin) {
          throw new Error("Unauthorized!");
        }
        // Proceeding to delete
        await UnitMatrix.deleteOne({ _id: unitMatrixId });

        return {
          message: `UnitMatrix with ID ${unitMatrixId} was deleted successfully`,
        };
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { unitMatrixResolver };
