import { gql } from 'graphql-tag';
import { PageCreatorFields, ColumnFields, UserFields } from './fragments';
const resource = {
  // Upload Resource image Mutation
  UPLOAD_RESOURCE_IMAGE: gql`
    mutation uploadResourceImage($file: Upload!) {
      uploadResourceImage(file: $file) {
        _id
        path
        filename
        mimetype
      }
    }
  `,
  // ADD alpha resource
  ADD_ALPHA_RESOURCE: gql`
    mutation (
      $alphaResourceContentInput: [AlphaResourceContentInput!]
      $alphaResourceInput: AlphaResourceInput!
    ) {
      addAlphaResourceData(
        alphaResourceContentInput: $alphaResourceContentInput
        alphaResourceInput: $alphaResourceInput
      ) {
        _id
        title
        category
        resourceRouteParam
      }
    }
  `,
  // Update alpha resource
  UPDATE_ALPHA_RESOURCE: gql`
    mutation (
      $alphaResourceId: ID!
      $alphaResourceContentInput: [AlphaResourceContentInput!]
      $alphaResourceInput: AlphaResourceInput!
    ) {
      updateAlphaResourceData(
        alphaResourceId: $alphaResourceId
        alphaResourceContentInput: $alphaResourceContentInput
        alphaResourceInput: $alphaResourceInput
      ) {
        _id
        title
        category
        resourceRouteParam
      }
    }
  `,
  // DELETE alpah resource
  DELETE_ALPHA_RESOURCE: gql`
    mutation ($alphaResourceId: ID!) {
      deleteAlphaResourceData(alphaResourceId: $alphaResourceId) {
        message
      }
    }
  `,
  // DISABLE alpah resource
  DISABLE_ALPHA_RESOURCE: gql`
    mutation ($alphaResourceId: ID!) {
      disableAlphaResourceData(alphaResourceId: $alphaResourceId) {
        message
      }
    }
  `,
  // DELETE alpah resource content Image
  DELETE_ALPHA_RESOURCE_IMAGE: gql`
    mutation (
      $alphaResourceId: ID!
      $contentIndexInput: Int!
      $imageFilenameInput: String!
    ) {
      deleteAlphaResourceImage(
        alphaResourceId: $alphaResourceId
        contentIndexInput: $contentIndexInput
        imageFilenameInput: $imageFilenameInput
      ) {
        message
      }
    }
  `,
};
const common = {
  ADD_MENU: gql`
    mutation ($menuInput: MenuInput!) {
      addMenu(menuInput: $menuInput) {
        _id
        name
        description
        menuType
        position
        isSideMenu
        isTopMenu
        isBottomMenu
        disabled
        published
        routeParam
        subMenus {
          name
          routeParam
          subTitles {
            name
            routeParam
          }
        }
      }
    }
  `,
  UPDATE_MENU: gql`
    mutation ($id: ID!, $menuInput: MenuInput!) {
      updateMenu(id: $id, menuInput: $menuInput) {
        _id
        name
        menuType
        description
        position
        isSideMenu
        isTopMenu
        isBottomMenu
        disabled
        published
        routeParam
        subMenus {
          name
          routeParam
          subTitles {
            name
            routeParam
          }
        }
      }
    }
  `,
  DELETE_MENU: gql`
    mutation ($id: ID!) {
      deleteMenu(id: $id) {
        message
      }
    }
  `,
};
const page = {
  // Create page creator
  ADD_PAGE_CREATOR: gql`
    mutation ($pageCreatorInput: PageCreatorInput!) {
      addPageCreator(pageCreatorInput: $pageCreatorInput) {
        ...PageCreatorFields
        pageRows {
          rowType
          numberOfCols
          col1 {
            ...ColumnFields
          }
          col2 {
            ...ColumnFields
          }
          col3 {
            ...ColumnFields
          }
        }
      }
    }
    ${PageCreatorFields}
    ${ColumnFields}
  `,
  // update page creator
  UPDATE_PAGE_CREATOR: gql`
    mutation ($pageCreatorInput: PageCreatorInput!, $id: ID!) {
      updatePageCreator(pageCreatorInput: $pageCreatorInput, id: $id) {
        ...PageCreatorFields
        pageRows {
          rowType
          numberOfCols
          col1 {
            ...ColumnFields
          }
          col2 {
            ...ColumnFields
          }
          col3 {
            ...ColumnFields
          }
        }
      }
    }
    ${PageCreatorFields}
    ${ColumnFields}
  `,
  // DELETE page creator
  DELETE_PAGE_CREATOR: gql`
    mutation ($id: ID!) {
      deletePageCreator(id: $id) {
        message
      }
    }
  `,
  // Disable page Creator
  DISABLE_PAGE_CREATOR: gql`
    mutation DisablePageCreator($id: ID!) {
      disablePageCreator(id: $id) {
        message
      }
    }
  `,
  // Bulk Email Mutations
  SEND_BULK_EMAIL: gql`
    mutation sendEmail($bulkEmailInput: BulkEmailInput!) {
      sendEmail(bulkEmailInput: $bulkEmailInput) {
        success
        message
      }
    }
  `,
};
const bom = {
  // ADD itemModel
  ADD_ITEM_MODEL: gql`
    mutation ($itemModelInput: ItemModelInput!) {
      addItemModelData(itemModelInput: $itemModelInput) {
        _id
        name
        routeParam
      }
    }
  `,
  // Update itemModel
  UPDATE_ITEM_MODEL: gql`
    mutation ($itemModelId: ID!, $itemModelInput: ItemModelInput!) {
      updateItemModelData(
        itemModelId: $itemModelId
        itemModelInput: $itemModelInput
      ) {
        _id
        name
        routeParam
      }
    }
  `,
  // DISABLE itemModel
  DISABLE_ITEM_MODEL: gql`
    mutation ($itemModelId: ID!) {
      disableItemModelData(itemModelId: $itemModelId) {
        message
      }
    }
  `,
  // DELETE ItemModelcontent Image
  DELETE_ITEM_MODEL_IMAGE: gql`
    mutation ($itemModelId: ID, $imageFilenameInput: String!) {
      deleteItemModelImage(
        itemModelId: $itemModelId
        imageFilenameInput: $imageFilenameInput
      ) {
        message
      }
    }
  `,
  // ADD itemModel
  ADD_ITEM: gql`
    mutation ($itemInput: ItemInput!) {
      addItemData(itemInput: $itemInput) {
        _id
        name
        routeParam
        defaultImage
        dealName
        maximumOrderQuantity
        price {
          value
          currency
        }
        category
        subCategory
        group
        rating {
          rateCount
          rateAvg
        }
      }
    }
  `,
  // Update itemModel
  UPDATE_ITEM: gql`
    mutation ($itemId: ID!, $itemInput: ItemInput!) {
      updateItemData(itemId: $itemId, itemInput: $itemInput) {
        _id
        name
        routeParam
        defaultImage
        dealName
        maximumOrderQuantity
        price {
          value
          currency
        }
        category
        subCategory
        group
        rating {
          rateCount
          rateAvg
        }
      }
    }
  `,
  // DISABLE itemModel
  DISABLE_ITEM: gql`
    mutation ($itemId: ID!) {
      disableItemData(itemId: $itemId) {
        message
      }
    }
  `,
  // DELETE Itemcontent Image
  DELETE_ITEM_IMAGE: gql`
    mutation ($itemId: ID, $imageFilenameInput: String!) {
      deleteItemImage(
        itemId: $itemId
        imageFilenameInput: $imageFilenameInput
      ) {
        message
      }
    }
  `,
  // Upload item model image Mutation
  UPLOAD_ITEM_MODEL_IMAGE: gql`
    mutation uploadItemModelImage($file: Upload!) {
      uploadItemModelImage(file: $file) {
        _id
        path
        filename
        mimetype
      }
    }
  `,
  // Upload item  image Mutation
  UPLOAD_ITEM_IMAGE: gql`
    mutation uploadItemImage($file: Upload!) {
      uploadItemImage(file: $file) {
        _id
        path
        filename
        mimetype
      }
    }
  `,
  // Update itemModel
  UPDATE_CART: gql`
    mutation ($cartInput: CartInput!, $context: String!) {
      addUpdateCartData(cartInput: $cartInput, context: $context) {
        _id
        items {
          item {
            _id
            name
            defaultImage
            dealName
            maximumOrderQuantity
            price {
              value
              currency
            }
            stock {
              runningLow
              outOfStock
            }
            tax
            discount
            routeParam
          }
          quantity
        }
        subTotal
        promotion {
          isPercentage
          value
        }
        promoCode
        billingAddress
        shippingAddress
        tax
        total
        currency
      }
    }
  `,
  ADD_ITEM_CATEGORY: gql`
    mutation ($categoryInput: CategoryInput!) {
      addCategory(categoryInput: $categoryInput) {
        _id
        name
        description
        categoryType
        disabled
        published
        subCategories {
          name
          subTitles {
            name
          }
        }
      }
    }
  `,
  UPDATE_ITEM_CATEGORY: gql`
    mutation ($id: ID!, $categoryInput: CategoryInput!) {
      updateCategory(id: $id, categoryInput: $categoryInput) {
        _id
        name
        description
        categoryType
        disabled
        published
        subCategories {
          name
          subTitles {
            name
          }
        }
      }
    }
  `,
  DELETE_ITEM_CATEGORY: gql`
    mutation ($id: ID!) {
      deleteCategory(id: $id) {
        message
      }
    }
  `,
  // Update multiple orders by admin
  UPDATE_MULTIPLE_ORDERS_BY_ADMIN: gql`
    mutation UpdateMultipleOrders($orderInput: [updateOrderInput]!) {
      updateMultipleOrders(orderInput: $orderInput) {
        message
      }
    }
  `,
};
const payment = {
  // generate Stripe payment url
  GENERATE_STRIPE_PAYMENT_URL: gql`
    mutation ($orderInput: OrderInput!) {
      generateStripePaymentUrlData(orderInput: $orderInput) {
        url
      }
    }
  `,
  // generate RazorPay payment url
  GENERATE_RAZOR_PAYMENT_URL: gql`
    mutation ($orderInput: OrderInput!) {
      generateRazorPaymentUrlData(orderInput: $orderInput) {
        key
        image
        order_id
        amount
        currency
        name
        theme {
          color
        }
      }
    }
  `,
  // check promo code
  CHECK_PROMO_CODE: gql`
    mutation ($checkPromoCodeInput: CheckPromoCodeInput!) {
      checkPromoCodeData(checkPromoCodeInput: $checkPromoCodeInput) {
        valid
        discountType
        discountValue
      }
    }
  `,
};
const address = {
  // ADD Address
  ADD_ADDRESS: gql`
    mutation ($addressInput: AddressInput!) {
      addAddressData(addressInput: $addressInput) {
        _id
        addresseeLast
        addresseeFirst
        category
        cityTown
        country
        line1
        line2
        phoneNumber {
          category
          countryCode
          mobileNumber
          localNumber
          areaCode
        }
        landmark
        postalCode
        stateProvince
      }
    }
  `,
  // UPDATE Address
  UPDATE_ADDRESS: gql`
    mutation ($addressId: ID!, $addressInput: AddressInput!) {
      updateAddressData(addressId: $addressId, addressInput: $addressInput) {
        _id
        addresseeLast
        addresseeFirst
        category
        cityTown
        country
        line1
        line2
        phoneNumber {
          category
          countryCode
          mobileNumber
          localNumber
          areaCode
        }
        landmark
        postalCode
        stateProvince
      }
    }
  `,
  // delete Address
  DELETE_ADDRESS: gql`
    mutation ($addressId: ID!) {
      deleteAddressData(addressId: $addressId) {
        message
      }
    }
  `,
};
const review = {
  // ADD review
  ADD_REVIEW: gql`
    mutation ($reviewInput: ReviewInput!) {
      addReviewData(reviewInput: $reviewInput) {
        _id
        caption
        text
        country
        nickName
        rating {
          value
        }
        helpful {
          count
          applied
        }
        updatedAt
      }
    }
  `,
  // UPDATE review
  UPDATE_REVIEW: gql`
    mutation ($reviewId: ID!, $reviewInput: ReviewInput!) {
      updateReviewData(reviewInput: $reviewInput, reviewId: $reviewId) {
        _id
        caption
        text
        country
        nickName
        rating {
          value
        }
        helpful {
          count
          applied
        }
        updatedAt
      }
    }
  `,
  // ADD RATING
  ADD_RATING: gql`
    mutation ($ratingInput: RatingInput!) {
      addRatingData(ratingInput: $ratingInput) {
        _id
        value
      }
    }
  `,
  // UPDATE RATING
  UPDATE_RATING: gql`
    mutation ($ratingId: ID!, $ratingInput: RatingInput!) {
      updateRatingData(ratingInput: $ratingInput, ratingId: $ratingId) {
        _id
        value
      }
    }
  `,
  // INCREMENT FOUND HELPFUL
  INCREMENT_FOUND_HELPFUL: gql`
    mutation ($reviewId: ID!) {
      incrementFoundHelpful(reviewId: $reviewId) {
        message
      }
    }
  `,
};
// Use, Organizations, Logo Muations
const user = {
  // User mutations
  SIGNUP_USER: gql`
    mutation ($userInput: UserInput!) {
      createUser(userInput: $userInput) {
        userId
      }
    }
  `,
  // // social Login
  // OAUTH_SIGN_IN: gql`
  //   ${UserFields}
  //   mutation OAuthSignIn($authProviderInput: AuthProviderInput!) {
  //     oauthSignIn(authProviderInput: $authProviderInput) {
  //       user {
  //         ...UserFields
  //       }
  //       token
  //     }
  //   }
  // `,

  // verifying a user
  VERIFY_USER: gql`
    ${UserFields}
    mutation ($userOtpInput: UserOtpInput!) {
      verifyUser(userOtpInput: $userOtpInput) {
        user {
          ...UserFields
        }
        token
        tokenExpiration
      }
    }
  `,

  VERIFY_USER_PASSWORD_RESET: gql`
    mutation ($resetPasswordOtpInput: ResetPasswordOtpInput!) {
      verifyUserForPasswordReset(
        resetPasswordOtpInput: $resetPasswordOtpInput
      ) {
        isVerified
        userId
      }
    }
  `,
  // verifying a user
  RESET_PASSWORD: gql`
    ${UserFields}
    mutation ($resetPasswordInput: ResetPasswordInput!) {
      resetPassword(resetPasswordInput: $resetPasswordInput) {
        user {
          ...UserFields
        }
        token
        tokenExpiration
      }
    }
  `,
  // Sending OTP
  SEND_OTP: gql`
    mutation ($sendOtpInput: SendOtpInput!) {
      sendOtp(sendOtpInput: $sendOtpInput) {
        message
      }
    }
  `,
  // Sending phone OTP
  SEND_PHONE_OTP: gql`
    mutation ($cellNumberInput: CellNumberInput!) {
      sendPhoneOtp(cellNumberInput: $cellNumberInput) {
        message
      }
    }
  `,
  // verifying phone number for user
  VERIFY_USER_PHONE: gql`
    ${UserFields}
    mutation ($userOtpInput: UserOtpInput!) {
      verifyUserPhone(userOtpInput: $userOtpInput) {
        message
        loginData {
          userId
          token
          tokenExpiration
          user {
            ...UserFields
          }
        }
      }
    }
  `,

  // Updating User
  UPDATE_USER: gql`
    ${UserFields}
    mutation ($userUpdateInput: UserUpdateInput!) {
      updateUser(userUpdateInput: $userUpdateInput) {
        user {
          ...UserFields
        }
        token
        tokenExpiration
      }
    }
  `,
  // Updating User properties
  UPDATE_USER_PROPERTIES: gql`
    mutation ($userPropertiesInput: UserPropertiesInput!) {
      updateUserProperties(userPropertiesInput: $userPropertiesInput) {
        message
      }
    }
  `,
  // SUBSCRIBE USER Mutations
  SUBSCRIBE_USER: gql`
    mutation AddSubscriberData($subscriberInput: SubscriberInput!) {
      addSubscriberData(subscriberInput: $subscriberInput) {
        message
      }
    }
  `,
  // SUBSCRIBE USER Mutations
  UNSUBSCRIBE_USER: gql`
    mutation UpdateSubscriberData($subscriberEmail: String!) {
      updateSubscriberData(subscriberEmail: $subscriberEmail) {
        message
      }
    }
  `,
  // Organization Mutations
  ADD_ORGANIZATION: gql`
    mutation ($organizationInput: OrganizationInput!) {
      addOrganizationData(organizationInput: $organizationInput) {
        _id
        organizationName
      }
    }
  `,
  // Update User item Array
  UPDATE_ITEM_ARRAY: gql`
    mutation ($itemId: ID!, $operation: String!, $arrayType: String!) {
      updateItemArrayData(
        itemId: $itemId
        operation: $operation
        arrayType: $arrayType
      ) {
        message
      }
    }
  `,
  // Update Organization
  UPDATE_ORGANIZATION: gql`
    mutation ($organizationId: ID!, $organizationInput: OrganizationInput!) {
      updateOrganizationData(
        organizationId: $organizationId
        organizationInput: $organizationInput
      ) {
        _id
        organizationName
      }
    }
  `,
  // Upload File Mutation
  UPLOAD_LOGO: gql`
    mutation uploadLogo($file: Upload!) {
      uploadLogo(file: $file) {
        _id
        path
        filename
        mimetype
        user {
          _id
        }
      }
    }
  `,
  SUBMIT_CONTACT_REQUEST: gql`
    mutation ($contactFormInput: ContactFormInput!) {
      addContactFormSubmission(contactFormInput: $contactFormInput) {
        refNumber
        user
      }
    }
  `,
  DELETE_USER_ACCOUNT: gql`
    mutation DeleteUserAccount($userId: ID!) {
      deleteUserAccount(userId: $userId) {
        message
      }
    }
  `,
};
// COnsolidating Mutations
const gqlMutations = {
  ...resource,
  ...common,
  ...bom,
  ...payment,
  ...address,
  ...review,
  ...user,
  ...page,
};

export { gqlMutations };
