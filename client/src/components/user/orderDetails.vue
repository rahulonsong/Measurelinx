<template>
  <v-container fluid class="ma-0 pa-0">
    <v-row justify="center" align="center">
      <v-col cols="12" md="8" sm="12" class="text-center">
        <v-card class="my-2 mx-2 py-2 px-4" min-height="500" elevation="1">
          <v-row class="ma-0 pa-0 d-flex">
            <v-col class="ma-0 pa-0 d-flex justify-start">
              <v-btn text @click="goBackToOrders">
                <v-icon left>mdi-arrow-left</v-icon> Back to Orders
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0 d-flex">
            <v-col class="ma-0 pa-0">
              <v-card-title class="mx-0 px-0"> Order Details </v-card-title>
            </v-col>
          </v-row>
          <!-- <v-btn @click="test">Test</v-btn> -->
          <!-- Main data -->
          <div v-if="user && token">
            <v-card-text class="mx-0 px-0" v-if="order">
              <!-- Shipping Address -->
              <v-row>
                <v-col cols="12" class="text-left">
                  <v-list-item-title>
                    <v-icon color="success">mdi-file-document-box</v-icon>
                    Order Number:
                    <span class="success--text">{{ order.orderNumber }}</span>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Order placed on:
                    <span class="primary--text">{{
                      convertTimestamp(order.orderDate)
                    }}</span>
                  </v-list-item-subtitle>
                </v-col>
                <v-col cols="12" class="text-left">
                  <v-list-item-title>
                    <v-icon color="error">mdi-currency-usd</v-icon>
                    Order Value:
                    <span class="error--text"
                      >{{ appCurrency }} {{ order.orderValue }}</span
                    >
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Status:
                    <span class="primary--text">{{
                      getOrderStatus(order.orderStatus)
                    }}</span>
                  </v-list-item-subtitle>
                </v-col>
              </v-row>
              <v-divider class="mt-5"></v-divider>
              <!-- Billing Address -->
              <v-row class="my-2">
                <v-col cols="12" md="6">
                  <v-list-item-title class="font-weight-black mb-2"
                    >Billing Address</v-list-item-title
                  >
                  <address-card
                    :addresses="[order.billingAddress]"
                    :selectedAddressId="order.billingAddress._id"
                    address-type="billing"
                    :readonly="true"
                    class="address-card-readonly"
                  />
                </v-col>

                <!-- Shipping Address -->
                <v-col cols="12" md="6">
                  <v-list-item-title class="font-weight-black mb-2"
                    >Shipping Address</v-list-item-title
                  >
                  <address-card
                    :addresses="[order.shippingAddress]"
                    :selectedAddressId="order.shippingAddress._id"
                    address-type="shipping"
                    :readonly="true"
                    class="address-card-readonly"
                  />
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <!-- items -->
              <v-row>
                <v-col cols="12" class="text-left mt-5">
                  <v-list-item-title class="font-weight-black"
                    >Items</v-list-item-title
                  >
                </v-col>
              </v-row>
              <v-row
                v-for="(el, itemIndex) in order.items"
                :key="itemIndex"
                class="my-1 py-0 d-flex"
                justify="start"
              >
                <v-col
                  cols="1"
                  md="1"
                  sm="1"
                  class="my-0 mx-5 pa-0 text-left"
                  align="center"
                >
                  <v-img
                    v-if="el.item.defaultImage"
                    :src="el.item.defaultImage"
                    class="ma-0 pa-0 pointerCursor"
                    alt="Item Image"
                    @click="goViewItem(el.item.routeParam)"
                    background-color="rgba(200,200,200,0.3)"
                    height="100"
                    width="100"
                    id="thumbnail"
                    contain
                  ></v-img>
                  <v-img
                    v-else
                    src="@/assets/images/cart_item.png"
                    class="ma-0 pa-0 pointerCursor"
                    alt="Item Image"
                    @click="goViewItem(el.item.routeParam)"
                    background-color="rgba(200,200,200,0.3)"
                    height="100"
                    width="100"
                    id="thumbnail"
                    contain
                  ></v-img>
                </v-col>
                <v-col
                  cols="9"
                  md="9"
                  sm="9"
                  class="text-left my-auto pa-0 mx-0"
                  align="center"
                >
                  <v-list-item-title>{{ el.item.name }}</v-list-item-title>
                  <v-list-item-subtitle
                    >Qty: {{ el.quantity }}</v-list-item-subtitle
                  >
                  <v-chip
                    v-if="el.returnInitiated || el.returned"
                    small
                    class="mt-1"
                    :color="el.refundProcessed ? 'green' : 'orange'"
                    text-color="white"
                  >
                    {{ getReturnStatusText(el) }}
                  </v-chip>
                </v-col>
              </v-row>
              <!-- Invoice Download -->
              <v-row
                v-if="order.orderStatus === 'delivered'"
                class="mt-3 mx-0 px-0"
              >
                <v-col cols="12" class="text-left">
                  <v-btn
                    color="green darken-2"
                    @click="downloadInvoice"
                    class="text-capitalize ma-2"
                    text
                    small
                  >
                    <v-icon left>mdi-download</v-icon> Download Invoice
                  </v-btn>
                </v-col>
              </v-row>
              <!-- tracking -->
              <v-row class="mt-3 mx-0 px-0">
                <v-col cols="12" class="text-left">
                  <v-btn
                    text
                    @click="trackOrder"
                    class="text-capitalize ma-2"
                    small
                  >
                    <v-icon left>mdi-truck-fast</v-icon> Track Order
                  </v-btn>
                  <!-- <v-btn text color="red" @click="cancelOrder">
                    <v-icon left>mdi-cancel"></v-icon> Cancel Order
                  </v-btn> -->
                </v-col>
              </v-row>
              <!-- Add Return Button -->
              <v-row class="mt-3 mx-0 px-0">
                <v-col cols="12" class="text-left">
                  <v-btn
                    color="primary"
                    outlined
                    @click="goToReturnProcess"
                    v-if="canReturnItems"
                    class="text-capitalize"
                  >
                    <v-icon left>mdi-package-return</v-icon> Return Items
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </div>
          <!-- Displaying The Spinner while loading -->
          <div v-else>
            <v-progress-circular indeterminate></v-progress-circular>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapMutations } from 'vuex';
