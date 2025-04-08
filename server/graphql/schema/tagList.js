const { gql } = require("apollo-server-express");

const tagListTypeDefs = gql`
  type TagList {
    _id: ID!
    listName: String!
    tagList: [String!]!
  }

  input TagListInput {
    listName: String!
    tagList: [String!]!
  }

  input TagsInput {
    tags: [String!]!
  }

  type Query {
    tagLists: [TagList]!
    singleTagList(tagListId: ID!): TagList!
  }

  type Mutation {
    addTagList(tagListInput: TagListInput): TagList!
    updateTagList(tagListId: ID!, tagListInput: TagListInput): TagList!
    addTags(tagListId: ID!, tagsInput: TagsInput): TagList!
    deleteTagList(tagListId: ID!): Message!
  }
`;

module.exports = { tagListTypeDefs };
