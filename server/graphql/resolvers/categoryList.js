const { CategoryList } = require("../../models/categoryList");

const { User } = require("../../models/user");

// const { transformAlphaResource } = require("./merge");

// const mongoose = require("mongoose");

const { getUserId } = require("../../utils/getUserId");

const categoryListResolver = {
  Query: {
    categoryLists: async (_parent, {}, { req }, _info) => {
      const userId = getUserId(req);

      // console.log("userId:", userId);
      // if (!userId) {
      //   throw new Error("Unauthenticated!");
      // }

      try {
        const categoryLists = await CategoryList.find();
        if (!categoryLists.length) {
          throw new Error("No lists found!");
        }
        return categoryLists.map((list) => list._doc);
      } catch (error) {
        throw error;
      }
    },
    singleCategoryList: async (_parent, { categoryName }, { req }, _info) => {
      // if (categoryName !== "Item Categories") {
      //   // const userId = getUserId(req);
      //   // console.log("userId:", userId);
      //   // if (!userId) {
      //   //   throw new Error("Unauthenticated!");
      //   // }
      // }

      try {
        const categoryLists = await CategoryList.find({
          categoryName: categoryName,
        });
        if (!categoryLists.length) {
          throw new Error(
            "Something went wrong while finding the category list. We are working on it to fix this"
          );
        }
        return categoryLists[0]._doc;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    // Adding Tag List
    addCategoryList: async (_parent, { categoryListInput }, { req }, _info) => {
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
      // Trimming Categories to remove white spaces
      let refinedCategoryList = [];
      categoryListInput.categoryList.forEach((tag) => {
        refinedCategoryList.push(tag.trim());
      });
      const categoryList = new CategoryList({
        categoryName: categoryListInput.categoryName,
        categoryList: refinedCategoryList,
      });

      try {
        const result = await categoryList.save();
        // console.log("result:", result);
        return result._doc;
      } catch (error) {
        throw error;
      }
    },
    //updating CategoryList
    updateCategoryList: async (
      _parent,
      { categoryListId, categoryListInput },
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
      let refinedCategoryList = [];
      categoryListInput.categoryList.forEach((tag) => {
        refinedCategoryList.push(tag.trim());
      });

      const updates = {};
      if (categoryListInput !== undefined) {
        updates.categoryList = refinedCategoryList;
        updates.categoryName = categoryListInput.categoryName;
      }

      try {
        const categoryList = await CategoryList.findByIdAndUpdate(
          categoryListId,
          {
            $set: updates,
          },
          { new: true }
        );

        return categoryList._doc;
      } catch (error) {
        throw error;
      }
    },
    // Adding categories
    addCategories: async (
      _parent,
      { categoryListId, categoriesInput },
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

      const existingCategoryList = await CategoryList.findById(categoryListId);
      const listOfCategories = existingCategoryList.categoryList;
      // Trimming Categories to remove white spaces
      let refinedCategoryList = [];
      categoriesInput.categories.forEach((tag) => {
        refinedCategoryList.push(tag.trim());
      });
      let newListOfCategories = [
        ...new Set([...listOfCategories, ...refinedCategoryList]),
      ];

      let updates = {};
      updates.categoryList = newListOfCategories;
      updates.categoryName = existingCategoryList.categoryName;

      try {
        const categoryList = await CategoryList.findByIdAndUpdate(
          categoryListId,
          {
            $set: updates,
          },
          { new: true }
        );

        return categoryList._doc;
      } catch (error) {
        throw error;
      }
    },
    // deleting a CategoryList
    deleteCategoryList: async (_parent, { categoryListId }, { req }, _info) => {
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
        let categoryList = await CategoryList.findById(categoryListId);
        // Checking if the user is the owner of this alpha Resource
        // if (alphaResource.user._id.valueOf() !== userId) {
        //   throw new Error("Unauthorized!");
        // }
        await CategoryList.deleteOne({ _id: categoryListId });

        return {
          message: `Tag List with ID ${categoryListId} was deleted successfully`,
        };
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { categoryListResolver };
