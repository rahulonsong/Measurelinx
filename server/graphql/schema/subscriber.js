const { gql } = require("apollo-server-express");

const subscriberTypeDefs = gql`
  type Subscriber {
    _id: ID!
    firstName: String
    lastName: String
    email: String!
    reasonForUnsubscribing: String
  }
  input SubscriberInput {
    firstName: String
    lastName: String
    email: String!
  }
  type Query {
    subscribers: [Subscriber!]!
    singleSubscriber(subscriberId: ID!): Subscriber!
  }
  type Mutation {
    addSubscriberData(subscriberInput: SubscriberInput!): Message!
    updateSubscriberData(
      subscriberEmail: String!
      reasonForUnsubscribing: String
    ): Message!
  }
`;

module.exports = { subscriberTypeDefs };
