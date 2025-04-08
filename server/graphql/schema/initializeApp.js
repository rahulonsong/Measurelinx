const { gql } = require("apollo-server-express");

const initializeAppTypeDefs = gql`
  type AppInitializationData {
    alphaResources: [AlphaResourceMinimal]
    constructorAlphaResources: [AlphaResourceMinimal]
    items: [ItemMinimal]
    itemModels: [ItemModelMinimal]
    unitMatrices: [UnitMatrix]
    itemCategories: [Category]
    appEnv: AppEnvData
    appMenus: [Menu]
    pages: [PageCreatorMinimal]
    homePageCarousel: AlphaResource
    homePageData: PageCreator
    dealItems: [ItemMinimal]
    appTags: [TagList]
    statesProvinces: CategoryList
    userItemCategories: PairedStringList
    countryPhoneCodes: PairedStringList
    orderStatusCodes: PairedStringList
  }

  # input AppInitializeInput {
  #   # alphaResourceId: ID
  #   # homePageCarouselResourceRouteParam: String
  #   # homePageRouteParam: String
  #   # stateProvinceCategoryName: String
  #   # userItemsCategoryName: String
  # }

  type Query {
    getAppInitializationData: AppInitializationData
  }
`;

module.exports = { initializeAppTypeDefs };
