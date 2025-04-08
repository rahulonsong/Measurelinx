const { gql } = require("apollo-server-express");

const bulkEmailTypeDefs = gql`
  type BulkEmail {
    _id: ID!
    sender: String!
    pageId: String!
    htmlContent: String!
    emailGroup: String!
    createdAt: String!
    updatedAt: String!
  }

  input BulkEmailInput {
    sender: String!
    pageId: String!
    htmlContent: String!
    emailGroup: String!
  }

  type Query {
    bulkEmails: [BulkEmail!]!
    singleBulkEmail(id: ID!): BulkEmail!
  }

  type Mutation {
    sendEmail(bulkEmailInput: BulkEmailInput!): Response!
  }

  type Response {
    success: Boolean!
    message: String
  }
`;

module.exports = { bulkEmailTypeDefs };
