<template>
  <v-container fluid class="ma-0 pa-0">
    <!-- Editable Confirm Dialog -->
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

    <!-- Main data -->
    <div v-if="user && token">
      <!-- Oreders List -->
      <v-row justify="center" align="center" class="my-0 py-0">
        <v-col cols="12" md="10" sm="12" class="text-center my-0 py-0">
          <v-card class="mt-0 pt-0" min-height="500" style="border-radius: 0">
            <v-row class="ma-0 pa-0 d-flex">
              <v-col class="ma-0 pa-0">
                <v-card-title> Your Orders </v-card-title>
              </v-col>
            </v-row>
            <!-- Searching for Orderrs based on year -->
            <v-row class="px-2 mx-2 py-0 my-0">
              <v-col cols="12" md="4" sm="6" class="py-0 my-0">
                <v-select
                  :menu-props="{ bottom: true, offsetY: true }"
                  dense
                  outlined
                  v-model="selectedYear"
                  :items="years"
                  label="Select Year"
                  @change="filterOrdersByYear"
                ></v-select>
              </v-col>
              <!-- Searching for Orderrs based on keyword -->
              <v-col cols="12" md="4" sm="6" class="py-0 my-0">
                <v-text-field
                  @keyup.enter="searchOrders()"
                  v-model="searchText"
                  label="Search Orders"
                  dense
                  outlined
                  @input="debouncedSearch"
                  prepend-inner-icon="mdi-magnify"
                ></v-text-field>
              </v-col>
              <!-- sorting -->
              <v-col cols="12" md="4" sm="6" class="py-0 my-0">
                <v-select
                  dense
                  :menu-props="{ bottom: true, offsetY: true }"
                  outlined
                  v-model="sortOrder"
                  :items="['Newest First', 'Oldest First']"
                  label="Sort By"
                  @change="sortOrders"
                ></v-select>
              </v-col>
            </v-row>
            <div v-if="filteredOrders.length">
              <v-card-text
                class="mx-0 px-0"
                style="overflow: auto; max-height: 700px"
              >
                <v-list>
                  <v-list-item-group
                    v-for="(order, index) in filteredOrders"
                    :key="'order' + index"
                  >
                    <v-list-item @click="viewOrderDetails(order._id)">
                      <v-list-item-content>
                        <v-row>
                          <v-col cols="12" md="4" class="text-left">
                            <v-list-item-title>
                              <v-icon color="success"
                                >mdi-file-document-box</v-icon
                              >
                              Order Number:
                              <span class="success--text">{{
                                order.orderNumber
                              }}</span>
                            </v-list-item-title>
                            <v-list-item-subtitle>
                              Order placed on:
                              <span class="primary--text">{{
                                convertTimestamp(order.orderDate)
                              }}</span>
                            </v-list-item-subtitle>
                          </v-col>
                          <v-col cols="12" md="4" class="text-left">
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
                          <v-col
                            cols="12"
                            md="4"
                            class="d-flex justify-end align-center"
                          >
                            <v-btn
                              text
                              @click.stop="trackOrder(index)"
                              class="mr-2"
                            >
                              <v-icon left>mdi-truck-fast</v-icon> Track Order
                            </v-btn>
                            <!-- <v-btn
                            text
                            color="red"
                            @click.stop="
                              handleDialog({ index: index }, 'cancelOrder')
                            "
                          >
                            <v-icon left>mdi-cancel</v-icon> Cancel Order
                          </v-btn> -->
                          </v-col>
                        </v-row>
                        <v-divider></v-divider>
                        <v-row
                          v-for="(el, itemIndex) in order.items"
                          :key="itemIndex"
                          class="my-1 py-0 d-flex"
                          justify="start"
                        >
                          <v-col
                            cols="2"
                            md="1"
                            sm="2"
                            class="my-0 ml-2 mr-5 pa-0 text-left"
                            align="center"
                          >
                            <v-img
                              :src="el.item.defaultImage"
                              class="ma-0 pa-0"
                              alt="Item Image"
                              @error="handleImageError($event, el)"
                              background-color="rgba(200,200,200,0.3)"
                              height="100"
                              width="100"
                              id="thumbnail"
                              contain
                            ></v-img>
                          </v-col>
                          <v-col
                            cols="8"
                            md="10"
                            sm="8"
                            class="text-left my-auto pa-0"
                            align="center"
                          >
                            <v-list-item-title>{{
                              el.item.name
                            }}</v-list-item-title>
                            <v-list-item-subtitle
                              >Qty: {{ el.quantity }}</v-list-item-subtitle
                            >
                          </v-col>
                        </v-row>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card-text>
            </div>
            <div v-else>
              <no-item-search-results></no-item-search-results>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <!-- pagination -->
      <v-row>
        <v-col>
          <!-- Pagination Controls -->
          <v-pagination
            v-if="numberOfOrderPages > 1"
            v-model="currentPage"
            :length="numberOfOrderPages"
            @input="loadOrders"
          ></v-pagination>
        </v-col>
      </v-row>
      <v-row v-if="!user.orders.length">
        <v-col>
          <v-list-item>
            <v-list-item-content class="text-center">
              <v-icon large>mdi-cart-off</v-icon>
              <h4>No Orders Yet!</h4>
              <p>
                Looks like you haven't made any orders. Explore our collections
                and find something you love.
              </p>
              <v-btn color="yellow darken-4" large @click="goToHomePage">
                Start Shopping
              </v-btn>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
    </div>

    <!-- Displaying The Spinner while loading -->
    <div v-else>
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
  </v-container>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import debounce from 'lodash/debounce';

