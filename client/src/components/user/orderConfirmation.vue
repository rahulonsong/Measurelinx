<template>
  <div class="container ma-0 pa-0">
    <!-- <v-btn @click="test">Test</v-btn> -->
    <div v-if="user && token && ordersByUserReceived" class="ma-0 pa-0">
      <v-row justify="center" class="ma-0 pa-0">
        <v-col cols="12" sm="8" md="6" class="ma-0 pa-0">
          <v-card class="text-left pa-1 ma-2">
            <v-icon color="success" size="64">mdi-check-circle-outline</v-icon>
            <h2 class="mt-4 mb-2">Order Confirmed!</h2>
            <p class="mb-4">
              Thank you for your purchase. Your order has been confirmed and is
              being processed.
            </p>
            <v-divider></v-divider>
            <div class="my-4">
              <!-- Order Number -->
              <div class="justify-content-between d-flex">
                <span>Order Number:</span>
                <span class="ml-2 font-weight-bold success--text">{{
                  lastOrder.orderNumber
                }}</span>
                <v-spacer></v-spacer>
                <v-btn x-small class="primary" @click="showOrders()"
                  >View Orders</v-btn
                >
              </div>
              <!-- transaction Id -->
              <div class="d-flex justify-content-between">
                <span>Transaction ID:</span>
                <span class="ml-2 font-weight-bold">{{
                  lastOrder.transactionId
                }}</span>
              </div>
              <!-- Shipping ADddress -->
              <v-row class="ma-0 py-2" justify="start">
                <v-col cols="12" md="2" sm="4" class="ma-0 pa-0 text-left">
                  <span>Shipping to:</span>
                </v-col>
                <v-col cols="12" md="10" sm="8" class="ma-0 pa-0 text-left">
                  <span class="font-weight-bold"
                    >{{ shippingAddress.addresseeFirst }}&nbsp;{{
                      shippingAddress.addresseeLast
                    }}, {{ shippingAddress.line1
                    }}{{
                      shippingAddress.line2 ? ', ' + shippingAddress.line2 : ''
                    }}{{
                      shippingAddress.landmark
                        ? ', ' + shippingAddress.landmark
                        : ''
                    }}, {{ shippingAddress.cityTown }},
                    {{ shippingAddress.stateProvince }},
                    {{ shippingAddress.country }},
                    {{ shippingAddress.postalCode }}</span
                  >
                </v-col>
              </v-row>
              <!-- Billing ADddress -->
              <v-row class="ma-0 py-2" justify="start">
                <v-col cols="12" md="2" sm="4" class="ma-0 pa-0 text-left">
                  <span>Billed to:</span>
                </v-col>
                <v-col cols="12" md="10" sm="8" class="ma-0 pa-0 text-left">
                  <span class="font-weight-bold"
                    >{{ billingAddress.addresseeFirst }}&nbsp;{{
                      billingAddress.addresseeLast
                    }}, {{ billingAddress.line1
                    }}{{
                      billingAddress.line2 ? ', ' + billingAddress.line2 : ''
                    }}{{
                      billingAddress.landmark
                        ? ', ' + billingAddress.landmark
                        : ''
                    }}, {{ billingAddress.cityTown }},
                    {{ billingAddress.stateProvince }},
                    {{ billingAddress.country }},
                    {{ billingAddress.postalCode }}</span
                  >
                </v-col>
              </v-row>
            </div>

            <!-- items details -->
            <v-row class="ma-0 pa-0">
              <v-col class="ma-0 pa-0">
                <v-card-text
                  class="my-0 py-0 mr-2"
                  style="flex-grow: 1; overflow: auto"
                >
                  <v-row
                    v-for="(el, index) in lastOrder.items"
                    :key="'item' + index"
                    class="my-1 mx-0 px-0 py-0 d-flex"
                    justify="start"
                    no-gutters
                  >
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
                      cols="6"
                      sm="6"
                      md="6"
                      align="center"
                      class="ma-0 pa-0 text-left"
                    >
                      <v-list two-line class="my-0 py-0">
                        <v-list-item class="my-0 py-0" :key="el.item.name">
                          <v-list-item-content class="my-0 py-0">
                            <v-list-item-title
                              v-text="el.item.name"
                              class="primary--text subtitle-2 my-0 py-0"
                            ></v-list-item-title>
                            <v-list-item-subtitle class="my-0 py-0">
                              <!-- item , Qty -->
                              <v-row class="ma-0 pa-0" style="max-height: 40px">
                                <v-col
                                  cols="2"
                                  sm="2"
                                  md="2"
                                  class="text-left my-0 mx-0 px-0 py-0 d-flex subtitle-2"
                                  align="center"
                                >
                                  <v-row class="ma-0 pa-0">
                                    <v-col
                                      class="ma-0 pa-0"
                                      cols="12"
                                      sm="12"
                                      md="4"
                                    >
                                      <p
                                        class="mt-2 mb-0 mx-0 px-0 py-0 subtitle-2"
                                      >
                                        Qty: {{ el.quantity }}
                                      </p>
                                    </v-col>
                                  </v-row>
                                </v-col>
                              </v-row>
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-col>
                    <!--total  Price -->
                    <v-col
                      cols="3"
                      sm="3"
                      md="3"
                      align="center"
                      class="d-flex subtitle-2"
                    >
                    </v-col>
                    <!-- Divider -->
                    <v-divider
                      class="my-2 mr-1"
                      v-if="index < lastOrder.items.length - 1"
                      :key="index"
                    ></v-divider>
                  </v-row>
                </v-card-text>
              </v-col>
            </v-row>
            <v-row class="ma-0 pa-0">
              <v-col class="ma-0 pa-0">
                <v-btn color="secondary" to="/">Continue Shopping</v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'orderConfirmation',
  // props: {
  //   orderNumber: {
  //     type: String,
  //     required: true,
  //   },
  //   transactionId: {
  //     type: String,
  //     required: true,
  //   },
  // },
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
      'ordersByUserReceived',
      'serverDomain',
    ]),
    lastOrder() {
      let orders = [...this.user.orders];
      // Convert date strings to Date objects
      orders.forEach((order) => {
        order.orderDate = new Date(order.orderDate);
      });

      // Sort orders by date
      orders.sort((a, b) => b.orderDate - a.orderDate);

      // Get the last (most recent) order
      const lastOrder = orders[0];
      return lastOrder;
    },
    shippingAddress() {
      return this.lastOrder.shippingAddress;
    },
    billingAddress() {
      return this.lastOrder.billingAddress;
    },
  },
  watch: {
    initializeAppComplete(newValue, oldValue) {
      if (oldValue === false) {
        this.fetchOrders();
      }
    },
    $route(to, from) {
      // if (this.itemDataReceived) {
      this.fetchOrders();
      // }
    },
  },
  methods: {
    goViewItem(route) {
      try {
        if (this.$router.currentRoute.fullPath !== `/items/${route}`) {
          this.$router.push(`/items/${route}`);
        }
      } catch (error) {
        // console.log(error);
      }
    },
    showOrders() {
      // directing to orders page
      if (this.$route.name !== 'ordersByUser') {
        this.$router.push({ name: 'ordersByUser' });
      }
    },
    async fetchOrders() {
      if (this.initializeAppComplete) {
        // Ensure 'page' is set to at least 1 or a default value.
        const page = this.currentPage || 1; // Assuming currentPage is available in your component's data or computed properties.

        // Optional variables
        const year = this.selectedYear || null;
        const searchQuery = this.searchQuery || null;
        const sortOrder = this.sortOrder || null;

        this.$store.commit('setOrdersByUserReceived', false);

        try {
          await this.$store.dispatch('getOrders', {
            page, // Required, ensure it's passed
            year, // Optional
            searchQuery, // Optional
            sortOrder, // Optional
          });
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      }
    },
    test() {
      // console.log('ordersReceived:', this.ordersByUserReceived);
    },
  },
  async created() {
    // Gtting user orders
    await this.fetchOrders();
  },
};
</script>

<style>
.container {
  padding-top: 64px;
}
</style>
