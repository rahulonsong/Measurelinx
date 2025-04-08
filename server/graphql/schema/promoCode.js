const { gql } = require("apollo-server-express");

const promoCodeTypeDefs = gql`
  type PromoCode {
    id: ID!
    code: String!
    discountType: String!
    discountValue: Float!
    validFrom: String!
    validTo: String!
    maxRedemptions: Int
    redeemed: Int
    createdAt: String!
  }
  type CheckPromoCodeResult {
    valid: Boolean!
    discountType: String!
    discountValue: Float!
  }

  input PromoCodeInput {
    code: String!
    discountType: String!
    discountValue: Float!
    validFrom: String!
    validTo: String!
    maxRedemptions: Int
  }

  input CheckPromoCodeInput {
    promoCode: String!
  }
  type Query {
    promoCodes: [PromoCode]
    singlePromoCode(promoCodeId: ID!): PromoCode
  }

  type Mutation {
    checkPromoCodeData(
      checkPromoCodeInput: CheckPromoCodeInput!
    ): CheckPromoCodeResult!
    addPromoCodeData(promoCodeInput: PromoCodeInput!): PromoCode
    updatePromoCodeData(
      promoCodeId: ID!
      promoCodeInput: PromoCodeInput
    ): PromoCode!
    deletePromoCodeData(promoCodeId: ID!): Message
  }
`;

module.exports = { promoCodeTypeDefs };
