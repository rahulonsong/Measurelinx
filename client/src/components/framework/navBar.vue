<template>
  <nav class="my-auto">
    <!-- ***************************** -->
    <!-- Horizonal App bar  -->
    <!-- ***************************** -->
    <v-app-bar
      dense
      dark
      fixed
      prominent
      height="50"
      style="
        background-color: rgba(25, 25, 25, 0.8);
        backdrop-filter: blur(10px);
        z-index: 10;
      "
      z-index:10
    >
      <!-- App-Title -->
      <v-app-bar-nav-icon class="my-auto mr-0" @click="toggleSideNav">
      </v-app-bar-nav-icon>
      <brand-name-router class="mr-0"></brand-name-router>
      <!-- Advanced FIlters -->
      <v-btn
        class="my-auto hidden-lg-and-up"
        v-if="
          itemSearchResultsData &&
          itemSearchResultsData.items &&
          itemSearchResultsData.items.length &&
          currentRouteName === 'itemSearchResults'
        "
        icon
        fab
      >
        <v-icon dark @click="toggleSideAdvancedFilters">mdi-filter-menu</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <!-- Navbar buttons for Small Screen -->
      <span
        class="hidden-md-and-up myfont1 my-auto navbar-icon-container"
        v-for="(navBtn, index) in navBarButtons"
        :key="'small-navBtn' + index"
      >
        <v-btn
          v-if="
            (navBtn.authRequired ? user && token : true) &&
            !(navBtn.hideWhenLoggedIn ? user && token : false)
          "
          x-small
          fab
          icon
          class="my-auto navbar-btn-xs"
          @click="executeClickFunction(navBtn.clickFunction)"
        >
          <v-icon>{{ navBtn.icon }}</v-icon>
        </v-btn>
      </span>
      <!-- Navbar buttobs for large Screen -->
      <span
        class="hidden-sm-and-down myfont1 my-auto"
        v-for="(navBtn, index) in navBarButtons"
        :key="'large-navBtn' + index"
      >
        <v-tooltip
          bottom
          v-if="
            (navBtn.authRequired ? user && token : true) &&
            !(navBtn.hideWhenLoggedIn ? user && token : false)
          "
        >
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              x-small
              fab
              icon
              class="mx-1 my-auto"
              @click="executeClickFunction(navBtn.clickFunction)"
            >
              <v-icon>{{ navBtn.icon }}</v-icon>
            </v-btn>
          </template>
          <span class="ml-2">{{ navBtn.name }}</span>
        </v-tooltip>
      </span>

      <!-- cart small screen -->
      <v-menu
        v-model="cartMenuSmall"
        :close-on-content-click="false"
        bottom
        nudge-bottom="1"
        :open-on-hover="false"
        offset-y
        :min-width="$vuetify.breakpoint.xs ? '100%' : '325'"
        :max-width="$vuetify.breakpoint.xs ? '100%' : '325'"
        z-index="5"
      >
        <template v-slot:activator="{ on }">
          <span class="hidden-md-and-up navbar-icon-container">
            <v-btn
              x-small
              class="my-auto navbar-btn-xs"
              v-on="on"
              icon
              style="vertical-align: middle; margin-top: 0; margin-bottom: 0"
            >
              <v-badge
                dark
                :content="cartLength"
                :value="cartLength"
                color="red darken-4"
                overlap
              >
                <v-icon>
                  {{ icons.mdiCart }}
                </v-icon>
              </v-badge>
            </v-btn>
          </span>
        </template>
        <!-- Mini Cart -->
        <v-card min-width="325" max-width="325">
          <v-card-title class="mb-0 pb-0">Your items in Cart</v-card-title>
          <div v-if="cart && cart.items && cart.items.length">
            <v-card-actions>
              <!-- Proceed to Checkout -->
              <v-row class="ma-0 pa-0" justify="center" dense>
                <v-col cols="12" class="ma-0 pa-0" align="center">
                  <!-- Continue -->
                  <v-btn
                    style="width: 100%; max-width: 500px"
                    text
                    class="app__button mx-0 px-0"
                    :class="appDark ? 'blue darken-4' : 'blue lighten-4'"
                    @click="goToCart"
                  >
                    View Cart
                  </v-btn>
                  <!-- Cancel -->
                  <v-btn
                    style="width: 100%; max-width: 500px"
                    text
                    class="app__button mx-0 px-0 mt-5"
                    :class="appDark ? 'green darken-4' : 'green lighten-4'"
                    @click="cartMenuSmall = false"
                  >
                    Cancel
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
            <v-card-text
              class="my-0 py-0 mx-0 px-0"
              style="flex-grow: 1; overflow: auto; max-height: 400px"
            >
              <!-- Cart Items -->
              <cart-items :navBarCart="true"></cart-items>
              <!-- Sub total -->
              <v-row justify="start" class="my-0 py-0">
                <v-col align="start" class="my-0 py-0 mx-0 font-weight-medium">
                  <p class="py-0 py-0">
                    Subtotal: {{ appCurrency }} {{ cartSubTotal.toFixed(2) }}
                  </p>
                </v-col>
              </v-row>
            </v-card-text>
          </div>
          <div v-else>
            <v-card-text class="pb-4 pt-0 my-0">
              <p class="my-0 py-0">
                There are no items in the cart!
                <v-btn text small to="/" color="primary"
                  >Explore the store</v-btn
                >
              </p>
            </v-card-text>
          </div>
        </v-card>
      </v-menu>
      <!-- cart big screen screen -->
      <v-menu
        v-model="cartMenuLarge"
        :close-on-content-click="false"
        bottom
        nudge-bottom="1"
        :open-on-hover="false"
        offset-y
        min-width="500"
        max-width="500"
        z-index="5"
      >
        <template v-slot:activator="{ on }">
          <v-btn x-small class="mx-1 my-auto hidden-sm-and-down" v-on="on" icon>
            <v-badge
              dark
              :content="cartLength"
              :value="cartLength"
              color="red darken-4"
              overlap
            >
              <v-icon>
                {{ icons.mdiCart }}
              </v-icon>
            </v-badge>
          </v-btn>
        </template>
        <!-- Mini Cart -->
        <v-card min-width="500" max-width="500">
          <v-card-title class="mb-0 pb-0"
            >Your items in Cart ( {{ appCurrency }}
            {{ cartSubTotal.toFixed(2) }} )</v-card-title
          >
          <div v-if="cart && cart.items && cart.items.length">
            <v-card-actions>
              <!-- Proceed to Checkout -->
              <v-row class="ma-0 pa-0" justify="center" dense>
                <v-col cols="12" class="ma-0 pa-0" align="center">
                  <!-- Continue -->
                  <v-btn
                    style="width: 100%; max-width: 500px"
                    text
                    class="app__button mx-0 px-0"
                    :class="appDark ? 'blue darken-4' : 'blue lighten-4'"
                    @click="goToCart"
                  >
                    View Cart
                  </v-btn>
                  <!-- Cancel -->
                  <v-btn
                    style="width: 100%; max-width: 500px"
                    text
                    class="app__button mx-0 px-0 mt-5"
                    :class="appDark ? 'green darken-4' : 'green lighten-4'"
                    @click="cartMenuLarge = false"
                  >
                    Cancel
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
            <v-card-text
              class="my-0 py-0 mx-2"
              style="flex-grow: 1; overflow: auto; max-height: 600px"
            >
              <!-- Cart Items -->
              <cart-items :navBarCart="true"></cart-items>
              <!-- Sub total -->
              <v-row justify="start" class="my-0 py-0">
                <v-col align="start" class="my-0 py-0 mx-0 font-weight-medium">
                  <p class="py-0 py-0">
                    Subtotal: {{ appCurrency }} {{ cartSubTotal.toFixed(2) }}
                  </p>
                </v-col>
              </v-row>
            </v-card-text>
          </div>
          <div v-else>
            <v-card-text class="pb-4 pt-0 my-0">
              <p class="my-0 py-0">
                There are no items in the cart!
                <v-btn text small to="/" color="primary"
                  >Explore the store</v-btn
                >
              </p>
            </v-card-text>
          </div>
        </v-card>
      </v-menu>
      <!-- More vertical bar -->
      <v-menu
        v-model="userCard"
        :close-on-content-click="false"
        bottom
        nudge-bottom="1"
        offset-y
        min-width="300"
        v-if="token && user"
        z-index="5"
      >
        <template v-slot:activator="{ on }">
          <v-btn small class="ml-2 mr-1 my-auto" v-on="on" icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>
        <!-- <v-btn @click="test()">Test</v-btn> -->
        <!-- user Card -->
        <v-card>
          <v-list>
            <v-list-item>
              <v-avatar size="48px">
                <v-img
                  :src="profileImageUrl"
                  :key="`avatar-${user?.avatar || 'default'}`"
                  :alt="displayName"
                  height="48"
                  width="48"
                  :error-src="require('@/assets/avatars/profilePic.webp')"
                  eager
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        :size="24"
                        :width="2"
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-avatar>

              <v-list-item-content class="ml-3">
                <v-list-item-title>{{ displayName }}</v-list-item-title>
                <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <user-card></user-card>
          <v-divider></v-divider>
          <!-- App theme -->
          <!-- <v-tooltip bottom class="ml-10">
            <template v-slot:activator="{ on }"> -->
          <v-btn icon @click="toggleTheme" class="ml-4">
            <v-icon>{{ appDark ? 'dark_mode' : 'light_mode' }}</v-icon>
          </v-btn>
          <!-- </template> -->
          <span class="ml-2">{{
            appDark ? 'Dark theme: On' : 'Dark theme: Off'
          }}</span>
          <!-- </v-tooltip> -->
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn text @click="userCard = false" small color="tertiary">
              Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="signUserOut" small>
              <v-icon>exit_to_app</v-icon>
              <span class="ml-1">Sign Out</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-app-bar>
  </nav>
