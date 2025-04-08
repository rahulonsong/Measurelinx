import Vue from 'vue';
import VueMeta from 'vue-meta';
// Vue.use(VueMeta, {
//   // Set CSP for all components
//   contentSecurityPolicy: {
//     directives: {
//       fontSrc: ["'self'", 'https://js.stripe.com'],
//     },
//   },
// });
import Cookies from 'js-cookie';

import ApolloClient from 'apollo-boost-upload';
import { InMemoryCache } from 'apollo-boost';
import VueApollo from 'vue-apollo';
import VueHorizontalList from 'vue-horizontal-list';

import { VueRecaptcha } from 'vue-recaptcha';

Vue.component('vue-recaptcha', VueRecaptcha);

import App from './App.vue';
import vuetify from './plugins/vuetify';
import VOverlay from 'vuetify/lib';
Vue.config.productionTip = false;
import Vuetify from 'vuetify/lib';
Vue.use(Vuetify, VueApollo);

// CK Editor packages
import CKEditor from '@ckeditor/ckeditor5-vue2';
import ckEditor from '@/components/CKEditor/ckEditor.vue';
Vue.use(CKEditor);
Vue.component('ck-editor', ckEditor);

import router from './router';
import store from './store';
import alert from '@/components/shared/alert';
import reLoginDialog from './components/auth/reLogin';
import alphaResourceIntro from '@/components/resource/alphaResourceIntro';
import alphaResourceContent from '@/components/resource/alphaResourceContent';
import alphaResourceReference from '@/components/resource/alphaResourceReference';
import alphaResourceTable from '@/components/resource/alphaResourceTable';
import ckEditorContainer from '@/components/CKEditor/ckEditorContainer';
import searchItems from '@/components/search/searchItems';
import advancedSearchFilters from '@/components/search/advancedSearchFilters';

// Item
import itemImage from '@/components/item/itemImage';
import noItemSearchResults from '@/components/search/noItemSearchResults';
import categoryItems from '@/components/item/categoryItems';
import itemAdditionalInfo from '@/components/item/additionalInfo';
import itemPagination from '@/components/item/itemPagination';

// User components
import userCard from '@/components/user/userCard';
import addCellNumber from './components/cellNumber/addCellNumber';
import verifyOtpDialog from './components/cellNumber/verifyOtpDialog';

// Checkout components
import shippingInfo from '@/components/user/shippingInfo';
import billingInfo from '@/components/user/billingInfo';
import reviewOrder from '@/components/user/reviewOrder';
import deliveryInfo from '@/components/user/deliveryInfo';
import orderSummary from '@/components/user/orderSummary';
import cartItems from '@/components/user/cartItems';

import VueImageChooser from 'vue-image-chooser';
import progressCircular from './components/shared/progressCircular';
import progressLinear from './components/shared/progressLinear';
import snackBar from './components/shared/snackBar';
import confirmDialog from './components/shared/confirmDialog';
import reviewDialog from './components/shared/reviewDialog';
import addressDialog from './components/shared/addressDialog';
import cardInput from './components/shared/cardInput';
import itemInitiator from './components/item/itemInitiator';

// Page Creator
import constructorResourceTemplate from './components/resource/alphaResourceView';
import pageTemplate from './components/page/viewer';

// menu
import menuTemplate from './components/menu/menuTemplate';
import menuDialog from './components/menu/menuDialog';

// category
import categoryTemplate from './components/category/categoryTemplate';
import categoryDialog from './components/category/categoryDialog';

// Importing Dashboard
import dashboard from './components/shared/dashboard';
import { mapGetters } from 'vuex';
Vue.component('vue-horizontal-list', VueHorizontalList);

// Using Dashboard
Vue.component('dash-board', dashboard);
Vue.component('v-overlay', VOverlay);
// Vue.component('apex-chart', VueApexCharts);
Vue.component('app-alert', alert);
Vue.component('reLogin-dialog', reLoginDialog);
Vue.component('alpha-resource-intro', alphaResourceIntro);
Vue.component('alpha-resource-content', alphaResourceContent);
Vue.component('alpha-resource-reference', alphaResourceReference);
Vue.component('alpha-resource-table', alphaResourceTable);
Vue.component('ck-editor-container', ckEditorContainer);
Vue.component('search-items-dialog', searchItems);
Vue.component('advanced-search-filters', advancedSearchFilters);
Vue.component('item-image', itemImage);
Vue.component('no-item-search-results', noItemSearchResults);
Vue.component('category-items', categoryItems);
Vue.component('item-pagination', itemPagination);

