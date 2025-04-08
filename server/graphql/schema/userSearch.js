const { gql } = require("apollo-server-express");

const userSearchTypeDefs = gql`
  type ItemSearchMinimal {
    _id: ID!
    name: String!
    description: String
    routeParam: String!
    defaultImage: String
    category: String
  }

  input SearchInput {
    searchText: String!
  }

  input SearchRegisterInput {
    searchText: String!
    context: String!
  }

  type SearchSpec {
    specName: String
    minValue: Float
    maxValue: Float
    specValueType: String
    specOptions: [String]
    specUnit: String
    count: Int
  }

  type ItemSearchResults {
    items: [ItemMinimal!]!
    categories: [String!]!
    sizes: [String]
    colors: [String]
    specs: [SearchSpec!]!
    totalItems: Int!
  }

  input AdvancedSearchInput {
    searchText: String
    specs: [SpecInput]
    categories: [String]
    colors: [String]
    sizes: [String]
    page: Int
    price: PriceInput
  }

  input SpecInput {
    specName: String!
    specOptions: [String]
    minValue: Int
    maxValue: Int
    userMinValue: Float
    userMaxValue: Float
    userSelectedOptions: [String]
    specValueType: String!
    specUnit: String
  }

  input PriceInput {
    minPrice: Float!
    maxPrice: Float!
    isAscendingOrder: Boolean!
  }

  type ItemAdvancedSearchResults {
    items: [ItemMinimal!]!
    totalItems: Int!
  }

  type Query {
    getItemSearchResults(searchInput: SearchInput!): ItemSearchResults
    getItemAdvancedSearchResults(
      searchInput: AdvancedSearchInput!
    ): ItemAdvancedSearchResults
  }

  type Mutation {
    registerSearch(searchRegisterInput: SearchRegisterInput!): Boolean
  }
`;

module.exports = { userSearchTypeDefs };
