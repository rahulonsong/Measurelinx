const { gql } = require("apollo-server-express");

const cartTypeDefs = gql`
  type CartItem {
    item: ItemElement
    quantity: Int
  }
  type ItemElement {
    _id: ID
    name: String
    defaultImage: String
    maximumOrderQuantity: Int
    price: ItemPrice
    tax: Float
    stock: ItemStock
    dealName: String
    discount: Float
    sku: String
    routeParam: String
    supplier: ID
  }
  type Cart {
    _id: ID!
    items: [CartItem]
    subTotal: Float
    promotion: Promotion
    promoCode: String
    billingAddress: ID
    shippingAddress: ID
    tax: Float
    total: Float
    currency: String
  }
  input CartInput {
    cartId: ID
    items: [quantifiedItemInput]
    subTotal: Float
    promotion: PromotionInput
    promoCode: String
    billingAddress: ID
    shippingAddress: ID
    tax: Float
    total: Float
    currency: String
    user: ID!
  }
  type Query {
    userCart: Cart!
  }
  type Mutation {
    addUpdateCartData(cartInput: CartInput!, context: String!): Cart!
    clearCartData: Message!
    addNewFieldsCart: Message!
  }
`;

module.exports = { cartTypeDefs };
