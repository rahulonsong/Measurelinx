//  All Vuex store getters are listed here
import router from '../router/index';
const app = {
  isStatusOverlay: (state) => state.isStatusOverlay,
  statusOverlayText: (state) => state.statusOverlayText,
  appCurrency: () => process.env.VUE_APP_CURRENCY || '$',
  appCurrencyText: () => process.env.VUE_APP_CURRENCY_TEXT,
  appCurrencyIconText: () => process.env.VUE_APP_CURRENCY_ICON_TEXT,
  initializeAppComplete: (state) => state.initializeAppComplete,
  appName: (state) => state.appName,
  appEnv: (state) => state.appEnv,
  currentSale: (state) =>
    state.appEnv &&
    state.appEnv.currentSale &&
    Date.now() > new Date(state.appEnv.dealExpiry)
      ? state.appEnv.currentSale
      : "Today's Deals",
  ignoreApolloStoreReset: (state) => state.ignoreApolloStoreReset,
  token: (state) => state.token,
  organizationName: (state) => state.organizationName,
  loading: (state) => state.loading,
  tempData: (state) => state.tempData,
  error: (state) => state.error,
  errorStatus: (state) => {
    if (state.error) {
      return true;
    } else {
      return false;
    }
  },
  appDark: (state) => state.appDark,
  appLightBackground: (state) => {
    if (state.appDark) {
      return {
        backgroundColor: '#202020',
      };
    } else {
      return {
        backgroundColor: '#FFFFFF',
      };
    }
  },
  appLightBackground1: (state) => {
    if (state.appDark) {
      return { backgroundColor: '#202020' };
    } else {
      return {
        backgroundColor: '#FFFFFF',
      };
    }
  },
  appLightBackground2: (state) => {
    if (state.appDark) {
      return {
        background: 'linear-gradient(to right, #330000, #002200)',
      };
    } else {
      return {
        background: 'linear-gradient(to right, #ffe5e5, #e5ffe5)',
      };
    }
  },
  appThemeFontColor1: (state) => {
    if (state.appDark) {
      return {
        color: 'white',
      };
    } else {
      return {
        color: 'black',
      };
    }
  },
  appThemeFontColor: (state) => {
    if (state.appDark) {
      return { color: 'white' };
    } else {
      return { color: 'black' };
    }
  },
  appTheme1: (state) => {
    if (state.appDark) {
      return {
        color: '#B3E5FC',
        backgroundColor: '#333333',
      };
    } else {
      return {
        color: '#01579B',
        backgroundColor: '#FFFFFF',
      };
    }
  },
  validationRules: (state) => state.validationRules,
  progressing: (state) => state.progressing,
  results: (state) => state.results,
  isDialog: (state) => state.isDialog,
  dialogHeading: (state) => state.dialogHeading,
  dialogText: (state) => state.dialogText,
  dialogText2: (state) => state.dialogText2,
  dialogBtn1: (state) => state.dialogBtn1,
  dialogBtn2: (state) => state.dialogBtn2,
  isDialogTips: (state) => state.isDialogTips,
  dialogTipsHeading: (state) => state.dialogTipsHeading,
  dialogTipsText: (state) => state.dialogTipsText,
  dialogTipsText2: (state) => state.dialogTipsText2,
  dialogTipsBtn1: (state) => state.dialogTipsBtn1,
  dialogTipsBtn2: (state) => state.dialogTipsBtn2,
  dialogTableOn: (state) => state.dialogTableOn,
  dialogResult: (state) => state.dialogResult,
  activeIndex: (state) => state.activeIndex,
  dialogContext: (state) => state.dialogContext,
  resultsToggle: (state) => state.resultsToggle,
  shown: (state) => state.shown,
  sideNav: (state) => state.sideNav,
  showSideNavigationDrawer: (state) => state.showSideNavigationDrawer,
  randomColor: (state) => {
    let min = 0;
    let max = 5;
    let colors = ['cyan', 'light-blue', 'teal', 'indigo', 'blue'];
    const randomColorIndex = Math.floor(Math.random() * (max - min)) + min;
    return (
      colors[randomColorIndex] + ` ${state.appDark ? 'lighten-4' : 'darken-4'}`
    );
  },
  cloneFlag: (state) => state.cloneFlag,
  snackBar: (state) => state.snackBar,
  targetRequired: (state) => state.targetRequired,
  targetLink: (state) => state.targetLink,
  targetText: (state) => state.targetText,
  snackBarText: (state) => state.snackBarText,
  snackBarTimeOut: () => process.env.VUE_APP_SNACKBAR_TIMEOUT,
  homeScreenData: (state) => state.homeScreenData,
  homePageData: (state) => state.homePageData,
  homePageDataReceived: (state) => state.homePageDataReceived,
  homePageCarousel: (state) => state.homePageCarousel,
  homePageCarouselImages: (state) => state.homePageCarouselImages,
  homPageCarouselReceived: (state) => state.homPageCarouselReceived,
  currentRoute: () => router.currentRoute.name,
  icons: (state) => state.icons,
  serverDomain: () => {
    const vueAppServerDomain =
      process.env.NODE_ENV === 'production'
        ? process.env.VUE_APP_SERVER_DOMAIN
        : process.env.VUE_APP_SERVER_DOMAIN_DEV;
    return vueAppServerDomain;
  },
  appMenus: (state) => state.appMenus,
  appSideMenus: (state) => state.appMenus.filter((menu) => menu.isSideMenu),

  menuContext: (state) => state.menuContext,
  activeMenu: (state) => state.activeMenu,
  menuDialog: (state) => state.menuDialog,
  isMenuFormValid: (state) => state.isMenuFormValid,
  appMenusReceived: (state) => state.appMenusReceived,
  userItemCategories: (state) => state.userItemCategories,
  orderStatusCodes: (state) => state.orderStatusCodes,
};
const user = {
  user: (state) => state.user,
  userEmail: (state) => state.userEmail,
  socialLoginProvider: (state) => state.socialLoginProvider, // ✅ NEW
  googleToken: (state) => state.googleToken, // ✅ NEW
  facebookToken: (state) => state.facebookToken, // ✅ NEW
  userId: (state) => {
    return state.userId || (state.user && state.user._id ? state.user._id : '');
  },
  resetPasswordActive: (state) => state.resetPasswordActive,
  firstName: (state) => state.firstName,
  lastName: (state) => state.lastName,
  userCard: (state) => state.userCard,
  userVerificationContext: (state) => state.userVerificationContext,
  subscriberFirstName: (state) => state.subscriberFirstName,
  subscriberLastName: (state) => state.subscriberLastName,
  subscriberEmail: (state) => state.subscriberEmail,
  ordersByUserReceived: (state) => state.ordersByUserReceived,
  subscriptionDialog: (state) => state.subscriptionDialog,
  addCellNumberDialog: (state) => state.addCellNumberDialog,
  verifyOtpDialog: (state) => state.verifyOtpDialog,
  cellNumberOtp: (state) => state.cellNumberOtp,
  cellNumberCountryCode: (state) => state.cellNumberCountryCode,
  cellNumberNumber: (state) => state.cellNumberNumber,
  countryCodes: (state) => state.countryCodes,
  countryPhoneCodes: (state) => state.countryPhoneCodes,
  orderInProgressPhoneVerificationFlag: (state) =>
    state.orderInProgressPhoneVerificationFlag,
  userAuthenticationByPhoneFlag: (state) => state.userAuthenticationByPhoneFlag,
  userAccountPhoneVerificationFlag: (state) =>
    state.userAccountPhoneVerificationFlag,
  phoneVerificationFlag: (state) => state.phoneVerificationFlag,
  ordersForAdmin: (state) => state.ordersForAdmin,
  ordersByAdminReceived: (state) => state.ordersByAdminReceived,
};
const ckEditor = {
  ckEditorKey: (state) => state.ckEditorKey,
  editorData: (state) => state.editorData,
  ckBuildFolder: (state) => state.ckBuildFolder,
  ckEditorConfig: (state) => state.ckEditorConfig,
  ckEditorReadOnly: (state) => state.ckEditorReadOnly,
  ckEditorConfigCustom: (state) => state.ckEditorConfigCustom,
  ckEditorConfigPrint: (state) => state.ckEditorConfigPrint,
  isCkEditorContainerDialog: (state) => state.isCkEditorContainerDialog,
};
const reLogin = {
  // Re-Login Dialog
  isReLoggingIn: (state) => state.isReLoggingIn,
  reLogInDialog: (state) => state.reLogInDialog,
  reLogInDialogHeading: (state) => state.reLogInDialogHeading,
  reLogInText: (state) => state.reLogInText,
  isReLogInFormValid: (state) => state.isReLogInFormValid,
  displayReLogInPassword: (state) => state.displayReLogInPassword,
  reLogInPassword: (state) => state.reLogInPassword,
};
const appResource = {
  resourceCategories: (state) => state.resourceCategories,
  editedTableItem: (state) => state.editedTableItem,
  defaultTableItem: (state) => state.defaultTableItem,
  resourceDataReceived: (state) => state.resourceDataReceived,
  activeResource: (state) => state.activeResource,
  resourceMode: (state) => state.resourceMode,
  alphaResourceViewTitle: (state) => state.alphaResourceViewTitle,
  alphaResourceViewIntro: (state) => state.alphaResourceViewIntro,
  alphaResourceViewCategory: (state) => state.alphaResourceViewCategory,
  alphaResourceViewContent: (state) => state.alphaResourceViewContent,
  alphaResourceViewTags: (state) => state.alphaResourceViewTags,
  alphaResourceViewReferences: (state) => state.alphaResourceViewReferences,
  appTags: (state) => state.appTags,
  alphaResourceReferenceDialog: (state) => state.alphaResourceReferenceDialog,
  activeReferenceIndex: (state) => state.activeReferenceIndex,
  appResourceTags: (state) => state.appResourceTags,
  resourceType: (state) => state.resourceType,
  alphaResourceTags: (state) => state.alphaResourceTags,
  alphaResourceReferences: (state) => state.alphaResourceReferences,
  generalResources: (state) => state.generalResources,
  processAnalyzerResources: (state) => state.processAnalyzerResources,
  processCalculationResources: (state) => state.processCalculationResources,
  constructorResources: (state) => state.constructorResources,
  alphaResources: (state) => state.alphaResources,
  constructorAlphaResources: (state) => state.constructorAlphaResources,
  alphaResourceTitle: (state) => state.alphaResourceTitle,
  alphaResourceContentIntro: (state) => state.alphaResourceContentIntro,
  alphaResourceCategory: (state) => state.alphaResourceCategory,
  alphaResourceContent: (state) => state.alphaResourceContent,
  activeResourceContent: (state) => state.activeResourceContent,
  activeContentIndex: (state) => state.activeContentIndex,
  alphaResourceTitleDialog: (state) => state.alphaResourceTitleDialog,
  isAlphaResourceIntroDialog: (state) => state.isAlphaResourceIntroDialog,
  isAlphaResourceContentDialog: (state) => state.isAlphaResourceContentDialog,
};
const units = {
  pressureUnits: (state) => state.pressureUnits,
  tempUnits: (state) => state.tempUnits,
  timeUnits: (state) => state.timeUnits,
  volumetricFlowrateUnits: (state) => state.volumetricFlowrateUnits,
  densityUnits: (state) => state.densityUnits,
  lengthUnits: (state) => state.lengthUnits,
  volumeUnits: (state) => state.volumeUnits,
  velocityUnits: (state) => state.velocityUnits,
  pressureDiffUnits: (state) => state.pressureDiffUnits,
  stressUnits: (state) => state.stressUnits,
  viscosityUnits: (state) => state.viscosityUnits,
  pressureUnitSelect: (state) => state.pressureUnitSelect,
  lengthUnitSelect: (state) => state.lengthUnitSelect,
  densityUnitSelect: (state) => state.densityUnitSelect,
  thicknessUnitSelect: (state) => state.thicknessUnitSelect,
  viscosityUnitSelect: (state) => state.viscosityUnitSelect,
  volFlowRateUnitSelect: (state) => state.volFlowRateUnitSelect,
  volFlowRateUnitsMatrix: (state) => state.volFlowRateUnitsMatrix,
  densityUnitsMatrix: (state) => state.densityUnitsMatrix,
  pipeSizeMatrix: (state) => state.pipeSizeMatrix,
  tubeSizeMatrix: (state) => state.tubeSizeMatrix,
  lengthUnitsMatrix: (state) => state.lengthUnitsMatrix,
  volumeUnitsMatrix: (state) => state.volumeUnitsMatrix,
  lengthUnitsMatrix2: (state) => state.lengthUnitsMatrix2,
  spHeatRatioMatrix: (state) => state.spHeatRatioMatrix,
  pressureDiffUnitsMatrix: (state) => state.pressureDiffUnitsMatrix,
  stressUnitsMatrix: (state) => state.stressUnitsMatrix,
  viscosityUnitsMatrix: (state) => state.viscosityUnitsMatrix,
  velocityUnitsMatrix: (state) => state.velocityUnitsMatrix,
  timeUnitsMatrix: (state) => state.timeUnitsMatrix,
  roughnessMatrix: (state) => state.roughnessMatrix,
  unitMatrices: (state) => state.unitMatrices,
};
const bom = {
  itemSearchText: (state) => state.itemSearchText,
  itemAdditionalInfo: (state) => state.itemAdditionalInfo,
  isItemAdditionalInfoDialog: (state) => state.isItemAdditionalInfoDialog,
  searchInProgress: (state) => state.searchInProgress,
  itemModels: (state) => state.itemModels,
  itemCategories: (state) => state.itemCategories,
  itemModelDataReceived: (state) => state.itemModelDataReceived,
  items: (state) => state.items,
  dealItems: (state) => state.dealItems,
  bulkItems: (state) => state.bulkItems,
  bulkItemsReceived: (state) => state.bulkItemsReceived,
  bulkItemsTitle: (state) => state.bulkItemsTitle,
  itemDataReceived: (state) => state.itemDataReceived,
  itemModelMode: (state) => state.itemModelMode,
  activeItemModel: (state) => state.activeItemModel,
  activeItem: (state) => state.activeItem,
  cleanItem: (state) => state.cleanItem,
  itemMode: (state) => state.itemMode,
  itemReviewDialog: (state) => state.itemReviewDialog,
  reviewsByUserDataReceived: (state) => state.reviewsByUserDataReceived,
  isItemInitiateDialog: (state) => state.isItemInitiateDialog,
  itemModelSelect: (state) => state.itemModelSelect,
  cart: (state) => state.cart,
  defaultCart: (state) => state.defaultCart,
  cartSubTotal: (state, context) => {
    let sum = 0;
    if (state.cart && state.cart.items) {
      switch (process.env.VUE_APP_CURRENCY_TEXT) {
        case 'cad':
          sum = state.cart.items.reduce((accumulator, el) => {
            // Calculate the price with discount for a single item with precise math
            const discountedPrice =
              el.item.price.value * (1 - el.item.discount / 100);
            // Round to exactly 2 decimal places to match Stripe's calculation
            const roundedPrice = Math.round(discountedPrice * 100) / 100;
            // Calculate the subtotal for this item (price × quantity)
            const itemSubtotal = roundedPrice * el.quantity;
            // Add to running total without rounding yet
            return accumulator + itemSubtotal;
          }, 0);
          break;

        case 'inr':
          sum = state.cart.items.reduce((accumulator, el) => {
            // Calculate the price with tax and discount for a single item
            const priceWithTaxAndDiscount =
              el.item.price.value *
              (1 + el.item.tax / 100) *
              (1 - el.item.discount / 100);
            // Round to exactly 2 decimal places to match payment gateway calculation
            const roundedPrice =
              Math.round(priceWithTaxAndDiscount * 100) / 100;
            // Calculate the subtotal for this item (price × quantity)
            const itemSubtotal = roundedPrice * el.quantity;
            // Add to running total without rounding yet
            return accumulator + itemSubtotal;
          }, 0);
          break;

        default:
          sum = 0; // Handle unexpected cases
          break;
      }
    }
    // Use exact mathematical precision to avoid floating point errors
    // Store as string to preserve exact decimal value
    state.cartSubTotal = parseFloat(sum.toFixed(2));
    return state.cartSubTotal;
  },

  cartDiscount: (state, context) => {
    let sum = 0;
    if (state.cart && state.cart.items) {
      switch (process.env.VUE_APP_CURRENCY_TEXT) {
        case 'cad':
          sum = state.cart.items.reduce((accumulator, el) => {
            return (
              accumulator +
              el.item.price.value * (el.item.discount / 100) * el.quantity
            );
          }, 0);
          break;

        case 'inr':
          sum = state.cart.items.reduce((accumulator, el) => {
            return (
              accumulator +
              el.item.price.value *
                (1 + el.item.tax / 100) *
                (el.item.discount / 100) *
                el.quantity
            );
          }, 0);
          break;

        default:
          sum = 0; // Handle unexpected cases
          break;
      }
    }
    state.cartDiscount = parseFloat(sum.toFixed(2)); // Round final result
    return state.cartDiscount;
  },

  cartTax: (state, context) => {
    return state.cartTax;
  },
  cartShippingFee: (state, context) => {
    let sum = parseInt(process.env.VUE_APP_DEFAULT_DELIVERY_FEE);
    // if (this.cart && this.cart.items) {
    //   this.cart.items.map(
    //     (el) =>
    //       (sum +=
    //         parseFloat(el.item.price.value * (el.item.discount / 100)) *
    //         el.quantity)
    //   );
    // }
    state.cartShippingFee = sum;
    return sum;
  },
  cartConvenienceFee: (state, context) => {
    let sum = 10;
    state.cartConvenienceFee = sum;
    return sum;
  },
  checkoutModel: (state) => state.checkoutModel,
  shippingAddresses: (state) => state.shippingAddresses,
  billingAddresses: (state) => state.billingAddresses,
  shippingInfoComplete: (state) => state.shippingInfoComplete,
  billingInfoComplete: (state) => state.billingInfoComplete,
  deliveryInfoComplete: (state) => state.deliveryInfoComplete,
  reviewOrderComplete: (state) => state.reviewOrderComplete,
  addressContext: (state) => state.addressContext,
  addressDialog: (state) => state.addressDialog,
  activeAddress: (state) => state.activeAddress,
  isAddressFormValid: (state) => state.isAddressFormValid,
  statesProvinces: (state) => state.statesProvinces,
  monthArray: (state) => state.monthArray,
  cardYearArray: (state) => state.cardYearArray,
  orderDialog: (state) => state.orderDialog,
  activeOrder: (state) => state.activeOrder,
  orders: (state) => state.orders,
  searchItemsDialog: (state) => state.searchItemsDialog,
  itemSearchResultsData: (state) => state.itemSearchResultsData,
  optionSpecs: (state) => state.optionSpecs,
  minMaxSpecs: (state) => state.minMaxSpecs,
  itemSearchCategories: (state) => state.itemSearchCategories,
  itemSearchColors: (state) => state.itemSearchColors,
  itemSearchSizes: (state) => state.itemSearchSizes,
  showSearchResultsButton: (state) => state.showSearchResultsButton,
  itemSearchPage: (state) => state.itemSearchPage,
  itemSearchPage: (state) => state.itemSearchPage,
  itemSearchPage: (state) => state.itemSearchPage,
  itemSearchNumberOfPages: (state) => state.itemSearchNumberOfPages,
  itemMinPrice: (state) => state.itemMinPrice,
  itemMaxPrice: (state) => state.itemMaxPrice,
  fixedItemMinPrice: (state) => parseFloat(process.env.VUE_APP_ITEM_MIN_PRICE),
  fixedItemMaxPrice: (state) => parseFloat(process.env.VUE_APP_ITEM_MAX_PRICE),
  itemPriceSortOrder: (state) => state.itemPriceSortOrder,
  sideAdavncedItemFilter: (state) => state.sideAdavncedItemFilter,
  colorItems: () => [
    'red',
    'pink',
    'purple',
    'deep-purple',
    'indigo',
    'blue',
    'light-blue',
    'cyan',
    'teal',
    'green',
    'light-green',
    'lime',
    'yellow',
    'amber',
    'orange',
    'deep-orange',
    'brown',
    'grey',
    'blue-grey',
    'black',
    'white',
  ],
  sizeOptions: () => ['small', 'medium', 'large', 'XL', 'XXL'],
  appCategories: (state) => state.appCategories,
  appSideCategories: (state) =>
    state.appCategories.filter((category) => category.isSideCategory),

  categoryContext: (state) => state.categoryContext,
  activeCategory: (state) => state.activeCategory,
  categoryDialog: (state) => state.categoryDialog,
  isCategoryFormValid: (state) => state.isCategoryFormValid,
  appCategoriesReceived: (state) => state.appCategoriesReceived,
  numberOfOrderPages: (state) => state.numberOfOrderPages,
  filteredOrders: (state) => state.filteredOrders,
};
const page = {
  pages: (state) => state.pages,
  pageMode: (state) => state.pageMode,
  activePageRow: (state) => state.activePageRow,
  activePageRowIndex: (state) => state.activePageRowIndex,
  activePage: (state) => state.activePage,
  activePageDataReceived: (state) => state.activePageDataReceived,
  navigablePageComponents: (state) => state.navigablePageComponents,
  pageCloningActive: (state) => state.pageCloningActive,
  itemPageNumber: (state) => state.itemPageNumber,
  itemPageNumberOfPages: (state) => state.itemPageNumberOfPages,
  itemPageDataReceived: (state) => state.itemPageDataReceived,
  itemPageData: (state) => state.itemPageData,
};
const getters = {
  ...user,
  ...app,
  ...ckEditor,
  ...units,
  ...bom,
  ...page,
  ...reLogin,
  ...appResource,
};

export default {
  ...getters,
};
