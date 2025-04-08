import { defaultClient as apolloClient } from '../main';
// Importing gql mutations
import { gqlMutations } from '../graphql/mutations';
import { gqlQueries } from '../graphql/queries';

// Common
const common = {
  // Get Categories List
  getCategoryListGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_CATEGORY_LIST,
        variables: payload,
      });

      return data.singleCategoryList.categoryList;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Get paired String List
  getPairedStringListGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_PAIRED_STRING_LIST,
        variables: payload,
      });

      return data.singlePairedStringList.pairedStringList;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Get paired Number List
  getPairedNumberListGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_PAIRED_NUMBER_LIST,
        variables: payload,
      });

      return data.singlePairedNumberList.pairedNumberList;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // get app menus
  getAppMenusGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_APP_MENUS,
        variables: payload,
      });
      return data.menus;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // add menu
  addMenuGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.ADD_MENU,
        variables: payload,
      });
      return data.addMenu;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // update menu
  updateMenuGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.UPDATE_MENU,
        variables: payload,
      });
      return data.updateMenu;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // delete menu
  deleteMenuGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.DELETE_MENU,
        variables: payload,
      });
      return data.deleteMenu;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
};
// user/Organizations/Logo actions
const user = {
  // Sign in
  signIn: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.SIGN_IN,
        variables: payload,
      });
      return data.login;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // get current user
  getCurrentUserGql: async ({ state, commit, dispatch }) => {
    try {
      // console.log('Getting current user from gql');

      const { data } = await apolloClient.query({
        query: gqlQueries.GET_CURRENT_USER,
      });
      return data.getCurrentUser;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // signing user out
  signoutUser: async ({ state, commit, dispatch }, payload) => {
    // end session
    await apolloClient.resetStore();
  },
  // Creating a user
  createUser: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.SIGNUP_USER,
        variables: payload,
      });
      return data.createUser;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Subscribe User
  subscribeUserGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.SUBSCRIBE_USER,
        variables: payload,
      });
      return data.addSubscriberData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // UnSubscribe User
  unsubscribeUserGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.UNSUBSCRIBE_USER,
        variables: payload,
      });
      return data.updateSubscriberData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Verify User
  verifyUserGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.VERIFY_USER,
        variables: payload,
      });
      return data.verifyUser;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },

  // Verify User
  resetPasswordGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.RESET_PASSWORD,
        variables: payload,
      });
      return data.resetPassword;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Verify User for password reset
  verifyUserForPasswordResetGql: async (
    { state, commit, dispatch },
    payload
  ) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.VERIFY_USER_PASSWORD_RESET,
        variables: payload,
      });
      return data.verifyUserForPasswordReset;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Send OTP
  sendOtpGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.SEND_OTP,
        variables: payload,
      });
      return data.sendOtp;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Send Phone OTP
  sendPhoneOtpGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.SEND_PHONE_OTP,
        variables: payload,
      });
      return data.sendPhoneOtp;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Verify User Phone
  verifyUserPhoneGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.VERIFY_USER_PHONE,
        variables: payload,
      });
      return data.verifyUserPhone;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },

  // Updating a user
  updateUser: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.UPDATE_USER,
        variables: payload,
      });

      return data.updateUser;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Updating User Properties
  updateUserPropertiesGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.UPDATE_USER_PROPERTIES,
        variables: payload,
      });

      return data.updateUserProperties;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Update UserInfo
  updateUserInfoGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.UPDATE_USERINFO,
        variables: payload,
      });

      return data.updateUserInfoData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Update ItemArray
  updateItemArrayGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.UPDATE_ITEM_ARRAY,
        variables: payload,
      });

      return data.updateItemArrayData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Adding Unit Set
  addOrganizationData: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.ADD_ORGANIZATION,
        variables: payload,
      });
      return data.addOrganizationData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Updating Organizartion
  updateOrganizationData: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.UPDATE_ORGANIZATION,
        variables: payload,
      });
      return data.updateOrganizationData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Uploading Logo
  uploadLogo: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.UPLOAD_LOGO,
        variables: payload,
        context: {
          hasUpload: true,
        },
      });
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // contact request submission
  submitContactRequestGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.SUBMIT_CONTACT_REQUEST,
        variables: payload,
      });
      return data.addContactFormSubmission;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Delete User Account
  deleteUserAccountGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.DELETE_USER_ACCOUNT,
        variables: payload,
      });
      return data.deleteUserAccount;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
};
// Unit Corrections
const units = {
  // Get UnitMatrices
  getUnitMatricesGql: async ({ state, commit, dispatch }) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_UNIT_MATRICES,
      });
      let result = data.unitMatrices;
      return result;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
};
// BOM/Items/Item Models
const bom = {
  // Get ItemModel
  getItemModelsGql: async ({ state, commit, dispatch }) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_ITEM_MODELS,
      });
      return data.itemModels;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // get single ItemModel
  getSingleItemModelGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_SINGLE_ITEM_MODEL,
        variables: payload,
        fetchPolicy: 'network-only', // Ensure it fetches the latest data
      });
      return data.singleItemModel;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Add ItemModel
  addItemModelGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.ADD_ITEM_MODEL,
        variables: payload,
      });

      return data.addItemModelData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Update ItemModel
  updateItemModelGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.UPDATE_ITEM_MODEL,
        variables: payload,
      });

      return data.updateItemModelData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Disable ItemModel
  disableItemModelGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.DISABLE_ITEM_MODEL,
        variables: payload,
      });

      return data.disableItemModelData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Get Item
  getItemsGql: async ({ state, commit, dispatch }) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_ITEMS,
      });
      return data.items;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },

  // Get App ENv
  getAppEnvGql: async ({ state, commit, dispatch }) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_APP_ENV,
      });
      return data.getAppEnvData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Get Deal Items
  getDealItemsGql: async ({ state, commit, dispatch }) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_DEAL_ITEMS,
      });
      return data.getDealItems;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Get All Category Items
  getAllCategoryItemsGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_ALL_CATEGORY_ITEMS,
        variables: payload,
      });
      return data.getAllCategoryItems;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Get Deal Items
  getAllDealItemsGql: async ({ state, commit, dispatch }) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_ALL_DEAL_ITEMS,
      });
      return data.getAllDealItems;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // get single Item
  getSingleItemGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_SINGLE_ITEM,
        variables: payload,
        fetchPolicy: 'network-only', // Ensure it fetches the latest data
      });
      return data.singleItem;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Add Item
  addItemGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.ADD_ITEM,
        variables: payload,
      });

      return data.addItemData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Update Item
  updateItemGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.UPDATE_ITEM,
        variables: payload,
      });

      return data.updateItemData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Disable Item
  disableItemGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.DISABLE_ITEM,
        variables: payload,
      });

      return data.disableItemData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Uploading item Model Image
  uploadItemModelImageGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.UPLOAD_ITEM_MODEL_IMAGE,
        variables: payload,
        context: {
          hasUpload: true,
        },
      });

      return data.uploadItemModelImage.path;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Uploading item Image
  uploadItemImageGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.UPLOAD_ITEM_IMAGE,
        variables: payload,
        context: {
          hasUpload: true,
        },
      });

      return data.uploadItemImage.path;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Delete ItemModel image
  deleteItemModelImageGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.DELETE_ITEM_MODEL_IMAGE,
        variables: payload,
      });

      return data.deleteItemModelImage;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Delete Item image
  deleteItemImageGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.DELETE_ITEM_IMAGE,
        variables: payload,
      });

      return data.deleteItemImage;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Update Cart
  updateCartGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.UPDATE_CART,
        variables: payload,
      });

      return data.addUpdateCartData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // get app itemCategories
  getItemCategoriesGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_ITEM_CATEGORIES,
        variables: payload,
      });
      return data.categories;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // add itemCategory
  addItemCategoryGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.ADD_ITEM_CATEGORY,
        variables: payload,
      });
      return data.addCategory;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // update itemCategory
  updateItemCategoryGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.UPDATE_ITEM_CATEGORY,
        variables: payload,
      });
      return data.updateCategory;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // delete itemCategory
  deleteItemCategoryGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.DELETE_ITEM_CATEGORY,
        variables: payload,
      });
      return data.deleteCategory;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Get orders with pagination, filtering, and sorting using payload
  getOrdersGql: async ({ state, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_ORDERS,
        variables: payload,
        fetchPolicy: 'network-only', // Ensure it fetches the latest data
      });
      return data.ordersByUser;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },

  // Get admin orders
  getOrdersByAdminGql: async ({ state, commit, dispatch }) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_ORDERS_BY_ADMIN,
      });
      return data.ordersByAdmin;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  updateOrderStatusesByAdminGQL: async ({ state, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.UPDATE_MULTIPLE_ORDERS_BY_ADMIN,
        variables: payload,
      });
      return data.updateMultipleOrders;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Get single order with return details
  getSingleOrderGql: async ({ state, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_SINGLE_ORDER,
        variables: payload,
        fetchPolicy: 'network-only', // Ensure it fetches the latest data
      });

      if (data && data.singleOrder) {
        return data.singleOrder;
      } else {
        return null;
      }
    } catch (error) {
      const errorMessage =
        error.message || 'Unknown error in getSingleOrderGql';
      dispatch('handleCatchError', { ...error, message: errorMessage });
      return null;
    }
  },
};
const page = {
  // Get Pages
  getPagesGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_PAGES,
        variables: payload,
      });
      return data.pageCreators;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Get Single Page
  getSinglePageGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_SINGLE_PAGE,
        variables: payload,
      });

      return data.singlePageData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Add Page
  addPageGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.ADD_PAGE_CREATOR,
        variables: payload,
      });

      return data.addPageCreator;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Update Page
  updatePageGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.UPDATE_PAGE_CREATOR,
        variables: payload,
      });

      return data.updatePageCreator;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Disable Page
  disablePageGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.DISABLE_PAGE_CREATOR,
        variables: payload,
      });

      return data.disablePageCreator;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  //  get item category page  Results
  getSingleCategoryGroupItemsGql: async (
    { state, commit, dispatch },
    payload
  ) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_ITEM_CATEGORY_PAGE_DATA,
        variables: payload,
      });
      return data.getSingleCategoryGroupItems;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Send Bulk Email
  sendBulkEmailGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.SEND_BULK_EMAIL,
        variables: payload,
      });
      return data.sendEmail;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
};
// search features
const search = {
  // Get item search resutls
  getItemSearchResultsGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_ITEM_SEARCH_RESULTS,
        variables: payload,
      });
      return data.getItemSearchResults;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Get item Advanced search resutls
  getItemAdvancedSearchResultsGql: async (
    { state, commit, dispatch },
    payload
  ) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_ITEM_ADVANCED_SEARCH_RESULTS,
        variables: payload,
      });
      return data.getItemAdvancedSearchResults;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
};
// Payment actions
const payment = {
  // cehck promo code info
  checkPromoCodeGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.CHECK_PROMO_CODE,
        variables: payload,
      });

      return data.checkPromoCodeData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Generate Stripe payment Url
  generateStripePaymentUrlGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.GENERATE_STRIPE_PAYMENT_URL,
        variables: payload,
      });

      return data.generateStripePaymentUrlData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Generate RazorPay payment Url
  generateRazorPaymentUrlGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.GENERATE_RAZOR_PAYMENT_URL,
        variables: payload,
      });

      return data.generateRazorPaymentUrlData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
};
// Address
const address = {
  // Add Address
  addAddressGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.ADD_ADDRESS,
        variables: payload,
      });

      return data.addAddressData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Update Address
  updateAddressGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.UPDATE_ADDRESS,
        variables: payload,
      });

      return data.updateAddressData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Delete Address
  deleteAddressGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.DELETE_ADDRESS,
        variables: payload,
      });

      return data.deleteAddressData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Get Addresses
  getAddressesByUserGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_ADDRESSES_BY_USER,
        variables: payload,
      });

      return data.addressesByUser;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
};
// Reviews
const review = {
  // Add Review
  addReviewGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.ADD_REVIEW,
        variables: payload,
      });

      return data.addReviewData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Update Review
  updateReviewGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.UPDATE_REVIEW,
        variables: payload,
      });

      return data.updateReviewData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Add Rating
  addRatingGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.ADD_RATING,
        variables: payload,
      });

      return data.addRatingData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Update Rating
  updateRatingGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.UPDATE_RATING,
        variables: payload,
      });

      return data.updateRatingData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Increment found helpful
  incrementFoundHelpfulGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.INCREMENT_FOUND_HELPFUL,
        variables: payload,
      });

      return data.incrementFoundHelpful;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // get reviews by user
  getReviewsByUserGql: async ({ state, commit, dispatch }) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_REVIEWS_BY_USER,
      });

      return data.reviewsByUser;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
};
// Resource Actions
const resource = {
  // Get Alpha Resources
  getAlphaResourcesGql: async ({ state, commit, dispatch }) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_ALPHA_RESOURCES,
      });
      return data.alphaResources;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Get COnstructor Alpha Resources
  getConstructorAlphaResourcesGql: async ({ state, commit, dispatch }) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_CONSTRUCTOR_ALPHA_RESOURCES,
      });
      return data.constructorAlphaResources;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // get single resource
  getSingleAlphaResourceGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_SINGLE_ALPHA_RESOURCE,
        variables: payload,
        fetchPolicy: 'network-only', // This ensures a network request is made
      });
      return data.singleAlphaResource;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Uploading Resource Image
  uploadResourceImageGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.UPLOAD_RESOURCE_IMAGE,
        variables: payload,
        context: {
          hasUpload: true,
        },
      });

      return data.uploadResourceImage.path;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Add Alpha Resource
  addAlphaResourceGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.ADD_ALPHA_RESOURCE,
        variables: payload,
      });

      return data.addAlphaResourceData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Update Alpha Resource
  updateAlphaResourceGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.UPDATE_ALPHA_RESOURCE,
        variables: payload,
      });

      return data.updateAlphaResourceData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Delete Alpha Resource
  deleteAlphaResourceGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.DELETE_ALPHA_RESOURCE,
        variables: payload,
      });

      return data.deleteAlphaResourceData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Delete Alpha Resource
  disableAlphaResourceGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.DISABLE_ALPHA_RESOURCE,
        variables: payload,
      });

      return data.disableAlphaResourceData;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Get App Tags
  getAnceptTagsGql: async ({ state, commit, dispatch }) => {
    try {
      const { data } = await apolloClient.query({
        query: gqlQueries.GET_APP_TAGS,
      });
      return data.tagLists;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Delete Alpha Resource image
  deleteAlphaResourceImageGql: async ({ state, commit, dispatch }, payload) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gqlMutations.DELETE_ALPHA_RESOURCE_IMAGE,
        variables: payload,
      });

      return data.deleteAlphaResourceImage;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
};
// Consolidating gql actions
const gqlActions = {
  ...common,
  ...user,
  ...resource,
  ...bom,
  ...page,
  ...search,
  ...payment,
  ...address,
  ...review,
  ...units,
};
export { gqlActions };
