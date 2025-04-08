const { gql } = require("apollo-server-express");

const userTypeDefs = gql`
  type User {
    _id: ID!
    email: String!
    firstName: String!
    lastName: String!
    verified: Boolean!
    googleId: String
    facebookId: String
    cellNumber: CellNumber
    password: String
    avatar: String
    defaultAddress: Address
    addresses: [Address]
    cart: Cart
    wishList: [ItemMinimal]
    favorites: [ItemMinimal]
    savedItems: [ItemMinimal]
    viewedItems: [ViewedItem]
    orderedItems: [OrderedItem]
    orders: [Order]!
    paymentMethods: [PaymentMethod]
    ratings: [Rating]!
    reviews: [Review]!
    isPrimeMember: Boolean!
    resourceCreator: Boolean!
    admin: Boolean!
    masterAdmin: Boolean!
    isOnTrial: Boolean
    trialExpiryDaysNumber: Int
    maximumFreeExecutions: Int
    maximumFreeProjects: Int
    anadezMainExecutions: Int
    trialStartDate: String
    numberOfTrialsOffered: Int
    questionAnswers: QuestionAnswer
    organization: Organization
    logo: File
    subscription: Subscription
    isDarkTheme: Boolean
    numberOfOrderPages: Int
  }

  type QuestionAnswer {
    question: String!
    answers: [qAnswer!]
  }

  type Subscription {
    subscribed: Boolean
    userUnsubscribed: Boolean
  }

  type qAnswer {
    answer: String!
    user: User!
    timeStamp: String!
  }

  type ViewedItem {
    item: ItemMinimal
    viewedDate: String
  }

  type OrderedItem {
    item: ItemMinimal
    orderDate: String
  }

  type CellNumber {
    countryCode: String
    number: String
    verified: Boolean
  }

  input CellNumberInput {
    countryCode: String
    number: String
    context: String
  }

  type PhoneOtpOutput {
    message: String!
    loginData: LoginData
  }

  type AuthData {
    # userId: ID!
    # email: String!
    user: User!
    token: String!
    tokenExpiration: Int!
  }

  type LoginData {
    userId: ID
    user: User
    token: String
    tokenExpiration: Int
    message: String
  }

  type AppEnvData {
    currentSale: String
    saleImages: [File]
    siteWideDiscount: Float
    dealExpiry: String
  }

  type UserInfoData {
    user: User!
  }

  type UserIdData {
    userId: String!
  }

  type ResetPasswordOutput {
    isVerified: Boolean!
    userId: String!
  }

  input ResetPasswordInput {
    newPassword: String!
    userId: String!
  }

  input UserOtpInput {
    userId: ID
    otp: String!
    context: String
    cellNumber: String
  }

  input ResetPasswordOtpInput {
    email: String!
    otp: String!
  }

  input SendOtpInput {
    userId: String
    email: String
    context: String!
  }

  input UserInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    subscribedToNewsletter: Boolean
  }

  input UserUpdateInput {
    email: String!
    oldPassword: String
    newPassword: String
    firstName: String!
    lastName: String!
  }

  input QuestionAnswerInput {
    question: String
    answers: qAnswerInput
  }

  input qAnswerInput {
    answer: String
    user: ID
    timeStamp: String
  }

  input UserInfoUpdateInput {
    avatar: String
    defaultAddress: AddressInput
    addresses: [AddressInput]
    cart: CartInput
    wishList: [ID]
    favorites: [ID]
    savedItems: [ID]
    orders: [OrderInput]
    paymentMethods: [PaymentMethodInput]
    ratings: [RatingInput]
    reviews: [ReviewInput]
    isPrimeMember: Boolean
    resourceCreator: Boolean
    admin: Boolean
    masterAdmin: Boolean
    isOnTrial: Boolean
    trialExpiryDaysNumber: Int
    maximumFreeExecutions: Int
    maximumFreeProjects: Int
    anadezMainExecutions: Int
    trialStartDate: String
    numberOfTrialsOffered: Int
    questionAnswers: [QuestionAnswerInput]
    organization: OrganizationInput
    logo: Upload
  }

  input UserPropertiesInput {
    isDarkTheme: Boolean
  }

  # Input for OAuth authentication (Google & Facebook)
  input AuthProviderInput {
    provider: String! # "google" or "facebook"
    providerId: String!
    email: String!
    firstName: String
    lastName: String
    avatar: String
  }

  type Query {
    login(email: String!, password: String!): LoginData
    # users: [User!]!
    getCurrentUser: User!
    getAppEnv: AppEnvData!
    # OAuth Login Mutations
  }

  type Mutation {
    createUser(userInput: UserInput!): UserIdData!
    verifyUser(userOtpInput: UserOtpInput): AuthData!
    verifyUserForPasswordReset(
      resetPasswordOtpInput: ResetPasswordOtpInput
    ): ResetPasswordOutput!
    resetPassword(resetPasswordInput: ResetPasswordInput!): AuthData!
    sendOtp(sendOtpInput: SendOtpInput): Message
    sendPhoneOtp(cellNumberInput: CellNumberInput): Message!
    verifyUserPhone(userOtpInput: UserOtpInput): PhoneOtpOutput
    updateUser(userUpdateInput: UserUpdateInput!): AuthData!
    updateUserInfo(userInfoUpdateInput: UserInfoUpdateInput!): UserInfoData!
    updateUserProperties(userPropertiesInput: UserPropertiesInput): Message
    addNewFieldsUser: Message!
    updateItemArrayData(
      itemId: ID!
      operation: String!
      arrayType: String!
    ): Message!
    deleteUserAccount(userId: ID!): Message! #Deletes user account
  }

  type Subscription {
    userAdded: User
  }
`;

module.exports = { userTypeDefs };