export default {
  name: 'ordersByUser',
  data() {
    return {
      isDialog: false,
      dialogHeading: '',
      dialogText: '',
      dialogText2: '',
      dialogBtn1: '',
      dialogBtn2: '',
      dialogResult: '',
      dialogContext: '',
      activeOrderIndex: null,
      currentPage: 1,
      ordersPerPage: 10,
      selectedYear: '',
      searchText: '', // Search input text
      sortOrder: 'Newest First',
    };
  },
  computed: {
    ...mapGetters([
      'user',
      'token',
      'appCurrency',
      'appDark',
      'orderStatusCodes',
      'numberOfOrderPages',
      'filteredOrders',
    ]),
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.ordersPerPage;
      const end = start + this.ordersPerPage;
      return this.filteredOrders.slice(start, end);
    },
    debouncedSearch() {
      return debounce(this.searchOrders, 500); // Debounce the search by 500ms
    },
    years() {
      const currentYear = new Date().getFullYear();
      return ['All', currentYear, currentYear - 1, currentYear - 2];
    },
  },
  methods: {
    loadOrders() {
      const payload = {
        page: this.currentPage,
        year: this.selectedYear ? parseInt(this.selectedYear) : undefined,
        searchQuery: this.searchText || undefined,
        sortOrder: this.sortOrder || 'Newest First',
      };
      this.$store.dispatch('getOrders', payload);
    },
    searchOrders() {
      this.currentPage = 1; // Reset to the first page on a new search
      this.loadOrders(); // Perform the search and fetch orders
    },
    filterOrdersByYear() {
      this.loadOrders();
    },
    filterOrdersByKeyword() {
      this.loadOrders();
    },
    sortOrders() {
      this.loadOrders();
    },
    clearDialog(result) {
      this.dialogResult = result;
      if (result === 'yes' && this.dialogContext === 'cancelOrder') {
        let payload = { orderId: this.user.orders[this.activeOrderIndex]._id };
        this.filteredOrders.splice(this.activeOrderIndex, 1);
        this.$store.commit('setUser', this.user);
      }
      this.isDialog = false;
    },
    handleDialog(content, context) {
      this.dialogContext = context;
      if (context === 'cancelOrder') {
        this.dialogHeading = 'Confirm Canceling Order';
        this.dialogText = 'Are you sure you want to cancel this order?';
        this.dialogBtn1 = 'Cancel';
        this.dialogBtn2 = 'Yes';
        this.isDialog = true;
        this.activeOrderIndex = content.index;
      }
    },
    trackOrder(index) {
      alert('this will track the order!');
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
    goToHomePage() {
      this.$router.push({ name: 'home' });
    },
    viewOrderDetails(orderId) {
      this.$router.push({ name: 'orderDetails', params: { orderId } });
    },
    handleImageError(event, el) {
      // Handle image error
      console.error('Image error:', event);
      // Replace with a placeholder image
      el.item.defaultImage = 'https://via.placeholder.com/100?text=No+Image';
    },
  },
  created() {
    this.$store.commit('setFilteredOrders', this.user.orders);
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
</style>
