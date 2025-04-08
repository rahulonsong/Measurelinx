const { gql } = require("apollo-server-express");
const { mergeTypeDefs } = require("@graphql-tools/merge");

// Importing schema

const { organizationTypeDefs } = require("./organization");
const { userTypeDefs } = require("./user");
const { logoUploadTypeDefs } = require("./logoUpload");
const { alphaResourceTypeDefs } = require("./alphaResource");
const { resourceImageUploadTypeDefs } = require("./resourceImageUpload");
const { tagListTypeDefs } = require("./tagList");
const { itemModelTypeDefs } = require("./itemModel");
const { itemTypeDefs } = require("./item");
const { categoryListTypeDefs } = require("./categoryList");
const { pairedStringListTypeDefs } = require("./pairedStringList");
const { pairedNumberListTypeDefs } = require("./pairedNumberList");
const { addressTypeDefs } = require("./address");
const { orderTypeDefs } = require("./order");
const { cartTypeDefs } = require("./cart");
const { ratingTypeDefs } = require("./rating");
const { subscriberTypeDefs } = require("./subscriber");
const { reviewTypeDefs } = require("./review");
const { paymentTypeDefs } = require("./payment");
const { paymentMethodTypeDefs } = require("./paymentMethod");
const { unitMatrixTypeDefs } = require("./unitMatrix");
const { itemModelImageUploadTypeDefs } = require("./itemModelImage");
const { itemImageUploadTypeDefs } = require("./itemImage");
const { supplierTypeDefs } = require("./supplier");
const { promoCodeTypeDefs } = require("./promoCode");
const { userSearchTypeDefs } = require("./userSearch");
const { contactFormTypeDefs } = require("./contactForm");
const { pageCreatorTypeDefs } = require("./pageCreator");
const { menuTypeDefs } = require("./menu");
const { categoryTypeDefs } = require("./category");
const { initializeAppTypeDefs } = require("./initializeApp");
const { bulkEmailTypeDefs } = require("./bulkEmail");

const typeDefs = [
  organizationTypeDefs,
  userTypeDefs,
  logoUploadTypeDefs,
  alphaResourceTypeDefs,
  resourceImageUploadTypeDefs,
  tagListTypeDefs,
  itemModelTypeDefs,
  itemTypeDefs,
  categoryListTypeDefs,
  pairedStringListTypeDefs,
  pairedNumberListTypeDefs,
  addressTypeDefs,
  cartTypeDefs,
  orderTypeDefs,
  ratingTypeDefs,
  subscriberTypeDefs,
  reviewTypeDefs,
  paymentTypeDefs,
  paymentMethodTypeDefs,
  unitMatrixTypeDefs,
  itemModelImageUploadTypeDefs,
  itemImageUploadTypeDefs,
  supplierTypeDefs,
  promoCodeTypeDefs,
  userSearchTypeDefs,
  contactFormTypeDefs,
  pageCreatorTypeDefs,
  menuTypeDefs,
  categoryTypeDefs,
  initializeAppTypeDefs,
  bulkEmailTypeDefs,
];

module.exports = mergeTypeDefs(typeDefs);
