<template>
  <v-app class="appFont2" :style="appLightBackground">
    <!-- Side Navbar -->
    <!-- ***************************** -->
    <v-navigation-drawer
      v-model="sideNav"
      app
      fixed
      style="z-index: 100"
      width="300"
    >
      <v-app-bar
        flat
        fixed
        dense
        height="50"
        style="
          background-color: rgba(25, 25, 25, 0.8);
          backdrop-filter: blur(10px);
          z-index: 10;
        "
      >
        <!-- <v-app-bar-nav-icon dark @click="toggleSideNav"></v-app-bar-nav-icon> -->
        <brand-name-router></brand-name-router>
        <v-spacer></v-spacer>
        <v-btn icon color="grey lighten-3" @click="toggleSideNav">
          <v-icon color="grey lighten-4">mdi-chevron-left</v-icon>
        </v-btn>
      </v-app-bar>

      <!-- <v-card
        class="ma-0 pa-0"
        elevation="0"
      >
        <v-card-title class="ma-0 pa-0"> -->
      <!-- </v-card-title>
        <v-card-text
          class="ma-0 pa-0 mt-10"
        > -->
      <v-divider></v-divider>
      <!-- Dashboard re-usable -->
      <dash-board class="mt-14"></dash-board>
      <!-- </v-card-text>
      </v-card> -->
    </v-navigation-drawer>

    <!-- Show item Adavanced Search Filter -->
    <v-navigation-drawer
      v-model="sideAdavncedItemFilter"
      temporary
      fixed
      style="z-index: 1"
      width="300"
    >
      <v-app-bar
        class="blue-grey darken-4"
        flat
        fixed
        dense
        height="60"
        style="z-index: 10"
      >
        <v-icon dark @click="toggleSideAdvancedFilters()"
          >mdi-filter-menu</v-icon
        >
        <v-toolbar-title class="ml-3 primary--text text--lighten-3">
          Adavanced Filters
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          class="error--text text--lighten-3"
          icon
          fab
          @click="toggleSideAdvancedFilters()"
          ><v-icon>close</v-icon></v-btn
        >
      </v-app-bar>
      <v-divider></v-divider>
      <!-- search Advanced Filters-->
      <advanced-search-filters class="mt-14"></advanced-search-filters>
      <!-- </v-card-text>
      </v-card> -->
    </v-navigation-drawer>
    <!-- ***************************** -->
    <!-- Horizonal App bar  -->
    <!-- ***************************** -->
    <navBar v-if="showToolBar" class="app--background"></navBar>
    <!-- ***************************** -->
    <!-- Main navigation for Activities, -->
    <!-- ***************************** -->
    <v-navigation-drawer
      mini-variant-width="70"
      expand-on-hover
      v-if="false && showSideNavigationDrawer"
      class="hidden-xs-only"
      style="margin-bottom: 100px; z-index: 5; top: 55px"
      width="350"
      height="100%"
      app
      fixed
      left
    >
      <!-- Dashboard reusable -->
      <dash-board></dash-board>
    </v-navigation-drawer>

    <!-- ***************************** -->
    <!--  Router view for each component-->
    <!-- ***************************** -->
    <v-main
      :style="appLightBackground"
      @scroll.passive="handleScroll"
      @click="shown = false"
      @keypress="shown = false"
      class="mt-13"
    >
      <!-- <v-btn @click="test">Test</v-btn> -->
      <!-- Showing Operation Status as Overlay -->
      <v-overlay :value="isStatusOverlay" :z-index="9999" :opacity="0.2">
        <p
          class="statusOverlayText grey"
          :class="
            appDark
              ? 'text--darken-4 body-1 black--text font-weight-black lighten-4'
              : 'text--lighten-4 body-1 font-weight-black  darken-4'
          "
        >
          {{ this.statusOverlayText }}
        </p>
        <!-- <v-icon>mdi-close</v-icon> -->
      </v-overlay>
      <!-- Social share -->
      <social-share style="z-index: 999"></social-share>
      <!-- Snackbar -->
      <snack-bar> </snack-bar>
      <!-- Custom Dialog for Return Labels -->
      <custom-dialog></custom-dialog>
      <!-- Error alert -->
      <app-alert
        v-if="error"
        @dismissed="onDismissed"
        :text="error.message"
      ></app-alert>
      <!-- Re-Login Dialog -->
      <reLogin-dialog></reLogin-dialog>
      <!-- Progressing Loader -->
      <div v-if="progressing" class="progressing__loader">
        <v-progress-circular
          :size="100"
          :width="8"
          color="light-blue darken-2"
          indeterminate
        >
          <img :src="logoUrl" alt="Papiloom Logo" height="50" />
        </v-progress-circular>
      </div>
      <!-- Go to Top Animation button  -->
      <v-btn
        @click="topFunction()"
        id="myBtn"
        elevation="5"
        small
        fab
        color="red"
        title="Go to top"
        class="lighten-5"
      >
        <v-icon>fas fa-chevron-up</v-icon>
      </v-btn>
      <!-- Displayig the Warning Dialog box -->
      <v-row wrap class="ma-0 pa-0">
        <v-col class="text-xs-center ma-0 pa-0">
          <v-dialog
            :retain-focus="false"
            content-class="curvedBorder1"
            v-model="isDialog"
            persistent
            max-width="400"
          >
            <v-card>
              <v-card-title
                class="dialogTitleBackground title white--text darken-2 font-weight-bold"
                >{{ dialogHeading }}</v-card-title
              >
              <v-card-text
                class="text--darken-3 font-weight-regular subtitle-2"
                v-html="dialogText"
              ></v-card-text>
              <v-card-text
                class="text--darken-3 font-weight-regular subtitle-2"
                v-if="dialogText2"
                >{{ dialogText2 }}</v-card-text
              >
              >
              <v-card-actions>
                <v-btn
                  v-if="dialogBtn1"
                  text
                  class="align-content-center d-flex mx-auto"
                  color="red darken-1 font-weight-bold"
                  @click="clearDialog('no')"
                  >{{ dialogBtn1 }}</v-btn
                >
                <v-btn
                  v-if="dialogBtn2"
                  text
                  class="align-content-center d-flex mx-auto font-weight-bold"
                  color="green darken-1"
                  @click="clearDialog('yes')"
                  >{{ dialogBtn2 }}</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
      <!-- Displayig the Tips Dialog box with option for Table-->
      <v-row justify="center">
        <v-col>
          <v-dialog
            scrollable
            content-class="curvedBorder1"
            v-model="isDialogTips"
            max-width="800"
          >
            <v-card>
              <v-card-title
                class="tipsDialogTitleBackground title white--text darken-2 font-weight-bold"
              >
                {{ dialogTipsHeading }}</v-card-title
              >
              <!-- Displaying Generic message Tips -->
              <v-card-text
                class="font-weight-medium mb-0 pb-0"
                v-if="dialogTipsText"
                >{{ dialogTipsText }}</v-card-text
              >
              <v-card-text
                class="text--darken-3 appFont2"
                v-if="dialogTipsText2"
                >{{ dialogTipsText2 }}</v-card-text
              >
              <!-- Displaying Tips matrix Headers-->
              <v-row
                v-if="dialogTableOn"
                class="d-flex justify-center pt-2 teal--text darken-4"
                style="width: 800px"
              >
                <v-col cols="6" sm="6" md="6" class="d-flex justify-center">
                  <p class="body-2 font-weight-bold">Material</p>
                </v-col>
                <v-col cols="6" sm="6" md="6" class="d-flex justify-center">
                  <p class="body-2 font-weight-bold">
                    Roughness Parameter (ε), mm
                  </p>
                </v-col>
              </v-row>
              <!-- Displaying Tips matrix Content -->
              <v-card-text
                v-if="dialogTableOn"
                style="height: 600px; width: 800px"
              >
                <!-- Displaying Tips matrix content Table-->
                <v-row
                  v-for="(item, index) in roughnessMatrix"
                  :key="index"
                  row
                  class="text--darken-3 pt-2 my-0 py-0"
                  style="height: 40px"
                >
                  <v-col
                    v-if="dialogTableOn"
                    cols="6"
                    sm="6"
                    md="6"
                    class="my-0 py-0 text-left text-start"
                  >
                    <p id="item.name">
                      {{ item.name }}
                    </p>
                  </v-col>
                  <v-col
                    cols="6"
                    sm="6"
                    md="6"
                    v-if="dialogTableOn"
                    class="d-flex justify-center my-0 py-0"
                  >
                    <p class="inputValue">
                      {{ item.value }}
                    </p>
                  </v-col>
                </v-row>
              </v-card-text>
              <!-- Diplaying dialog buttons -->
              <v-row class="ma-0 pa-0">
                <v-card-actions
                  class="text-xs-center mx-auto justify-space-around"
                >
                  <v-btn
                    v-if="dialogTipsBtn1"
                    class="align-content-center d-flex mx-auto"
                    color="red font-weight-bold"
                    :class="appDark ? 'text--lighten-4' : 'text--darken-4'"
                    text
                    @click="clearDialog('no')"
                    >{{ dialogTipsBtn1 }}</v-btn
                  >
                  <v-btn
                    v-if="dialogTipsBtn2"
                    class="align-content-center d-flex mx-auto font-weight-bold"
                    color="green"
                    :class="appDark ? 'text--lighten-4' : 'text--darken-4'"
                    text
                    @click="clearDialog('yes')"
                    >{{ dialogTipsBtn2 }}</v-btn
                  >
                </v-card-actions>
              </v-row>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
      <!-- Show Cookies dialog -->
      <cookie-consent-dialog v-if="initializeAppComplete" />
      <!-- Router View for Each component -->
      <router-view
        style="max-width: 1400px"
        v-if="
          initializeAppComplete ||
          currentRoute.name === 'signin' ||
          (initializeAppComplete && currentRoute.name === 'itemViewer') ||
          (initializeAppComplete && currentRoute.name === 'resource') ||
          (initializeAppComplete &&
            currentRoute.path.indexOf('/calculators/') !== -1)
        "
        class="page mx-auto py-0 my-0"
      ></router-view>
      <!-- Whatsapp icon -->
      <!-- <v-btn
        elevation="5"
        icon
        id="myWhatsappBtn"
        color="green"
        title="Let's WhatsApp!"
        class="lighten-5"
        :href="whatsAppLink"
        target="_blank"
      >
        <v-icon>mdi-whatsapp</v-icon>
      </v-btn> -->

      <!-- </transition> -->
    </v-main>
    <!-- Search items dialog -->
    <search-items-dialog
      style="width: 100%"
      v-if="searchItemsDialog"
    ></search-items-dialog>
    <!-- Subscription Dialog -->
    <subscriptionDialog></subscriptionDialog>

    <!-- ***************************** -->
    <!--  App Footer-->
    <!-- ***************************** -->
    <footerBar class="mt-5"></footerBar>
    <!-- test -->
  </v-app>