import AddressCard from '@/components/shared/AddressCard.vue';

export default {
  name: 'orderDetails',
  components: {
    AddressCard,
  },
  data() {
    return {
      order: null,
    };
  },
  computed: {
    ...mapGetters([
      'user',
      'token',
      'appCurrency',
      'appDark',
      'orderStatusCodes',
      'filteredOrders',
    ]),
    isReturnable() {
      if (this.order && this.order.orderDate) {
        const orderDate = moment(this.order.orderDate).startOf('day'); // Strip time for accurate day comparison
        const currentDate = moment().startOf('day'); // Today's date without time
        const daysDifference = currentDate.diff(orderDate, 'days'); // Difference in days

        return daysDifference <= 14; // Return true if within 14 days
      }
      return false;
    },
    canReturnItems() {
      if (!this.order || !this.order.items || !this.order.items.length) {
        // console.log('No order or items found');
        return false;
      }

      // Check if order status allows returns (must be delivered)
      if (this.order.orderStatus !== 'delivered') {
        // console.log('Order not delivered, cannot return');
        return false;
      }

      // Check if order date is within return window (14 days)
      if (!this.isReturnable) {
        // console.log('Order outside return window');
        return false;
      }

      // Only show return button if there's at least one item with available quantity
      const hasReturnable = this.order.items.some((item) => {
        const returnedQty = Number(item.returnedQuantity || 0);
        const totalQty = Number(item.quantity || 0);

        // Item is not returnable if:
        // 1. The returned flag is explicitly set to true, OR
        // 2. The returnedQuantity equals or exceeds the total quantity
        const isFullyReturned =
          item.returned === true || returnedQty >= totalQty;

        // Debug item return eligibility
        /* 
        if (isFullyReturned) {
          console.log(
            `Item ${item.item.name} has no available quantity for return`
          );
        }
        */

        return !isFullyReturned;
      });

      // console.log(`Order has returnable items: ${hasReturnable}`);
      return hasReturnable;
    },
  },
  async created() {
    try {
      // Load order data using GET_SINGLE_ORDER
      const orderId = this.$route.params.orderId;

      // Fetch the latest order data directly from the server to ensure we have current return status
      const payload = { orderId };

      // console.log('Fetching order data for ID:', orderId);
      const orderData = await this.$store.dispatch(
        'getSingleOrderGql',
        payload
      );

      if (orderData) {
        this.order = orderData;
      } else {
        console.error('Failed to retrieve order data from server');

        // Fallback to local orders if API fails
        if (this.filteredOrders?.length === 0 && this.user?.orders?.length) {
          this.$store.commit('setFilteredOrders', this.user.orders);
        }

        if (this.filteredOrders && this.filteredOrders.length) {
          const order = this.filteredOrders.find(
            (order) => order._id === orderId
          );
          if (order) {
            // console.log('Using cached order data as fallback');
            this.order = order;
          } else {
            console.error('Order not found in cached data either');
            // Show a user-friendly message
            this.$store.dispatch('setSnackBarText', {
              text: 'Could not load order details. Please try again later.',
              color: 'error',
            });
          }
        } else {
          // No orders available in cache
          console.error('No cached order data available');
          this.$store.dispatch('setSnackBarText', {
            text: 'Could not load order details. Please try again later.',
            color: 'error',
          });
        }
      }
    } catch (error) {
      console.error('Error loading order data:', error);
      this.$store.dispatch('setSnackBarText', {
        text:
          'Error loading order details: ' + (error.message || 'Unknown error'),
        color: 'error',
      });
    }
  },
  methods: {
    test() {
      // this.isReturnable();
    },
    convertTimestamp(date) {
      return moment(date).format('MMM DD, YYYY');
    },
    getOrderStatus(status) {
      const statusItem = this.orderStatusCodes.pairedStringList.find(
        (item) => item.key === status
      );
      return statusItem.stringValue;
    },
    async downloadInvoice() {
      // sending command to doqnload invoice
      const payload = {
        id: this.order._id,
      };
      this.$store.dispatch('downloadInvoice', payload);
    },
    trackOrder() {
      // Implement the logic to track the order
      alert('Order tracking!');
    },
    cancelOrder() {
      // Implement the logic to cancel the order
      alert('Order canceled!');
    },
    goBackToOrders() {
      this.$router.push({ name: 'ordersByUser' });
    },
    goToReturnProcess() {
      this.$router.push({
        name: 'returnProcess',
        params: { orderId: this.order._id },
      });
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
    getReturnStatusText(item) {
      if (item.refundProcessed) {
        return 'Refunded';
      }
      if (item.returnStatus === 'completed') {
        return 'Return Completed';
      }
      return 'Return Initiated';
    },
  },
};
</script>

<style scoped>
.v-card-title {
  font-weight: bold;
}
.v-list-item-title {
  font-weight: medium;
}
.v-list-item-subtitle {
  color: grey;
}
.v-btn {
  font-size: 14px;
}

.address-card-readonly :deep(.v-btn) {
  display: none; /* Hide the "New Address" button */
}

.address-card-readonly :deep(.v-card) {
  cursor: default;
}

.address-card-readonly :deep(.v-card:hover) {
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12) !important;
}
</style>
