const { gql } = require("apollo-server-express");

const pairedStringListTypeDefs = gql`
  type PairedStringList {
    _id: ID!
    pairedStringListName: String!
    pairedStringList: [pairedString!]!
  }
  type pairedString {
    key: String!
    stringValue: String!
  }

  input PairedStringListInput {
    pairedStringListName: String!
    pairedStringList: [PairedStringInput!]!
  }
  input PairedStringsInput {
    pairedStrings: [PairedStringInput!]!
  }

  input PairedStringInput {
    key: String!
    stringValue: String!
  }

  type Query {
    pairedStringLists: [PairedStringList]!
    singlePairedStringList(pairedStringListName: String!): PairedStringList!
  }

  type Mutation {
    addPairedStringList(
      pairedStringListInput: PairedStringListInput
    ): PairedStringList!
    updatePairedStringList(
      pairedStringListId: ID!
      pairedStringListInput: PairedStringListInput
    ): PairedStringList!
    addPairedStrings(
      pairedStringListId: ID!
      pairedStringsInput: PairedStringsInput
    ): PairedStringList!
    deletePairedStringList(pairedStringListId: ID!): Message!
  }
`;

module.exports = { pairedStringListTypeDefs };
