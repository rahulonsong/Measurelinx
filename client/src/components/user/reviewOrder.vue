<template>
  <v-container fluid class="ma-0 pa-0">
    <!-- Main data -->
    <div v-if="user && token">
      <v-row justify="center" align="center">
        <!-- <v-btn @click="test">Test</v-btn> -->
        <v-col
          cols="12"
          md="12"
          sm="12"
          style="max-width: 1200px"
          class="text-center"
        >
          <!-- Data Available after Sync actions -->
          <div class="mt-0 pt-0">
            <v-card
              class="mt-0 pb-0 mb-0"
              min-height="500"
              scrollable
              style="border-radius: 0; overflow: auto"
            >
              <!-- checkout title -->
              <v-row class="ma-0 pa-0 d-flex">
                <v-col class="ma-0 pa-0">
                  <v-card-title> Review Order Details </v-card-title>
                </v-col>
              </v-row>
              <!-- Shipping -->
              <v-row class="ma-0 pa-0">
                <v-col class="ma-0 pa-0">
                  <!-- Shipping Info-->
                  <v-card-text class="mx-0 px-0 mb-1">
                    <div class="pb-1">
                      <v-card class="mx-3 py-1" style="border: 1px solid grey">
                        <v-row class="ma-0 pa-0" justify="center">
                          <!-- Address -->
                          <v-col
                            cols="12"
                            md="12"
                            sm="12"
                            class="ma-0 pa-0"
                            align="start"
                          >
                            <v-card-text class="my-1 py-1">
                              <!-- title order aspect -->
                              <v-row class="ma-0 pa-0">
                                <v-col class="ma-0 pa-0">
                                  <p
                                    class="subtitle-1 font-weight-bold ma-0 pa-0"
                                  >
                                    Shipping Address
                                  </p>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col v-if="currentShippingAddress">
                                  <p class="ma-0 pa-0">
                                    {{ currentShippingAddress.addresseeFirst }}
                                    {{ currentShippingAddress.addresseeLast }}
                                  </p>
                                  <p class="ma-0 pa-0">
                                    {{ currentShippingAddress.line1 }}
                                    {{ currentShippingAddress.line2 }}
                                  </p>
                                  <p class="ma-0 pa-0">
                                    {{ currentShippingAddress.cityTown }},
                                    {{ currentShippingAddress.stateProvince }},
                                    {{ currentShippingAddress.postalCode }}
                                  </p>
                                  <p class="ma-0 pa-0">
                                    {{ currentShippingAddress.country }}
                                  </p>
                                  <p class="ma-0 pa-0">
                                    +{{
                                      currentShippingAddress.phoneNumber
                                        .countryCode
                                    }}-{{
                                      currentShippingAddress.phoneNumber
                                        .category === 'Mobile'
                                        ? '(' +
                                          currentShippingAddress.phoneNumber.mobileNumber.substring(
                                            0,
                                            3
                                          ) +
                                          ')-' +
                                          currentShippingAddress.phoneNumber.mobileNumber.substring(
                                            3,
                                            6
                                          ) +
                                          '-' +
                                          currentShippingAddress.phoneNumber.mobileNumber.substring(
                                            6,
                                            10
                                          )
                                        : currentShippingAddress.phoneNumber
                                            .areaCode +
                                          '-' +
                                          currentShippingAddress.localNumber
                                    }}
                                  </p>
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </v-col>
                        </v-row>
                      </v-card>
                    </div>
                  </v-card-text>
                </v-col>
              </v-row>
              <!-- Delivery -->
              <v-row class="ma-0 pa-0">
                <v-col class="ma-0 pa-0">
                  <!-- Title -->
                  <v-row class="ma-0 pa-0" justify="center">
                    <v-col
                      cols="12"
                      class="ma-0 pa-0 text-center"
                      align="center"
                    >
                      <v-card-title class="justify-start ml-1 my-0 py-0"
                        >Items to be billed</v-card-title
                      >
                    </v-col>
                  </v-row>
                  <!-- Item Iterated -->
                  <cart-items class="ml-5" :navBarCart="false"></cart-items>
                </v-col>
              </v-row>
              <!-- Billing -->
              <v-row class="ma-0 pa-0">
                <v-col class="ma-0 pa-0">
                  <!-- Billing Info-->
                  <v-card-text class="mx-0 px-0 mb-1">
                    <div class="pb-1">
                      <v-card class="mx-3 py-1" style="border: 1px solid grey">
                        <v-row class="ma-0 pa-0" justify="center">
                          <!-- Address -->
                          <v-col
                            cols="12"
                            md="12"
                            sm="12"
                            class="ma-0 pa-0"
                            align="start"
                          >
                            <v-card-text class="my-1 py-1">
                              <!-- title order aspect -->
                              <v-row class="ma-0 pa-0">
                                <v-col class="ma-0 pa-0">
                                  <p
                                    class="subtitle-1 font-weight-bold ma-0 pa-0"
                                  >
                                    Billing Address
                                  </p>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col v-if="currentBillingAddress">
                                  <p class="ma-0 pa-0">
                                    {{ currentBillingAddress.addresseeFirst }}
                                    {{ currentBillingAddress.addresseeLast }}
                                  </p>
                                  <p class="ma-0 pa-0">
                                    {{ currentBillingAddress.line1 }}
                                    {{ currentBillingAddress.line2 }}
                                  </p>
                                  <p class="ma-0 pa-0">
                                    {{ currentBillingAddress.cityTown }},
                                    {{ currentBillingAddress.stateProvince }},
                                    {{ currentBillingAddress.postalCode }}
                                  </p>
                                  <p class="ma-0 pa-0">
                                    {{ currentBillingAddress.country }}
                                  </p>
                                  <p class="ma-0 pa-0">
                                    +{{
                                      currentBillingAddress.phoneNumber
                                        .countryCode
                                    }}-{{
                                      currentBillingAddress.phoneNumber
                                        .category === 'Mobile'
                                        ? '(' +
                                          currentBillingAddress.phoneNumber.mobileNumber.substring(
                                            0,
                                            3
                                          ) +
                                          ')-' +
                                          currentBillingAddress.phoneNumber.mobileNumber.substring(
                                            3,
                                            6
                                          ) +
                                          '-' +
                                          currentBillingAddress.phoneNumber.mobileNumber.substring(
                                            6,
                                            10
                                          )
                                        : currentBillingAddress.phoneNumber
                                            .areaCode +
                                          '-' +
                                          currentBillingAddress.localNumber
                                    }}
                                  </p>
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </v-col>
                        </v-row>
                      </v-card>
                    </div>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </div>
    <!-- Displaying The Spinner while loading -->
    <div v-else>
      <progress-circular></progress-circular>
    </div>
  </v-container>
