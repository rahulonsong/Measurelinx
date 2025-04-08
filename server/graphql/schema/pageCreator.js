const { gql } = require("apollo-server-express");

const pageCreatorTypeDefs = gql`
  type PageCreator {
    _id: ID!
    name: String!
    routeParam: String!
    description: String
    pageRows: [PageRow!]!
    isItemPage: Boolean
    itemDetails: ItemPageDetails
  }
  type ItemPageDetails {
    category: String
    subCategory: String
    group: String
  }
  input ItemPageDetailsInput {
    category: String
    subCategory: String
    group: String
    itemPageNumber: Int
  }

  type PageCreatorMinimal {
    _id: ID!
    name: String!
    routeParam: String!
  }

  type PageRow {
    rowType: String!
    numberOfCols: String!
    col1: Column
    col2: Column
    col3: Column
    hasButton: Boolean
    buttonParameters: ButtonParameters
  }

  type Column {
    title: String
    exists: Boolean!
    height: Float
    width: Float
    navigation: Navigation
    resource: AlphaResource
  }

  type Navigation {
    isEnabled: Boolean!
    component: String
    routeParam: String
  }
  type ButtonParameters {
    text: String
    targetType: String
    routeParam: String
  }
  input ButtonParametersInput {
    text: String
    targetType: String
    routeParam: String
  }

  input PageCreatorInput {
    name: String!
    # routeParam: String!
    description: String
    pageRows: [PageRowInput!]!
    user: ID!
    isItemPage: Boolean
    itemDetails: ItemPageDetailsInput
  }

  input PageRowInput {
    rowType: String!
    numberOfCols: String!
    col1: ColumnInput
    col2: ColumnInput
    col3: ColumnInput
    hasButton: Boolean
    buttonParameters: ButtonParametersInput
  }

  input ColumnInput {
    title: String
    exists: Boolean!
    height: Float
    width: Float
    navigation: NavigationInput
    resource: ID
  }

  input NavigationInput {
    isEnabled: Boolean!
    component: String
    routeParam: String
  }

  type Query {
    pageCreators: [PageCreatorMinimal]!
    singlePageData(routeParam: String!): PageCreator!
  }

  type Mutation {
    addPageCreator(pageCreatorInput: PageCreatorInput): PageCreator!
    disablePageCreator(id: ID!): Message!
    updatePageCreator(id: ID!, pageCreatorInput: PageCreatorInput): PageCreator!
    deletePageCreator(id: ID!): Message!
    addNewFieldsPageCreator: Message!
  }
`;

module.exports = { pageCreatorTypeDefs };
