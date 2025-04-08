<template>
  <v-container fluid class="ma-0 pa-0">
    <!-- Main data -->
    <div v-if="user && token" class="ma-0 pa-0">
      <v-row justify="center" align="center" class="ma-0 pa-0">
        <!-- <v-btn @click="test">Test</v-btn> -->
        <v-col cols="12" md="12" sm="12" class="text-center ma-0 pr-0 pl-3">
          <!-- Title  -->
          <v-row class="ma-0 pa-0" justify="start">
            <v-col cols="12" class="ma-0 pa-0 text-left" align="center">
              <v-card-title class="justify-start mx-0 px-0"
                >Order Summary</v-card-title
              >
            </v-col>
          </v-row>
          <!-- Order Summary Details -->
          <v-row class="ml-0 mb-5 pa-0" justify="start">
            <v-col cols="12" class="ma-0 pa-0" align="start">
              <div class="ml-3 mr-10">
                <!-- subtotal -->
                <v-row class="my-2 pa-0 appFont1">
                  <v-col class="ma-0 pa-0" cols="8">Item Subtotal</v-col>
                  <v-col cols="4" class="ma-0 pa-0 text-right"
                    >{{ appCurrency }}
                    {{
                      (Math.round(itemTotalBeforeDiscount * 100) / 100).toFixed(
                        2
                      )
                    }}</v-col
                  >
                </v-row>
                <!-- Order Discounts -->
                <v-row class="my-2 pa-0 appFont1">
                  <v-col class="ma-0 pa-0" cols="8">You save</v-col>
                  <v-col
                    cols="4"
                    class="ma-0 pa-0 text-right red--text text--darken-4 font-weight-medium"
                  >
                    - {{ appCurrency }}
                    {{
                      (Math.round(cartDiscount * 100) / 100).toFixed(2)
                    }}</v-col
                  >
                </v-row>
                <!-- Item total after discounts -->
                <v-row class="my-2 pa-0 appFont1">
                  <v-col class="ma-0 pa-0" cols="8">Total After Discount</v-col>
                  <v-col
                    cols="4"
                    class="ma-0 pa-0 text-right text--darken-4 font-weight-medium"
                  >
                    {{ appCurrency }}
                    {{
                      (Math.round(cartSubTotal * 100) / 100).toFixed(2)
                    }}</v-col
                  >
                </v-row>
                <!-- Promo code and shipping stuff , Total Exstimate-->
                <div v-if="checkoutModel === 4">
                  <!-- Adding promo code -->
                  <v-form
                    @submit.prevent="checkPromoCode"
                    class="ma-0 pa-0"
                    v-model="isPromocodeFormValid"
                    ref="promoCodeForm"
                  >
                    <v-row
                      v-if="!isPromoCodeVerified && promoCodeActive"
                      class="my-2 pa-0 d-flex"
                    >
                      <div></div>
                      <v-col class="ma-0 pa-0" cols="4">Promo Code</v-col>
                      <!-- <v-spacer></v-spacer> -->
                      <v-col
                        cols="6"
                        md="3"
                        sm="4"
                        style="min-width: 150px"
                        class="ma-0 pa-0"
                      >
                        <v-text-field
                          id="promo__code--textbox"
                          class="ma-0 pa-0"
                          dense
                          outlined
                          v-model="promoCode"
                          append-icon="mdi-tag"
                        ></v-text-field>
                      </v-col>
                      <!-- Remove promotion -->
                      <v-tooltip
                        v-if="!isPromoCodeVerified"
                        bottom
                        class="mx-5"
                      >
                        <template v-slot:activator="{ on }">
                          <v-btn
                            v-on="on"
                            x-small
                            icon
                            @click="removePromotion()"
                            class="ml-5 mt-1 error"
                          >
                            <v-icon>close</v-icon>
                          </v-btn>
                        </template>
                        <span>Remove Promotion</span>
                      </v-tooltip>
                    </v-row>
                    <!-- Verify promo code -->
                    <v-row class="ma-0 pa-0" justify="start">
                      <v-col class="ma-0 pa-0 d-flex text-left">
                        <v-btn
                          v-if="!isPromoCodeVerified && promoCode"
                          :disabled="!isPromocodeFormValid || !promoCode"
                          small
                          @click="checkPromoCode"
                          class="font-weight-bold app__button"
                          :class="appDark ? 'blue darken-4' : 'blue lighten-4'"
                        >
                          <v-icon small left>mdi-check</v-icon>
                          Verify
                        </v-btn>
                        <v-spacer></v-spacer>
                        <!-- Manage Promotion -->
                        <v-btn
                          v-if="
                            (!promoCodeActive && !isPromoCodeVerified) ||
                            (promoCode && isPromoCodeVerified)
                          "
                          small
                          @click="managePromoCode()"
                          class="font-weight-bold app__button mr-0"
                          :class="
                            appDark ? 'green darken-4' : 'green lighten-4'
                          "
                        >
                          <v-icon small left>{{
                            promoCode ? 'mdi-pencil' : 'mdi-plus'
                          }}</v-icon>
                          {{
                            promoCode ? 'Change promoCode' : 'Apply promotion'
                          }}
                        </v-btn>
                        <!-- Remove promotion -->
                        <v-tooltip
                          v-if="isPromoCodeVerified"
                          bottom
                          class="mx-5"
                        >
                          <template v-slot:activator="{ on }">
                            <v-btn
                              v-on="on"
                              x-small
                              icon
                              @click="removePromotion()"
                              class="ml-5 mt-1 error"
                            >
                              <v-icon>close</v-icon>
                            </v-btn>
                          </template>
                          <span>Remove Promotion</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-form>
                  <!-- Verified Promo code -->
                  <v-row v-if="isPromoCodeVerified" class="my-2 pa-0 appFont1">
                    <v-col class="ma-0 pa-0" cols="8">Promotion Applied</v-col>
                    <v-col cols="4" class="ma-0 pa-0 text-right"
                      ><v-icon class="mr-2" color="primary">verified</v-icon
                      >{{ verifiedPromoCode }}</v-col
                    >
                  </v-row>
                  <!-- promotion applied -->
                  <v-row v-if="isPromoCodeVerified" class="my-2 pa-0 appFont1">
                    <v-col class="ma-0 pa-0" cols="8">Promotion Applied</v-col>
                    <v-col cols="4" class="ma-0 pa-0 text-right"
                      >{{ appCurrency
                      }}{{
                        (Math.round(promotionalDiscount * 100) / 100).toFixed(2)
                      }}</v-col
                    >
                  </v-row>
                  <!-- Estimated Tax -->
                  <v-row
                    v-if="appCurrencyText === 'cad'"
                    class="my-2 pa-0 appFont1"
                  >
                    <v-col class="ma-0 pa-0" cols="8">Estimated Tax</v-col>
                    <v-col cols="4" class="ma-0 pa-0 text-right"
                      >{{ appCurrency }}
                      {{
                        (Math.round(cartTaxAfterPromotion * 100) / 100).toFixed(
                          2
                        )
                      }}</v-col
                    >
                  </v-row>
                  <!-- Items Total after tax and discount -->
                  <v-row class="my-2 pa-0 appFont1">
                    <v-col class="ma-0 pa-0" cols="8"
                      >Item total after discount</v-col
                    >
                    <v-col
                      v-if="appCurrencyText === 'cad'"
                      cols="4"
                      class="ma-0 pa-0 text-right"
                      >{{ appCurrency }}
                      {{
                        (
                          Math.round(itemTotalAfterDiscount * 100) / 100
                        ).toFixed(2)
                      }}</v-col
                    >
                  </v-row>
                  <!-- Estimated Shipping -->
                  <v-row class="my-2 pa-0 appFont1">
                    <v-col class="ma-0 pa-0" cols="8">Estimated Shipping</v-col>
                    <v-col cols="4" class="ma-0 pa-0 text-right"
                      >{{ appCurrency }}
                      {{
                        (Math.round(cartShippingFee * 100) / 100).toFixed(2)
                      }}</v-col
                    >
                  </v-row>
                  <!-- Estimated Total -->
                  <v-row class="mt-10 pa-0 appFont1 font-weight-medium">
                    <v-col class="ma-0 pa-0" cols="8">Estimated Total</v-col>
                    <v-col cols="4" class="ma-0 pa-0 text-right"
                      >{{ appCurrency }}
                      {{
                        (Math.round(estimatedTotal * 100) / 100).toFixed(2)
                      }}</v-col
                    >
                  </v-row>
                </div>
              </div>
              <!-- Proceed to Checkout -->
              <v-row class="mt-10 pa-0 mr-5" justify="center" dense>
                <v-col cols="12" class="ma-0 pa-0" align="center">
                  <!-- Continue -->
                  <v-btn
                    :disabled="!continueToNextSection"
                    style="width: 100%; max-width: 500px"
                    text
                    class="app__button mx-0 px-0"
                    :class="appDark ? 'blue darken-4' : 'blue lighten-4'"
                    @click="proceedToCheckout()"
                  >
                    <v-icon v-if="currentRoute !== 'checkout'"
                      >shopping_cart_checkout</v-icon
                    >
                    <span
                      :class="currentRoute !== 'checkout' ? 'ml-2' : 'ml-0'"
                      >{{
                        currentRoute === 'checkout' && checkoutModel === 4
                          ? 'Place Order'
                          : currentRoute === 'checkout'
                          ? 'Continue'
                          : 'Proceed to Checkout'
                      }}</span
                    >
                  </v-btn>
                  <!-- Back -->
                  <v-btn
                    style="width: 100%; max-width: 500px"
                    text
                    v-if="
                      currentRoute === 'checkout' &&
                      this.checkoutModel > 1 &&
                      this.checkoutModel !== '1'
                    "
                    class="app__button mx-0 px-0 mt-5"
                    :class="appDark ? 'green darken-4' : 'green lighten-4'"
                    @click="goToPreviousSection()"
                  >
                    Back
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
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
import { eventBus } from '../../shared/eventBus';
export default {
  name: 'orderSummary',
  data() {
    return {
      // reviewsByUserDataReceived: false,
      pageTitle: 'Your Cart',
      isPromoCodeVerified: false,
      verifiedPromoCode: '',
      progress: null,
      isPromocodeFormValid: false,
      promoCode: '',
      promotionalDiscount: null,
      promoCodeInfo: null,
      promoCodeActive: false,
      // confirmDialog: false,
      // confirmDialogText: "some Dialog text",
    };
  },
  computed: {
    ...mapGetters([
      'user',
      'token',
      'error',
      'errorStatus',
      'loading',
      'appCurrency',
      'appCurrencyText',
      'appDark',
      'appThemeFontColor',
      'validationRules',
      'initializeAppComplete',
      'randomColor',
      'cartSubTotal',
      'cartDiscount',
      'cartShippingFee',
      'cartConvenienceFee',
      // "cartTotal",
      'cartTax',
      'serverDomain',
      'addCellNumberDialog',
      'defaultCart',
      'orderInProgressPhoneVerificationFlag',
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
    itemTotalBeforeDiscount() {
      return this.cartSubTotal + this.cartDiscount;
    },
    itemTotalAfterDiscount() {
      switch (this.appCurrencyText) {
        case 'cad':
          // Calculate in cents to avoid floating point issues
          const subtotalCents = Math.round(this.cartSubTotal * 100);
          const discountCents = Math.round(
            (this.promotionalDiscount || 0) * 100
          );
          const taxCents = Math.round(this.cartTaxAfterPromotion * 100);

          // Calculate the total in cents
          const totalCents = subtotalCents - discountCents + taxCents;

          // Convert back to dollars
          return totalCents / 100;

        case 'inr':
          // Calculate in paise to avoid floating point issues
          const inrSubtotalPaise = Math.round(this.cartSubTotal * 100);
          const inrDiscountPaise = Math.round(
            (this.promotionalDiscount || 0) * 100
          );

          // Calculate the total in paise and convert back to rupees
          return (inrSubtotalPaise - inrDiscountPaise) / 100;

        default:
          return 0; // Handle unexpected cases
      }
    },

    estimatedTotal() {
      switch (this.appCurrencyText) {
        case 'cad':
          // First calculate the subtotal and tax without rounding intermediate results
          const subtotal = this.cartSubTotal;
          const tax = this.cartTaxAfterPromotion; // This now uses ceiling function
          const discount = this.promotionalDiscount || 0;
          const shippingFee = this.cartShippingFee;

          // Calculate total using exact math that matches Stripe's calculation
          // We want to avoid floating point issues, so calculate in cents
          const totalInCents =
            Math.round(subtotal * 100) +
            Math.round(tax * 100) -
            Math.round(discount * 100) +
            Math.round(shippingFee * 100);

          // Convert back to dollars with 2 decimal places
          return totalInCents / 100;

        case 'inr':
          // For INR, use the same approach without tax
          const inrSubtotal = this.cartSubTotal;
          const inrDiscount = this.promotionalDiscount || 0;
          const inrShippingFee = this.cartShippingFee;

          // Calculate in cents to avoid floating point issues
          const inrTotalInCents =
            Math.round(inrSubtotal * 100) -
            Math.round(inrDiscount * 100) +
            Math.round(inrShippingFee * 100);

          // Convert back to rupees with 2 decimal places
          return inrTotalInCents / 100;

        default:
          return 0; // Handle unexpected cases
      }
    },

    cartTaxAfterPromotion() {
      if (!this.cartSubTotal || !process.env.VUE_APP_REGIONAL_TAX) {
        return 0; // Return 0 if required values are missing
      }

      const taxableAmount = this.cartSubTotal - this.promotionalDiscount;
      const taxRate = parseFloat(process.env.VUE_APP_REGIONAL_TAX) / 100;

      // Calculate the tax amount
      const taxAmount = taxableAmount * taxRate;

      // Stripe rounds tax calculations to the nearest cent (not ceiling)
      // Using Math.round ensures we match Stripe's tax calculation precisely
      const roundedTax = Math.round(taxAmount * 100) / 100;

      return roundedTax >= 0 ? roundedTax : 0; // Ensure the result is non-negative
    },

    currentRoute() {
      return this.$router.currentRoute.name;
    },
    continueToNextSection() {
      if (this.currentRoute !== 'checkout') {
        return true;
      }

      const step = parseInt(this.checkoutModel);

      switch (step) {
        case 1: // Shipping step
          return (
            this.cart &&
            this.cart.shippingAddress &&
            this.user.addresses.some(
              (addr) => addr._id === this.cart.shippingAddress
            )
          );

        case 2: // Delivery step
          return true;

        case 3: // Billing step
          return (
            this.cart &&
            this.cart.billingAddress &&
            this.user.addresses.some(
              (addr) => addr._id === this.cart.billingAddress
            )
          );

        case 4: // Review step
          return this.cart && this.cart.items && this.cart.items.length > 0;

        default:
          return false;
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
  },
  async created() {
    // Cell number verification has been removed, so we don't need to check for previous route
    this.checkoutModel = 1;
  },
  beforeDestroy() {
    // No event listener to remove since we no longer use cell number verification
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
    cartSubTotal() {
      if (this.promoCodeInfo && this.promoCodeInfo.valid) {
        switch (this.promoCodeInfo.discountType) {
          case 'percent':
            switch (this.appCurrencyText) {
              case 'cad':
                // Use Math.round for consistent rounding with backend
                this.promotionalDiscount =
                  Math.round(
                    ((this.cartSubTotal * this.promoCodeInfo.discountValue) /
                      100) *
                      100
                  ) / 100;
                break;
              case 'inr':
                // Use Math.round for consistent rounding with backend
                this.promotionalDiscount =
                  Math.round(
                    ((this.cartSubTotal * this.promoCodeInfo.discountValue) /
                      100) *
                      100
                  ) / 100;
                break;

              default:
                break;
            }

            break;
          case 'amount':
            this.promotionalDiscount = this.promoCodeInfo.discountValue;
            break;
          default:
            break;
        }
      }
    },
    checkoutModel(new_value, old_value) {
      this.$nextTick(() => {
        if (this.$refs.promoCodeForm) {
          this.$refs.promoCodeForm.resetValidation();
        }
      });
    },
  },
  methods: {
    test() {
      console.log('App Currency:', this.appCurrency);
    },
    managePromoCode() {
      if (!this.promoCode) {
        this.promoCodeActive = true;
        this.$nextTick(() => {
          // Set focus on promo code text field
          const promoCodeInput = document.getElementById(
            'promo__code--textbox'
          );
          if (promoCodeInput) promoCodeInput.focus();
        });
      } else {
        this.promoCodeActive = true;
        this.isPromoCodeVerified = false;
        this.promoCode = '';
        this.promotionalDiscount = 0;
        this.promoCodeInfo = null;
      }
    },
    removePromotion() {
      this.promoCodeActive = false;
      this.isPromoCodeVerified = false;
      this.promoCode = '';
      this.promotionalDiscount = 0;
      this.promoCodeInfo = null;
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
    async proceedToCheckout() {
      if (this.currentRoute === 'checkout' && this.checkoutModel === 4) {
        // Cell number verification has been removed to make the process more user-friendly

        // Prepare the payment payload
        const payload = {
          orderInput: {
            items: this.cart.items.map((itemObj) => ({
              item: itemObj.item._id,
              quantity: itemObj.quantity,
            })),
            billingAddress: this.cart.billingAddress,
            shippingAddress: this.cart.shippingAddress,
            promoCode: this.verifiedPromoCode || '',
            promotion: {
              isPercentage: this.promoCodeInfo?.valid
                ? this.promoCodeInfo.discountType === 'percent'
                : false,
              value: this.promoCodeInfo?.valid
                ? this.promoCodeInfo.discountValue
                : 0,
            },
            subTotal: this.estimatedTotal,
            // Add tax calculation to ensure the backend knows our exact calculation
            // tax: this.cartTaxAfterPromotion,
          },
        };

        // Start server action
        this.$store.dispatch('initializeServerAction');

        try {
          // Generate Stripe payment URL
          const paymentUrlObj = await this.$store.dispatch(
            'generateStripePaymentUrl',
            payload
          );

          // End server action
          this.$store.dispatch('endServerAction');

          if (paymentUrlObj && paymentUrlObj.url) {
            // Redirect user to Stripe Checkout
            window.location = paymentUrlObj.url;
          } else {
            console.error('Failed to generate Stripe payment URL');
            this.goToNextSection(); // Move to the next section even if payment fails
          }
        } catch (error) {
          console.error('Error during payment initialization:', error);
          this.$store.dispatch('endServerAction');
          this.goToNextSection(); // Ensure user can proceed to the next section on error
        }
      } else if (this.currentRoute === 'checkout') {
        this.goToNextSection();
      } else {
        if (this.$route.name !== 'checkout') {
          this.$router.push({ name: 'checkout' });
        }
      }
    },

    goToNextSection() {
      // alert("This progresses to next section");
      this.checkoutModel++;
    },
    goToPreviousSection() {
      this.checkoutModel--;
    },
    async checkPromoCode() {
      if (this.$refs.promoCodeForm.validate()) {
        const payload = {
          checkPromoCodeInput: {
            promoCode: this.promoCode,
          },
        };

        this.promoCodeInfo = await this.$store.dispatch(
          'checkPromoCode',
          payload
        );
        if (this.promoCodeInfo && this.promoCodeInfo.valid) {
          this.isPromoCodeVerified = true;
          this.verifiedPromoCode = this.promoCode;

          switch (this.promoCodeInfo.discountType) {
            case 'percent':
              switch (this.appCurrencyText) {
                case 'cad':
                  // Use Math.round for consistent rounding with backend
                  this.promotionalDiscount =
                    Math.round(
                      ((this.cartSubTotal * this.promoCodeInfo.discountValue) /
                        100) *
                        100
                    ) / 100;
                  break;
                case 'inr':
                  // Use Math.round for consistent rounding with backend
                  this.promotionalDiscount =
                    Math.round(
                      ((this.cartSubTotal * this.promoCodeInfo.discountValue) /
                        100) *
                        100
                    ) / 100;
                  break;

                default:
                  break;
              }

              break;
            case 'amount':
              this.promotionalDiscount = this.promoCodeInfo.discountValue;
              break;
            default:
              break;
          }
        }
      }
    },
    handleDialog(content, context) {
      this.$store.dispatch('handleDialog', {
        content,
        context,
      });
    },
  },
};
</script>
<style>
.shipping-address__card {
  cursor: pointer;
  color: rgb(196, 74, 74);
}
.shipping-address__card .v-card :hover {
  border: #302b63 solid 1mm;
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
</style>
