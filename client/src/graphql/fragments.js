import { gql } from 'graphql-tag';

export const UserFields = gql`
  fragment UserFields on User {
    _id
    email
    firstName
    lastName
    verified
    googleId # ✅ Added for Google Login
    facebookId # ✅ Added for Facebook Login
    cellNumber {
      countryCode
      number
      verified
    }
    resourceCreator
    admin
    masterAdmin
    avatar
    cart {
      _id
      items {
        item {
          _id
          name
          defaultImage
          dealName
          price {
            value
            currency
          }
          stock {
            runningLow
            outOfStock
            quantity
          }
          tax
          discount
          routeParam
        }
        quantity
      }
      shippingAddress
      billingAddress
      subTotal
      promotion {
        isPercentage
        value
      }
      promoCode
      subTotal
      tax
      total
      currency
    }
    defaultAddress {
      _id
      category
      addresseeFirst
      addresseeLast
      line1
      line2
      landmark
      stateProvince
      cityTown
      country
      postalCode
      phoneNumber {
        category
        countryCode
        areaCode
        localNumber
        mobileNumber
      }
    }
    wishList {
      _id
      name
      routeParam
      defaultImage
      dealName
      discount
      tax
      stock {
        runningLow
        outOfStock
        quantity
      }
      price {
        value
        currency
      }
      category
      rating {
        rateCount
        rateAvg
      }
    }
    favorites {
      _id
      name
      routeParam
      defaultImage
      dealName
      discount
      stock {
        runningLow
        outOfStock
        quantity
      }
      tax
      price {
        value
        currency
      }
      category
      rating {
        rateCount
        rateAvg
      }
    }
    savedItems {
      _id
      name
      routeParam
      defaultImage
      dealName
      discount
      stock {
        runningLow
        outOfStock
        quantity
      }
      tax
      price {
        value
        currency
      }
      category
      rating {
        rateCount
        rateAvg
      }
    }
    viewedItems {
      item {
        _id
        name
        routeParam
        defaultImage
        dealName
        discount
        stock {
          runningLow
          outOfStock
          quantity
        }
        tax
        price {
          value
          currency
        }
        category
        rating {
          rateCount
          rateAvg
        }
      }
      viewedDate
    }
    orderedItems {
      item {
        _id
        name
        routeParam
        defaultImage
        dealName
        discount
        stock {
          runningLow
          outOfStock
          quantity
        }
        tax
        price {
          value
          currency
        }
        category
        rating {
          rateCount
          rateAvg
        }
      }
      orderDate
    }
    addresses {
      _id
      category
      addresseeFirst
      addresseeLast
      line1
      line2
      landmark
      stateProvince
      cityTown
      country
      postalCode
      phoneNumber {
        category
        countryCode
        areaCode
        localNumber
        mobileNumber
      }
    }
    orders {
      _id
      orderNumber
      transactionId
      deliveryEstimate
      items {
        item {
          _id
          name
          routeParam
          defaultImage
          category
          price {
            value
            currency
          }
          tax
          discount
        }
        quantity
      }
      subTotal
      promotion {
        isPercentage
        value
      }
      billingAddress {
        _id
        addresseeFirst
        addresseeLast
        line1
        line2
        landmark
        stateProvince
        cityTown
        country
        postalCode
        phoneNumber {
          category
          countryCode
          areaCode
          localNumber
          mobileNumber
        }
      }
      shippingAddress {
        _id
        addresseeFirst
        addresseeLast
        line1
        line2
        landmark
        stateProvince
        cityTown
        country
        postalCode
        phoneNumber {
          category
          countryCode
          areaCode
          localNumber
          mobileNumber
        }
      }
      tax
      orderValue
      orderCurrency
      orderStatus
      trackingNumber
      orderComplete
      canceled
      orderDate
    }
    ratings {
      _id
      item
    }
    reviews {
      _id
      item
    }
    isOnTrial
    isPrimeMember
    trialExpiryDaysNumber
    trialStartDate
    maximumFreeExecutions
    numberOfTrialsOffered
    maximumFreeProjects
    organization {
      _id
      organizationName
      # logoImageURL
    }
    logo {
      _id
      path
      filename
    }
    # createdProjects {
    #   _id
    # }
    subscription {
      subscribed
      userUnsubscribed
    }
    numberOfOrderPages
    isDarkTheme
  }
`;
export const PageCreatorFields = gql`
  fragment PageCreatorFields on PageCreator {
    __typename
    _id
    name
    routeParam
    description
    isItemPage
    itemDetails {
      category
      subCategory
      group
    }
  }
`;
export const ResourceFields = gql`
  fragment ResourceFields on AlphaResource {
    __typename
    _id
    title
    contentIntro
    isPageConstructor
    content {
      contentDetail
      imageRequired
      filename
      imageLink
      imageOnLeft
      contentTable {
        tableRequired
        tableHeaders {
          text
          align
          sortable
          value
        }
        tableItems {
          header1
          header2
          header3
          header4
          header5
          header6
          header7
          header8
          header9
          header10
          header11
          header12
          header13
          header14
          header15
          header16
          header17
          header18
          header19
          header20
          header21
          header22
          header23
          header24
          header25
          header26
          header27
          header28
          header29
          header30
        }
        tableDescription
      }
    }
    category
    references
    tags
    resourceRouteParam
  }
`;
export const ColumnFields = gql`
  fragment ColumnFields on Column {
    __typename
    title
    exists
    navigation {
      isEnabled
      component
      routeParam
    }
    height
    width
    resource {
      ...ResourceFields
    }
  }
  ${ResourceFields}
`;
export const ItemFields = gql`
  fragment ItemFields on ItemMinimal {
    _id
    name
    routeParam
    defaultImage
    maximumOrderQuantity
    discount
    stock {
      runningLow
      outOfStock
      quantity
    }
    tax
    dealName
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
`;
// Fragment for Shipping Address
export const ShippingAddressFields = gql`
  fragment ShippingAddressFields on Address {
    _id
    addresseeFirst
    addresseeLast
    line1
    line2
    landmark
    stateProvince
    cityTown
    country
    postalCode
    phoneNumber {
      category
      countryCode
      areaCode
      localNumber
      mobileNumber
    }
  }
`;

// Fragment for Billing Address
export const BillingAddressFields = gql`
  fragment BillingAddressFields on Address {
    _id
    addresseeFirst
    addresseeLast
    line1
    line2
    landmark
    stateProvince
    cityTown
    country
    postalCode
    phoneNumber {
      category
      countryCode
      areaCode
      localNumber
      mobileNumber
    }
  }
`;
