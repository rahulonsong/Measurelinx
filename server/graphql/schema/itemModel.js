const { gql } = require("apollo-server-express");

const itemModelTypeDefs = gql`
  type ItemModelImage {
    imageRequired: Boolean!
    imageLink: String
    filename: String
  }
  input ItemModelImageInput {
    imageRequired: Boolean!
    imageLink: String
    filename: String
  }
  type ItemModelSpec {
    specName: String!
    specDescription: String
    specValueType: String
    specValue: Float
    specText: String
    specValueSelect: Float
    specTextSelect: String
    specUnitOptions: [String]
    specUnitSelect: String
    specValueOptions: [Float]
    specTextOptions: [String]
  }
  input ItemModelSpecInput {
    specName: String!
    specDescription: String
    specValueType: String
    specValue: Float
    specText: String
    specValueSelect: Float
    specTextSelect: String
    specUnitOptions: [String]
    specUnitSelect: String
    specValueOptions: [Float]
    specTextOptions: [String]
  }
  type ItemModelMinimal {
    _id: ID!
    name: String!
    routeParam: String!
  }
  type ItemModel {
    _id: ID!
    name: String!
    colors: [String!]
    description: String
    disabled: Boolean
    catId: ID!
    category: String!
    subCategory: String
    group: String
    tags: [String!]
    routeParam: String
    published: Boolean
    images: [ItemModelImage]
    specs: [ItemModelSpec]!
  }
  input ItemModelInput {
    name: String!
    description: String
    colors: [String!]
    catId: ID!
    category: String!
    subCategory: String
    group: String
    tags: [String!]
    images: [ItemModelImageInput]
    specs: [ItemModelSpecInput]!
    disabled: Boolean
    published: Boolean
  }
  type Query {
    itemModels: [ItemModelMinimal!]!
    singleItemModel(itemModelId: ID!): ItemModel!
  }

  type Mutation {
    addItemModelData(itemModelInput: ItemModelInput!): ItemModel!
    updateItemModelData(
      itemModelId: ID!
      itemModelInput: ItemModelInput!
    ): ItemModel!
    addNewFieldsItemModel: Message!
    deleteItemModelData(itemModelId: ID!): Message!
    disableItemModelData(itemModelId: ID!): Message!
    deleteItemModelImage(itemModelId: ID, imageFilenameInput: String!): Message!
    publishItemModelData(itemModelId: ID!): Message!
  }
`;

module.exports = { itemModelTypeDefs };
