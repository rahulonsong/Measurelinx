<template>
  <v-container fluid class="ma-0 pa-0">
    <!-- Ediatable Confirm Dialog -->
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
    <div v-if="user && token && user.admin && ordersByAdminReceived">
      <v-row justify="center" align="center" class="my-0 py-0">
        <v-col cols="12" md="10" sm="12" class="text-center my-0 py-0">
          <v-card
            class="mt-0 pt-0"
            min-height="500"
            elevation="0"
            style="border-radius: 10px"
          >
            <v-card-title
              class="py-2 d-flex align-center justify-space-between"
            >
              <v-row>
                <v-col cols="6" class="text-left">
                  <span class="headline">Manage Orders</span>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search Orders"
                    single-line
                    hide-details
                    dense
                    @input="filterOrders"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-title>

            <v-card-text class="mx-0 px-0">
              <v-data-table
                :headers="headers"
                :items="filteredOrders"
                :search="search"
                item-value="_id"
                class="elevation-1"
                :items-per-page="itemsPerPage"
                :page.sync="page"
                @click:row="rowClicked"
              >
                <template v-slot:top>
                  <div class="d-flex align-center">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          :disabled="!filteredOrders.length"
                          class="ml-2"
                          @click="selectAll"
                          text
                          small
                          v-on="on"
                        >
                          <v-icon medium dark fab color="light-blue">{{
                            icons.mdiSelectAll
                          }}</v-icon>
                        </v-btn>
                      </template>
                      <span>Select All</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          class="ml-2"
                          :disabled="!selectedOrders.length"
                          @click="selectNone"
                          text
                          small
                          v-on="on"
                        >
                          <v-icon medium dark fab color="error">{{
                            icons.mdiNotificationClearAll
                          }}</v-icon>
                        </v-btn>
                      </template>
                      <span>Clear Selection</span>
                    </v-tooltip>
                  </div>
                </template>
                <template v-slot:item="{ item, index }">
                  <tr
                    :class="{
                      'light-blue darken-2 white--text':
                        selectedOrders.includes(item._id),
                    }"
                    @click="toggleSelection(item)"
                  >
                    <td>{{ item.orderNumber }}</td>
                    <td>{{ convertTimestamp(item.orderDate) }}</td>
                    <td>{{ appCurrency }} {{ item.orderValue }}</td>
                    <!-- Status -->
                    <td style="max-width: 200px" @click.stop>
                      <v-select
                        :disabled="item.orderStatus === 'delivered'"
                        v-model="item.orderStatus"
                        :items="statusOptions"
                        dense
                        hide-details
                      ></v-select>
                    </td>
                    <!-- Tracking Number -->
                    <td @click.stop>
                      <v-text-field
                        v-model="item.trackingNumber"
                        dense
                        placeholder="####-########"
                        hide-details
                      ></v-text-field>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-card-text>
            <v-card-actions>
              <v-row class="mt-3" justify="space-between" align="center">
                <v-col cols="12" md="6" class="text-left">
                  <span>{{ selectedOrders.length }} orders selected</span>
                </v-col>
                <v-col cols="12" md="6" class="text-right">
                  <v-btn
                    color="primary"
                    :disabled="!selectedOrders.length"
                    @click="handleDialog(null, 'orderStatusUpdates')"
                    >Submit Changes</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
  </v-container>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'manageOrders',
  data() {
    return {
      search: '',
      selectedOrders: [],
      page: 1,
      itemsPerPage: 10,
      headers: [
        { text: 'Order Number', value: 'orderNumber', align: 'center' },
        { text: 'Order Date', value: 'orderDate', align: 'center' },
        { text: 'Order Value ($)', value: 'orderValue', align: 'center' },
        { text: 'Status', value: 'status', sortable: false, align: 'center' },
        {
          text: 'Tracking Number',
          value: 'trackingNumber',
          sortable: false,
          align: 'center',
        },
      ],
      icons: {
        mdiSelectAll: 'mdi-select-all',
        mdiNotificationClearAll: 'mdi-notification-clear-all',
      },
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
      'appCurrency',
      'appDark',
      'ordersForAdmin',
      'ordersByAdminReceived',
      'orderStatusCodes',
    ]),
    filteredOrders() {
      if (!this.search) {
        return this.ordersForAdmin;
      }
      return this.ordersForAdmin.filter((order) => {
        return (
          order.orderNumber.toLowerCase().includes(this.search.toLowerCase()) ||
          this.convertTimestamp(order.orderDate)
            .toLowerCase()
            .includes(this.search.toLowerCase()) ||
          String(order.orderValue)
            .toLowerCase()
            .includes(this.search.toLowerCase())
        );
      });
    },
    statusOptions() {
      return this.orderStatusCodes.pairedStringList.map((item) => item.key);
    },
  },
  methods: {
    ...mapActions(['getOrdersByAdmin', 'updateOrderStatusesByAdmin']),
    convertTimestamp(date) {
      return moment(date).format('MMM DD, YYYY');
    },
    async updateOrderStatuses() {
      if (this.selectedOrders.length <= 0) {
        console.log('count:', this.selectedOrders.length);
        this.handleDialog(null, 'noOrdersSelected');
        return; // Ensure the method returns here to prevent further execution
      }
      try {
        const orderInput = this.selectedOrders.map((orderId) => {
          const order = this.ordersForAdmin.find((o) => o._id === orderId);
          return {
            _id: orderId,
            orderStatus: order.orderStatus,
            trackingNumber: order.trackingNumber,
          };
        });
        const payload = {
          orderInput,
        };
        // console.log('payload:', payload);
        await this.updateOrderStatusesByAdmin(payload);

        if (!this.error) {
          this.selectedOrders = [];
        }
      } catch (error) {
        this.$store.commit('setSnackbar', {
          text: 'Failed to update order statuses',
          color: 'error',
        });
      }
    },
    filterOrders() {
      this.page = 1;
    },
    selectAll() {
      this.selectedOrders = this.filteredOrders.map((order) => order._id);
    },
    selectNone() {
      this.selectedOrders = [];
    },
    toggleSelection(order) {
      const index = this.selectedOrders.indexOf(order._id);
      if (index > -1) {
        this.selectedOrders.splice(index, 1);
      } else {
        this.selectedOrders.push(order._id);
      }
    },
    rowClicked({ item }) {
      this.toggleSelection(item);
    },
    clearDialog(result) {
      this.dialogResult = result;
      if (result === 'yes') {
        if (this.dialogContext === 'orderStatusUpdates') {
          this.updateOrderStatuses();
        }
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
        case 'orderStatusUpdates':
          this.dialogContext = 'orderStatusUpdates';
          break;
        case 'noOrdersSelected':
          this.dialogContext = 'noOrdersSelected';
          break;

        default:
          break;
      }
      // performing action
      switch (this.dialogContext) {
        case 'orderStatusUpdates':
          this.dialogHeading = 'Confirm submitting the order status updates';
          this.dialogText =
            'Are you sure you want to submit the changes in order statuses? This will send email updates to the users for corresponding orders. Make sure that you have selected the correct orders for updates to avoid incorrect email updates';
          this.dialogBtn1 = 'Cancel';
          this.dialogBtn2 = 'Yes';
          this.isDialog = true;
          break;
        case 'noOrdersSelected':
          this.dialogHeading = 'No orders selected';
          this.dialogText = 'Select orders for submitting status changes.';
          this.dialogBtn1 = 'Ok';
          this.dialogBtn2 = '';
          this.isDialog = true;
          break;

        default:
          break;
      }
    },
  },

  created() {
    this.getOrdersByAdmin();
  },
};
</script>

<style scoped>
.v-card {
  border-radius: 10px;
}

.v-card-title {
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.v-btn {
  font-size: 14px;
}

tr.light-row {
  color: black;
}

tr.dark-row {
  color: white;
}
</style>
