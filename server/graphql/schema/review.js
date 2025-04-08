const { gql } = require("apollo-server-express");

const reviewTypeDefs = gql`
  type ReviewByUser {
    _id: ID
    caption: String
    text: String
    country: String
    item: ReviewItem!
    user: User
    nickName: String
    comments: [Comment]
    rating: Rating
    helpful: Helpful
    updatedAt: String!
  }

  type ReviewItem {
    _id: ID
    name: String
    images: [ItemImage]!
  }
  type Review {
    _id: ID
    caption: String
    text: String
    country: String
    item: ID!
    user: User
    nickName: String
    comments: [Comment]
    rating: Rating
    helpful: Helpful
    updatedAt: String!
  }
  type Helpful {
    count: Int
    applied: Boolean
  }
  type Comment {
    text: String!
    user: ID!
  }
  input CommentInput {
    text: String!
    user: ID!
  }
  input ReviewInput {
    rating: ID
    caption: String
    nickName: String
    text: String
    country: String
    item: ID!
  }
  type Query {
    reviewsByUser: [ReviewByUser!]!
    reviewsByItem(itemId: ID!): [Review!]!
    singleReview(reviewId: ID!): Review!
  }
  type Mutation {
    addReviewData(reviewInput: ReviewInput!): Review!
    updateReviewData(reviewId: ID!, reviewInput: ReviewInput!): Review!
    deleteReviewData(reviewId: ID!): Message!
    incrementFoundHelpful(reviewId: ID!): Message!
  }
`;

module.exports = { reviewTypeDefs };
