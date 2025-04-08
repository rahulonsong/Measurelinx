const Post = require("./models/post");

const resolvers = {
  Query: {
    hello: () => {
      return "Hello World";
    },
    getAllPosts: async () => {
      return await Post.find();
    },
    getPost: async (parent, { id }, context, info) => {
      return await Post.findById(id);
    },
  },

  Mutation: {
    createPost: async (_parent, args, _context, _info) => {
      const { title, description } = args.post;
      const post = new Post({ title, description });
      await post.save();
      return post;
    },

    deletePost: async (_parent, { id }, _context, _info) => {
      await Post.findByIdAndDelete(id);
      return `Post with ID of ${id} Deleted`;
    },
    updatePost: async (_parent, args, _context, _info) => {
      const { id, title, description } = args.post;
      let updates = {};
      if (title !== undefined) {
        updates.title = title;
      }
      if (description !== undefined) {
        updates.description = description;
      }
      const post = await Post.findByIdAndUpdate(id, updates, {
        new: true,
      });
      return post;
    },
  },
};

let { alphaResourceId, resourceRouteParam, routeParam, categoryName } =
  appInitializeInput;

let user;
try {
  // Alpharesource Filters
  let resourceFilters = {
    disabled: false,
    published: true,
    isPageConstructor: false,
  };
  // For admin/reesource creator, remove the published and disabled iteems
  const userId = getUserId(req);
  if (userId) {
    user = await User.findById(userId);
  }

  if (user && (user.admin || user.masterAdmin || user.resourceCreator)) {
    resourceFilters = { disabled: false };
  }
  // Alpha Rresources
  // Filtering out disabled items
  let itemFilters = {
    disabled: false,
    published: true,
  };
  // For admin, remove the published and disabled iteems
  if (userId) {
    const user = await User.findById(userId);
    if (user.admin || user.masterAdmin) {
      itemFilters = { disabled: false };
    }
  }
  let alphaResources = await AlphaResource.find(resourceFilters);
  alphaResources.map((alphaResource) => {
    return transformAlphaResourceMinimal(alphaResource._doc);
  });
  // Constructor AlphaResources
  // Filtering out disabled resources
  let constructorAlphaResources = await AlphaResource.find({
    disabled: false,
    published: true,
    isPageConstructor: true,
  });
  constructorAlphaResources.map((alphaResource) => {
    return transformAlphaResourceMinimal(alphaResource._doc);
  });
  // Item models
  let itemModelFilters = {
    disabled: false,
    published: true,
  };
  if (user && (user.admin || user.masterAdmin)) {
    itemModelFilters = { disabled: false };
  }
  let itemModels = await ItemModel.find(itemModelFilters);
  // Items
  const itemCategoryList = await Category.find();

  const itemCategories = itemCategoryList.map((category) => category.name);
  let items = [];
  itemFilters = {
    disabled: false,
    published: true,
  };
  if (user && (user.admin || user.masterAdmin)) {
    itemFilters = { disabled: false };
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
  items = [
    ...items.map((el) => {
      return transformItemMinimal(el._doc, appEnv);
    }),
  ];

  // Deal items
  let dealItems = await Item.find({
    ...itemFilters,
    discount: { $gt: 0 },
  })
    .sort({ discount: -1 })
    .limit(DEAL_ITEMS_LIMIT);
  dealItems = [
    ...items.map((el) => {
      return transformItemMinimal(el._doc);
    }),
  ];

  // Getting Pages
  let pageCreators = await PageCreator.find({
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

  // Home Page data
  const pageCreator = await PageCreator.findOne({
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
    pageCreator = {};
  }

  if (pageCreator.disabled) {
    if (user && !user.admin) {
      pageCreator = {};
    }
  }
  if (pageCreator.pageRows && pageCreator.pageRows.length) {
    pageCreator = await transformPageResource(pageCreator);
  }

  // Homepage Carousel resource
  let homePageCarousel = await AlphaResource.findOne({
    resourceRouteParam,
  });
  homePageCarousel = transformAlphaResource(homePageCarousel._doc);

  // Unit matrices
  let unitMatrices = await UnitMatrix.find();

  // Item categories

  let categoryFilters = {
    disabled: false,
    published: true,
  };
  // For admin, remove the published and disabled iteems
  if (user && (user.admin || user.masterAdmin)) {
    categoryFilters = { disabled: false };
  }
  let categories = await Category.find(categoryFilters);
  categories = [
    ...categories.map((el) => {
      return transformCategory(el._doc);
    }),
  ];

  // Menus
  let menuFilters = {
    disabled: false,
    published: true,
  };

  if ((user && user.admin) || user.masterAdmin) {
    menuFilters = { disabled: false };
  }
  let menus = await Menu.find(menuFilters);
  menus = [
    ...menus.map((el) => {
      return transformMenu(el._doc);
    }),
  ];

  // App tags
  let appTags = await TagList.find();
  let categoryLists = await CategoryList.find({
    categoryName,
  });
  let statesProvinces;
  if (categoryLists) {
    statesProvinces = categoryLists[0];
  }
  statesProvinces = [];
} catch (error) {
  throw error;
}

getAppInitializationData: async (
  _parent,
  { appInitializeInput },
  { req },
  _info
) => {
  const { alphaResourceId, resourceRouteParam, routeParam, categoryName } =
    appInitializeInput;

  let user;
  try {
    // Get the authenticated user
    const userId = getUserId(req);
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
      resourceFilters = { disabled: false };
    }

    if (user && (user.admin || user.masterAdmin)) {
      itemFilters = { disabled: false };
      itemModelFilters = { disabled: false };
      categoryFilters = { disabled: false };
      menuFilters = { disabled: false };
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
      pageCreators,
    ] = await Promise.all([
      AlphaResource.find(resourceFilters),
      AlphaResource.find({
        disabled: false,
        published: true,
        isPageConstructor: true,
      }),
      ItemModel.find(itemModelFilters),
      UnitMatrix.find(),
      Category.find(categoryFilters),
      AppEnv.findOne(),
      Menu.find(menuFilters),
      AlphaResource.findOne({ resourceRouteParam }),
      PageCreator.findOne({ routeParam })
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
      Item.find({ ...itemFilters, discount: { $gt: 0 } })
        .sort({ discount: -1 })
        .limit(DEAL_ITEMS_LIMIT),
      TagList.find(),
      CategoryList.findOne({ categoryName }),
      PageCreator.find({ disabled: false }).select("name routeParam"),
    ]);

    // Transform data
    const transformedAlphaResources = alphaResources.map((alphaResource) =>
      transformAlphaResourceMinimal(alphaResource._doc)
    );
    const transformedConstructorAlphaResources = constructorAlphaResources.map(
      (alphaResource) => transformAlphaResourceMinimal(alphaResource._doc)
    );
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
    if (homePageData) {
      transformedHomePageData = await transformPageResource(homePageData._doc);
    }

    let transformedHomePageCarousel = {};
    if (homePageCarousel) {
      1;
      transformedHomePageCarousel = transformAlphaResource(
        homePageCarousel._doc
      );
    }

    return {
      alphaResources: transformedAlphaResources,
      constructorAlphaResources:
        user && (user.admin || user.masterAdmin || user.resourceCreator)
          ? transformedConstructorAlphaResources
          : [],
      items: transformedItems,
      itemModels:
        user && (user.admin || user.masterAdmin || user.resourceCreator)
          ? itemModels
          : [],
      unitMatrices,
      itemCategories: transformedCategories,
      appEnv,
      appMenus: transformedMenus,
      homePageCarousel: transformedHomePageCarousel,
      homePageData: transformedHomePageData,
      dealItems: transformedDealItems,
      appTags,
      statesProvinces: statesProvinces,
      pages: transformedPageCreators,
    };
  } catch (error) {
    throw new Error(error.message);
  }
},
  (module.exports = resolvers);
