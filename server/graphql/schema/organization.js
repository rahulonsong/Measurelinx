const { gql } = require("apollo-server-express");

const organizationTypeDefs = gql`
  type Organization {
    _id: ID!
    organizationName: String!
    # ext: String!
    # firstName: String!
    # lastName: String!
    # logoImageURL: String!
    user: User!
  }
  input OrganizationInput {
    organizationName: String!
    # ext: String!
    # firstName: String!
    # lastName: String!
    # logoImageURL: String!
  }
  type Query {
    organizations: [Organization!]!
    singleOrganization(organizationId: ID!): Organization!
  }

  type Mutation {
    addOrganizationData(organizationInput: OrganizationInput): Organization!
    updateOrganizationData(
      organizationId: ID!
      organizationInput: OrganizationInput
    ): Organization!
  }
`;

module.exports = { organizationTypeDefs };
