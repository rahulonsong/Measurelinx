const { AlphaResource } = require("../../models/alphaResource.js");

const { TagList } = require("../../models/tagList");

const { User } = require("../../models/user");

const {
  transformAlphaResourceMinimal,
  transformAlphaResource,
} = require("./merge");

const { File } = require("../../models/file.js");
const { deleteS3Item } = require("../../utils/s3Actions.js");

// const mongoose = require("mongoose");

const { getUserId } = require("../../utils/getUserId");

const alphaResourceResolver = {
  Query: {
    alphaResources: async (_parent, {}, { req }, _info) => {
      try {
        let resourceFilters = {
          disabled: false,
          published: true,
          isPageConstructor: false,
        };
        // For admin/reesource creator, remove the published and disabled iteems
        const userId = getUserId(req);
        if (userId) {
          const user = await User.findById(userId);
          if (user.admin || user.masterAdmin || user.resourceCreator) {
            resourceFilters = { disabled: false };
          }
        }
        // Filtering out disabled resources
        const alphaResources = await AlphaResource.find(resourceFilters);
        return alphaResources.map((alphaResource) => {
          return transformAlphaResourceMinimal(alphaResource._doc);
        });
      } catch (error) {
        throw error;
      }
    },
    constructorAlphaResources: async (
      _parent,
      { alphaResourceId },
      { req },
      _info
    ) => {
      try {
        const userId = getUserId(req);

        if (!userId) {
          throw new Error("Unauthenticated!");
        }

        // Getting user
        const user = await User.findById(userId);
        // Checkjing if user has rights to manage resource
        if (!user.resourceCreator && !user.admin) {
          // throw new Error("Access Forbidden!");
          return [];
        }

        // Filtering out disabled resources
        const alphaResources = await AlphaResource.find({
          disabled: false,
          published: true,
          isPageConstructor: true,
        });
        return alphaResources.map((alphaResource) => {
          return transformAlphaResourceMinimal(alphaResource._doc);
        });
      } catch (error) {
        throw error;
      }
    },
    singleAlphaResource: async (
      _parent,
      { alphaResourceId, resourceRouteParam },
      { req },
      _info
    ) => {
      try {
        let alphaResource;
        if (alphaResourceId) {
          alphaResource = await AlphaResource.findById(alphaResourceId);
        } else if (resourceRouteParam) {
          alphaResource = await AlphaResource.findOne({ resourceRouteParam });
        }
        // code ater receiving the alpha resource
        if (
          !alphaResource ||
          alphaResource.disabled ||
          !alphaResource.published
        ) {
          const userId = getUserId(req);
          if (!userId) {
            throw new Error("Page Data not found!");
          }
          const user = await User.findById(userId);
          if (!user.admin && !user.resourceCreator) {
            throw new Error("Page Data not found!");
          }
        }
        return transformAlphaResource(alphaResource._doc);
      } catch (error) {
        throw error;
      }
    },
    singleConstructorAlphaResource: async (
      _parent,
      { alphaResourceId, resourceRouteParam },
      { req },
      _info
    ) => {
      try {
        let alphaResource;
        if (alphaResourceId) {
          alphaResource = await AlphaResource.findById(alphaResourceId);
        } else if (resourceRouteParam) {
          alphaResource = await AlphaResource.findOne({ resourceRouteParam });
        }
        // code ater receiving the alpha resource
        if (
          !alphaResource ||
          alphaResource.disabled ||
          !alphaResource.published
        ) {
          const userId = getUserId(req);
          if (!userId) {
            throw new Error("Page Data not found!");
          }
          const user = await User.findById(userId);
          if (!user.admin && !user.resourceCreator) {
            throw new Error("Page Data not found!");
          }
        }
        return transformAlphaResource(alphaResource._doc);
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    // Adding Alpha Resource
    addAlphaResourceData: async (
      _parent,
      { alphaResourceContentInput, alphaResourceInput },
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
      if (!user.resourceCreator && !user.admin) {
        throw new Error("Access Forbidden!");
      }

      // Checking if the title is unique
      let existingResources = await AlphaResource.find({
        title: alphaResourceInput.title,
      });
      // console.log("existingResources:", existingResources);
      if (existingResources.length) {
        throw new Error(
          "Title already asssigned to an existing resource. Try again with a unique title!"
        );
      }

      let refinedTagList = [];
      if (alphaResourceInput.tags) {
        alphaResourceInput.tags.forEach((tag) => {
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
      // updating database for tags
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
      // console.log("alphaResourceContentkInput:", alphaResourceContentInput);
      // Creating alpha Resource in database
      // generating route param
      const title = alphaResourceInput.title.trim();
      const routeParam = title.replace(/ /g, "-");
      const alphaResource = new AlphaResource({
        title: title,
        contentIntro: alphaResourceInput.contentIntro,
        content: alphaResourceContentInput,
        category: alphaResourceInput.category,
        type: alphaResourceInput.type,
        references: alphaResourceInput.references,
        tags: alphaResourceInput.tags,
        resourceRouteParam: routeParam,
        disabled: false,
        // To be reviewed
        published: true,
        // page cosntrcutor
        isPageConstructor: alphaResourceInput.isPageConstructor,
        creator: userId,
      });

      let createdAlphaResource;

      try {
        const result = await alphaResource.save();
        // console.log("result:", result);
        createdAlphaResource = transformAlphaResource(result);
        return createdAlphaResource;
      } catch (error) {
        throw error;
      }
    },
    addNewFieldsAlphaResource: async (_parent, {}, { req }, _info) => {
      // Checking if Authenticated
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      try {
        // Adding new fields to User model
        await AlphaResource.updateMany(
          { isPageConstructor: true }, // Condition to match documents where isPageConstructor is true
          {
            $set: {
              category: "Constructor", // Setting the "category" field to "Constructor"
            },
          },
          {
            upsert: false, // Ensuring that no new documents are created if no existing documents match
            multi: true, // This option is deprecated in MongoDB, updateMany inherently updates multiple documents
          }
        );

        // Returning Success message
        return {
          message: "New fields Added successfully!",
        };
      } catch (err) {
        throw err;
      }
    },
    //updating alphaResource
    updateAlphaResourceData: async (
      _parent,
      { alphaResourceId, alphaResourceContentInput, alphaResourceInput },
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
      if (!user.resourceCreator && !user.admin) {
        throw new Error("Access Forbidden!");
      }

      let refinedTagList = [];
      if (alphaResourceInput.tags) {
        alphaResourceInput.tags.forEach((tag) => {
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
      const title = alphaResourceInput.title.trim();
      const routeParam = title.replace(/ /g, "-");
      updates = {};
      if (alphaResourceContentInput !== undefined)
        updates.content = alphaResourceContentInput;
      if (alphaResourceInput !== undefined) {
        updates.contentIntro = alphaResourceInput.contentIntro;
        updates.category = alphaResourceInput.category;
        updates.title = title;
        updates.isPageConstructor = alphaResourceInput.isPageConstructor;
        updates.type = alphaResourceInput.type;
        updates.references = alphaResourceInput.references;
        updates.tags = alphaResourceInput.tags;
        updates.resourceRouteParam = routeParam;
        updates.disabled = alphaResourceInput.disabled;
        updates.published = alphaResourceInput.published;
      }
      // To be reviewed when the resource creation is delegated
      // for (let prop in updates) if (!updates[prop]) delete updates[prop];

      try {
        const alphaResource = await AlphaResource.findByIdAndUpdate(
          alphaResourceId,
          {
            $set: updates,
          },
          { new: true }
        );
        // return alphaResource._doc;
        updatedAlphaResource = transformAlphaResource(alphaResource);
        return updatedAlphaResource;
      } catch (error) {
        throw error;
      }
    },
    // deleting a alphaResource
    deleteAlphaResourceData: async (
      _parent,
      { alphaResourceId },
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
      if (!user.resourceCreator && !user.admin) {
        throw new Error("Access Forbidden!");
      }
      try {
        let alphaResource = await AlphaResource.findById(alphaResourceId)
          .populate({
            path: "creator",
          })
          .exec();
        // Checking if the user is the owner of this alpha Resource
        if (alphaResource.creator._id.valueOf() !== userId) {
          throw new Error("Unauthorized!");
        }
        await AlphaResource.deleteOne({ _id: alphaResourceId });

        return {
          message: `Resource with ID ${alphaResourceId} was deleted successfully`,
        };
      } catch (error) {
        throw error;
      }
    },
    // disablinh a alphaResource
    disableAlphaResourceData: async (
      _parent,
      { alphaResourceId },
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
      if (
        !user.resourceCreator &&
        !user.admin &&
        !(user.email === "rahul.kanakath@anacept.com")
      ) {
        throw new Error("Access Forbidden!");
      }
      try {
        let alphaResource = await AlphaResource.findById(alphaResourceId)
          .populate({
            path: "creator",
          })
          .exec();
        // Checking if the user is the owner of this alpha Resource
        if (alphaResource.creator._id.valueOf() !== userId) {
          throw new Error("Unauthorized!");
        }
        let updates = {};
        // Disabling the resource
        updates.disabled = true;
        let disabledResource = await AlphaResource.findByIdAndUpdate(
          alphaResourceId,
          {
            $set: updates,
          },
          { new: true }
        );
        return {
          message: `Resource with title ${disabledResource.title} was disabled successfully`,
        };
      } catch (error) {
        throw error;
      }
    },
    // publishing a alphaResource
    publishAlphaResourceData: async (
      _parent,
      { alphaResourceId },
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
      if (
        !user.resourceCreator &&
        !user.admin &&
        !(user.email === "rahul.kanakath@anacept.com")
      ) {
        throw new Error("Access Forbidden!");
      }
      try {
        let alphaResource = await AlphaResource.findById(alphaResourceId)
          .populate({
            path: "creator",
          })
          .exec();
        // Checking if the user is the owner of this alpha Resource
        if (alphaResource.creator._id.valueOf() !== userId) {
          throw new Error("Unauthorized!");
        }
        let updates = {};
        // Disabling the resource
        updates.published = true;
        let publishedResource = await AlphaResource.findByIdAndUpdate(
          alphaResourceId,
          {
            $set: updates,
          },
          { new: true }
        );
        return {
          message: `Resource with title ${publishedResource.title} was published successfully`,
        };
      } catch (error) {
        throw error;
      }
    },
    // Deleting image
    deleteAlphaResourceImage: async (
      _parent,
      { alphaResourceId, contentIndexInput, imageFilenameInput },
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
        // Checking if  Admin
        if (!user.admin) {
          throw new Error("Unauthorized!");
        }

        if (alphaResourceId) {
          let alphaResource = await AlphaResource.findById(alphaResourceId);
          let existingContent = alphaResource.content.find(
            (content) => content.filename === imageFilenameInput
          );
          if (existingContent) {
            // deleting the image from alphaResource
            alphaResource.content[contentIndexInput].imageLink = "";
            alphaResource.content[contentIndexInput].imageRequired = false;
            // Savin updated alphaResource
            await alphaResource.save();
          }
        }
        // Check if there is any other resource uses this image
        let sharedResources = await AlphaResource.find({
          "content.filename": imageFilenameInput,
        });
        // console.log(sharedResources);
        if (sharedResources.length) {
          return {
            message:
              "This image is shared by another resource and cannot be deleted from the database!",
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
          throw new Error("There was a problem deleting the image!");
        }
        return {
          message: "Image was deleted successfully",
        };
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { alphaResourceResolver };
