const { gql } = require("apollo-server-express");

const paymentMethodTypeDefs = gql`
  type PaymentMethod {
    _id: ID!
    name: String!
    cardNumber: String!
    # cvv: String!
    expirationMonth: String!
    expirationYear: String!
    defaultCard: Boolean
  }
  input PaymentMethodInput {
    name: String!
    cardNumber: String!
    defaultCard: Boolean
    cvv: String
    expirationMonth: String!
    expirationYear: String!
    user: ID!
  }
  type Query {
    paymentMethodsByUser: [PaymentMethod!]!
    singlePaymentMethod(paymentMethodId: ID!): PaymentMethod!
  }
  type Mutation {
    addPaymentMethodData(
      paymentMethodInput: PaymentMethodInput!
    ): PaymentMethod!
    updatePaymentMethodData(
      paymentMethodId: ID!
      paymentMethodInput: PaymentMethodInput!
    ): PaymentMethod!
    deletePaymentMethodData(paymentMethodId: ID!): Message!
  }
`;

module.exports = { paymentMethodTypeDefs };
