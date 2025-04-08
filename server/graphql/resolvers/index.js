// const GMR = require("graphql-merge-resolvers");

const _ = require("lodash");
const { userResolver } = require("./user");
const { organizationResolver } = require("./organization");
const { logoUploadResolver } = require("./logoUpload");
const { alphaResourceResolver } = require("./alphaResource");
const { tagListResolver } = require("./tagList");
const { resourceImageUploadResolver } = require("./resourceImageUpload");
const { itemModelResolver } = require("./itemModel");
const { itemResolver } = require("./item");
const { categoryListResolver } = require("./categoryList");
const { pairedStringListResolver } = require("./pairedStringList");
const { pairedNumberListResolver } = require("./pairedNumberList");
const { orderResolver } = require("./order");
const { cartResolver } = require("./cart");
const { ratingResolver } = require("./rating");
const { subscriberResolver } = require("./subscriber");
const { reviewResolver } = require("./review");
const { paymentResolver } = require("./payment");
const { paymentMethodResolver } = require("./paymentMethod");
const { addressResolver } = require("./address");
const { unitMatrixResolver } = require("./unitMatrix");
const { itemModelImageUploadResolver } = require("./itemModelImage");
const { itemImageUploadResolver } = require("./itemImage");
const { supplierResolver } = require("./supplier");
const { promoCodeResolver } = require("./promoCode");
const { userSearchResolver } = require("./userSearch");
const { contactFormResolver } = require("./contactForm");
const { pageCreatorResolver } = require("./pageCreator");
const { menuResolver } = require("./menu");
const { categoryResolver } = require("./category");
const { initializeAppResolver } = require("./initializeApp");
const { bulkEmailResolver } = require("./bulkEmail");

// const resolvers = GMR.merge([projectResolver, userResolver]);

const resolvers = _.merge(
  userResolver,
  organizationResolver,
  logoUploadResolver,
  alphaResourceResolver,
  resourceImageUploadResolver,
  tagListResolver,
  itemModelResolver,
  itemResolver,
  categoryListResolver,
  pairedStringListResolver,
  pairedNumberListResolver,
  orderResolver,
  cartResolver,
  ratingResolver,
  reviewResolver,
  subscriberResolver,
  paymentResolver,
  paymentMethodResolver,
  addressResolver,
  unitMatrixResolver,
  itemModelImageUploadResolver,
  itemImageUploadResolver,
  supplierResolver,
  promoCodeResolver,
  userSearchResolver,
  contactFormResolver,
  pageCreatorResolver,
  menuResolver,
  categoryResolver,
  initializeAppResolver,
  bulkEmailResolver
);

module.exports = resolvers;
