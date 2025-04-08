<template>
  <div>
    <v-row class="ma-0 pa-0">
      <v-col class="ma-0 pa-0">
        <v-card-text
          class="my-0 py-0 mr-2 ml-0 px-1"
          style="flex-grow: 1; overflow: auto"
        >
          <v-row
            v-for="(el, index) in cart.items"
            :key="'item' + index"
            class="my-1 mx-0 px-0 py-0 d-flex"
            justify="start"
          >
            <v-col class="ma-0 pa-0">
              <v-row class="ma-0 pa-0">
                <!-- Item image -->
                <v-col
                  cols="3"
                  sm="3"
                  md="3"
                  align="center"
                  class="ma-0 pa-0 text-left"
                >
                  <v-img
                    class="ma-0 pa-0 pointerCursor"
                    @click="goViewItem(el.item.routeParam)"
                    :to="`/items/${el.item.routeParam}`"
                    v-if="el.item.defaultImage"
                    :src="el.item.defaultImage"
                    alt="Item Image"
                    background-color="rgba(200,200,200,0.3)"
                    height="100"
                    width="100"
                    id="thumbnail"
                    contain
                  >
                  </v-img>
                  <v-img
                    v-else
                    @click="goViewItem(el.item.routeParam)"
                    class="ma-0 pa-0 pointerCursor"
                    src="@/assets/images/cart_item.png"
                    alt="Item Image"
                    background-color="rgba(200,200,200,0.3)"
                    max-height="100"
                    id="thumbnail"
                    contain
                  >
                  </v-img>
                </v-col>
                <!-- item details -->
                <v-col
                  cols="9"
                  sm="9"
                  md="9"
                  align="center"
                  class="ma-0 pa-0 mx-0 px-0 text-left"
                >
                  <v-list two-line class="my-0 py-0">
                    <v-list-item
                      class="my-0 py-0 ml-1 px-0"
                      :key="el.item.name"
                    >
                      <v-list-item-content class="my-0 py-0">
                        <v-list-item-title
                          v-text="el.item.name"
                          class="primary--text subtitle-2 my-0 py-0"
                        ></v-list-item-title>
                        <!-- CAD -->
                        <v-list-item-subtitle
                          v-if="appCurrencyText === 'cad'"
                          class="my-1 py-0"
                          >Price: {{ appCurrency
                          }}{{
                            (
                              Math.round(
                                el.item.price.value *
                                  (1 - el.item.discount / 100) *
                                  100
                              ) / 100
                            ).toFixed(2)
                          }}</v-list-item-subtitle
                        >
                        <!-- INR -->
                        <v-list-item-subtitle
                          v-if="appCurrencyText === 'inr'"
                          class="my-1 py-0"
                          >Price: {{ appCurrency
                          }}{{
                            (
                              Math.round(
                                el.item.price.value *
                                  (1 + el.item.tax / 100) *
                                  (1 - el.item.discount / 100) *
                                  100
                              ) / 100
                            ).toFixed(2)
                          }}</v-list-item-subtitle
                        >
                        <v-list-item-subtitle class="my-0 py-0">
                          <!-- item , Qty -->
                          <v-row
                            v-if="
                              !(
                                checkoutStage === 4 &&
                                currentRoute === 'checkout' &&
                                !navBarCart
                              )
                            "
                            class="ma-0 pa-0"
                            style="max-height: 40px"
                          >
                            <v-col
                              cols="12"
                              sm="12"
                              md="12"
                              class="text-left my-0 mx-0 px-0 py-0 d-flex subtitle-2"
                              align="center"
                            >
                              <v-row class="ma-0 pa-0">
                                <v-col
                                  class="ma-0 pa-0 d-flex"
                                  cols="12"
                                  sm="12"
                                  md="12"
                                >
                                  <p
                                    class="mt-2 mb-0 mx-0 px-0 py-0 subtitle-2"
                                  >
                                    Qty:
                                  </p>
                                  <v-btn
                                    class="mt-1 mr-0 mb-0 ml-0 pl-0 pa-0"
                                    @click="decrementQuantity(index)"
                                    :disabled="el.quantity <= 1"
                                    x-small
                                    fab
                                    icon
                                    color="error"
                                  >
                                    <v-icon> remove </v-icon>
                                  </v-btn>
                                  <v-text-field
                                    style="min-width: 45px; max-width: 60px"
                                    class="ma-0 pa-0 item__quantity subtitle-2"
                                    dense
                                    single-line
                                    v-model="el.quantity"
                                    solo
                                    readonly
                                  ></v-text-field>
                                  <v-btn
                                    class="mt-1 mb-0 mx-0 px-0 pa-0"
                                    @click="incrementQuantity(index)"
                                    icon
                                    x-small
                                    fab
                                    color="primary"
                                  >
                                    <v-icon> add </v-icon>
                                  </v-btn>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                          <v-row v-else>
                            <v-col>
                              <p>Qty:{{ el.quantity }}</p>
                            </v-col>
                          </v-row>
                          <!-- item Remove button & total per item -->
                          <v-row
                            v-if="
                              !(
                                checkoutStage === 4 &&
                                currentRoute === 'checkout' &&
                                !navBarCart
                              )
                            "
                            class="mt-1 mb-1 pa-0"
                            justify="start"
                          >
                            <!-- remove button -->
                            <v-col
                              class="text-left my-0 mx-0 px-0 py-0"
                              cols="8"
                              sm="8"
                              md="8"
                              align="center"
                            >
                              <v-btn
                                class="my-0 py-0"
                                @click="removeItem(index)"
                                small
                                text
                                color="error"
                              >
                                <v-icon small> delete </v-icon>
                                <span>{{ '  Remove' }}</span>
                              </v-btn>
                            </v-col>
                            <v-spacer></v-spacer>
                            <!--total  Price -->
                            <v-col
                              cols="4"
                              sm="4"
                              md="4"
                              align="center"
                              class="my-0 py-0 mx-0 px-0 text-right subtitle-2"
                            >
                              <!-- CAD -->
                              <p
                                v-if="appCurrencyText === 'cad'"
                                class="mt-1 pa-0 mx-0 d-flex"
                              >
                                {{
                                  appCurrency +
                                  ' ' +
                                  (
                                    (Math.round(
                                      el.item.price.value *
                                        (1 - el.item.discount / 100) *
                                        100
                                    ) /
                                      100) *
                                    el.quantity
                                  ).toFixed(2)
                                }}
                              </p>
                              <!-- INR -->
                              <p
                                v-if="appCurrencyText === 'inr'"
                                class="mt-1 pa-0 mx-0 d-flex"
                              >
                                {{
                                  appCurrency +
                                  ' ' +
                                  (
                                    (Math.round(
                                      el.item.price.value *
                                        (1 + el.item.tax / 100) *
                                        (1 - el.item.discount / 100) *
                                        100
                                    ) /
                                      100) *
                                    el.quantity
                                  ).toFixed(2)
                                }}
                              </p>
                            </v-col>
                          </v-row>
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
              <!-- Divider -->
              <v-row class="ma-0 pa-0"
                ><v-col class="ma-0 pa-0">
                  <v-divider
                    class="my-0 py-0 mr-1"
                    v-if="index < cart.items.length - 1"
                    :key="index"
                  ></v-divider
                ></v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'cartItems',
  data() {
    return {};
  },
  props: ['navBarCart'],
  computed: {
    ...mapGetters([
      'user',
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
      'cartTotal',
      'cartTax',
      'checkoutModel',
      'serverDomain',
      // "progressing",
    ]),
    currentRoute() {
      return this.$router.currentRoute.name;
    },
    checkoutStage() {
      return parseInt(this.checkoutModel);
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
  async created() {},
  mounted() {},
  watch: {},
  methods: {
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
    enableSnackBar(targetRequired, targetText, targetLink) {
      // Assign snackbar parameters
      this.targetRequired = targetRequired;
      this.targetText = targetText;
      this.targetLink = targetLink;
      // show snackbar
      this.$store.commit('setSnackBar', true);
    },
  },
};
</script>
