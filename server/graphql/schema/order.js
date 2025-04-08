const { gql } = require("apollo-server-express");

const orderTypeDefs = gql`
  type quantifiedItem {
    item: ID!
    quantity: Int!
  }

  type quantifiedItemDetail {
    item: ItemMinimal!
    quantity: Int!
    returned: Boolean
    returnedQuantity: Int
    returnStatus: String
    returnInitiated: Boolean
    refundProcessed: Boolean
    refundAmount: Float
    refundDate: String
    refundSessionStatus: String
  }

  input quantifiedItemInput {
    item: ID!
    quantity: Int!
  }

  type Promotion {
    isPercentage: Boolean
    value: Float
  }

  type ReturnItemDetail {
    itemId: ID!
    quantity: Int!
    reason: String!
    comment: String
    refundStatus: String
    refundAmount: Float
    refundDate: String
  }

  type RefundSessionItem {
    itemId: ID!
    quantity: Int!
    amount: Float!
  }

  type RefundSession {
    refundId: String
    refundDate: String
    refundAmount: Float!
    paymentIntentId: String
    items: [RefundSessionItem!]!
    status: String!
    returnStatus: String
    refundProcessed: Boolean
    returnInitiatedDate: String
  }

  type ReturnDetails {
    returnInitiatedDate: String!
    items: [ReturnItemDetail!]!
    returnCharges: Float
    refundAmount: Float
    returnStatus: String!
    refundProcessed: Boolean
    refundDate: String
    returnLabelUrl: String
    returnLabelUrls: [String]
    refundSessions: [RefundSession]
    totalRefundAmount: Float
  }

  type Order {
    _id: ID!
    orderNumber: String!
    deliveryEstimate: Int!
    items: [quantifiedItemDetail!]!
    subTotal: Float!
    promotion: Promotion
    orderDate: String!
    billingAddress: Address!
    shippingAddress: Address!
    transactionId: String
    tax: Float!
    orderValue: Float!
    orderCurrency: String!
    orderStatus: String!
    orderComplete: Boolean
    canceled: Boolean!
    trackingNumber: String
    returnLabelUrl: String
    returnLabelUrls: [String]
    returnDetails: ReturnDetails # This is now returnDetails instead of returnProcess
  }

  input PromotionInput {
    isPercentage: Boolean
    value: Float
  }

  input OrderInput {
    items: [quantifiedItemInput!]!
    subTotal: Float
    promotion: PromotionInput
    promoCode: String
    billingAddress: ID!
    shippingAddress: ID!
  }

  input updateOrderInput {
    _id: ID!
    orderStatus: String
    trackingNumber: String
  }

  input ReturnRefundInput {
    itemId: ID!
    quantity: Int!
    amount: Float!
  }

  type Url {
    url: String!
  }

  type RazorPayTheme {
    color: String
  }

  type RazorPay {
    order_id: String!
    key: String!
    image: String!
    amount: Float!
    currency: String!
    name: String!
    theme: RazorPayTheme
  }

  type OrderWithPagination {
    orders: [Order]!
    numberOfOrderPages: Int!
  }

  type Query {
    ordersByUser(
      page: Int
      year: Int
      searchQuery: String
      sortOrder: String
    ): OrderWithPagination!
    singleOrder(orderId: ID!): Order!
    ordersByAdmin: [Order]!
  }

  type Mutation {
    generateStripePaymentUrlData(orderInput: OrderInput!): Url!
    generateRazorPaymentUrlData(orderInput: OrderInput!): RazorPay!
    addOrderData(orderInput: OrderInput!): Order!
    cancelOrder(orderId: ID!): Message!
    updateMultipleOrders(orderInput: [updateOrderInput]!): Message!
    addNewFieldsOrder: Message!
    processReturnRefund(
      orderId: ID!
      paymentIntentId: String!
      amount: Float!
      items: [ReturnRefundInput!]!
    ): Message!
  }
`;

module.exports = { orderTypeDefs };
