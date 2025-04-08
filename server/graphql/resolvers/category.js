const { Category } = require("../../models/category");
const { User } = require("../../models/user");
const { getUserId } = require("../../utils/getUserId");
const { Item } = require("../../models/item");
const { ItemModel } = require("../../models/itemModel");
const { transformCategory } = require("./merge");

const categoryResolver = {
  Query: {
    categories: async (_parent, _args, { req }, _info) => {
      let categories;
      try {
        let categoryFilters = {
          disabled: false,
          published: true,
        };
        // For admin, remove the published and disabled iteems
        const userId = getUserId(req);
        if (userId) {
          const user = await User.findById(userId);
          if (user.admin || user.masterAdmin) {
            categoryFilters = { disabled: false };
          }
        }
        categories = await Category.find(categoryFilters);
        const modifiedCategories = [
          ...categories.map((el) => {
            return transformCategory(el._doc);
          }),
        ];
        return modifiedCategories;
      } catch (error) {
        throw error;
      }
    },
    // singleCategoryData: async (_parent, { routeParam }) => {
    //   try {
    //     const category = await Category.findOne({ routeParam });
    //     if (!category) {
    //       throw new Error("Category not found");
    //     }
    //     return category;
    //   } catch (error) {
    //     throw error;
    //   }
    // },
  },
  Mutation: {
    addCategory: async (_parent, { categoryInput }, { req }, _info) => {
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
      const newCategory = new Category({
        ...categoryInput,
        user: user._id,
      });
      try {
        const result = await newCategory.save();
        return result._doc;
      } catch (error) {
        throw error;
      }
    },
    updateCategory: async (_parent, { id, categoryInput }, { req }, _info) => {
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
        // Fetch the original category
        let originalCategory = await Category.findById(id);
        if (!originalCategory) {
          throw new Error("Category not found");
        }

        // Update the category
        let updatedCategory = await Category.findByIdAndUpdate(
          id,
          { $set: { ...categoryInput, user: user._id } },
          { new: true }
        );

        if (!updatedCategory) {
          throw new Error("Failed to update category");
        }
        // Extract _doc data for easier comparison
        originalCategory = { ...originalCategory._doc };
        updatedCategory = { ...updatedCategory._doc };

        // Identify changes
        const categoryChanged = originalCategory.name !== updatedCategory.name;
        const subCategoriesChanged =
          JSON.stringify(originalCategory.subCategories) !==
          JSON.stringify(updatedCategory.subCategories);

        const changedSubCategories = {};
        const changedSubTitles = {};
        // Identify changed subcategories and subtitles
        if (subCategoriesChanged) {
          const originalSubCategories = originalCategory.subCategories || [];
          const updatedSubCategories = updatedCategory.subCategories || [];

          updatedSubCategories.forEach((updatedSubCategory, index) => {
            const originalSubCategory = originalSubCategories[index];
            if (
              !originalSubCategory ||
              originalSubCategory.name !== updatedSubCategory.name
            ) {
              changedSubCategories[originalSubCategory?.name] =
                updatedSubCategory.name;
            }

            updatedSubCategory.subTitles.forEach(
              (updatedSubTitle, subIndex) => {
                const originalSubTitle =
                  originalSubCategory?.subTitles[subIndex];
                if (
                  !originalSubTitle ||
                  originalSubTitle.name !== updatedSubTitle.name
                ) {
                  changedSubTitles[originalSubTitle?.name] =
                    updatedSubTitle.name;
                }
              }
            );
          });
        }

        // Prepare updates for Items and ItemModels
        let itemUpdatePromises = [];
        let itemUpdateFields = {};

        if (categoryChanged) {
          itemUpdateFields.category = updatedCategory.name;
        }

        const items = await Item.find({ catId: id });
        const itemModels = await ItemModel.find({ catId: id });

        items.forEach((item) => {
          const updateFields = { ...itemUpdateFields };

          if (
            categoryChanged ||
            changedSubCategories[item.subCategory] ||
            changedSubTitles[item.group]
          ) {
            if (changedSubCategories[item.subCategory]) {
              updateFields.subCategory = changedSubCategories[item.subCategory];
            }
            if (changedSubTitles[item.group]) {
              updateFields.group = changedSubTitles[item.group];
            }
            itemUpdatePromises.push(
              Item.findByIdAndUpdate(item._id, { $set: updateFields })
            );
          }
        });

        itemModels.forEach((itemModel) => {
          const updateFields = { ...itemUpdateFields };

          if (
            categoryChanged ||
            changedSubCategories[itemModel.subCategory] ||
            changedSubTitles[itemModel.group]
          ) {
            if (changedSubCategories[itemModel.subCategory]) {
              updateFields.subCategory =
                changedSubCategories[itemModel.subCategory];
            }
            if (changedSubTitles[itemModel.group]) {
              updateFields.group = changedSubTitles[itemModel.group];
            }
            itemUpdatePromises.push(
              ItemModel.findByIdAndUpdate(itemModel._id, { $set: updateFields })
            );
          }
        });

        await Promise.all(itemUpdatePromises);

        return transformCategory(updatedCategory);
      } catch (error) {
        throw error;
      }
    },

    deleteCategory: async (_parent, { id }, { req }, _info) => {
      const userId = getUserId(req);

      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      const user = await User.findById(userId);
      if (!(user.masterAdmin || user.admin)) {
        throw new Error(
          "Forbidden:          You do not have permission to perform this action."
        );
      }
      try {
        await Category.findByIdAndRemove(id);
        return { message: "Category deleted successfully" };
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { categoryResolver };
