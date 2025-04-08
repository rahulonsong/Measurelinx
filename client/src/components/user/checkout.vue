<template>
  <v-container fluid>
    <!-- Ediatable Dialog -->
    <confirm-dialog
      :isDialog="isDialog"
      :dialogHeading="dialogHeading"
      :dialogText="dialogText"
      :dialogText2="dialogText2"
      :dialogBtn1="dialogBtn1"
      :dialogBtn2="dialogBtn2"
      @confirmedNo="clearDialog('no')"
      @confirmedYes="clearDialog('yes')"
    ></confirm-dialog>
    <!-- Addres DIalog -->
    <address-dialog
      @userAddressesUpdated="triggerAddressUpdate()"
    ></address-dialog>
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
            <v-card class="mt-0 pt-0">
              <!-- checkout title -->
              <v-card-title>
                <v-icon
                  :color="appDark ? 'orange lighten-3' : 'orange darken-3'"
                  >enhanced_encryption</v-icon
                >
                <span class="ml-2">Secure Checkout</span>
              </v-card-title>
              <v-row class="ma-0 pa-0">
                <!-- Checkout steps -->
                <v-col cols="12" sm="12" md="8" class="ma-0 pa-0" align="start">
                  <!-- Checkout process steps -->
                  <v-stepper
                    id="checkout__v-stepper--content"
                    v-model="checkoutModel"
                    alt-labels
                    class="mx-3 px-0 mb-3 stepper-no-transition"
                    :class="
                      appDark ? 'stepper-border__dark' : 'stepper-border__light'
                    "
                  >
                    <!-- Displaying the  Step Headers -->
                    <v-stepper-header class="pa-0 ma-0 body-2">
                      <!-- Stepper for "Shipping" -->
                      <v-stepper-step
                        :complete="shippingInfoComplete"
                        step="1"
                        :editable="shippingInfoComplete && checkoutModel > 1"
                        :edit-icon="shippingInfoComplete ? 'check' : 'edit'"
                        :complete-icon="'check'"
                        class="mx-0 px-0"
                      >
                        Shipping
                      </v-stepper-step>
                      <v-divider></v-divider>
                      <!-- Stepper for "Delivery of items" -->
                      <v-stepper-step
                        :complete="deliveryInfoComplete"
                        :editable="deliveryInfoComplete && checkoutModel > 2"
                        step="2"
                        :edit-icon="deliveryInfoComplete ? 'check' : 'edit'"
                        :complete-icon="'check'"
                        class="mx-0 px-0"
                      >
                        Delivery
                      </v-stepper-step>
                      <v-divider></v-divider>
                      <!-- Stepper for "Billing" -->
                      <v-stepper-step
                        :complete="billingInfoComplete"
                        step="3"
                        :editable="billingInfoComplete && checkoutModel > 3"
                        :edit-icon="billingInfoComplete ? 'check' : 'edit'"
                        :complete-icon="'check'"
                        class="mx-0 px-0"
                      >
                        Billing
                      </v-stepper-step>
                      <v-divider></v-divider>
                      <!-- Stepper for "Review" -->
                      <v-stepper-step
                        :complete="reviewOrderComplete"
                        :editable="reviewOrderComplete && checkoutModel >= 4"
                        step="4"
                        :edit-icon="reviewOrderComplete ? 'check' : 'edit'"
                        :complete-icon="'check'"
                        class="mx-0 px-0"
                      >
                        Review
                      </v-stepper-step>
                    </v-stepper-header>
                    <!-- Displaying  Step Content -->
                    <v-stepper-items class="mx-0 px-0">
                      <!-- Main Steps Checkout process -->
                      <span style="overflow: auto; max-height: 600px">
                        <!-- Stepper Content for "Shipping -->
                        <v-stepper-content step="1" class="my-0 py-0 mx-0 px-0">
                          <shipping-info></shipping-info>
                        </v-stepper-content>
                        <!-- Displaying Delivery of items -->
                        <v-stepper-content step="2" class="ma-0 pa-0">
                          <delivery-info></delivery-info>
                        </v-stepper-content>
                        <!-- Stepper Content for "Billing -->
                        <v-stepper-content step="3" class="my-0 py-0 mx-0 px-0">
                          <billing-info></billing-info>
                        </v-stepper-content>
                        <!-- Displaying Review -->
                        <v-stepper-content
                          step="4"
                          class="my-0 py-0 mx-0 px-0"
                          style="overflow: auto; max-height: 600px"
                        >
                          <review-order></review-order>
                        </v-stepper-content>
                      </span>
                    </v-stepper-items>
                  </v-stepper>
                </v-col>
                <!-- order summary -->
                <v-col
                  cols="12"
                  sm="12"
                  md="4"
                  align="center"
                  align-self="start"
                  class="mt-n8 pa-0"
                >
                  <order-summary></order-summary>
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
  name: 'checkout',
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
      // "user",
      'token',
      'error',
      'errorStatus',
      'loading',
      'appDark',
      'appThemeFontColor',
      'validationRules',
      'reviewsByUserDataReceived',
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
    cloneFlag: {
      get() {
        return this.$store.getters.cloneFlag;
      },
      set(value) {
        this.$store.commit('setCloneFlag', value);
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
    user: {
      get() {
        return this.$store.getters.user;
      },
      set(value) {
        this.$store.commit('setUser', value);
      },
    },
    checkoutModel: {
      get() {
        return this.$store.getters.checkoutModel;
      },
      set(value) {
        this.$store.commit('setCheckoutModel', value);
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
    shippingAddresses: {
      get() {
        return this.$store.getters.shippingAddresses;
      },
      set(value) {
        this.$store.commit('setShippingAddresses', value);
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
    let user = this.user;
    // Updating store
    this.$store.commit('setUser', user);
    // setting resourceReceivedFlag to false
    if (this.cart.shippingAddress) {
      this.shippingInfoComplete = true;
    }
    if (this.cart.billingAddress) {
      this.billingInfoComplete = true;
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.progressing = false;
    });
  },
  watch: {
    initializeAppComplete(newValue, oldValue) {
      if (oldValue === false) {
        //   Do action for this Page
        this.getReviewsByUser();
      }
    },
    $route(to, from) {
      // Check data received and perform action
      this.getReviewsByUser();
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
      // console.log('checkoutModel:', this.checkoutModel);
      // console.log('cart:', this.cart);
      // console.log('ResourceContent:', this.alphaResourceContent);
    },
    convertTimestamp(date) {
      return moment(date).format('MMM DD, YYYY');
    },
    async incrementQuantity(index) {
      if (
        this.cart.items[index].item.stock <= this.cart.items[index].quantity
      ) {
        alert(
          'Sorry! This is the maximum quantity that can be ordered at this point.'
        );
        return;
      }
      this.cart.items[index].quantity++;
      // Update database
      await this.updateCart();
    },
    async decrementQuantity(index) {
      let itemRemoved = false;
      if (this.cart.items[index].quantity === 1) {
        this.snackBarText = 'item removed from the cart';
        this.cart.items.splice(index, 1);
      } else {
        this.cart.items[index].quantity--;
      }
      // Update database
      await this.updateCart();
      // Enable snackBar

      if (itemRemoved) this.enableSnackBar(true, 'View Cart', '/cart');
    },
    async removeItem(index) {
      this.snackBarText = 'item removed from the cart';
      this.cart.items.splice(index, 1);
      // Update database
      await this.updateCart();
      this.enableSnackBar(true, 'View Cart', '/cart');
    },
    enableSnackBar(targetRequired, targetText, targetLink) {
      // Assign snackbar parameters
      this.targetRequired = targetRequired;
      this.targetText = targetText;
      this.targetLink = targetLink;
      // show snackbar
      this.$store.commit('setSnackBar', true);
    },
    async updateCart() {
      try {
        await this.$store.dispatch('updateCart');
      } catch (error) {
        // console.log(error);
      }
    },
    goViewItem(route) {
      try {
        if (this.$router.currentRoute.fullPath !== `/items/${route}`) {
          this.$router.push(`/items/${route}`);
        }
      } catch (error) {
        // console.log(error);
      }
    },
    goToNextSection() {
      this.checkoutModel++;
      this.shippingInfoComplete = true;
    },
    triggerAddressUpdate() {
      this.reOrderShippingAddresses();
      this.reOrderBillingAddresses();
    },
    reOrderShippingAddresses() {
      if (
        !this.user.addresses ||
        (this.user.addresses && !this.user.addresses.length) ||
        (this.user.addresses.length && this.user.addresses[0] == undefined)
      ) {
        return;
      }
      let addresses = this.user.addresses;
      let currentAddress = addresses.find(
        (address) => address._id === this.cart.shippingAddress
      );
      let currentIndex = addresses.indexOf(currentAddress);
      let deletedAddress = addresses.splice(currentIndex, 1)[0];
      addresses.unshift(deletedAddress);
      this.shippingAddresses = [...addresses];
      this.$nextTick(() => {
        var firstAddress = document.getElementById('shippingAddress0');
        firstAddress.scrollIntoView();
        firstAddress.focus();
      });
      this.$forceUpdate();
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
  },
};
</script>
<style>
.checkout-container {
  background-color: var(--v-background-base, #f5f5f5);
  min-height: calc(100vh - 64px);
}

.checkout-wrapper {
  margin-top: 16px;
}

.checkout-card {
  border-radius: 8px;
  overflow: hidden;
}

.checkout-title {
  border-bottom: 1px solid var(--v-border-base, #e0e0e0);
  background-color: var(--v-surface-base, #ffffff);
}

.checkout-stepper {
  border-radius: 4px;
  background-color: transparent !important;
}

.stepper-border__light {
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.stepper-border__dark {
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
}

.v-stepper__header {
  box-shadow: none !important;
  border-bottom: 1px solid var(--v-border-base, #e0e0e0);
}

.v-stepper__step {
  padding: 24px 0;
}

.v-stepper__step__step {
  margin-right: 8px;
}

.order-summary-wrapper {
  position: sticky;
  top: 24px;
}

.order-summary-col {
  border-left: 1px solid var(--v-border-base, #e0e0e0);
}

@media (max-width: 959px) {
  .order-summary-col {
    border-left: none;
    border-top: 1px solid var(--v-border-base, #e0e0e0);
  }

  .order-summary-wrapper {
    position: static;
  }

  .checkout-card {
    border-radius: 0;
  }
}

.v-stepper--alt-labels .v-stepper__header .v-divider {
  margin: 35px -67px 0;
}

/* Custom styling for active step */
.v-stepper__step--active .v-stepper__label {
  color: var(--v-primary-base) !important;
  font-weight: 600;
}

/* Improve stepper step appearance */
.v-stepper__step__step {
  height: 32px !important;
  width: 32px !important;
  font-size: 14px;
}

/* Add transition for smooth step changes */
.v-stepper-content {
  transition: all 0.3s ease-in-out;
}
</style>
<style scoped>
.v-stepper__header >>> .v-stepper__label {
  display: block !important;
}
</style>