</template>
<script>
import { mapGetters } from 'vuex';
import { mdiCart } from '@mdi/js';
import BrandNameRouter from '@/components/shared/brandNameRouter.vue';

export default {
  name: 'navBar',
  components: {
    BrandNameRouter,
  },
  data() {
    return {
      fav: true,
      searchItem: '',
      cartMenuSmall: false,
      cartMenuLarge: false,
      message: false,
      hints: true,
      searchBar: false,
      // userCard: false,
      calculators: [
        { title: 'Dew point/Bubble point', name: 'dpbp' },
        { title: 'Pressure Drop', name: 'pressureDrop' },
        { title: 'Valve Flow Coefficient (Cv)', name: 'flowCoeff' },
        { title: 'Pressure Safety Valve Sizing', name: 'psvSizing' },
        // {title: 'Acid Dew Point',name:'acidDewPoint'},
        { title: 'Wobbe Index', name: 'wobbeIndex' },
        { title: 'Orifice plate', name: 'orifice' },
        { title: 'Viscosity Estimation', name: 'viscosityCalculator' },
        { title: 'Density Estimation', name: 'densityCalculator' },
        // {title: 'Mass fraction to mole fraction',name:'massToMole'}
      ],
      icons: {
        mdiCart,
      },
      navBarButtons: [
        {
          name: 'Search Items',
          icon: 'search',
          clickFunction: 'initiateSearch',
          to: '',
          authRequired: false,
          hideWhenLoggedIn: false,
        },
        {
          name: 'Contact Us',
          icon: 'mdi-email-outline',
          clickFunction: 'goToContactUs',
          to: '',
          authRequired: false,
          hideWhenLoggedIn: false,
        },
        {
          name: this.appDark ? 'Dark theme: On' : 'Dark theme: Off',
          icon: this.appDark ? 'dark_mode' : 'light_mode',
          clickFunction: 'toggleTheme',
          to: '',
          authRequired: false,
          hideWhenLoggedIn: true,
        },
        {
          name: 'Sign In',
          icon: 'login',
          clickFunction: 'signIn',
          to: 'signin',
          authRequired: false,
          hideWhenLoggedIn: true,
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'user',
      'token',
      'error',
      'appCurrency',
      'appDark',
      // "cart",
      'appLightBackground',
      'cartSubTotal',
      'cartDiscount',
      'searchItemsDialog',
      'itemSearchResultsData',
    ]),
    loading: {
      get() {
        return this.$store.getters.loading;
      },
      set(value) {
        this.$store.commit('setLoading', value);
      },
    },
    progressing: {
      get() {
        return this.$store.getters.progressing;
      },
      set(value) {
        this.$store.commit('setProgressing', value);
      },
    },
    sideNav: {
      get() {
        return this.$store.getters.sideNav;
      },
      set(value) {
        this.$store.commit('setSideNav', value);
      },
    },
    sideAdavncedItemFilter: {
      get() {
        return this.$store.getters.sideAdavncedItemFilter;
      },
      set(value) {
        this.$store.commit('setSideAdavncedItemFilter', value);
      },
    },
    appDark: {
      get() {
        return this.$store.getters.appDark;
      },
      set(value) {
        this.$store.commit('setAppDark', value);
      },
    },
    userCard: {
      get() {
        return this.$store.getters.userCard;
      },
      set(value) {
        this.$store.commit('setUserCard', value);
      },
    },
    menuItems() {
      let menuItems;
      // If user signin in
      if (this.user) {
        menuItems = [
          // { icon: "fas fa-book", title: "Resources", link: "/resources" },
        ];
      }
      // If user signed out or unregistered user
      else {
        menuItems = [
          { icon: 'face', title: 'Sign up', link: '/signup' },
          { icon: 'lock_open', title: 'Sign in', link: '/signin' },
        ];
      }
      return menuItems;
    },
    maxAllowedProbeLengthWFC() {
      return this.$store.getters.maxAllowedProbeLengthWFC;
    },
    totalLagTimeAz() {
      return this.$store.getters.totalLagTimeAz;
    },
    quickMenuBottomSheet: {
      get() {
        return this.$store.getters.quickMenuBottomSheet;
      },
      set(value) {
        this.$store.commit('setQuickMenuBottomSheet', value);
      },
    },
    currentRouteName() {
      return this.$route.name;
    },
    displayName() {
      if (this.user) {
        return `${this.user.firstName} ${this.user.lastName}`;
      } else {
        return '';
      }
    },
    cartLength() {
      let count = 0;
      if (this.cart && this.cart.items) {
        this.cart.items.map((el) => (count += el.quantity));
      }
      return count;
    },
    cart: {
      get() {
        return this.$store.getters.cart;
      },
      set(value) {
        this.$store.commit('setCart', value);
      },
    },
    targetRequired: {
      get() {
        return this.$store.getters.targetRequired;
      },
      set(value) {
        this.$store.commit('setTargetRequired', value);
      },
    },
    targetLink: {
      get() {
        return this.$store.getters.targetLink;
      },
      set(value) {
        this.$store.commit('setTargetLink', value);
      },
    },
    targetText: {
      get() {
        return this.$store.getters.targetText;
      },
      set(value) {
        this.$store.commit('setTargetText', value);
      },
    },
    snackBarText: {
      get() {
        return this.$store.getters.snackBarText;
      },
      set(value) {
        this.$store.commit('setSnackBarText', value);
      },
    },
    brandName() {
      return process.env.VUE_APP_NAME;
    },
    profileImageUrl() {
      try {
        if (!this.user?.avatar) {
          return require('@/assets/avatars/profilePic.webp');
        }

        const avatar = this.user.avatar;

        // Handle Google avatars
        if (avatar.includes('googleusercontent.com')) {
          return avatar.split('=')[0].replace('http://', 'https://') + '=s96-c';
        }

        // Handle Facebook avatars
        if (avatar.includes('facebook.com') || avatar.includes('fbsbx.com')) {
          return avatar.replace('http://', 'https://');
        }

        return avatar;
      } catch (error) {
        console.error('Error processing avatar URL:', error);
        return require('@/assets/avatars/profilePic.webp');
      }
    },
  },
  methods: {
    test() {
      console.log('Avatar URL:', this.user.avatar);
      // console.log('cart:', this.cart);
      // console.log('light:', this.appLight);
    },
    signUserOut() {
      this.userCard = false;
      // this.$router.push({ name: "signin" }).catch();
      this.$store.dispatch('signUserOut');
      // setTimeout(() => {
      // }, 100);
    },
    toggleSideNav() {
      // this.topFunction();
      this.sideNav = !this.sideNav;
    },
    toggleSideAdvancedFilters() {
      // this.topFunction();
      this.sideAdavncedItemFilter = !this.sideAdavncedItemFilter;
    },
    // When the user clicks on the button, scroll to the top of the document
    topFunction() {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    },
    // toggling light and dark themes
    async toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.appDark = !this.appDark;
      if (this.user) {
        const payload = {
          userPropertiesInput: {
            isDarkTheme: this.appDark,
          },
        };
        //update user properties in database
        await this.$store.dispatch('updateUserProperties', payload);
      }
    },
    enableSnackBar(targetRequired, targetText, targetLink) {
      // Assign snackbar parameters
      this.targetRequired = targetRequired;
      this.targetText = targetText;
      this.targetLink = targetLink;
      // show snackbar
      // console.log('targetRequired:', this.targetRequired);
      // console.log('targetText:', this.targetText);
      // console.log('targetLink:', this.targetLink);
      // console.log('snackBarText:', this.snackBarText);
      this.$store.commit('setSnackBar', true);
    },
    goToCart() {
      // console.log('Going to Cart');
      try {
        if (this.$route.name !== 'userCart') {
          this.$router.push({ name: 'userCart' });
        }
      } catch (error) {
        // console.log(error);
      }
      this.cartMenuLarge = false;
      this.cartMenuSmall = false;
    },
    initiateSearch() {
      this.$store.commit('setSearchItemsDialog', true);
    },
    goToContactUs() {
      if (this.$route.name !== 'contactUs') {
        this.$router.push({ name: 'contactUs' });
      }
    },
    signIn() {
      if (this.$route.name !== 'signin') {
        this.$router.push({ name: 'signin' });
      }
    },
    // A dispatcher method
    executeClickFunction(functionName) {
      if (typeof this[functionName] === 'function') {
        this[functionName]();
      } else {
        console.error(`Method ${functionName} not found`);
      }
    },
  },
};
</script>
<style>
.myfont1 {
  font-size: 14px;
}
.menu--margin__navbar {
  margin-top: 50px;
}
.item__search__navigation .v-text-field .v-input__control .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  height: 30px;
  margin-top: 5px;
  margin-left: 0;
  padding-left: 5px;
}
.item__search__navigation
  .v-text-field
  .v-input__control
  .v-input__slot
  .v-text-field__slot
  .v-label {
  font-size: 0.9em;
}
.item__search__navigation
  .v-text-field
  .v-input__control
  .v-input__slot
  .v-text-field__slot
  input {
  font-weight: 500;
}
.item__search__navigation
  .v-text-field
  .v-input__prepend-inner
  .v-input__icon
  .v-icon {
  margin-bottom: 10px;
}

.item__quantity .v-input__control .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  height: 30px;
  margin-top: 5px;
  margin-left: 0;
  margin-right: 0;
  padding-left: 0px;
  padding-right: 0px;
}
.pointerMouse {
  cursor: auto;
  color: rgb(196, 74, 74);
}
.pointerCursor {
  cursor: pointer;
  color: rgb(196, 74, 74);
}
.badge__cart--quantity .v-badge__wrapper .v-badge__badge {
  color: black;
}

/* Add consistent spacing for navbar icons */
.navbar-icon-container {
  display: inline-flex;
  margin: 0 4px;
  align-items: center;
  height: 100%;
}

/* Adjust spacing on very small screens */
@media (max-width: 350px) {
  .navbar-icon-container {
    margin: 0 2px;
  }

  .navbar-btn-xs {
    margin: 0 !important;
    padding: 0 !important;
  }
}

/* Ensure all navbar buttons have consistent vertical alignment */
.v-btn.navbar-btn-xs {
  vertical-align: middle !important;
}
</style>