// User components
Vue.component('user-card', userCard);
Vue.component('add-cellnumber', addCellNumber);
Vue.component('verify-otp', verifyOtpDialog);

// Checkout Components
Vue.component('shipping-info', shippingInfo);
Vue.component('billing-info', billingInfo);
Vue.component('review-order', reviewOrder);
Vue.component('delivery-info', deliveryInfo);
Vue.component('order-summary', orderSummary);
Vue.component('cart-items', cartItems);

Vue.component('progress-circular', progressCircular);
Vue.component('progress-linear', progressLinear);
Vue.component('snack-bar', snackBar);
Vue.component('confirm-dialog', confirmDialog);
Vue.component('review-dialog', reviewDialog);
Vue.component('address-dialog', addressDialog);
Vue.component('card-input', cardInput);
Vue.component('item-initiator', itemInitiator);
Vue.component('item-additional-info', itemAdditionalInfo);

// page creator resource
Vue.component('constructor-resource-template', constructorResourceTemplate);
Vue.component('page-template', pageTemplate);

// menu
Vue.component('menu-template', menuTemplate);
Vue.component('menu-dialog', menuDialog);

// category
Vue.component('category-template', categoryTemplate);
Vue.component('category-dialog', categoryDialog);

Vue.use(VueImageChooser);

Vue.config.productionTip = false;

const graphqlUri =
  process.env.NODE_ENV === 'production'
    ? process.env.VUE_APP_GRAPHQL_HTTP
    : process.env.VUE_APP_GRAPHQL_HTTP_DEV;

// Set up Apollo Client
export const defaultClient = new ApolloClient({
  uri: graphqlUri, // Your backend GraphQL URL
  cache: new InMemoryCache({
    addTypename: true,
  }),
  fetchOptions: {
    credentials: 'include', // Include cookies in requests
  },
  request: (operation) => {
    // Retrieve token from cookies
    const token = Cookies.get('papiloomToken') || '';

    // Set token in request headers
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '', // Add token only if it exists
      },
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log('[networkError]', networkError);
    }
    if (graphQLErrors) {
      for (const error of graphQLErrors) {
        console.dir(error);
        // Handle token expiration errors
        if (
          error.name === 'AuthenticationError' ||
          error.message === 'jwt expired'
        ) {
          store.commit('setError', error);
          // Optionally, implement token refresh or logout logic here
        }
      }
    }
  },
});

const apolloProvider = new VueApollo({ defaultClient });

// Import chat widget
import { initChatWidget } from './shared/chat-widget-config';

new Vue({
  apolloProvider,
  vuetify,
  router,
  store,
  render: (h) => h(App),
  async created() {
    try {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = process.env.VUE_APP_BRAND_LOGO_URL;
      document.head.appendChild(link);

      if (!this.token) {
        const token = this.$store.dispatch('getCookieValue', 'papiloomToken');
        this.$store.commit('setToken', token);
      }
      // Getting user's data if logged in
      if (
        this.$store.getters.user ||
        Cookies.get('papiloomToken') ||
        this.$store.dispatch('getCookieValue', 'papiloomToken')
      ) {
        // console.log("Fetching user's data...");

        await this.$store.dispatch('getCurrentUser');
        if (this.error) {
          this.$store.dispatch('clearError');
          await this.$store.dispatch('initializeApp');
          return;
        }
        this.$store.commit('setLoading', false);
        this.$store.commit('setProgressing', false);
      }
      // Initialize the app
      // console.log('Initializing the app...');
      await this.$store.dispatch('initializeApp');
      this.$vuetify.theme.dark = this.appDark;

      // Initialize chat widget after app is loaded
      setTimeout(() => {
        initChatWidget();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  },
  computed: {
    ...mapGetters(['user', 'error', 'errorStatus', 'appDark', 'token']),
  },
}).$mount('#app');
