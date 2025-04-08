const { gql } = require("apollo-server-express");

const contactFormTypeDefs = gql`
  type ContactFormSubmission {
    _id: ID!
    firstName: String!
    lastName: String!
    country: String!
    isdCode: String!
    phoneNumber: String!
    email: String!
    category: ContactCategory!
    contactType: ContactType!
    message: String!
  }

  type ContactFormResult {
    refNumber: String!
    user: ID
  }

  enum ContactCategory {
    Support
    Sales
    Feedback
    Other
  }

  enum ContactType {
    Request
    Feedback
  }

  input ContactFormInput {
    firstName: String!
    lastName: String!
    country: String!
    isdCode: String!
    phoneNumber: String!
    email: String!
    category: ContactCategory!
    contactType: ContactType!
    message: String!
    user: ID
  }

  type Query {
    contactFormSubmissions: [ContactFormSubmission!]!
    singleContactFormSubmission(
      contactFormSubmissionId: ID!
    ): ContactFormSubmission!
  }

  type Mutation {
    addContactFormSubmission(
      contactFormInput: ContactFormInput!
    ): ContactFormResult!
  }
`;

module.exports = { contactFormTypeDefs };
