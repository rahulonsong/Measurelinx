if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { getUserId } = require("../../utils/getUserId");
const { User } = require("../../models/user");
const { AppEnv } = require("../../models/appEnv.js");
const { AlphaResource } = require("../../models/alphaResource");
const { Item } = require("../../models/item");
const { PageCreator } = require("../../models/pageCreator");
const {
  transformPageResource,
} = require("../../graphql/resolvers/pageCreator.js");
const { ItemModel } = require("../../models/itemModel");
const { UnitMatrix } = require("../../models/unitMatrix");
const { Category } = require("../../models/category");
const { Menu } = require("../../models/menu");
const { TagList } = require("../../models/tagList");
const { CategoryList } = require("../../models/categoryList");
const { PairedStringList } = require("../../models/pairedStringList.js");
const {
  transformAlphaResourceMinimal,
  transformAlphaResource,
  transformItemMinimal,
  transformCategory,
  transformMenu,
} = require("./merge");
const { ObjectId } = require("mongodb");

const BRAND_NAME = `${process.env.BRAND_NAME}`;

const DEAL_ITEMS_LIMIT = process.env.DEAL_ITEMS_LIMIT;
const CATEGORY_ITEMS_LIMIT = process.env.CATEGORY_ITEMS_LIMIT;
const HOME_PAGE_PARAM = process.env.HOME_PAGE_PARAM;
const HOME_PAGE_CAROUSEL_PARAM = process.env.HOME_PAGE_CAROUSEL_PARAM;
const STATE_PROVINCE_CATEGORY_NAME = process.env.STATE_PROVINCE_CATEGORY_NAME;
const USER_ITEMS_CATEGORY_NAME = process.env.USER_ITEMS_CATEGORY_NAME;
const COUNTRY_PHONE_CODES = process.env.COUNTRY_PHONE_CODES;
const ORDER_STATUS_CODES = "orderStatusCodes";