</template>
<script>
// Importing required modules
// import { loadStripe } from '@stripe/stripe-js';
import moment from 'moment';
import { mapGetters } from 'vuex';
export default {
  name: 'billingInfo',
  data() {
    return {
      // reviewsByUserDataReceived: false,
      pageTitle: 'Your Cart',
      progress: null,
      // confirmDialog: false,
      // confirmDialogText: "some Dialog text",
      isDialog: false,
      dialogHeading: '',
      dialogText: '',
      dialogText2: '',
      dialogBtn1: '',
      dialogBtn2: '',
      dialogResult: '',
      dialogContext: '',
      checkoutModel: 1,
      billingAddresses: [],
    };
  },
  computed: {
    ...mapGetters([
      'user',
      'token',
      'error',
      'errorStatus',
      'loading',
      'appDark',
      'appCurrency',
      'appThemeFontColor',
      'validationRules',
      'initializeAppComplete',
      'randomColor',
      'serverDomain',
      // "progressing",
    ]),
    progressing: {
      get() {
        return this.$store.getters.progressing;
      },
      set(value) {
        this.$store.commit('setProgressing', value);
      },
    },
    currentRoute() {
      return this.$router.currentRoute.name;
    },
    currentShippingAddress() {
      if (
        (this.user.addresses && !this.user.addresses.length) ||
        (this.user.addresses &&
          this.user.addresses.length &&
          this.user.addresses[0] === undefined)
      ) {
        return null;
      } else {
        return this.user.addresses.find(
          (address) => address._id === this.cart.shippingAddress
        );
      }
    },
    currentBillingAddress() {
      if (
        (this.user.addresses && !this.user.addresses.length) ||
        (this.user.addresses &&
          this.user.addresses.length &&
          this.user.addresses[0] === undefined)
      ) {
        return null;
      } else {
        return this.user.addresses.find(
          (address) => address._id === this.cart.billingAddress
        );
      }
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
    shippingInfoComplete: {
      get() {
        return this.$store.getters.shippingInfoComplete;
      },
      set(value) {
        this.$store.commit('setShippingInfoComplete', value);
      },
    },
    billingInfoComplete: {
      get() {
        return this.$store.getters.billingInfoComplete;
      },
      set(value) {
        this.$store.commit('setBillingInfoComplete', value);
      },
    },
    deliveryInfoComplete: {
      get() {
        return this.$store.getters.deliveryInfoComplete;
      },
      set(value) {
        this.$store.commit('setDeliveryInfoComplete', value);
      },
    },
    reviewOrderComplete: {
      get() {
        return this.$store.getters.reviewOrderComplete;
      },
      set(value) {
        this.$store.commit('setReviewOrderComplete', value);
      },
    },
    addressContext: {
      get() {
        return this.$store.getters.addressContext;
      },
      set(value) {
        this.$store.commit('setAddressContext', value);
      },
    },
    addressDialog: {
      get() {
        return this.$store.getters.addressDialog;
      },
      set(value) {
        this.$store.commit('setAddressDialog', value);
      },
    },
  },
  async created() {
    // this.test();
    // setting resourceReceivedFlag to false
  },
  mounted() {
    this.$nextTick(function () {
      this.progressing = false;
    });
    // this.reviewsByUserDataReceived = true;
  },
  watch: {
    initializeAppComplete(newValue, oldValue) {
      if (oldValue === false) {
        //   Do action for this Page
      }
    },
    $route(to, from) {
      // Check data received and perform action
      // this.getReviewsByUser();
    },
  },
  methods: {
    clearDialog(result) {
      this.dialogResult = result;
      if (result === 'yes') {
        // if (this.dialogContext === "disableResource") {
        //   this.handleDisableAlphaResource();
        // }
      }
      this.dialogHeading = '';
      this.isDialog = false;
      this.dialogText = '';
      this.dialogText2 = '';
      this.dialogBtn1 = '';
      this.dialogBtn2 = '';
      this.dialogContext = '';
      this.dialogResult = '';
    },
    handleDialog(content, context) {
      // Setting context
      switch (context) {
        // case "disableResource":
        //   this.dialogContext = "disableResource";
        //   break;

        default:
          break;
      }
      // performing action
      switch (this.dialogContext) {
        // case "disableResource":
        //   this.dialogHeading = "Confirm Disabling Resource";
        //   this.dialogText =
        //     "Are you sure you want to disable this resource? This can be enabled later from database. data will remain in the database.";
        //   this.dialogBtn1 = "Cancel";
        //   this.dialogBtn2 = "Yes";
        //   this.isDialog = true;
        //   break;

        default:
          break;
      }
    },
    test() {
      // console.log('currentShippingAddress:', this.currentShippingAddress);
    },
    convertTimestamp(date) {
      return moment(date).format('MMM DD, YYYY');
    },
    enableSnackBar(targetRequired, targetText, targetLink) {
      // Assign snackbar parameters
      this.targetRequired = targetRequired;
      this.targetText = targetText;
      this.targetLink = targetLink;
      // show snackbar
      this.$store.commit('setSnackBar', true);
    },
    maskify(cc) {
      return cc.replace(/.(?=.{4})/g, '#');
    },
    evaluateCardType(cardNumber) {
      const pattern1 = /^(?:5[1-5][0-9]{14})$/;
      const pattern2 = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
      const pattern3 = /^(?:3[47][0-9]{13})$/;
      if (pattern1.test(cardNumber)) {
        return 'Master Card';
      } else if (pattern2.test(cardNumber)) {
        return 'Visa Card';
      } else if (pattern3.test(cardNumber)) {
        return 'American Express Card';
      }
    },
  },
};
</script>
<style>
.billing-address__card {
  cursor: pointer;
  color: rgb(196, 74, 74);
}
.pointerMouse {
  cursor: auto;
  color: rgb(196, 74, 74);
}
.rightJustified {
  text-align: right;
}
.myfont1 {
  font-size: 14px;
}
.sizeWidth {
  max-width: 30px;
}
.customWidth {
  max-width: 80px;
}
.inputValue input::-webkit-outer-spin-button,
.inputValue input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.disable-events {
  pointer-events: none;
}
.tipsDialogTitleBackground {
  background: #0f0c29; /* fallback for old browsers */
  color: white;
  background: -webkit-linear-gradient(
    to right,
    #24243e,
    #302b63,
    #0f0c29
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #24243e,
    #302b63,
    #0f0c29
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.customDecoration.v-text-field > .v-input__control > .v-input__slot:before {
  border-style: none;
}
.customDecoration.v-text-field > .v-input__control > .v-input__slot:after {
  border-style: none;
}
.image_required__checkbox .v-input__control .v-input__slot label {
  font-size: 14px;
  font-weight: 500;
}
.app__button {
  opacity: 1;
}
.app__button:hover {
  border-color: #302b63;
  color: darkorange;
}
.display__resource-image {
  border-radius: 15px;
}
.stepper-no-transition .v-stepper__content {
  transition: none;
}
.stepper-border__dark {
  border: 1px solid rgb(48, 145, 145) !important;
}
.stepper-border__light {
  border: 1px solid rgb(74, 135, 135) !important;
}
.stepper-background__light {
  background-color: #ede7f6;
}
.v-stepper__label {
  margin: auto;
  justify-content: center;
  justify-self: center;
  justify-items: center;
}
.v-stepper--alt-labels .v-stepper__step {
  flex-basis: 80px;
}
.v-application--is-ltr .v-stepper__label {
  text-align: center;
}
.v-stepper--alt-labels .v-stepper__header .v-divider {
  margin: auto;
}
</style>

<style lang="sass" scoped>
.v-card.on-hover.theme--dark
  background-color: rgba(#FFF, 0.8)
  color: #000

.v-card.on-hover.theme--light
  background-color: rgba(#000, 0.8)
  color: #FFF
</style>
