const { gql } = require("apollo-server-express");

const categoryTypeDefs = gql`
  type Category {
    _id: ID!
    name: String!
    description: String
    disabled: Boolean!
    published: Boolean!
    categoryType: String!
    subCategories: [SubCategory]
  }

  type SubCategory {
    name: String!
    subTitles: [SubTitle]
  }

  type SubTitle {
    name: String!
  }

  input CategoryInput {
    name: String!
    description: String
    disabled: Boolean!
    published: Boolean!
    categoryType: String!
    subCategories: [SubCategoryInput]
  }

  input SubCategoryInput {
    name: String!
    subTitles: [SubTitleInput]
  }

  input SubTitleInput {
    name: String!
  }

  type Query {
    categories: [Category!]!
    # singleCategoryData(routeParam: String!): Category!
  }

  type Mutation {
    addCategory(categoryInput: CategoryInput): Category!
    updateCategory(id: ID!, categoryInput: CategoryInput): Category!
    deleteCategory(id: ID!): Message!
  }
`;

module.exports = { categoryTypeDefs };
