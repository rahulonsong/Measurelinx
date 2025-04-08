const { gql } = require("apollo-server-express");

const paymentTypeDefs = gql`
  type Payment {
    _id: ID!
    amount: Float!
    currency: String!
    transactionId: String!
    date: String!
    orderId: ID!
    # paymentMethod: ID
    status: String!
  }
  input PaymentInput {
    amount: Float!
    currency: String!
    date: String!
    # paymentMethod: ID
    # number: String
    # exp_month: Int
    # exp_year: Int
    # cvc: String
    # name: String
    # savePaymentMethod: Boolean
  }
  input paymentUpdateInput {
    date: String!
    paymentMethod: ID!
    status: String!
  }
  type Query {
    paymentsByUser: [Payment!]!
    singlePayment(paymentId: ID!): Payment!
  }
  type Mutation {
    processOrderAndPayment(
      paymentInput: PaymentInput!
      orderInput: OrderInput!
    ): Order!
    updatePaymentData(
      paymentId: ID!
      paymentInput: paymentUpdateInput!
    ): Payment!
  }
`;

module.exports = { paymentTypeDefs };
