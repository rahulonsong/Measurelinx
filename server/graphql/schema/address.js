const { gql } = require("apollo-server-express");

const addressTypeDefs = gql`
  type PhoneNumber {
    category: String!
    countryCode: String!
    areaCode: String
    localNumber: String
    mobileNumber: String
  }
  type Address {
    _id: ID!
    category: String
    addresseeFirst: String
    addresseeLast: String
    line1: String!
    line2: String
    landmark: String
    stateProvince: String!
    cityTown: String!
    country: String!
    postalCode: String!
    phoneNumber: PhoneNumber!
  }
  type Message {
    message: String!
  }
  input PhoneNumberInput {
    category: String!
    countryCode: String!
    areaCode: String
    localNumber: String
    mobileNumber: String
  }
  input AddressInput {
    category: String!
    addresseeFirst: String
    addresseeLast: String
    line1: String!
    line2: String
    landmark: String
    stateProvince: String!
    cityTown: String!
    country: String!
    postalCode: String!
    phoneNumber: PhoneNumberInput!
  }
  type Query {
    addressesByUser: [Address!]!
    singleAddress(addressId: ID!): Address!
  }

  type Mutation {
    addAddressData(addressInput: AddressInput!): Address!
    updateAddressData(addressId: ID!, addressInput: AddressInput!): Address!
    deleteAddressData(addressId: ID!): Message!
  }
`;

module.exports = { addressTypeDefs };
