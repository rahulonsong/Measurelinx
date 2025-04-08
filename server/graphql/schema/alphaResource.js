const { gql } = require("apollo-server-express");

const alphaResourceTypeDefs = gql`
  type AlphaResourceContent {
    contentDetail: String
    imageRequired: Boolean!
    imageLink: String
    imageOnLeft: Boolean
    filename: String
    contentTable: AlphaResourceTable
    _id: ID
  }
  type AlphaResourceMinimal {
    _id: ID!
    title: String!
    category: String!
    resourceRouteParam: String!
  }
  type AlphaResource {
    _id: ID!
    published: Boolean
    disabled: Boolean
    title: String!
    contentIntro: String!
    content: [AlphaResourceContent!]
    category: String!
    references: [String]
    tags: [String]
    resourceRouteParam: String!
    isPageConstructor: Boolean!
  }
  type AlphaResourceTableHeader {
    text: String
    align: String
    sortable: Boolean
    value: String
  }
  type AlphaResourceTableItem {
    header1: String
    header2: String
    header3: String
    header4: String
    header5: String
    header6: String
    header7: String
    header8: String
    header9: String
    header10: String
    header11: String
    header12: String
    header13: String
    header14: String
    header15: String
    header16: String
    header17: String
    header18: String
    header19: String
    header20: String
    header21: String
    header22: String
    header23: String
    header24: String
    header25: String
    header26: String
    header27: String
    header28: String
    header29: String
    header30: String
  }

  input AlphaResourceTableHeaderInput {
    text: String
    align: String
    sortable: Boolean
    value: String
  }
  input AlphaResourceTableItemInput {
    header1: String
    header2: String
    header3: String
    header4: String
    header5: String
    header6: String
    header7: String
    header8: String
    header9: String
    header10: String
    header11: String
    header12: String
    header13: String
    header14: String
    header15: String
    header16: String
    header17: String
    header18: String
    header19: String
    header20: String
    header21: String
    header22: String
    header23: String
    header24: String
    header25: String
    header26: String
    header27: String
    header28: String
    header29: String
    header30: String
  }
  type AlphaResourceTable {
    tableRequired: Boolean
    tableDescription: String
    tableHeaders: [AlphaResourceTableHeader!]
    tableItems: [AlphaResourceTableItem!]
  }

  input AlphaResourceTableInput {
    tableRequired: Boolean
    tableDescription: String
    tableHeaders: [AlphaResourceTableHeaderInput]
    tableItems: [AlphaResourceTableItemInput]
  }

  input AlphaResourceInput {
    title: String!
    isPageConstructor: Boolean!
    contentIntro: String!
    category: String!
    type: String!
    references: [String]
    tags: [String]
    published: Boolean
    disabled: Boolean
  }
  input AlphaResourceContentInput {
    contentDetail: String
    imageRequired: Boolean!
    filename: String
    imageLink: String
    imageOnLeft: Boolean
    contentTable: AlphaResourceTableInput
  }

  type Query {
    alphaResources: [AlphaResourceMinimal!]!
    constructorAlphaResources: [AlphaResourceMinimal!]!
    singleAlphaResource(
      alphaResourceId: ID
      resourceRouteParam: String
    ): AlphaResource!
    singleConstructorAlphaResource(
      alphaResourceId: ID
      resourceRouteParam: String
    ): AlphaResource!
  }

  type Mutation {
    addAlphaResourceData(
      alphaResourceContentInput: [AlphaResourceContentInput!]
      alphaResourceInput: AlphaResourceInput!
    ): AlphaResource!
    updateAlphaResourceData(
      alphaResourceId: ID!
      alphaResourceContentInput: [AlphaResourceContentInput!]
      alphaResourceInput: AlphaResourceInput!
    ): AlphaResource!
    deleteAlphaResourceData(alphaResourceId: ID!): Message!
    disableAlphaResourceData(alphaResourceId: ID!): Message!
    publishAlphaResourceData(alphaResourceId: ID!): Message!
    deleteAlphaResourceImage(
      alphaResourceId: ID!
      contentIndexInput: Int!
      imageFilenameInput: String!
    ): Message!
    addNewFieldsAlphaResource: Message!
  }
`;

module.exports = { alphaResourceTypeDefs };
