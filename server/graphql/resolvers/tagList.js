const { TagList } = require("../../models/tagList");

const { User } = require("../../models/user");

// const { transformAlphaResource } = require("./merge");

// const mongoose = require("mongoose");

const { getUserId } = require("../../utils/getUserId");

const tagListResolver = {
  Query: {
    tagLists: async () => {
      try {
        const tagLists = await TagList.find();
        return tagLists.map((list) => list._doc);
      } catch (error) {
        throw error;
      }
    },
    singleTagList: async (_parent, { tagListId }, { req }, _info) => {
      try {
        const tagList = await TagList.findById(tagListId);
        return tagList._doc;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    // Adding Tag List
    addTagList: async (_parent, { tagListInput }, { req }, _info) => {
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
      // console.log("alphaResourceContentkInput:", alphaResourceContentInput);
      // Trimming Tags to remove white spaces
      let refinedTagList = [];
      tagListInput.tagList.forEach((tag) => {
        refinedTagList.push(tag.trim());
      });
      const tagList = new TagList({
        listName: tagListInput.listName,
        tagList: refinedTagList,
      });

      try {
        const result = await tagList.save();
        // console.log("result:", result);
        return result._doc;
      } catch (error) {
        throw error;
      }
    },
    //updating TagList
    updateTagList: async (
      _parent,
      { tagListId, tagListInput },
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
      let refinedTagList = [];
      tagListInput.tagList.forEach((tag) => {
        refinedTagList.push(tag.trim());
      });

      const updates = {};
      if (tagListInput !== undefined) {
        updates.tagList = refinedTagList;
        updates.listName = tagListInput.listName;
      }

      try {
        const tagList = await TagList.findByIdAndUpdate(
          tagListId,
          {
            $set: updates,
          },
          { new: true }
        );

        return tagList._doc;
      } catch (error) {
        throw error;
      }
    },
    // Adding tags
    addTags: async (_parent, { tagListId, tagsInput }, { req }, _info) => {
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

      const existingTagList = await TagList.findById(tagListId);
      const listOfTags = existingTagList.tagList;
      // Trimming Tags to remove white spaces
      let refinedTagList = [];
      tagsInput.tags.forEach((tag) => {
        refinedTagList.push(tag.trim());
      });
      let newListOfTags = [...new Set([...listOfTags, ...refinedTagList])];

      let updates = {};
      updates.tagList = newListOfTags;
      updates.listName = existingTagList.listName;

      try {
        const tagList = await TagList.findByIdAndUpdate(
          tagListId,
          {
            $set: updates,
          },
          { new: true }
        );

        return tagList._doc;
      } catch (error) {
        throw error;
      }
    },
    // deleting a TagList
    deleteTagList: async (_parent, { tagListId }, { req }, _info) => {
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
        let tagList = await TagList.findById(tagListId);
        // Checking if the user is the owner of this alpha Resource
        // if (alphaResource.user._id.valueOf() !== userId) {
        //   throw new Error("Unauthorized!");
        // }
        await TagList.deleteOne({ _id: tagListId });

        return {
          message: `Tag List with ID ${tagListId} was deleted successfully`,
        };
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { tagListResolver };
