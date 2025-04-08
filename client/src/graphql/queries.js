import { gql } from 'graphql-tag';
import {
  PageCreatorFields,
  ColumnFields,
  UserFields,
  ItemFields,
  ResourceFields,
  ShippingAddressFields,
  BillingAddressFields,
} from './fragments';

// // User, Organizations, Logo queries
const user = {
  // Signin
  SIGN_IN: gql`
    ${UserFields}
    query ($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        userId
        token
        tokenExpiration
        user {
          ...UserFields
        }
        message
      }
    }
  `,
  // get current user
  GET_CURRENT_USER: gql`
    ${UserFields}
    query {
      getCurrentUser {
        ...UserFields
      }
    }
  `,
  // get logo
  GET_LOGO: gql`
    query {
      logo {
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
  // Organizations Queries
  GET_ORGANIZATIONS: gql`
    query {
      organizations {
        _id
        organizationName
        # ext
        # firstName
        # lastName
        # logoImageURL
        user {
          _id
          email
        }
      }
    }
  `,
  // get logo
  GET_APP_ENV: gql`
    query {
      getAppEnv {
        currentSale
        siteWideDiscount
        dealExpiry
        saleImages {
          _id
          path
          filename
          mimetype
          user {
            _id
          }
        }
      }
    }
  `,
};
const app = {
  // get app menus
  GET_APP_MENUS: gql`
    query {
      menus {
        _id
        name
        description
        position
        isSideMenu
        isTopMenu
        isBottomMenu
        disabled
        published
        menuType
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
  GET_APP_INITIALIZATION_DATA: gql`
    ${ItemFields}
    ${ColumnFields}
    query GetAppInitializationData {
      getAppInitializationData {
        alphaResources {
          _id
          title
          category
          resourceRouteParam
        }
        constructorAlphaResources {
          _id
          title
          category
          resourceRouteParam
        }
        items {
          ...ItemFields
        }
        pages {
          _id
          name
          routeParam
        }
        itemModels {
          _id
          name
          routeParam
        }
        unitMatrices {
          _id
          conversionMatrix {
            unit
            value
          }
          defaultUnit
          propertyName
          type
        }
        itemCategories {
          _id
          categoryType
          description
          disabled
          published
          name
          subCategories {
            name
            subTitles {
              name
            }
          }
        }
        appEnv {
          currentSale
          siteWideDiscount
          dealExpiry
          saleImages {
            _id
            path
            filename
            mimetype
            user {
              _id
            }
          }
        }
        appMenus {
          _id
          name
          description
          position
          isSideMenu
          isTopMenu
          isBottomMenu
          disabled
          published
          menuType
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
        dealItems {
          ...ItemFields
        }
        appTags {
          _id
          listName
          tagList
        }
        statesProvinces {
          _id
          categoryList
          categoryName
        }
        userItemCategories {
          _id
          pairedStringList {
            key
            stringValue
          }
          pairedStringListName
        }
        countryPhoneCodes {
          _id
          pairedStringList {
            key
            stringValue
          }
          pairedStringListName
        }
        orderStatusCodes {
          _id
          pairedStringList {
            key
            stringValue
          }
          pairedStringListName
        }
        homePageCarousel {
          _id
          title
          contentIntro
          content {
            contentDetail
            imageRequired
            imageLink
            imageOnLeft
            filename
          }
        }
        homePageData {
          _id
          name
          routeParam
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
    }
  `,
};
const address = {
  // Address Queries
  GET_ADDRESSES_BY_USER: gql`
    query {
      addressesByUser {
        _id
        addresseeFirst
        addresseeLast
        category
        cityTown
        country
        landmark
        line1
        line2
        phoneNumber {
          areaCode
          category
          countryCode
          localNumber
          mobileNumber
        }
        postalCode
        stateProvince
      }
    }
  `,
};
const units = {
  // Unit Sets Queries
  GET_UNIT_MATRICES: gql`
    query {
      unitMatrices {
        _id
        conversionMatrix {
          unit
          value
        }
        defaultUnit
        propertyName
        type
      }
    }
  `,
};
// BOM Item Item model Queries
const bom = {
  // Item Model Queries
  GET_ITEM_MODELS: gql`
    query {
      itemModels {
        _id
        name
        routeParam
      }
    }
  `,
  // Item Model <Queries></Queries>
  GET_SINGLE_ITEM_MODEL: gql`
    query ($itemModelId: ID!) {
      singleItemModel(itemModelId: $itemModelId) {
        _id
        catId
        category
        subCategory
        group
        description
        images {
          imageRequired
          imageLink
          filename
        }
        name
        published
        disabled
        routeParam
        specs {
          specDescription
          specName
          specUnitOptions
          specUnitSelect
          specValue
          specText
          specTextSelect
          specValueOptions
          specTextOptions
          specValueSelect
          specValueType
        }
        tags
        colors
      }
    }
  `,
  // Item Queries
  GET_ITEMS: gql`
    ${ItemFields}
    query {
      items {
        ...ItemFields
      }
    }
  `,
  GET_ALL_CATEGORY_ITEMS: gql`
    ${ItemFields}
    query ($itemCategoryInput: ItemCategoryInput!) {
      getAllCategoryItems(itemCategoryInput: $itemCategoryInput) {
        ...ItemFields
      }
    }
  `,
  GET_DEAL_ITEMS: gql`
    ${ItemFields}
    query {
      getDealItems {
        ...ItemFields
      }
    }
  `,
  GET_ALL_DEAL_ITEMS: gql`
    ${ItemFields}
    query {
      getAllDealItems {
        ...ItemFields
      }
    }
  `,
  // SINGLE ITEM Queries
  GET_SINGLE_ITEM: gql`
    query ($itemId: ID!) {
      singleItem(itemId: $itemId) {
        _id
        name
        published
        disabled
        color
        colorOptions
        isSizeApplicable
        isColorApplicable
        size
        length
        width
        height
        weight
        description
        dealName
        maximumOrderQuantity
        category
        subCategory
        group
        additionalInfo
        tags
        price {
          value
          currency
        }
        tax
        sku
        stock {
          runningLow
          outOfStock
          quantity
        }
        supplier
        model
        discount
        routeParam
        featuresDetails {
          caption
          description
        }
        customerQuestions {
          question
          answer
        }
        rating {
          rateCount
          rateCount1
          rateCount2
          rateCount3
          rateCount4
          rateCount5
          rateAvg
          ratings {
            value
          }
        }
        reviews {
          _id
          text
          item
          comments {
            text
            user
          }
          nickName
          country
          caption
          rating {
            value
          }
          helpful {
            count
            applied
          }
          updatedAt
        }
        defaultImage
        dealName
        images {
          imageRequired
          imageLink
          filename
        }
        specs {
          specName
          specDescription
          specValueType
          specValue
          specText
          specTextSelect
          specValueSelect
          specUnit
          specValueOptions
          specTextOptions
        }
      }
    }
  `,
  // GET ORDERS with pagination, filtering, sorting, and number of pages
  GET_ORDERS: gql`
    query getOrders(
      $page: Int!
      $year: Int
      $searchQuery: String
      $sortOrder: String
    ) {
      ordersByUser(
        page: $page
        year: $year
        searchQuery: $searchQuery
        sortOrder: $sortOrder
      ) {
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
            returned
            returnedQuantity
          }
          subTotal
          promotion {
            isPercentage
            value
          }
          billingAddress {
            ...BillingAddressFields
          }
          shippingAddress {
            ...ShippingAddressFields
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
        numberOfOrderPages
      }
    }
    ${ShippingAddressFields}
    ${BillingAddressFields}
  `,

  // GET ORDERS
  GET_ORDERS_BY_ADMIN: gql`
    query {
      ordersByAdmin {
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
          ...BillingAddressFields
        }
        shippingAddress {
          ...ShippingAddressFields
        }
        tax
        orderValue
        orderCurrency
        orderStatus
        orderComplete
        canceled
        orderDate
      }
    }
    ${ShippingAddressFields}
    ${BillingAddressFields}
  `,
  // get app menus
  GET_ITEM_CATEGORIES: gql`
    query {
      categories {
        _id
        categoryType
        description
        disabled
        published
        name
        subCategories {
          name
          subTitles {
            name
          }
        }
      }
    }
  `,
  // GET SINGLE ORDER
  GET_SINGLE_ORDER: gql`
    query getSingleOrder($orderId: ID!) {
      singleOrder(orderId: $orderId) {
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
          returned
          returnedQuantity
        }
        billingAddress {
          ...BillingAddressFields
        }
        shippingAddress {
          ...ShippingAddressFields
        }
        subTotal
        promotion {
          isPercentage
          value
        }
        tax
        orderValue
        orderCurrency
        orderStatus
        trackingNumber
        orderComplete
        canceled
        orderDate
        returnDetails {
          returnInitiatedDate
          items {
            itemId
            quantity
            reason
            comment
          }
          returnStatus
          returnLabelUrl
          returnLabelUrls
        }
      }
    }
    ${ShippingAddressFields}
    ${BillingAddressFields}
  `,
};
const search = {
  GET_ITEM_SEARCH_RESULTS: gql`
    query getTtemSearchResults($searchInput: SearchInput!) {
      getItemSearchResults(searchInput: $searchInput) {
        items {
          _id
          category
          defaultImage
          routeParam
          name
          discount
          dealName
          maximumOrderQuantity
          rating {
            rateAvg
            rateCount
          }
          tax
          stock {
            runningLow
            outOfStock
            quantity
          }
          price {
            currency
            value
          }
        }
        categories
        colors
        sizes
        specs {
          specName
          minValue
          maxValue
          specValueType
          specOptions
          specUnit
          count
        }
        totalItems
      }
    }
  `,
  GET_ITEM_ADVANCED_SEARCH_RESULTS: gql`
    query getTtemAdvancedSearchResults($searchInput: AdvancedSearchInput!) {
      getItemAdvancedSearchResults(searchInput: $searchInput) {
        items {
          _id
          category
          defaultImage
          routeParam
          name
          discount
          dealName
          maximumOrderQuantity
          rating {
            rateAvg
            rateCount
          }
          tax
          stock {
            runningLow
            outOfStock
            quantity
          }
          price {
            currency
            value
          }
        }
        totalItems
      }
    }
  `,
};
// list of categories
const categories = {
  // GET REVIEWS BY USER
  GET_CATEGORY_LIST: gql`
    query ($categoryName: String!) {
      singleCategoryList(categoryName: $categoryName) {
        _id
        categoryList
        categoryName
      }
    }
  `,
  // GET pairedd string list BY USER
  GET_PAIRED_STRING_LIST: gql`
    query ($pairedStringListName: String!) {
      singlePairedStringList(pairedStringListName: $pairedStringListName) {
        _id
        pairedStringList {
          key
          stringValue
        }
        pairedStringListName
      }
    }
  `,
  // GET paired Number number BY USER
  GET_PAIRED_NUMBER_LIST: gql`
    query ($pairedNumberListName: String!) {
      singlePairedNumberList(pairedNumberListName: $pairedNumberListName) {
        _id
        pairedNumberList
        pairedNumberListName {
          key
          numberValue
        }
      }
    }
  `,
};
// reviews
const review = {
  // GET REVIEWS BY USER
  GET_REVIEWS_BY_USER: gql`
    query {
      reviewsByUser {
        _id
        item {
          _id
          images {
            imageLink
            imageRequired
          }
          name
        }
        caption
        text
        nickName
        country
        rating {
          _id
          value
        }
      }
    }
  `,
};
// Resource queries
const resource = {
  // Alpha Resources Queries
  GET_ALPHA_RESOURCES: gql`
    query {
      alphaResources {
        _id
        title
        category
        resourceRouteParam
      }
    }
  `,
  // constructor Alpha Resources Queries
  GET_CONSTRUCTOR_ALPHA_RESOURCES: gql`
    query {
      constructorAlphaResources {
        _id
        title
        category
        resourceRouteParam
      }
    }
  `,
  // Alpha Resources Queries
  GET_SINGLE_ALPHA_RESOURCE: gql`
    ${ResourceFields}
    query ($alphaResourceId: ID, $resourceRouteParam: String) {
      singleAlphaResource(
        alphaResourceId: $alphaResourceId
        resourceRouteParam: $resourceRouteParam
      ) {
        ...ResourceFields
      }
    }
  `,
  // Alpha Resources Queries
  GET_SINGLE_TAG_LIST: gql`
    query ($tagListId: ID!) {
      singleTagList(tagListId: $tagListId) {
        tagLists {
          _id
          listName
          tagList
        }
      }
    }
  `,
  // Get tags
  GET_APP_TAGS: gql`
    query {
      tagLists {
        _id
        listName
        tagList
      }
    }
  `,
};

const page = {
  // get al pages
  GET_PAGES: gql`
    query {
      pageCreators {
        _id
        name
        routeParam
      }
    }
  `,
  // Alpha Resources Queries
  GET_SINGLE_PAGE: gql`
    query singlePageData($routeParam: String!) {
      singlePageData(routeParam: $routeParam) {
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
          hasButton
          buttonParameters {
            text
            targetType
            routeParam
          }
        }
      }
    }
    ${PageCreatorFields}
    ${ColumnFields}
  `,
  GET_ITEM_CATEGORY_PAGE_DATA: gql`
    query getSingleCategoryGroupItems(
      $itemPageDetailsInput: ItemPageDetailsInput!
    ) {
      getSingleCategoryGroupItems(itemPageDetailsInput: $itemPageDetailsInput) {
        items {
          _id
          category
          defaultImage
          routeParam
          name
          discount
          dealName
          maximumOrderQuantity
          rating {
            rateAvg
            rateCount
          }
          tax
          stock {
            runningLow
            outOfStock
            quantity
          }
          price {
            currency
            value
          }
        }
        totalItems
      }
    }
  `,
};
// Consolidating Queries
const gqlQueries = {
  ...user,
  ...units,
  ...app,
  ...bom,
  ...search,
  ...address,
  ...categories,
  ...review,
  ...resource,
  ...page,
};

export { gqlQueries };
