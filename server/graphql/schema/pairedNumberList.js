const { gql } = require("apollo-server-express");

const pairedNumberListTypeDefs = gql`
  type PairedNumberList {
    _id: ID!
    pairedNumberListName: String!
    pairedNumberList: [pairedNumber!]!
  }
  type pairedNumber {
    key: String!
    numberValue: Float!
  }

  input PairedNumberListInput {
    pairedNumberListName: String!
    pairedNumberList: [PairedNumberInput!]!
  }
  input PairedNumbersInput {
    pairedNumbers: [PairedNumberInput!]!
  }

  input PairedNumberInput {
    key: String!
    numberValue: Float!
  }

  type Query {
    pairedNumberLists: [PairedNumberList]!
    singlePairedNumberList(pairedNumberListName: String!): PairedNumberList!
  }

  type Mutation {
    addPairedNumberList(
      pairedNumberListInput: PairedNumberListInput
    ): PairedNumberList!
    updatePairedNumberList(
      pairedNumberListId: ID!
      pairedNumberListInput: PairedNumberListInput
    ): PairedNumberList!
    addPairedNumbers(
      pairedNumberListId: ID!
      pairedNumbersInput: PairedNumbersInput
    ): PairedNumberList!
    deletePairedNumberList(pairedNumberListId: ID!): Message!
  }
`;

module.exports = { pairedNumberListTypeDefs };