const initializeAppResolver = {
  Mutation: {},
  Query: {
    getAppInitializationData: async (_parent, {}, { req }, _info) => {
      let user;
      try {
        // Get the authenticated user if available
        const userId = getUserId(req, false); // Do not require auth for this resolver
        if (userId) {
          user = await User.findById(userId);
        }

        // Define filters based on user roles
        let resourceFilters = {
          disabled: false,
          published: true,
          isPageConstructor: false,
        };
        let itemFilters = { disabled: false, published: true };
        let itemModelFilters = { disabled: false, published: true };
        let categoryFilters = { disabled: false, published: true };
        let menuFilters = { disabled: false, published: true };

        if (user && (user.admin || user.masterAdmin || user.resourceCreator)) {
          resourceFilters = {};
        }

        if (user && (user.admin || user.masterAdmin)) {
          itemFilters = {};
          itemModelFilters = {};
          categoryFilters = {};
          menuFilters = {};
        }

        // Fetch data in parallel
        const [
          alphaResources,
          constructorAlphaResources,
          itemModels,
          unitMatrices,
          itemCategoryList,
          appEnv,
          menus,
          homePageCarousel,
          homePageData,
          dealItems,
          appTags,
          statesProvinces,
          userItemCategories,
          countryPhoneCodes,
          orderStatusCodes,
          pageCreators,
        ] = await Promise.all([
          // Resources
          user && (user.admin || user.masterAdmin || user.resourceCreator)
            ? AlphaResource.find(resourceFilters)
            : [],
          // Constrcutor Resources
          user && (user.admin || user.masterAdmin || user.resourceCreator)
            ? AlphaResource.find({
                disabled: false,
                published: true,
                isPageConstructor: true,
              })
            : [],
          user && (user.admin || user.masterAdmin)
            ? ItemModel.find(itemModelFilters)
            : [],
          UnitMatrix.find(),
          Category.find(categoryFilters),
          AppEnv.findOne(),
          Menu.find(menuFilters),
          AlphaResource.findOne({
            resourceRouteParam: HOME_PAGE_CAROUSEL_PARAM,
          }),
          // Getting Home page data
          PageCreator.findOne({ routeParam: HOME_PAGE_PARAM })
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
            }),
          // Getting items data
          Item.find({ ...itemFilters, discount: { $gt: 0 } })
            .sort({ discount: -1 })
            .limit(DEAL_ITEMS_LIMIT),
          TagList.find(),
          CategoryList.findOne({ categoryName: STATE_PROVINCE_CATEGORY_NAME }),
          PairedStringList.findOne({
            pairedStringListName: USER_ITEMS_CATEGORY_NAME,
          }),
          PairedStringList.findOne({
            pairedStringListName: COUNTRY_PHONE_CODES,
          }),
          PairedStringList.findOne({
            pairedStringListName: ORDER_STATUS_CODES,
          }),
          PageCreator.find({ disabled: false }).select("name routeParam"),
        ]);

        // Transform alpha resouerces data if available
        let transformedAlphaResources = [];
        if (alphaResources.length > 0) {
          transformedAlphaResources = alphaResources.map((alphaResource) =>
            transformAlphaResourceMinimal(alphaResource._doc)
          );
        }
        // Transform alpha resouerces data if available
        let transformedConstructorAlphaResources = [];
        if (constructorAlphaResources.length > 0) {
          transformedConstructorAlphaResources =
            user && (user.admin || user.masterAdmin || user.resourceCreator)
              ? constructorAlphaResources.map((alphaResource) =>
                  transformAlphaResourceMinimal(alphaResource._doc)
                )
              : [];
        }
        // Transforming items data based on categories
        const transformedItems = await Promise.all(
          itemCategoryList.map(async (category) => {
            const categoryItems = await Item.find({
              ...itemFilters,
              category: category.name,
            })
              .sort({ discount: -1 })
              .limit(CATEGORY_ITEMS_LIMIT);
            return categoryItems.map((item) =>
              transformItemMinimal(item._doc, appEnv)
            );
          })
        ).then((results) => results.flat());
        const transformedDealItems = dealItems.map((item) =>
          transformItemMinimal(item._doc)
        );
        const transformedCategories = itemCategoryList.map((category) =>
          transformCategory(category._doc)
        );
        const transformedMenus = menus.map((menu) => transformMenu(menu._doc));
        const transformedPageCreators = pageCreators.map((pageCreator) => ({
          _id: pageCreator._id,
          name: pageCreator.name,
          routeParam: pageCreator.routeParam,
        }));

        let transformedHomePageData = {};
        if (homePageData != null) {
          transformedHomePageData = await transformPageResource(homePageData);
        }

        let transformedHomePageCarousel = {};
        if (homePageCarousel != null) {
          transformedHomePageCarousel = await transformAlphaResource(
            homePageCarousel._doc
          );
        }
        return {
          alphaResources: transformedAlphaResources,
          constructorAlphaResources: transformedConstructorAlphaResources,
          items: transformedItems,
          itemModels,
          unitMatrices: unitMatrices.map((matrix) => matrix._doc),
          itemCategories: transformedCategories,
          appEnv: appEnv ? appEnv._doc : appEnv,
          appMenus: transformedMenus,
          homePageCarousel: transformedHomePageCarousel,
          homePageData: transformedHomePageData,
          dealItems: transformedDealItems,
          appTags: appTags ? appTags.map((tag) => tag._doc) : appTags,
          statesProvinces,
          countryPhoneCodes,
          orderStatusCodes,
          userItemCategories: userItemCategories
            ? userItemCategories._doc
            : userItemCategories,
          pages: transformedPageCreators,
        };
      } catch (error) {
        console.error("Error in getAppInitializationData:", error);
        throw new Error(error.message);
      }
    },
  },
};

module.exports = { initializeAppResolver };
