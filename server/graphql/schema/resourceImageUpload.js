const { gql } = require("apollo-server-express");

const resourceImageUploadTypeDefs = gql`
  type File {
    _id: ID!
    path: String!
    filename: String!
    mimetype: String!
    encoding: String!
    user: User!
  }

  scalar Upload
  type Mutation {
    uploadResourceImage(file: Upload!): File!
  }
  type Query {
    resourceImage(resourceImageId: ID!): File!
  }
`;

module.exports = { resourceImageUploadTypeDefs };
