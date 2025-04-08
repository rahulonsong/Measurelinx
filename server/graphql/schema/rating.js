const { gql } = require("apollo-server-express");

const ratingTypeDefs = gql`
  type Rating {
    _id: ID!
    value: Int!
    item: ID!
  }
  input RatingInput {
    value: Int!
    item: ID!
  }
  type Query {
    ratingsByUser: [Rating!]!
    ratingsByItem(itemId: ID!): [Rating!]!
    singleRating(ratingId: ID!): Rating!
  }
  type Mutation {
    addRatingData(ratingInput: RatingInput!): Rating!
    updateRatingData(ratingId: ID!, ratingInput: RatingInput!): Rating!
  }
`;

module.exports = { ratingTypeDefs };
