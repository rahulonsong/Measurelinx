import getDefaultState from './state';

const app = {
  setStatusOverlayText: (state, payload) => (state.statusOverlayText = payload),
  setIsStatusOverlay: (state, payload) => (state.isStatusOverlay = payload),
  setLogoImageURL: (state, payload) => (state.logoImageURL = payload),
  setOrganizationName: (state, payload) => (state.organizationName = payload),
  resetState: (state) => Object.assign(state, getDefaultState()),
  setAppEnv: (state, payload) => (state.appEnv = payload),
  setInitializeAppComplete: (state, payload) =>
    (state.initializeAppComplete = payload),
  setAppDark: (state, payload) => (state.appDark = payload),
  setIgnoreApolloStoreReset: (state, payload) =>
    (state.ignoreApolloStoreReset = payload),
  setToken: (state, payload) => (state.token = payload),
  setAxiosConfig: (state, payload) => {
    state.axiosConfig = payload;
  },
  setLoading: (state, payload) => (state.loading = payload),
  setError: (state, payload) => (state.error = payload),
  setTempData: (state, payload) => (state.tempData = payload),
  setValidationRules: (state, payload) => (state.validationRules = payload),
  setProgressing: (state, payload) => (state.progressing = payload),
  clearError: (state) => (state.error = null),
  // Common Variables
  setResults: (state, payload) => (state.results = payload),
  setIsDialog: (state, payload) => (state.isDialog = payload),
  setDialogHeading: (state, payload) => (state.dialogHeading = payload),
  setDialogText: (state, payload) => (state.dialogText = payload),
  setDialogText2: (state, payload) => (state.dialogText2 = payload),
  setDialogBtn1: (state, payload) => (state.dialogBtn1 = payload),
  setDialogBtn2: (state, payload) => (state.dialogBtn2 = payload),
  setIsDialogTips: (state, payload) => (state.isDialogTips = payload),
  setDialogTipsHeading: (state, payload) => (state.dialogTipsHeading = payload),
  setDialogTipsText: (state, payload) => (state.dialogTipsText = payload),
  setDialogTipsText2: (state, payload) => (state.dialogTipsText2 = payload),
  setDialogTipsBtn1: (state, payload) => (state.dialogTipsBtn1 = payload),
  setDialogTipsBtn2: (state, payload) => (state.dialogTipsBtn2 = payload),
  setDialogTableOn: (state, payload) => (state.dialogTableOn = payload),
  setDialogResult: (state, payload) => (state.dialogResult = payload),
  setActiveIndex: (state, payload) => (state.activeIndex = payload),
  setDialogContext: (state, payload) => (state.dialogContext = payload),
  setResultsToggle: (state, payload) => (state.resultsToggle = payload),
  setShown: (state, payload) => (state.shown = payload),
  setSideNav: (state, payload) => (state.sideNav = payload),
  setShowSideNavigationDrawer: (state, payload) =>
    (state.showSideNavigationDrawer = payload),
  setCloneFlag: (state, payload) => (state.cloneFlag = payload),
  setSnackBar: (state, payload) => (state.snackBar = payload),
  setTargetRequired: (state, payload) => (state.targetRequired = payload),
  setTargetLink: (state, payload) => (state.targetLink = payload),
  setTargetText: (state, payload) => (state.targetText = payload),
  setSnackBarText: (state, payload) => (state.snackBarText = payload),
  setHomeScreenData: (state, payload) => (state.homeScreenData = payload),
  setHomePageData: (state, payload) => (state.homePageData = payload),
  setHomePageDataReceived: (state, payload) =>
    (state.homePageDataReceived = payload),
  setHomePageCarousel: (state, payload) => (state.homePageCarousel = payload),
  setHomePageCarouselImages: (state, payload) =>
    (state.homePageCarouselImages = payload),
  setHomPageCarouselReceived: (state, payload) =>
    (state.homPageCarouselReceived = payload),
  setAppMenus: (state, payload) => (state.appMenus = payload),
  setMenuContext: (state, payload) => (state.menuContext = payload),
  setActiveMenu: (state, payload) => (state.activeMenu = payload),
  setMenuDialog: (state, payload) => (state.menuDialog = payload),
  setIsMenuFormValid: (state, payload) => (state.isMenuFormValid = payload),
  setAppMenusReceived: (state, payload) => (state.appMenusReceived = payload),
  setUserItemCategories: (state, payload) =>
    (state.userItemCategories = payload),
  setOrderStatusCodes: (state, payload) => (state.orderStatusCodes = payload),
};
const user = {
  setUser: (state, payload) => (state.user = payload),
  setUserId: (state, payload) => (state.userId = payload),
  setUserEmail: (state, payload) => (state.userEmail = payload),

  // ✅ NEW: Store OAuth provider details
  setSocialLoginProvider: (state, payload) =>
    (state.socialLoginProvider = payload),
  setGoogleToken: (state, payload) => {
    state.googleToken = payload;
    Cookies.set('googleToken', payload, {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    });
  },
  setFacebookToken: (state, payload) => {
    state.facebookToken = payload;
    Cookies.set('facebookToken', payload, {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    });
  },

  // ✅ NEW: Logout - Remove social tokens when user logs out
  clearSocialLogin: (state) => {
    state.socialLoginProvider = '';
    state.googleToken = '';
    state.facebookToken = '';
    Cookies.remove('googleToken');
    Cookies.remove('facebookToken');
  },
  setResetPasswordActive: (state, payload) =>
    (state.resetPasswordActive = payload),
  setUserCard: (state, payload) => (state.userCard = payload),
  setUserVerificationContext: (state, payload) =>
    (state.userVerificationContext = payload),
  setFirstName: (state, payload) => (state.firstName = payload),
  setLastName: (state, payload) => (state.lastName = payload),
  setSubscriberFirstName: (state, payload) =>
    (state.subscriberFirstName = payload),
  setSubscriberLastName: (state, payload) =>
    (state.subscriberLastName = payload),
  setSubscriberEmail: (state, payload) => (state.subscriberEmail = payload),
  setOrdersByUserReceived: (state, payload) =>
    (state.ordersByUserReceived = payload),
  setSubscriptionDialog: (state, payload) =>
    (state.subscriptionDialog = payload),
  setAddCellNumberDialog: (state, payload) =>
    (state.addCellNumberDialog = payload),
  setVerifyOtpDialog: (state, payload) => (state.verifyOtpDialog = payload),
  setCellNumberOtp: (state, payload) => (state.cellNumberOtp = payload),
  setCellNumberCountryCode: (state, payload) =>
    (state.cellNumberCountryCode = payload),
  setCellNumberNumber: (state, payload) => (state.cellNumberNumber = payload),
  setCountryCodes: (state, payload) => (state.countryCodes = payload),
  setCountryPhoneCodes: (state, payload) => (state.countryPhoneCodes = payload),
  setOrderInProgressPhoneVerificationFlag: (state, payload) =>
    (state.orderInProgressPhoneVerificationFlag = payload),
  setUserAuthenticationByPhoneFlag: (state, payload) =>
    (state.userAuthenticationByPhoneFlag = payload),
  setUserAccountPhoneVerificationFlag: (state, payload) =>
    (state.userAccountPhoneVerificationFlag = payload),
  setPhoneVerificationFlag: (state, payload) =>
    (state.phoneVerificationFlag = payload),
  setOrdersForAdmin: (state, payload) => (state.ordersForAdmin = payload),
  setOrdersByAdminReceived: (state, payload) =>
    (state.ordersByAdminReceived = payload),
  setIntendedRoute(state, route) {
    state.intendedRoute = route;
  },
  clearIntendedRoute(state) {
    state.intendedRoute = null;
  },
};
const ckEditor = {
  setCkEditorKey: (state, payload) => {
    state.ckEditorKey = payload;
  },
  setEditorData: (state, payload) => {
    state.editorData = payload;
  },
  setCkEditorConfig: (state, payload) => {
    state.ckEditorConfig = payload;
  },
  setCkEditorReadOnly: (state, payload) => {
    state.ckEditorReadOnly = payload;
  },
  setCkEditorConfigCustom: (state, payload) => {
    state.ckEditorConfigCustom = payload;
  },
  setIsCkEditorContainerDialog: (state, payload) =>
    (state.isCkEditorContainerDialog = payload),
};
const units = {
  setTimeUnits: (state, payload) => (state.timeUnits = payload),
  setVolumetricFlowrateUnits: (state, payload) =>
    (state.volumetricFlowrateUnits = payload),
  setDensityUnits: (state, payload) => (state.densityUnits = payload),
  setLengthUnits: (state, payload) => (state.lengthUnits = payload),
  setVolumeUnits: (state, payload) => (state.volumeUnits = payload),
  setVelocityUnits: (state, payload) => (state.velocityUnits = payload),
  setPressureDiffUnits: (state, payload) => (state.pressureDiffUnits = payload),
  setStressUnits: (state, payload) => (state.stressUnits = payload),
  setViscosityUnits: (state, payload) => (state.viscosityUnits = payload),
  setTimeUnitsMatrix: (state, payload) => (state.timeUnitsMatrix = payload),
  setVolFlowRateUnitsMatrix: (state, payload) =>
    (state.volFlowRateUnitsMatrix = payload),
  setDensityUnitsMatrix: (state, payload) =>
    (state.densityUnitsMatrix = payload),
  setLengthUnitsMatrix: (state, payload) => (state.lengthUnitsMatrix = payload),
  setLengthUnitsMatrix2: (state, payload) =>
    (state.lengthUnitsMatrix2 = payload),
  setVolumeUnitsMatrix: (state, payload) => (state.volumeUnitsMatrix = payload),
  setVelocityUnitsMatrix: (state, payload) =>
    (state.velocityUnitsMatrix = payload),
  setPressureDiffUnitsMatrix: (state, payload) =>
    (state.pressureDiffUnitsMatrix = payload),
  setStressUnitsMatrix: (state, payload) => (state.stressUnitsMatrix = payload),
  setViscosityUnitsMatrix: (state, payload) =>
    (state.viscosityUnitsMatrix = payload),
  setUnitMatrices: (state, payload) => (state.unitMatrices = payload),
};
const bom = {
  setItemSearchText: (state, payload) => (state.itemSearchText = payload),
  setItemAdditionalInfo: (state, payload) =>
    (state.itemAdditionalInfo = payload),
  setIsItemAdditionalInfoDialog: (state, payload) =>
    (state.isItemAdditionalInfoDialog = payload),
  setSearchInProgress: (state, payload) => (state.searchInProgress = payload),
  setItemModels: (state, payload) => (state.itemModels = payload),
  setItemCategories: (state, payload) => (state.itemCategories = payload),
  setItemModelDataReceived: (state, payload) =>
    (state.itemModelDataReceived = payload),
  setItems: (state, payload) => (state.items = payload),
  setDealItems: (state, payload) => (state.dealItems = payload),
  setBulkItems: (state, payload) => (state.bulkItems = payload),
  setBulkItemsReceived: (state, payload) => (state.bulkItemsReceived = payload),
  setBulkItemsTitle: (state, payload) => (state.bulkItemsTitle = payload),
  setItemDataReceived: (state, payload) => (state.itemDataReceived = payload),
  setItemModelMode: (state, payload) => (state.itemModelMode = payload),
  setActiveItemModel: (state, payload) => (state.activeItemModel = payload),
  setActiveItem: (state, payload) => (state.activeItem = payload),
  setItemMode: (state, payload) => (state.itemMode = payload),
  setItemReviewDialog: (state, payload) => (state.itemReviewDialog = payload),
  setReviewsByUserDataReceived: (state, payload) =>
    (state.reviewsByUserDataReceived = payload),
  setIsItemInitiateDialog: (state, payload) =>
    (state.isItemInitiateDialog = payload),
  setItemModelSelect: (state, payload) => (state.itemModelSelect = payload),
  setCart: (state, payload) => (state.cart = payload),
  setCartSubTotal: (state, payload) => (state.cartSubTotal = payload),
  setCartDiscount: (state, payload) => (state.cartDiscount = payload),
  setCartShippingFee: (state, payload) => (state.cartShippingFee = payload),
  setCartConvenienceFee: (state, payload) =>
    (state.cartConvenienceFee = payload),
  setCartTotal: (state, payload) => (state.cartTotal = payload),
  setCheckoutModel: (state, payload) => (state.checkoutModel = payload),
  setShippingAddresses: (state, payload) => (state.shippingAddresses = payload),
  setBillingAddresses: (state, payload) => (state.billingAddresses = payload),
  setShippingInfoComplete: (state, payload) =>
    (state.shippingInfoComplete = payload),
  setBillingInfoComplete: (state, payload) =>
    (state.billingInfoComplete = payload),
  setDeliveryInfoComplete: (state, payload) =>
    (state.deliveryInfoComplete = payload),
  setReviewOrderComplete: (state, payload) =>
    (state.reviewOrderComplete = payload),
  setAddressContext: (state, payload) => (state.addressContext = payload),
  setAddressDialog: (state, payload) => (state.addressDialog = payload),
  setActiveAddress: (state, payload) => (state.activeAddress = payload),
  setIsAddressFormValid: (state, payload) =>
    (state.isAddressFormValid = payload),
  setStatesProvinces: (state, payload) => (state.statesProvinces = payload),
  setOrderDialog: (state, payload) => (state.orderDialog = payload),
  setActiveOrder: (state, payload) => (state.activeOrder = payload),
  setOrders: (state, payload) => (state.orders = payload),
  setSearchItemsDialog: (state, payload) => (state.searchItemsDialog = payload),
  setItemSearchResultsData: (state, payload) =>
    (state.itemSearchResultsData = payload),
  setOptionSpecs: (state, payload) => (state.optionSpecs = payload),
  setMinMaxSpecs: (state, payload) => (state.minMaxSpecs = payload),
  setItemSearchCategories: (state, payload) =>
    (state.itemSearchCategories = payload),
  setItemSearchColors: (state, payload) => (state.itemSearchColors = payload),
  setItemSearchSizes: (state, payload) => (state.itemSearchSizes = payload),
  setShowSearchResultsButton: (state, payload) =>
    (state.showSearchResultsButton = payload),
  setItemSearchPage: (state, payload) => (state.itemSearchPage = payload),
  setItemSearchNumberOfPages: (state, payload) =>
    (state.itemSearchNumberOfPages = payload),
  setItemMinPrice: (state, payload) => (state.itemMinPrice = payload),
  setItemMaxPrice: (state, payload) => (state.itemMaxPrice = payload),
  setItemPriceSortOrder: (state, payload) =>
    (state.itemPriceSortOrder = payload),
  setIsAscendingOrder: (state, payload) => (state.isAscendingOrder = payload),
  setSideAdavncedItemFilter: (state, payload) =>
    (state.sideAdavncedItemFilter = payload),
  setAppCategories: (state, payload) => (state.appCategories = payload),
  setCategoryContext: (state, payload) => (state.categoryContext = payload),
  setActiveCategory: (state, payload) => (state.activeCategory = payload),
  setCategoryDialog: (state, payload) => (state.categoryDialog = payload),
  setIsCategoryFormValid: (state, payload) =>
    (state.isCategoryFormValid = payload),
  setAppCategoriesReceived: (state, payload) =>
    (state.appCategoriesReceived = payload),
  setNumberOfOrderPages: (state, payload) =>
    (state.numberOfOrderPages = payload),
  setFilteredOrders: (state, payload) => (state.filteredOrders = payload),
};
const page = {
  setPages: (state, payload) => (state.pages = payload),
  setPageMode: (state, payload) => (state.pageMode = payload),
  setActivePageRow: (state, payload) => (state.activePageRow = payload),
  setActivePageRowIndex: (state, payload) =>
    (state.activePageRowIndex = payload),
  setActivePage: (state, payload) => (state.activePage = payload),
  setActivePageDataReceived: (state, payload) =>
    (state.activePageDataReceived = payload),
  setPageCloningActive: (state, payload) => (state.pageCloningActive = payload),
  setItemPageNumber: (state, payload) => (state.itemPageNumber = payload),
  setItemPageNumberOfPages: (state, payload) =>
    (state.itemPageNumberOfPages = payload),
  setItemPageDataReceived: (state, payload) =>
    (state.itemPageDataReceived = payload),
  setItemPageData: (state, payload) => (state.itemPageData = payload),
};
const reLogin = {
  // Re-Login Mutations
  setIsReLoggingIn: (state, payload) => (state.isReLoggingIn = payload),
  setReLogInDialog: (state, payload) => (state.reLogInDialog = payload),
  setReLogInDialogHeading: (state, payload) =>
    (state.reLogInDialogHeading = payload),
  setReLogInText: (state, payload) => (state.reLogInText = payload),
  setIsReLogInFormValid: (state, payload) =>
    (state.isReLogInFormValid = payload),
  setDisplayReLogInPassword: (state, payload) =>
    (state.displayReLogInPassword = payload),
  setReLogInPassword: (state, payload) => (state.reLogInPassword = payload),
};
const appResources = {
  setEditedTableItem: (state, payload) => (state.editedTableItem = payload),
  setDefaultTableItem: (state, payload) => (state.defaultTableItem = payload),
  setResourceDataReceived: (state, payload) =>
    (state.resourceDataReceived = payload),
  setActiveResource: (state, payload) => (state.activeResource = payload),
  setResourceMode: (state, payload) => (state.resourceMode = payload),
  setAlphaResourceViewTitle: (state, payload) =>
    (state.alphaResourceViewTitle = payload),
  setAlphaResourceViewIntro: (state, payload) =>
    (state.alphaResourceViewIntro = payload),
  setAlphaResourceViewCategory: (state, payload) =>
    (state.alphaResourceViewCategory = payload),
  setAlphaResourceViewContent: (state, payload) =>
    (state.alphaResourceViewContent = payload),
  setAlphaResourceViewTags: (state, payload) =>
    (state.alphaResourceViewTags = payload),
  setAlphaResourceViewReferences: (state, payload) =>
    (state.alphaResourceViewReferences = payload),
  setAppTags: (state, payload) => (state.appTags = payload),
  setAlphaResourceReferenceDialog: (state, payload) =>
    (state.alphaResourceReferenceDialog = payload),
  setActiveReferenceIndex: (state, payload) =>
    (state.activeReferenceIndex = payload),
  setAppResourceTags: (state, payload) => (state.appResourceTags = payload),
  setResourceType: (state, payload) => (state.resourceType = payload),
  setAlphaResourceTags: (state, payload) => (state.alphaResourceTags = payload),
  setAlphaResourceReferences: (state, payload) =>
    (state.alphaResourceReferences = payload),
  setGeneralResources: (state, payload) => (state.generalResources = payload),
  setProcessAnalyzerResources: (state, payload) =>
    (state.processAnalyzerResources = payload),
  setProcessCalculationResources: (state, payload) =>
    (state.processCalculationResources = payload),
  setConstructorResources: (state, payload) =>
    (state.constructorResources = payload),
  setAlphaResources: (state, payload) => (state.alphaResources = payload),
  setConstructorAlphaResources: (state, payload) =>
    (state.constructorAlphaResources = payload),
  setAlphaResourceTitle: (state, payload) =>
    (state.alphaResourceTitle = payload),
  setAlphaResourceContentIntro: (state, payload) =>
    (state.alphaResourceContentIntro = payload),
  setAlphaResourceCategory: (state, payload) =>
    (state.alphaResourceCategory = payload),
  setAlphaResourceContent: (state, payload) =>
    (state.alphaResourceContent = payload),
  setActiveResourceContent: (state, payload) =>
    (state.activeResourceContent = payload),
  setActiveContentIndex: (state, payload) =>
    (state.activeContentIndex = payload),
  setAlphaResourceTitleDialog: (state, payload) =>
    (state.alphaResourceTitleDialog = payload),
  setIsAlphaResourceIntroDialog: (state, payload) =>
    (state.isAlphaResourceIntroDialog = payload),
  setIsAlphaResourceContentDialog: (state, payload) =>
    (state.isAlphaResourceContentDialog = payload),
};
// Consolidating mutations
const mutations = {
  ...app,
  ...user,
  ...ckEditor,
  ...units,
  ...bom,
  ...page,
  ...reLogin,
  ...appResources,
  // Dialog for custom components with HTML
  setDialog: (state, payload) => {
    state.dialog = payload;
  },
  // Return Label
  setReturnLabelUrl: (state, payload) => {
    const { orderId, returnLabelUrl } = payload;
    // Check if the order exists in the orders array
    if (state.orders && state.orders.length) {
      const orderIndex = state.orders.findIndex(
        (order) => order._id === orderId
      );
      if (orderIndex !== -1) {
        // If return details doesn't exist, create it
        if (!state.orders[orderIndex].returnDetails) {
          state.orders[orderIndex].returnDetails = {};
        }
        state.orders[orderIndex].returnDetails.returnLabelUrl = returnLabelUrl;
      }
    }

    // Also update in filteredOrders if it exists
    if (state.filteredOrders && state.filteredOrders.length) {
      const orderIndex = state.filteredOrders.findIndex(
        (order) => order._id === orderId
      );
      if (orderIndex !== -1) {
        // If return details doesn't exist, create it
        if (!state.filteredOrders[orderIndex].returnDetails) {
          state.filteredOrders[orderIndex].returnDetails = {};
        }
        state.filteredOrders[orderIndex].returnDetails.returnLabelUrl =
          returnLabelUrl;
      }
    }
  },
};

export default {
  ...mutations,
};