</template>
<script>
import navBar from '@/components/framework/navBar';
import footerBar from '@/components/framework/footerBar';
import SocialShare from './shared/socialShare.vue';
import brandNameRouter from '@/components/shared/brandNameRouter';
import CustomDialog from '@/components/shared/CustomDialog.vue';
// Import component
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';
import { mapGetters } from 'vuex';
import * as moment from 'moment';
// import twilio from '@/components/twilio/twilio';
import subscriptionDialog from '@/components/shared/subscriptionDialog';
import CookieConsentDialog from './shared/cookieConsentDialog.vue';
import Cookies from 'js-cookie';
import {
  initChatWidget,
  chatWidgetControls,
} from '@/shared/chat-widget-config';
export default {
  name: 'App',
  components: {
    navBar,
    footerBar,
    Loading,
    subscriptionDialog,
    SocialShare,
    CookieConsentDialog,
    brandNameRouter,
    CustomDialog,
    // twilio,
  },
  data() {
    return {
      currentTime: 0,
      showToolBar: true,
      mini: true,
      // progressing:true
    };
  },
  watch: {
    async currentTime(newValue, oldValue) {
      // Log user out when current time exceeds the token expiry time
      // Getting token ExpiryTime
      if (Cookies.get('papiloomTokenExpiryTime')) {
        const tokenExpiryTime = new Date(
          Cookies.get('papiloomTokenExpiryTime')
        );

        const timeRemainingInMinutes = moment
          .duration(tokenExpiryTime - newValue, 'millisecond')
          .asMinutes();
        // console.log(timeRemainingInMinutes);

        if (tokenExpiryTime && newValue > tokenExpiryTime) {
          // Log out user
          if (this.user && this.token) {
            await this.$store.dispatch('signUserOut');
          }
        } else if (
          timeRemainingInMinutes <= 30 &&
          timeRemainingInMinutes > 29.98
        ) {
          this.handleDialog(
            { timeRemainingInMinutes: 30 },
            'aboutToBeLoggedOut'
          );
        } else if (
          timeRemainingInMinutes <= 5 &&
          timeRemainingInMinutes > 4.98
        ) {
          this.handleDialog(
            { timeRemainingInMinutes: 5 },
            'aboutToBeLoggedOut'
          );
        } else if (
          timeRemainingInMinutes <= 1 &&
          timeRemainingInMinutes > 0.98
        ) {
          this.handleDialog(
            { timeRemainingInMinutes: 'a' },
            'aboutToBeLoggedOut'
          );
        }
      }
    },
    searchItemsDialog(newValue, oldValue) {
      if (!oldValue) {
        this.$store.commit('setItemSearchText', '');
      }
    },
    $route(to, from) {
      // Controlling Side Nav Bar view for survey Respondent view
      this.showSideNavigationDrawer = true;
      this.showToolBar = true;
      this.topFunction();
      // console.log('currentRoute:', to);
    },
    token(newValue, oldValue) {
      if (!this.newValue) {
        this.$vuetify.theme.dark = this.appDark;
        if (this.$route.name !== 'signin') {
          this.$router.push({ name: 'signin' });
        }
      }
    },
    // Assuming `appDark` is a reactive data property or Vuex state
    appDark(newValue) {
      this.setAppThemeFontColor(newValue);
    },
  },
  computed: {
    ...mapGetters([
      'user',
      'token',
      'appDark',
      'appLightBackground',
      'appLightBackground2',
      'initializeAppComplete',
      'statusOverlayText',
      'isStatusOverlay',
      'error',
      'loading',
      'roughnessMatrix',
      'searchItemsDialog',
      // "snackBarText",
      // "targetRequired",
      // "targetLink",
      // "targetText",
    ]),
    customBackground() {
      const customRouteNames = [
        'signin',
        'signup',
        'resetPassword',
        'unsubscribe',
        'userVerification',
      ];
      const currentRouteName = this.$router.currentRoute.name;
      console.log('routename:', currentRouteName);
      return customRouteNames.includes(currentRouteName);
    },
    whatsAppLink() {
      return `https://wa.me/${process.env.VUE_APP_WHATSAPP_NUMBER}`;
    },
    progressing: {
      get() {
        return this.$store.getters.progressing;
      },
      set(value) {
        this.$store.commit('setProgressing', value);
      },
    },
    currentRoute() {
      return this.$route;
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
    showSideNavigationDrawer: {
      get() {
        return this.$store.getters.showSideNavigationDrawer;
      },
      set(value) {
        this.$store.commit('setShowSideNavigationDrawer', value);
      },
    },
    dialogHeading: {
      get() {
        return this.$store.getters.dialogHeading;
      },
      set(value) {
        this.$store.commit('setDialogHeading', value);
      },
    },
    dialogText: {
      get() {
        return this.$store.getters.dialogText;
      },
      set(value) {
        this.$store.commit('setDialogText', value);
      },
    },
    dialogText2: {
      get() {
        return this.$store.getters.dialogText2;
      },
      set(value) {
        this.$store.commit('setDialogText2', value);
      },
    },
    dialogBtn1: {
      get() {
        return this.$store.getters.dialogBtn1;
      },
      set(value) {
        this.$store.commit('setDialogBtn1', value);
      },
    },
    dialogBtn2: {
      get() {
        return this.$store.getters.dialogBtn2;
      },
      set(value) {
        this.$store.commit('setDialogBtn2', value);
      },
    },
    isDialogTips: {
      get() {
        return this.$store.getters.isDialogTips;
      },
      set(value) {
        this.$store.commit('setIsDialogTips', value);
      },
    },
    dialogTipsHeading: {
      get() {
        return this.$store.getters.dialogTipsHeading;
      },
      set(value) {
        this.$store.commit('setDialogTipsHeading', value);
      },
    },
    dialogTipsText: {
      get() {
        return this.$store.getters.dialogTipsText;
      },
      set(value) {
        this.$store.commit('setDialogTipsText', value);
      },
    },
    dialogTipsText2: {
      get() {
        return this.$store.getters.dialogTipsText2;
      },
      set(value) {
        this.$store.commit('setDialogTipsText2', value);
      },
    },
    dialogTipsBtn1: {
      get() {
        return this.$store.getters.dialogTipsBtn1;
      },
      set(value) {
        this.$store.commit('setDialogTipsBtn1', value);
      },
    },
    dialogTipsBtn2: {
      get() {
        return this.$store.getters.dialogTipsBtn2;
      },
      set(value) {
        this.$store.commit('setDialogTipsBtn2', value);
      },
    },
    dialogTableOn: {
      get() {
        return this.$store.getters.dialogTableOn;
      },
      set(value) {
        this.$store.commit('setDialogTableOn', value);
      },
    },
    dialogResult: {
      get() {
        return this.$store.getters.dialogResult;
      },
      set(value) {
        this.$store.commit('setDialogResult', value);
      },
    },
    isDialog: {
      get() {
        return this.$store.getters.isDialog;
      },
      set(value) {
        this.$store.commit('setIsDialog', value);
      },
    },
    dialogContext: {
      get() {
        return this.$store.getters.dialogContext;
      },
      set(value) {
        this.$store.commit('setDialogContext', value);
      },
    },
    logoUrl() {
      return process.env.VUE_APP_BRAND_LOGO_URL;
    },
    brandName() {
      return process.env.VUE_APP_NAME;
    },
  },
  created() {
    // Handling Scroll
    window.addEventListener('scroll', this.handleScroll);
    // Initialize background color on load
    const appDark = this.$store.state.appDark;
    const backgroundColor = appDark
      ? 'var(--toolbar-background-color-dark)'
      : 'var(--toolbar-background-color-light)';
    document.documentElement.style.setProperty(
      '--toolbar-background-color',
      backgroundColor
    );
  },
  async mounted() {
    this.progressing = false;
    window.setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
    this._keyListener = function (e) {
      if (e.key === 'k' && e.metaKey) {
        e.preventDefault();
        this.$nextTick(function () {
          this.$store.commit('setSearchItemsDialog', true);
          // console.log('currentRoute:', this.$route);
        });
      }
    };
    document.addEventListener('keydown', this._keyListener.bind(this));
    this.setAppThemeFontColor(this.appDark);
    // Use a try-catch block to handle potential errors
    try {
      // Initialize the chat widget
      initChatWidget();

      // Add a global error handler for the chat widget
      window.addEventListener('error', (event) => {
        if (event.filename && event.filename.includes('chat-widget.js')) {
          console.error('Chat widget error:', event.error);
        }
      });
    } catch (error) {
      console.error('Failed to initialize chat widget:', error);
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    // Scroll function
    handleScroll() {
      let mybutton = document.getElementById('myBtn');
      if (
        document.body.scrollTop > 100 ||
        document.documentElement.scrollTop > 100
      ) {
        mybutton.style.display = 'block';
      } else {
        mybutton.style.display = 'none';
      }
    },
    // Handling Dialogs
    handleDialog(content, context) {
      this.$store.dispatch('handleDialog', {
        content: content,
        context: context,
      });
    },
    // When the user clicks on the button, scroll to the top of the document
    topFunction() {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    },
    onDismissed() {
      this.$store.commit('setError', null);
    },
    // clearReLogInDialog() {
    //   this.$store.dispatch("clearReLogInDialog");
    // },
    updateReLogInDialog() {
      this.$store.commit('setDisplayReLogInPassword', true);
      this.$store.commit('reLogInDialogHeading', 'Re-Login');
    },
    toggleSideNav() {
      // this.topFunction();
      this.sideNav = !this.sideNav;
    },
    toggleSideAdvancedFilters() {
      this.topFunction();
      this.sideAdavncedItemFilter = !this.sideAdavncedItemFilter;
    },
    test() {
      // console.log('customBackground:', this.customBackground);
    },
    // Clearing Dialog
    clearDialog(result) {
      this.$store.dispatch('clearDialog', { result: result });
    },
    setAppThemeFontColor(isDark) {
      const color = isDark ? 'white' : 'black';
      document.documentElement.style.setProperty(
        '--app-theme-font-color',
        color
      );
    },
    // Add these methods to control the chat widget
    showChatWidget() {
      chatWidgetControls.show();
    },

    hideChatWidget() {
      chatWidgetControls.hide();
    },

    toggleChatWidget() {
      chatWidgetControls.toggle();
    },
  },
};
</script>
<style lang="scss">
@import 'main.css';
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css';
</style>
