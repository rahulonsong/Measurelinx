if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { Item } = require("../../models/item.js");

const { TagList } = require("../../models/tagList");

const {
  transformItemMinimal,
  transformReview,
  transformItem,
} = require("../resolvers/merge");

const { User } = require("../../models/user");

const { File } = require("../../models/file");

const { AppEnv } = require("../../models/appEnv");

const { PairedStringList } = require("../../models/pairedStringList");

const { Category } = require("../../models/category.js");

const shortid = require("shortid");

const mongoose = require("mongoose");

const { getUserId } = require("../../utils/getUserId");

const { deleteS3Item } = require("../../utils/s3Actions.js");
const { ItemModel } = require("../../models/itemModel.js");
const { getProjectedItemFields } = require("../resolvers/userSearch");

const DEAL_ITEMS_LIMIT = process.env.DEAL_ITEMS_LIMIT;
const CATEGORY_ITEMS_LIMIT = process.env.CATEGORY_ITEMS_LIMIT;
const PAGE_ITEMS_LIMIT = process.env.ITEMS_PER_PAGE;

const itemResolver = {
  Query: {
    items: async (_parent, {}, { req }, _info) => {
      // const userId = getUserId(req);

      // console.log("userId:", userId);
      // if (!userId) {
      //   throw new Error("Unauthenticated!");
      // }

      try {
        // Filtering out disabled items
        // get item Categories
        const itemCategoryList = await Category.find();

        const itemCategories = itemCategoryList.map(
          (category) => category.name
        );
        let items = [];
        let itemFilters = {
          disabled: false,
          published: true,
        };
        // For admin, remove the published and disabled iteems
        const userId = getUserId(req);
        if (userId) {
          try {
            const user = await User.findById(userId);
            if (user && (user.admin || user.masterAdmin)) {
              // For admin users, we only want to filter out disabled items
              itemFilters = { disabled: false };
            }
          } catch (error) {
            // Handle any errors finding the user, but don't throw
            console.error("Error checking admin status:", error);
            // Continue with default filters (published: true, disabled: false)
          }
        }
        // Getting category items
        if (itemCategories && itemCategories.length) {
          for (const category of itemCategories) {
            let categoryItems = await Item.find({
              ...itemFilters,
              category,
            })
              .sort({ discount: -1 })
              .limit(CATEGORY_ITEMS_LIMIT);
            if (categoryItems.length) {
              items.push(...categoryItems);
            }
          }
        }

        // Get App Env variables
        const appEnv = await AppEnv.find()[0];
        const modifiedItems = [
          ...items.map((el) => {
            return transformItemMinimal(el._doc, appEnv);
          }),
        ];
        return modifiedItems;
      } catch (error) {
        throw error;
      }
    },
    getAllCategoryItems: async (
      _parent,
      { itemCategoryInput },
      { req },
      _info
    ) => {
      let category = itemCategoryInput.itemCategoryName;
      try {
        // Filtering out disabled items
        let itemFilters = {
          disabled: false,
          published: true,
        };
        // For admin, remove the published and disabled iteems
        const userId = getUserId(req);
        if (userId) {
          try {
            const user = await User.findById(userId);
            if (user && (user.admin || user.masterAdmin)) {
              // For admin users, we only want to filter out disabled items
              itemFilters = { disabled: false };
            }
          } catch (error) {
            // Handle any errors finding the user, but don't throw
            console.error("Error checking admin status:", error);
            // Continue with default filters (published: true, disabled: false)
          }
        }
        // get item Categories
        let items = await Item.find({
          ...itemFilters,
          category,
        }).sort({ discount: -1 });

        // Get App Env variables
        const appEnv = await AppEnv.find()[0];
        const modifiedItems = [
          ...items.map((el) => {
            return transformItemMinimal(el._doc, appEnv);
          }),
        ];
        // console.log("items:", modifiedItems);
        return modifiedItems;
      } catch (error) {
        throw error;
      }
    },
    singleItem: async (_parent, { itemId }, { req }, _info) => {
      let userId;
      try {
        userId = getUserId(req);
      } catch (error) {
        // console.log("Unauthenticated");
      }
      const user = await User.findById(userId);

      try {
        let item = await Item.findById(itemId)
          .populate({
            path: "reviews",
            populate: {
              path: "user",
            },
          })
          .populate({
            path: "rating.ratings",
          })
          .populate({
            path: "reviews",
            populate: {
              path: "rating",
            },
          })
          .exec();

        if (!item) {
          throw new Error("Invalid item!");
        }

        // Updating Item view count
        item.viewsCount++;
        await item.save();

        if (user) {
          // Updating User viewed Items
          const viewEntry = {
            viewedDate: new Date(),
            item: item._id,
          };
          const itemIndex = user.viewedItems.indexOf(
            user.viewedItems.find(
              (viewedItem) => viewedItem.item.valueOf() === item._id.valueOf()
            )
          );
          if (itemIndex > -1) {
            user.viewedItems[itemIndex] = Object.assign({}, viewEntry);
          } else {
            user.viewedItems.push(viewEntry);
          }
          await user.save();
        }

        if (!user && (item.disabled || !item.published)) {
          throw new Error("Invalid item!");
        }

        if (
          user &&
          !(user.admin || user.masterAdmin) &&
          (item.disabled || !item.published)
        ) {
          throw new Error("Invalid item!");
        }

        // Get App Env variables
        const appEnv = await AppEnv.findOne();
        const modifiedItem = transformItem(item._doc, appEnv);
        modifiedItem.reviews = [
          ...item.reviews.map((review) => {
            return userId
              ? transformReview(review, userId)
              : transformReview(review, "");
          }),
        ];
        return modifiedItem;
      } catch (error) {
        throw error;
      }
    },
    getDealItems: async (_parent, {}, { req }, _info) => {
      try {
        let itemFilters = {
          disabled: false,
          published: true,
        };
        // For admin, remove the published and disabled iteems
        const userId = getUserId(req);
        if (userId) {
          try {
            const user = await User.findById(userId);
            if (user && (user.admin || user.masterAdmin)) {
              // For admin users, we only want to filter out disabled items
              itemFilters = { disabled: false };
            }
          } catch (error) {
            // Handle any errors finding the user, but don't throw
            console.error("Error checking admin status:", error);
            // Continue with default filters (published: true, disabled: false)
          }
        }
        // Filtering out disabled items
        const items = await Item.find({
          ...itemFilters,
          discount: { $gt: 0 },
        })
          .sort({ discount: -1 })
          .limit(DEAL_ITEMS_LIMIT);
        const modifiedItems = [
          ...items.map((el) => {
            return transformItemMinimal(el._doc);
          }),
        ];
        return modifiedItems;
      } catch (error) {
        throw error;
      }
    },
    getAllDealItems: async (_parent, {}, { req }, _info) => {
      // const userId = getUserId(req);

      // console.log("userId:", userId);
      // if (!userId) {
      //   throw new Error("Unauthenticated!");
      // }

      try {
        let itemFilters = {
          disabled: false,
          published: true,
        };
        // For admin, remove the published and disabled iteems
        const userId = getUserId(req);
        if (userId) {
          try {
            const user = await User.findById(userId);
            if (user && (user.admin || user.masterAdmin)) {
              // For admin users, we only want to filter out disabled items
              itemFilters = { disabled: false };
            }
          } catch (error) {
            // Handle any errors finding the user, but don't throw
            console.error("Error checking admin status:", error);
            // Continue with default filters (published: true, disabled: false)
          }
        }
        // Filtering out disabled items
        const items = await Item.find(itemFilters).sort({ discount: -1 });
        const modifiedItems = [
          ...items.map((el) => {
            return transformItemMinimal(el._doc);
          }),
        ];
        return modifiedItems;
      } catch (error) {
        throw error;
      }
    },
    getSingleCategoryGroupItems: async (
      _parent,
      { itemPageDetailsInput },
      { req },
      _info
    ) => {
      try {
        const {
          category,
          subCategory,
          group,
          itemPageNumber = 1,
        } = itemPageDetailsInput;
        const limit = parseInt(PAGE_ITEMS_LIMIT);
        const skip = (itemPageNumber - 1) * limit;

        let itemFilters = {
          disabled: false,
          published: true,
        };

        // Ensure at least the category is valid
        if (!category) {
          throw new Error("Category is required");
        }

        // Adding category, subCategory, and group to the filters if provided
        itemFilters.category = category;
        if (subCategory) {
          itemFilters.subCategory = subCategory;
        }
        if (group) {
          itemFilters.group = group;
        }

        // For admin, remove the published filter
        const userId = getUserId(req);
        if (userId) {
          try {
            const user = await User.findById(userId);
            if (user && (user.admin || user.masterAdmin)) {
              // For admin users, we only want to filter out disabled items
              delete itemFilters.published;
            }
          } catch (error) {
            // Handle any errors finding the user, but don't throw
            console.error("Error checking admin status:", error);
            // Continue with default filters (published: true, disabled: false)
          }
        }

        // Building the aggregation pipeline
        const pipeline = [{ $match: itemFilters }, { $sort: { discount: -1 } }];

        // Get the total count of items matching the filters
        const countPipeline = [...pipeline, { $count: "totalItems" }];
        const countResult = await Item.aggregate(countPipeline);
        const totalItems =
          countResult.length > 0 ? countResult[0].totalItems : 0;

        // Adding pagination to the pipeline
        const itemsPipeline = [
          ...pipeline,
          { $skip: skip },
          { $limit: limit },
          {
            $project: getProjectedItemFields(),
          },
        ];

        // Fetching items based on the pipeline
        const items = await Item.aggregate(itemsPipeline);

        // Transforming items to minimal format
        const modifiedItems = items.map((el) => transformItemMinimal(el));

        return {
          items: modifiedItems,
          totalItems,
        };
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    // Adding Alpha Resource
    addItemData: async (_parent, { itemInput }, { req }, _info) => {
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
      let existingItems = await Item.find({
        name: itemInput.name,
      });
      // console.log("existingResources:", existingResources);
      if (existingItems.length) {
        throw new Error(
          "Title already asssigned to an existing item. Try again with a unique name!"
        );
      }

      let refinedTagList = [];
      if (itemInput.tags) {
        itemInput.tags.forEach((tag) => {
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
      // Creating item Model in database
      // refining name
      let name = itemInput.name.trim();
      // generating route param
      const routeParam = shortid.generate() + "-" + name.replace(/ /g, "-");
      // gnerating sku
      let nameArray = name.split(" ");
      let skuName = "";
      nameArray.forEach((part) => {
        skuName +=
          part.length >= 3
            ? part.substring(0, 3)
            : part.length >= 2
            ? part.substring(0, 2)
            : "";
      });
      const sku = skuName + "-" + shortid.generate();
      // get itemModel data
      const itemModel = await ItemModel.findById(itemInput.model);
      if (!itemModel) {
        throw new Error("ItemModel not found");
      }
      const { category, subCategory, group, catId } = itemModel._doc;

      let item = new Item({
        name: name,
        description: itemInput.description,
        color: itemInput.color,
        colorOptions: itemInput.colorOptions,
        isSizeApplicable: itemInput.isSizeApplicable,
        isColorApplicable: itemInput.isColorApplicable,
        length: itemInput.length,
        width: itemInput.width,
        height: itemInput.height,
        weight: itemInput.weight,
        size: itemInput.size,
        category,
        subCategory,
        group,
        catId,
        additionalInfo: itemInput.additionalInfo,
        price: itemInput.price,
        tax: itemInput.tax,
        discount: itemInput.discount,
        maximumOrderQuantity: itemInput.maximumOrderQuantity,
        stock: itemInput.stock,
        model: itemInput.model,
        images: itemInput.images,
        specs: itemInput.specs,
        tags: itemInput.tags,
        defaultImage: itemInput.defaultImage,
        featuresDetails: itemInput.featuresDetails,
        viewsCount: 0, // initiating view count as zero.k
        sku: sku,
        supplier: itemInput.supplier,
        routeParam: routeParam,
        disabled: !itemInput.disabled ? false : itemInput.disabled,
        // To be reviewed
        published: !itemInput.published ? false : itemInput.published,
        creator: userId,
      });

      try {
        let result = await item.save();
        // console.log("result:", result);
        result = await Item.findById(result.id)
          .populate({
            path: "reviews",
            populate: {
              path: "user",
            },
          })
          .exec();
        if (!item) {
          throw new Error("Invalid item!");
        }

        let itemReviews = item.reviews.map((review) => {
          return transformReview(review);
        });
        item = { ...item._doc };
        item.reviews = itemReviews;
        return item;
      } catch (error) {
        throw error;
      }
    },
    addNewFieldsItem: async (_parent, {}, { req }, _info) => {
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
        // overwrite existing fields
        await Item.updateMany(
          {},
          {
            $set: {
              // images: [],
              // additionalInfo: "",
              "price.currency": "CAD",
              // length: 5,
              // width: 5,
              // height: 5,
              // weight: 5,
              // size: "small",
              // color: "blue",
              // colorOptions: ["red", "blue", "green"],
              // isColorApplicable: true,
              // isSizeApplicable: true,
              // category: "Clothing",
              // subCategory: "Men",
              // group: "Formals",
              // catId: mongoose.Types.ObjectId("664a193b21d99df001d2602f"),
              // rating: {
              //   ratings: [],
              // },
              // reviews: [],
              // tax: 13,
            },
          },
          { upsert: false, multi: true }
        );
        // Add new fields without overwriteing
        // await Item.updateMany(
        //   {},
        //   {
        //     $set: {
        //       "specs.$[].specTextOptions": [],
        //       "specs.$[].specText": "",
        //       "specs.$[].specTextSelect": "",
        //     },
        //     $setOnInsert: {
        //       "specs.$[].specValue": null,
        //       "specs.$[].specValueSelect": null,
        //       "specs.$[].specValueOptions": [],
        //     },
        //   },
        //   { upsert: false, multi: true }
        // );

        // Returning Success message
        return {
          message: "New fields Added successfully!",
        };
      } catch (err) {
        throw err;
      }
    },
    //updating item
    updateItemData: async (_parent, { itemId, itemInput }, { req }, _info) => {
      const userId = getUserId(req);
      // console.log("userId:", userId);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      const user = await User.findById(userId);
      if (!user.admin && !user.masterAdmin) {
        throw new Error("Forbidden!");
      }
      let refinedTagList = [];
      if (itemInput.tags) {
        itemInput.tags.forEach((tag) => {
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
      // Geting existing data
      let oldData = await Item.findById(itemId);
      let routeParam;
      let name;
      if (itemInput.name !== oldData.name) {
        name = itemInput.name.trim();
        routeParam = shortid.generate() + "-" + name.replace(/ /g, "-");
      } else {
        name = oldData.name;
        routeParam = oldData.routeParam;
      }
      updates = {};
      if (itemInput !== undefined) {
        updates.name = name;
        updates.description = itemInput.description;
        updates.category = itemInput.category;
        updates.additionalInfo = itemInput.additionalInfo;
        updates.defaultImage = itemInput.defaultImage;
        updates.price = itemInput.price;
        updates.discount = itemInput.discount;
        updates.tax = itemInput.tax;
        updates.model = itemInput.model;
        updates.images = itemInput.images;
        updates.specs = itemInput.specs;
        updates.stock = itemInput.stock;
        updates.featuresDetails = itemInput.featuresDetails;
        updates.customerQuestions = itemInput.customerQuestions;
        updates.tags = itemInput.tags;
        updates.color = itemInput.color;
        updates.size = itemInput.size;
        updates.colorOptions = itemInput.colorOptions;
        updates.isSizeApplicable = itemInput.isSizeApplicable;
        updates.isColorApplicable = itemInput.isColorApplicable;
        updates.routeParam = routeParam;
        updates.supplier = itemInput.supplier;
        updates.disabled = itemInput.disabled;
        updates.published = itemInput.published;
      }
      // To be reviewed when the item creation is delegated
      // for (let prop in updates) if (!updates[prop]) delete updates[prop];

      try {
        const item = await Item.findByIdAndUpdate(
          itemId,
          {
            $set: updates,
          },
          { new: true }
        )
          .populate({
            path: "reviews",
            populate: {
              path: "user",
            },
          })
          .populate({
            path: "rating.ratings",
          })
          .populate({
            path: "reviews",
          })
          .exec();
        if (!item) {
          throw new Error("Invalid item!");
        }
        item._doc.reviews = [
          ...item.reviews.map((review) => {
            return userId
              ? transformReview(review, userId)
              : transformReview(review, "");
          }),
        ];
        return item._doc;
      } catch (error) {
        throw error;
      }
    },
    // deleting a item
    deleteItemData: async (_parent, { itemId }, { req }, _info) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      const user = await User.findById(userId);
      if (!user.admin && !user.masterAdmin) {
        throw new Error("Forbidden!");
      }

      try {
        let item = await Item.findById(itemId)
          .populate({
            path: "creator",
          })
          .exec();
        // Checking if the user is the owner of this item Model
        if (item.creator._id.valueOf() !== userId) {
          throw new Error("Unauthorized!");
        }
        await Item.deleteOne({ _id: itemId });

        return {
          message: `Resource with ID ${itemId} was deleted successfully`,
        };
      } catch (error) {
        throw error;
      }
    },
    // disablinh a item
    disableItemData: async (_parent, { itemId }, { req }, _info) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      const user = await User.findById(userId);
      if (!user.admin && !user.masterAdmin) {
        throw new Error("Forbidden!");
      }
      try {
        let item = await Item.findById(itemId)
          .populate({
            path: "creator",
          })
          .exec();
        // Checking if the user is the owner of this item Model
        if (item.creator._id.valueOf() !== userId) {
          throw new Error("Unauthorized!");
        }
        let updates = {};
        // Disabling the item
        updates.disabled = true;
        let disabledResource = await Item.findByIdAndUpdate(
          itemId,
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
    // Deleting image
    deleteItemImage: async (
      _parent,
      { itemId, imageFilenameInput },
      { req },
      _info
    ) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      try {
        // Checking if the user is an admin
        const user = await User.findById(userId);
        if (!user.admin && !user.masterAdmin) {
          throw new Error("Forbidden!");
        }

        if (itemId) {
          let item = await Item.findById(itemId);
          let existingImage = item.images.find(
            (el) => el.filename === imageFilenameInput
          );
          if (existingImage) {
            // Getting Index of the image
            const imageToBeDeleted = item.images.find(
              (image) => image.filename === imageFilenameInput
            );
            const imageIndex = item.images.indexOf(imageToBeDeleted);
            // deleting the image from itemModel
            item.images.splice(imageIndex, 1);
            // Savinf updated itemModel
            await item.save();
          }
        }
        // Check if there is any other resource uses this image
        let sharedItems = await Item.find({
          "images.filename": imageFilenameInput,
        });
        // console.log(sharedResources);
        if (sharedItems.length) {
          return {
            message: "This image was deleted from this item",
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
          return {
            message:
              "There was a problem deleting the image. No matching image was found in the database!",
          };
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

module.exports = { itemResolver };
