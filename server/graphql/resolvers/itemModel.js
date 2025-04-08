const { ItemModel } = require("../../models/itemModel.js");

const { Item } = require("../../models/item.js");

const { TagList } = require("../../models/tagList");

const { User } = require("../../models/user");

const { transformItemModel } = require("../resolvers/merge");

const { deleteS3Item } = require("../../utils/s3Actions.js");

const fs = require("fs");

const mongoose = require("mongoose");
// const { createWriteStream, mkdir } = require("fs");
// import our model
const { File } = require("../../models/file.js");

const { getUserId } = require("../../utils/getUserId");

const itemModelResolver = {
  Query: {
    itemModels: async (_parent, {}, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      const user = await User.findById(userId);
      if (!user.admin) {
        // Instead of attempting to use res.status(403).send("Forbidden"), throw an error.
        throw new Error(
          "Forbidden: You do not have permission to perform this action."
        );
      }
      let itemModelFilters = {
        disabled: false,
        published: true,
      };
      // For admin, remove the published and disabled iteems
      if (user) {
        if (user.admin || user.masterAdmin) {
          itemModelFilters = { disabled: false };
        }
      }

      try {
        // Filtering out disabled itemModels
        const itemModels = await ItemModel.find(itemModelFilters);
        return itemModels.map((model) => model._doc);
      } catch (error) {
        throw error;
      }
    },
    singleItemModel: async (_parent, { itemModelId }, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      const user = await User.findById(userId);
      if (!user.admin && !user.masterAdmin) {
        // Instead of attempting to use res.status(403).send("Forbidden"), throw an error.
        throw new Error(
          "Forbidden: You do not have permission to perform this action."
        );
      }
      try {
        const itemModel = await ItemModel.findById(itemModelId);
        if (
          !itemModel ||
          ((itemModel.disabled || !itemModel.published) &&
            !(user.admin || user.masterAdmin))
        ) {
          throw new Error("Invalid item model!");
        }
        const modifiedItemModel = transformItemModel(itemModel._doc);
        return modifiedItemModel;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    // Adding Alpha Resource
    addItemModelData: async (_parent, { itemModelInput }, { req }, _info) => {
      const userId = getUserId(req);

      // console.log("userId:", userId);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      const user = await User.findById(userId);
      if (!user.admin && !user.masterAdmin) {
        throw new Error("Forbidden!");
      }
      // Checking if the name is unique
      let existingItemModels = await ItemModel.find({
        name: itemModelInput.name,
      });
      // console.log("existingResources:", existingResources);
      if (existingItemModels.length) {
        throw new Error(
          "Name already asssigned to an existing item model. Try again with a unique name!"
        );
      }

      let refinedTagList = [];
      if (itemModelInput.tags) {
        itemModelInput.tags.forEach((tag) => {
          refinedTagList.push(tag.trim());
        });
      }
      const existingTagList = await TagList.find({ listName: "Resource Tags" });
      // console.log("res tagList:", existingTagList[0]);
      const listOfTags = existingTagList[0].tagList;
      let newListOfTags = [...new Set([...listOfTags, ...refinedTagList])];
      // updating Resource Tags
      let updates = {};
      updates.tagList = newListOfTags;
      updates.listName = existingTagList.listName;
      // updating database
      try {
        await TagList.findByIdAndUpdate(
          existingTagList[0]._id,
          {
            $set: updates,
          },
          { new: true }
        );
      } catch (error) {
        throw error;
      }
      // console.log("itemModelContentkInput:", itemModelContentInput);
      // Creating item Model in database
      // generating route param
      const name = itemModelInput.name.trim();
      const routeParam = name.replace(/ /g, "-");
      const itemModel = new ItemModel({
        name: name,
        description: itemModelInput.description,
        colors: itemModelInput.colors,
        disabled: user.masterAdmin ? itemModelInput.disabled : false,
        catId: itemModelInput.catId,
        category: itemModelInput.category,
        subCategory: itemModelInput.subCategory,
        group: itemModelInput.group,
        images: itemModelInput.images,
        specs: itemModelInput.specs,
        tags: itemModelInput.tags,
        routeParam: routeParam,
        // To be reviewed
        published: itemModelInput.published,
        creator: userId,
      });

      try {
        const result = await itemModel.save();
        // console.log("result:", result);
        return result._doc;
      } catch (error) {
        throw error;
      }
    },
    //updating itemModel
    updateItemModelData: async (
      _parent,
      { itemModelId, itemModelInput },
      { req },
      _info
    ) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      const user = await User.findById(userId);
      if (!user.admin && !user.masterAdmin) {
        throw new Error("Forbidden!");
      }

      let refinedTagList = [];
      if (itemModelInput.tags) {
        itemModelInput.tags.forEach((tag) => {
          refinedTagList.push(tag.trim());
        });
      }

      const existingTagList = await TagList.find({ listName: "Resource Tags" });
      const listOfTags = existingTagList[0].tagList;
      let newListOfTags = [...new Set([...listOfTags, ...refinedTagList])];
      let updates = {
        tagList: newListOfTags,
        listName: existingTagList.listName,
      };

      try {
        await TagList.findByIdAndUpdate(
          existingTagList[0]._id,
          { $set: updates },
          { new: true }
        );
      } catch (error) {
        throw error;
      }

      const name = itemModelInput.name.trim();
      const routeParam = name.replace(/ /g, "-");
      // Fetch the original item model to compare changes in category, subCategory, and group
      const originalItemModel = await ItemModel.findById(itemModelId);
      const categoryChanged =
        originalItemModel.category !== itemModelInput.category;
      const subCategoryChanged =
        originalItemModel.subCategory !== itemModelInput.subCategory;
      const groupChanged = originalItemModel.group !== itemModelInput.group;
      updates = {
        name: itemModelInput.name,
        published: itemModelInput.published,
        colors: itemModelInput.colors,
        description: itemModelInput.description,
        disabled: user.masterAdmin ? itemModelInput.disabled : false,
        category: itemModelInput.category,
        subCategory: itemModelInput.subCategory,
        group: itemModelInput.group,
        images: itemModelInput.images,
        specs: itemModelInput.specs,
        tags: itemModelInput.tags,
        routeParam: routeParam,
      };

      try {
        // Fetch the original item model to compare changes in category, subCategory, and group
        const itemModel = await ItemModel.findByIdAndUpdate(
          itemModelId,
          { $set: updates },
          { new: true }
        ).populate({ path: "creator" });

        const modifiedItemModel = transformItemModel(itemModel._doc);

        // Check for new, updated, or deleted specs in itemModel
        const { specs: updatedSpecs } = itemModelInput;
        const { colors } = itemModelInput;

        if (
          updatedSpecs !== undefined ||
          categoryChanged ||
          subCategoryChanged ||
          groupChanged
        ) {
          const associatedItems = await Item.find({ model: itemModelId });

          for (const item of associatedItems) {
            const itemSpecs = item.specs || [];

            // Handle updated and new specs
            for (const updatedSpec of updatedSpecs) {
              const index = itemSpecs.findIndex(
                (spec) => spec.specName === updatedSpec.specName
              );

              if (index === -1) {
                // New spec, add it to the item's specs array
                const newItemSpec = {
                  specName: updatedSpec.specName,
                  specDescription: updatedSpec.specDescription,
                  specValueType: updatedSpec.specValueType,
                  specUnit: updatedSpec.specUnitSelect, // Use specUnitSelect for new specs
                  specValue: updatedSpec.specValue,
                  specText: updatedSpec.specText,
                  specValueSelect: updatedSpec.specValueSelect,
                  specTextSelect: updatedSpec.specTextSelect,
                  specValueOptions: updatedSpec.specValueOptions,
                  specTextOptions: updatedSpec.specTextOptions,
                };
                itemSpecs.push(newItemSpec);
              } else {
                // Existing spec, update relevant fields
                const { specDescription, specValueOptions, specTextOptions } =
                  updatedSpec;

                // Retain the existing values for certain fields
                const existingSpec = itemSpecs[index];
                const {
                  specName,
                  specValueType,
                  specUnit,
                  specValue,
                  specText,
                  specValueSelect,
                  specTextSelect,
                } = existingSpec;

                itemSpecs[index] = {
                  specName,
                  specDescription,
                  specValueType,
                  specUnit,
                  specValue,
                  specText,
                  specValueSelect,
                  specTextSelect,
                  specValueOptions,
                  specTextOptions,
                };
              }
            }

            // Handle deleted specs
            const deletedSpecs = itemSpecs.filter(
              (itemSpec) =>
                !updatedSpecs.find(
                  (updatedSpec) => updatedSpec.specName === itemSpec.specName
                )
            );

            // Remove deleted specs from the item's specs array
            for (const deletedSpec of deletedSpecs) {
              const deleteIndex = itemSpecs.findIndex(
                (itemSpec) => itemSpec.specName === deletedSpec.specName
              );
              itemSpecs.splice(deleteIndex, 1);
            }

            // Prepare the update fields for the item
            const itemUpdateFields = {
              specs: itemSpecs,
              colorOptions: colors,
            };

            // Check for changes in category, subCategory, or group and update the item accordingly
            if (categoryChanged) {
              itemUpdateFields.category = itemModelInput.category;
            }
            if (subCategoryChanged) {
              itemUpdateFields.subCategory = itemModelInput.subCategory;
            }
            if (groupChanged) {
              itemUpdateFields.group = itemModelInput.group;
            }

            // Update the item with the modified specs and any category/subCategory/group changes
            await Item.findByIdAndUpdate(
              item._id,
              { $set: itemUpdateFields },
              { new: true }
            );
          }
        }

        return modifiedItemModel;
      } catch (error) {
        throw error;
      }
    },

    addNewFieldsItemModel: async (_parent, {}, { req }, _info) => {
      // Checking if Authenticated
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      const user = await User.findById(userId);
      if (!user.masterAdmin) {
        throw new Error("Forbidden!");
      }
      try {
        // Adding new fields to User model
        // await Item.updateMany(
        //   {},
        //   {
        //     $set: {
        //       // viewsCount: 0,
        //       // historicalOrderCount: 0,
        //       maximumOrderQuantity: 5,
        //     },
        //   },
        //   { upsert: false, multi: true }
        // );
        // await ItemModel.updateMany(
        //   {},
        //   {
        //     $set: {
        //       "specs.$[].specTextOptions": [],
        //       "specs.$[].specText": "",
        //       "specs.$[].specTextSelect": "",
        //     },
        //   },
        //   { upsert: false, multi: true }
        // );
        // overwrite existing fields
        await ItemModel.updateMany(
          {},
          {
            $set: {
              // images: [],
              // colors: ["red", "blue", "green"],
              // category: "Clothing",
              // subCategory: "Men",
              // group: "Formals",
              catId: mongoose.Types.ObjectId("664a193b21d99df001d2602f"),
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
    // deleting a itemModel
    deleteItemModelData: async (_parent, { itemModelId }, { req }, _info) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      const user = await User.findById(userId);
      if (!user.masterAdmin) {
        throw new Error("Forbidden!");
      }
      try {
        let itemModel = await ItemModel.findById(itemModelId)
          .populate({
            path: "creator",
          })
          .exec();
        // Checking if the user is the owner of this item Model
        if (itemModel.creator._id.valueOf() !== userId) {
          throw new Error("Unauthorized!");
        }
        await ItemModel.deleteOne({ _id: itemModelId });

        return {
          message: `Resource with ID ${itemModelId} was deleted successfully`,
        };
      } catch (error) {
        throw error;
      }
    },
    // disablinh a itemModel
    disableItemModelData: async (_parent, { itemModelId }, { req }, _info) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      const user = await User.findById(userId);
      if (!user.admin && !user.masterAdmin) {
        throw new Error("Forbidden!");
      }
      try {
        let itemModel = await ItemModel.findById(itemModelId)
          .populate({
            path: "creator",
          })
          .exec();
        // Checking if the user is the owner of this item Model
        if (itemModel.creator._id.valueOf() !== userId) {
          throw new Error("Unauthorized!");
        }
        let updates = {};
        // Disabling the item model
        updates.disabled = true;
        let disabledResource = await ItemModel.findByIdAndUpdate(
          itemModelId,
          {
            $set: updates,
          },
          { new: true }
        );
        return {
          message: `Resource with name ${disabledResource.name} was disabled successfully`,
        };
      } catch (error) {
        throw error;
      }
    },
    // publishing a itemModel
    publishItemModelData: async (_parent, { itemModelId }, { req }, _info) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      const user = await User.findById(userId);
      if (!user.admin && !user.masterAdmin) {
        throw new Error("Forbidden!");
      }
      try {
        let itemModel = await ItemModel.findById(itemModelId)
          .populate({
            path: "creator",
          })
          .exec();
        if (!user.masterAdmin) {
          // Checking if the user is the owner of this item Model
          if (itemModel.creator._id.valueOf() !== userId) {
            throw new Error("Unauthorized!");
          }
        }
        let updates = {};
        // Disabling the item model
        updates.published = true;
        let publishedResource = await ItemModel.findByIdAndUpdate(
          itemModelId,
          {
            $set: updates,
          },
          { new: true }
        );
        return {
          message: `Resource with name ${publishedResource.name} was published successfully`,
        };
      } catch (error) {
        throw error;
      }
    },
    // Deleting imag
    deleteItemModelImage: async (
      _parent,
      { itemModelId, imageFilenameInput },
      { req },
      _info
    ) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      const user = await User.findById(userId);
      if (!user.admin && !user.masterAdmin) {
        throw new Error("Forbidden!");
      }
      try {
        // Checking if the user is an admin
        const user = await User.findById(userId);
        // Checking if  Admin
        if (!user.admin) {
          throw new Error("Unauthorized!");
        }

        if (itemModelId) {
          let itemModel = await ItemModel.findById(itemModelId);
          let existingImage = itemModel.images.find(
            (el) => el.filename === imageFilenameInput
          );
          if (existingImage) {
            // Getting Index of the image
            const imageToBeDeleted = itemModel.images.find(
              (image) => image.filename === imageFilenameInput
            );
            const imageIndex = itemModel.images.indexOf(imageToBeDeleted);
            // deleting the image from itemModel
            itemModel.images.splice(imageIndex, 1);
            // Savinf updated itemModel
            await itemModel.save();
          }
        }
        // Check if there is any other resource uses this image
        let sharedItemModels = await ItemModel.find({
          "images.filename": imageFilenameInput,
        });
        // console.log(sharedResources);
        if (sharedItemModels.length) {
          return {
            message: "This image was deleted from this item model",
          };
        }
        try {
          // check if the file exists
          const file = await File.findOne({ filename: imageFilenameInput });
          if (file) {
            // deleting image from the database
            await File.deleteOne({ filename: imageFilenameInput });
            // deleting image from S3 storage
            await deleteS3Item(
              imageFilenameInput,
              process.env.S3_BUCKET_NAME_ITEM
            );
          }
        } catch (error) {
          throw new Error(
            "There was a problem deleting the image. No matching image was found in the database!"
          );
        }
        // Sending confirmation to client
        return {
          message: "Image was deleted successfully",
        };
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { itemModelResolver };
