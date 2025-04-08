const { gql } = require("apollo-server-express");

const categoryListTypeDefs = gql`
  type CategoryList {
    _id: ID!
    categoryName: String!
    categoryList: [String!]!
  }

  input CategoryListInput {
    categoryName: String!
    categoryList: [String!]!
  }

  input CategoriesInput {
    categories: [String!]!
  }

  type Query {
    categoryLists: [CategoryList]!
    singleCategoryList(categoryName: String!): CategoryList!
  }

  type Mutation {
    addCategoryList(categoryListInput: CategoryListInput): CategoryList!
    updateCategoryList(
      categoryListId: ID!
      categoryListInput: CategoryListInput
    ): CategoryList!
    addCategories(
      categoryListId: ID!
      categoriesInput: CategoriesInput
    ): CategoryList!
    deleteCategoryList(categoryListId: ID!): Message!
  }
`;

module.exports = { categoryListTypeDefs };
