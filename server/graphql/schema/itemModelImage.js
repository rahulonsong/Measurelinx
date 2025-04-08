const { gql } = require("apollo-server-express");

const itemModelImageUploadTypeDefs = gql`
  type File {
    _id: ID!
    path: String!
    filename: String!
    mimetype: String!
    encoding: String!
  }

  scalar Upload
  type Mutation {
    uploadItemModelImage(file: Upload!): File!
  }
  type Query {
    itemModelImage(itemModelImageId: ID!): File!
  }
`;

module.exports = { itemModelImageUploadTypeDefs };
