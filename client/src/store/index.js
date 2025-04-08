import Vue from 'vue';
import Vuex from 'vuex';
import { getters } from './getters';
import { mutations } from './mutations';
import actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: '',
    user: null,
    error: null,
    loading: false,
    progressing: false,
    filteredOrders: [],
    logOut: null,
    appDark: localStorage.getItem('dark') === 'true',
    appCurrency: 'CAD',
    alphaResources: [],
    constructorAlphaResources: [],
    items: [],
    itemModels: [],
    pages: [],
    unitMatrices: {
      lengthMatrix: [],
      massMatrix: [],
      volFlowRateMatrix: [],
      unitsSymbolMatrix: [],
    },
    volFlowRateUnitsMatrix: [],
    massFlowRateUnitsMatrix: [],
    itemCategories: [],
    countryPhoneCodes: [],
    orderStatusCodes: {
      objectList: [],
      pairedStringList: [],
    },
    isNavDrawerActive: false,
    appEnv: null,
    appMenus: null,
    userItemCategories: [],
    homePageCarousel: {},
    cart: {
      cartItems: [],
    },
    paymentMethods: ['credit-card', 'stripe'],
    paymentType: null,
    paymentSuccessData: {},
    axiosConfig: {
      headers: {
        common: {},
      },
    },
    checkoutDialog: false,
    snackBarText: '',
    ignoreApolloStoreReset: false,
    initializeAppComplete: false,
    currentPage: null,
  },
  getters,
  mutations,
  actions,
});
