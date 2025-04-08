const { gql } = require("apollo-server-express");

const supplierTypeDefs = gql`
  type Supplier {
    _id: ID!
    name: String!
    address: ID!
    items: [Item]
    orders: [Order]
    user: ID!
  }
  input SupplierInput {
    name: String!
    address: ID!
  }
  type Query {
    suppliers: [Supplier!]!
    singleSupplier: Supplier!
  }

  type Mutation {
    addSupplierData(supplierInput: SupplierInput!): Supplier!
    updateSupplierData(
      supplierId: ID!
      supplierInput: SupplierInput!
    ): Supplier!
    addNewFieldsSupplier: Message!
  }
`;

module.exports = { supplierTypeDefs };
