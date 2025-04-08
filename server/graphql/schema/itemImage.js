const { gql } = require("apollo-server-express");

const itemImageUploadTypeDefs = gql`
  type File {
    _id: ID!
    path: String!
    filename: String!
    mimetype: String!
    encoding: String!
  }

  scalar Upload
  type Mutation {
    uploadItemImage(file: Upload!): File!
  }
  type Query {
    itemImage(itemImageId: ID!): File!
  }
`;

module.exports = { itemImageUploadTypeDefs };
