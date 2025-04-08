<template>
  <v-container fluid class="mx-0 pa-0">
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
              class="mt-0 pb-2 mb-0"
              min-height="500"
              scrollable
              style="border-radius: 0; overflow: auto"
            >
              <!-- checkout title -->
              <v-row class="ma-0 pa-0 d-flex">
                <v-col class="ma-0 pa-0">
                  <v-card-title> Billing Address </v-card-title>
                </v-col>
              </v-row>
              <v-row class="ma-0 pa-0">
                <v-col class="mt-2 mx-5 pa-0 text-right">
                  <v-btn
                    small
                    class="blue app__button"
                    :class="appDark ? 'darken-3' : 'lighten-4'"
                    @click="addNewAddress()"
                  >
                    <v-icon>add_business</v-icon>
                    <span class="ml-2">New Address</span>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row class="ma-0 pa-0">
                <v-col class="ma-0 pa-0">
                  <!-- Billing addresses and Create New Address -->
                  <v-card-text
                    v-if="user.addresses && user.addresses.length"
                    class="mx-0 px-0 mb-3"
                    style="height: 600px"
                  >
                    <div
                      v-for="(address, index) in billingAddresses"
                      :key="'address' + index"
                      :id="'billingAddress' + index"
                    >
                      <!-- Address Card -->
                      <v-hover v-slot="{ hover }" class="mb-2">
                        <div class="pb-3" v-if="address != null">
                          <v-card
                            :elevation="hover ? 16 : 2"
                            :class="{ 'on-hover': hover }"
                            class="mx-3 py-2"
                            style="border: 1px solid grey"
                            :style="
                              cart.billingAddress &&
                              address._id === cart.billingAddress
                                ? 'border: 2px solid skyblue;'
                                : ''
                            "
                            hover
                            @click="assignBillingAddress(address)"
                          >
                            <v-row class="ma-0 pa-0" justify="center">
                              <!-- Address -->
                              <v-col
                                cols="11"
                                md="11"
                                sm="9"
                                class="ma-0 pa-0"
                                align="start"
                              >
                                <v-card-text class="my-2 py-2">
                                  <v-row>
                                    <v-col v-if="address">
                                      <p class="ma-0 pa-0">
                                        {{ address.addresseeFirst }}
                                        {{ address.addresseeLast }}
                                      </p>
                                      <p class="ma-0 pa-0">
                                        {{ address.line1 }} {{ address.line2 }}
                                      </p>
                                      <p class="ma-0 pa-0">
                                        {{ address.cityTown }},
                                        {{ address.stateProvince }},
                                        {{ address.postalCode }}
                                      </p>
                                      <p class="ma-0 pa-0">
                                        {{ address.country }}
                                      </p>
                                      <p class="ma-0 pa-0">
                                        {{ address.phoneNumber.countryCode }}-{{
                                          address.phoneNumber.category ===
                                          'Mobile'
                                            ? '(' +
                                              address.phoneNumber.mobileNumber.substring(
                                                0,
                                                3
                                              ) +
                                              ')-' +
                                              address.phoneNumber.mobileNumber.substring(
                                                3,
                                                6
                                              ) +
                                              '-' +
                                              address.phoneNumber.mobileNumber.substring(
                                                6,
                                                10
                                              )
                                            : address.phoneNumber.areaCode +
                                              '-' +
                                              address.localNumber
                                        }}
                                      </p>
                                      <p
                                        class="ma-0 pa-0"
                                        v-if="address.landmark"
                                      >
                                        Landmark: {{ address.landmark }}
                                      </p>
                                    </v-col>
                                  </v-row>
                                </v-card-text>
                              </v-col>
                              <!-- Checked status -->
                              <v-col cols="3" md="1" sm="3" align-self="center">
                                <v-icon
                                  v-if="
                                    cart.billingAddress &&
                                    address._id === cart.billingAddress
                                  "
                                  class="success--text mb-2"
                                  >check_circle</v-icon
                                >
                              </v-col>
                            </v-row>
                          </v-card>
                        </div>
                      </v-hover>
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
      'appThemeFontColor',
      'validationRules',
      'initializeAppComplete',
      'randomColor',
      'checkoutModel',
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
    billingAddresses: {
      get() {
        return this.$store.getters.billingAddresses;
      },
      set(value) {
        this.$store.commit('setBillingAddresses', value);
      },
    },
  },
  async created() {
    // setting resourceReceivedFlag to false
    // this.test();
    this.reOrderBillingAddresses();
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
      // console.log('cart:', this.cart);
      // console.log('billing addresses:', this.billingAddresses);
    },
    addNewAddress() {
      this.addressContext = 'add';
      this.addressDialog = true;
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
    async assignBillingAddress(address) {
      // this.$nextTick(() => {
      this.cart.billingAddress = address._id;
      await this.updateCart();
      this.$store.commit('setBillingInfoComplete', true);
      this.reOrderBillingAddresses();
      this.$forceUpdate();
      // });
    },
    reOrderBillingAddresses() {
      if (
        !this.user.addresses ||
        (this.user.addresses && !this.user.addresses.length) ||
        (this.user.addresses.length && this.user.addresses[0] == undefined)
      ) {
        return;
      }
      let addresses = this.user.addresses;
      let currentAddress = addresses.find(
        (address) => address._id === this.cart.billingAddress
      );
      let currentIndex = addresses.indexOf(currentAddress);
      let deletedAddress = addresses.splice(currentIndex, 1)[0];
      addresses.unshift(deletedAddress);
      this.billingAddresses = [...addresses];
      this.$nextTick(() => {
        var firstAddress = document.getElementById('billingAddress0');
        firstAddress.scrollIntoView();
        firstAddress.focus();
      });
    },
    async updateCart() {
      try {
        await this.$store.dispatch('updateCart');
      } catch (error) {
        // console.log(error);
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
