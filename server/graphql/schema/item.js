const { gql } = require("apollo-server-express");

const itemTypeDefs = gql`
  type ItemImage {
    imageRequired: Boolean!
    imageLink: String
    filename: String
  }
  type SimpleQA {
    question: String
    answer: String
  }
  input SimpleQAInput {
    question: String
    answer: String
  }
  type FeaturesDetails {
    caption: String
    description: String
  }
  input FeaturesDetailsInput {
    caption: String!
    description: String!
  }
  type ItemRatingMinimal {
    rateCount: Int
    rateAvg: Float
  }
  type ItemRating {
    rateCount: Int
    rateCount1: Int
    rateCount2: Int
    rateCount3: Int
    rateCount4: Int
    rateCount5: Int
    rateAvg: Float
    ratings: [Rating]!
  }
  input ItemImageInput {
    imageRequired: Boolean!
    imageLink: String
    filename: String
  }
  type ItemSpec {
    specName: String!
    specValueType: String
    specDescription: String
    specUnit: String
    specValue: Float
    specText: String
    specValueSelect: Float
    specTextSelect: String
    specValueOptions: [Float]
    specTextOptions: [String]
  }
  type ItemPrice {
    value: Float
    currency: String
  }
  input ItemPriceInput {
    value: Float
    currency: String
  }
  input ItemSpecInput {
    specName: String!
    specDescription: String
    specValueType: String
    specUnit: String
    specValue: Float
    specText: String
    specValueSelect: Float
    specTextSelect: String
    specValueOptions: [Float]
    specTextOptions: [String]
  }
  input ItemCategoryInput {
    itemCategoryName: String!
  }
  type ItemMinimal {
    _id: ID!
    name: String!
    routeParam: String!
    discount: Float!
    maximumOrderQuantity: Int!
    tax: Float
    defaultImage: String
    price: ItemPrice
    category: String
    subCategory: String
    group: String
    rating: ItemRatingMinimal
    dealName: String
    stock: ItemStock
  }
  type ItemPage {
    items: [ItemMinimal!]!
    totalItems: Int!
  }
  type ItemStock {
    runningLow: Boolean
    outOfStock: Boolean
    quantity: Int
  }
  type Item {
    _id: ID!
    name: String!
    description: String
    defaultImage: String
    category: String!
    subCategory: String
    group: String
    price: ItemPrice
    stock: ItemStock
    maximumOrderQuantity: Int!
    tax: Float
    discount: Float
    sku: String!
    model: ID!
    tags: [String]!
    routeParam: String!
    images: [ItemImage]
    specs: [ItemSpec]!
    featuresDetails: [FeaturesDetails]!
    additionalInfo: String
    customerQuestions: [SimpleQA]!
    rating: ItemRating
    reviews: [Review]!
    supplier: ID
    viewsCount: Int
    historicalOrderCount: Int
    dealName: String
    color: String
    colorOptions: [String]
    size: String
    isSizeApplicable: Boolean
    isColorApplicable: Boolean
    length: Float!
    width: Float!
    height: Float!
    weight: Float!
    disabled: Boolean
    published: Boolean
  }
  input ItemInput {
    name: String!
    description: String
    defaultImage: String
    category: String!
    maximumOrderQuantity: Int!
    price: ItemPriceInput
    tax: Float
    stock: Int!
    discount: Float
    model: ID!
    tags: [String!]
    images: [ItemImageInput]
    specs: [ItemSpecInput]!
    featuresDetails: [FeaturesDetailsInput]!
    additionalInfo: String
    supplier: ID!
    color: String
    size: String
    isSizeApplicable: Boolean
    isColorApplicable: Boolean
    length: Float!
    width: Float!
    height: Float!
    weight: Float!
    disabled: Boolean
    published: Boolean
  }
  type Query {
    items: [ItemMinimal!]!
    singleItem(itemId: ID!): Item!
    getDealItems: [ItemMinimal!]!
    getAllDealItems: [ItemMinimal!]!
    getAllCategoryItems(itemCategoryInput: ItemCategoryInput!): [ItemMinimal!]!
    getSingleCategoryGroupItems(
      itemPageDetailsInput: ItemPageDetailsInput
    ): ItemPage!
  }

  type Mutation {
    addItemData(itemInput: ItemInput!): ItemMinimal!
    updateItemData(itemId: ID!, itemInput: ItemInput!): ItemMinimal!
    deleteItemData(itemId: ID!): Message!
    disableItemData(itemId: ID!): Message!
    publishItemData(itemId: ID!): Message!
    deleteItemImage(itemId: ID, imageFilenameInput: String!): Message!
    addNewFieldsSupplier: Message!
    addNewFieldsItem: Message!
  }
`;

module.exports = { itemTypeDefs };
