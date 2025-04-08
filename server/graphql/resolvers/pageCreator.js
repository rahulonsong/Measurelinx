const { PageCreator } = require("../../models/pageCreator");
const { User } = require("../../models/user");
const { getUserId } = require("../../utils/getUserId");
const shortid = require("shortid");
const { transformAlphaResource } = require("./merge");

async function transformPageResource(page) {
  // Check if page has rows
  if (page.pageRows.length) {
    for (const row of page.pageRows) {
      // col1
      if (row.col1.exists) {
        row.col1.resource = await transformAlphaResource(row.col1.resource);
      }
      // col2
      if (row.col2.exists) {
        row.col2.resource = await transformAlphaResource(row.col2.resource);
      }
      // col3
      if (row.col3.exists) {
        row.col3.resource = await transformAlphaResource(row.col3.resource);
      }
    }
  }
  return page._doc;
}

const pageCreatorResolver = {
  Query: {
    pageCreators: async (_parent, _args, { req }, _info) => {
      const userId = getUserId(req);

      // if (!userId) {
      //   throw new Error("Unauthenticated!");
      // }

      try {
        const pageCreators = await PageCreator.find({
          disabled: false,
        }).select("name routeParam");

        pageCreators.map((pageCreator) => ({
          _id: pageCreator._id,
          name: pageCreator.name,
          routeParam: pageCreator.routeParam,
        }));

        // removing home page creator
        pageCreators.filter(
          (page) => page.routeParam !== process.env.HOME_PAGE_ROUTE_PARAM
        );
        return pageCreators;
      } catch (error) {
        throw error;
      }
    },

    singlePageData: async (_parent, { routeParam }, { req }, _info) => {
      // if (!userId) {
      //   throw new Error("Unauthenticated!");
      // }

      // if (routeParam === process.env.HOME_PAGE_ROUTE_PARAM) {
      //   throw new Error("Forbidden!");
      // }
      try {
        let pageCreator = await PageCreator.findOne({
          routeParam: routeParam,
        })
          .populate({
            path: "pageRows.col1.resource",
            model: "AlphaResource",
          })
          .populate({
            path: "pageRows.col2.resource",
            model: "AlphaResource",
          })
          .populate({
            path: "pageRows.col3.resource",
            model: "AlphaResource",
          });

        if (!pageCreator) {
          throw new Error("Page Data not found!");
        }

        if (pageCreator.disabled) {
          const userId = getUserId(req);
          const user = await User.findById(userId);
          if (!user.admin) {
            throw new Error("Page Data not found!");
          }
        }
        if (pageCreator.pageRows && pageCreator.pageRows.length)
          pageCreator = await transformPageResource(pageCreator);
        // console.log("col2 nav: ", pageCreator.pageRows[0].col2.navigation);
        return pageCreator;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    addPageCreator: async (_parent, { pageCreatorInput }, { req }, _info) => {
      const userId = getUserId(req);

      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      const user = await User.findById(userId);
      if (!(user.resourceCreator || user.admin)) {
        throw new Error(
          "Forbidden: You do not have permission to perform this action."
        );
      }
      // gettig name
      let name = pageCreatorInput.name.trim();
      // generating route param
      const routeParam = shortid.generate() + "-" + name.replace(/ /g, "-");
      try {
        const pageCreator = new PageCreator({
          name: pageCreatorInput.name,
          routeParam: routeParam,
          disabled: false,
          description: pageCreatorInput.description,
          pageRows: pageCreatorInput.pageRows,
          isItemPage: pageCreatorInput.isItemPage,
          itemDetails: {
            category:
              pageCreatorInput.itemDetails &&
              pageCreatorInput.itemDetails.category
                ? pageCreatorInput.itemDetails.category
                : "",
            subCategory:
              pageCreatorInput.itemDetails &&
              pageCreatorInput.itemDetails.subCategory
                ? pageCreatorInput.itemDetails.subCategory
                : "",
            group:
              pageCreatorInput.itemDetails && pageCreatorInput.itemDetails.group
                ? pageCreatorInput.itemDetails.group
                : "",
          },
        });
        const result = await pageCreator.save();
        // Populate references after saving
        const modifiedResult = await PageCreator.findById(result._id)
          .populate({
            path: "pageRows.col1.resource",
            model: "AlphaResource",
          })
          .populate({
            path: "pageRows.col2.resource",
            model: "AlphaResource",
          })
          .populate({
            path: "pageRows.col3.resource",
            model: "AlphaResource",
          })
          .exec();
        if (modifiedResult.pageRows && modifiedResult.pageRows.length)
          await transformPageResource(modifiedResult);
        return modifiedResult;
      } catch (error) {
        throw error;
      }
    },
    updatePageCreator: async (
      _parent,
      { id, pageCreatorInput },
      { req },
      _info
    ) => {
      const userId = getUserId(req);

      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      const user = await User.findById(userId);
      if (!(user.resourceCreator || user.admin)) {
        throw new Error(
          "Forbidden: You do not have permission to perform this action."
        );
      }

      try {
        const pageCreator = await PageCreator.findByIdAndUpdate(
          id,
          pageCreatorInput,
          { new: true }
        )
          .populate({
            path: "pageRows.col1.resource",
            model: "AlphaResource",
          })
          .populate({
            path: "pageRows.col2.resource",
            model: "AlphaResource",
          })
          .populate({
            path: "pageRows.col3.resource",
            model: "AlphaResource",
          });

        if (!pageCreator) {
          throw new Error("Page Creator not found!");
        }
        if (pageCreator.pageRows && pageCreator.pageRows.length)
          await transformPageResource(pageCreator);

        return pageCreator;
      } catch (error) {
        throw error;
      }
    },
    deletePageCreator: async (_parent, { id }, { req }, _info) => {
      const userId = getUserId(req);

      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      const user = await User.findById(userId);
      if (!user.admin) {
        throw new Error(
          "Forbidden: You do not have permission to perform this action."
        );
      }

      try {
        await PageCreator.findByIdAndDelete(id);

        return {
          message: `Page Creator with ID ${id} was deleted successfully`,
        };
      } catch (error) {
        throw error;
      }
    },
    // disabling a page
    disablePageCreator: async (_parent, { id }, { req }, _info) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      const user = await User.findById(userId);
      if (!user.resourceCreator) {
        throw new Error(
          "Forbidden: You do not have permission to perform this action."
        );
      }
      try {
        let updates = {};
        // Disabling the pageCreator
        updates.disabled = true;
        let disabledPage = await PageCreator.findByIdAndUpdate(
          id,
          {
            $set: updates,
          },
          { new: true }
        );
        return {
          message: `Resource with name ${disabledPage.name} was disabled successfully`,
        };
      } catch (error) {
        throw error;
      }
    },
    // add new fields
    addNewFieldsPageCreator: async (_parent, {}, { req }, _info) => {
      // Checking if Authenticated
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      const user = await User.findById(userId);
      if (!user.masterAdmin) {
        throw new Error(
          "Forbidden: You do not have permission to perform this action."
        );
      }

      try {
        // Adding new fields to page creator model
        await PageCreator.updateMany(
          {},
          {
            $set: {
              "pageRows.$[].hasButton": false,
              "pageRows.$[].buttonParameters": {
                text: "",
                targetType: "",
                routeParam: "",
              },
            },
          },
          { upsert: false }
        );

        // Returning Success message
        return {
          message: "New fields added successfully!",
        };
      } catch (err) {
        throw err;
      }
    },
  },
};

module.exports = { pageCreatorResolver, transformPageResource };
