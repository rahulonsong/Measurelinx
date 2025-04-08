const { gql } = require("apollo-server-express");

const logoUploadTypeDefs = gql`
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
    uploadLogo(file: Upload!): File!
  }
  type Query {
    logo(logoId: ID!): File!
  }
`;

module.exports = { logoUploadTypeDefs };
