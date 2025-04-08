<template>
  <v-container fluid class="ma-0 pa-0">
    <v-row justify="center" align="center">
      <v-col cols="12" md="8" sm="12" class="text-center">
        <v-card class="my-0 mx-5 py-0" min-height="500" elevation="0">
          <v-row class="ma-0 pa-0">
            <v-col class="ma-0 pa-0 d-flex justify-start">
              <v-btn text @click="goBackToOrderDetails">
                <v-icon left>mdi-arrow-left</v-icon> Back to Order Details
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col class="ma-0 pa-0">
              <v-card-title class="mx-0 px-0">Return Process</v-card-title>
            </v-col>
          </v-row>

          <!-- No items available warning -->
          <v-row v-if="order.items.length === 0">
            <v-col cols="12" class="text-center">
              <v-alert type="warning" dense>
                There are no items available for return in this order.
              </v-alert>
            </v-col>
          </v-row>

          <!-- Message for when no items are available to return -->
          <v-row
            v-if="!order.items.some((item) => getAvailableQuantity(item) > 0)"
          >
            <v-col cols="12">
              <v-alert type="info" dense>
                There are no items available to return from this order. This
                could be because all items have already been returned or are not
                eligible for return.
              </v-alert>
            </v-col>
          </v-row>

          <!-- Item Selection for Return -->
          <v-card-text v-else class="mx-0 px-0">
            <v-row>
              <v-col cols="12" class="text-left">
                <v-list-item-title>Select Items for Return</v-list-item-title>
              </v-col>
            </v-row>

            <!-- Only show items with available quantity -->
            <v-row
              v-for="(item, index) in order.items.filter(
                (item) => getAvailableQuantity(item) > 0
              )"
              :key="index"
              class="order-item"
            >
              <v-col cols="12" md="12">
                <v-card class="pa-3">
                  <v-row align="center">
                    <!-- Item image -->
                    <v-col cols="2" md="1">
                      <v-img
                        :src="item.item.defaultImage"
                        height="80"
                        width="80"
                        contain
                      ></v-img>
                    </v-col>

                    <!-- Item details -->
                    <v-col
                      cols="10"
                      md="7"
                      class="d-flex flex-column align-start"
                    >
                      <div class="font-weight-bold">{{ item.item.name }}</div>
                      <div>
                        Quantity: {{ item.quantity }} | Available for return:
                        {{ getAvailableQuantity(item) }}
                      </div>
                      <div v-if="item.returnedQuantity">
                        Previously returned: {{ item.returnedQuantity }}
                      </div>
                    </v-col>

                    <!-- Return selection -->
                    <v-col cols="12" md="4">
                      <v-checkbox
                        v-model="item.returnSelected"
                        :true-value="true"
                        :false-value="false"
                        label="Select for return"
                        dense
                        hide-details
                        class="mb-2"
                      ></v-checkbox>

                      <div v-show="item.returnSelected">
                        <v-text-field
                          v-model.number="item.returnQuantity"
                          label="Quantity to return"
                          type="number"
                          min="1"
                          :max="getAvailableQuantity(item)"
                          outlined
                          dense
                          hide-details
                          class="mb-2"
                        ></v-text-field>

                        <v-select
                          v-model="item.returnReason"
                          :items="returnReasons"
                          label="Reason for return"
                          outlined
                          dense
                          hide-details
                          class="mb-2"
                        ></v-select>

                        <v-textarea
                          v-model="item.returnComment"
                          label="Additional comments (optional)"
                          outlined
                          dense
                          hide-details
                          rows="2"
                        ></v-textarea>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>

          <!-- Submit return button -->
          <v-card-text>
            <v-row>
              <v-col cols="12" class="d-flex">
                <v-btn
                  small
                  color="primary"
                  class="text-capitalize mt-5"
                  @click="generateReturnLabel"
                  :disabled="
                    !isValidReturnRequest || loading || order.items.length === 0
                  "
                  :loading="loading"
                >
                  Submit Return Request
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      returnReasons: [
        'Item no longer required',
        'Received incorrect item',
        'Item defective or non-functional',
        'Product damaged, packaging intact',
        'Item and packaging both damaged',
        'Incomplete package (missing parts or accessories)',
        'Late delivery, item no longer needed',
        'Item not as described on website',
        'Performance or quality below expectations',
        'Purchased by mistake',
        'Found a better price elsewhere',
        'Item incompatible or does not meet needs',
        'Unauthorized purchase',
        'Received an extra item I did not order (no refund needed)',
      ],
      order: {
        items: [], // This will be populated with items when the component is created
      },
      loading: false,
    };
  },
  computed: {
    ...mapGetters(['filteredOrders']),
    // Ensures that every selected item has a reason and a comment
    isValidReturnRequest() {
      return this.order.items.every(
        (item) =>
          !item.returnSelected ||
          (item.returnReason &&
            item.returnComment &&
            item.returnComment.length >= 10)
      );
    },
  },
  async created() {
    try {
      const orderId = this.$route.params.orderId;
      if (!orderId) {
        console.error('No order ID found in route params');
        return;
      }

      console.log('Attempting to fetch order data for ID:', orderId);

      // First, try to get the order directly from the API
      let orderData = null;
      try {
        // Use the same method as orderDetails to fetch from API
        orderData = await this.$store.dispatch('getSingleOrderGql', {
          orderId,
        });
        console.log('API fetch result:', orderData ? 'Success' : 'Failed');
      } catch (apiError) {
        console.error('Error fetching from API:', apiError);
      }

      // If API fetch failed, check filtered orders as fallback
      if (!orderData && this.filteredOrders && this.filteredOrders.length) {
        console.log('API fetch failed, falling back to filteredOrders');
        const cachedOrder = this.filteredOrders.find(
          (order) => order._id === orderId
        );
        if (cachedOrder) {
          console.log('Found order in filteredOrders');
          orderData = cachedOrder;
        }
      }

      // If we still don't have order data, show error and exit
      if (!orderData) {
        console.error('Failed to retrieve order data');
        this.$store.dispatch('setSnackBarText', {
          text: 'Could not load order data. Please try again.',
          color: 'error',
        });
        return;
      }

      console.log('Original order data:', orderData);

      // Make a deep copy to avoid modifying store data
      this.order = JSON.parse(JSON.stringify(orderData));

      // Initialize each item with default return selection and return quantity
      // Filter out items that have 0 available quantity (e.g. already returned items)
      this.order.items = this.order.items
        .filter((item) => {
          // Check if item has available quantity to return
          const returnedQty = Number(item.returnedQuantity || 0);
          const totalQty = Number(item.quantity);

          // If "returned" flag is true, item should be filtered out
          if (item.returned === true) {
            console.log(
              `Item ${
                item.item.name || 'Unknown'
              } is marked as fully returned (returned=true), filtering out`
            );
            return false;
          }

          // Calculate available quantity
          const availableQty = totalQty - returnedQty;

          // If returnedQuantity equals or exceeds quantity, filter out
          if (returnedQty >= totalQty) {
            console.log(
              `Item ${
                item.item.name || 'Unknown'
              } has no available quantity (${returnedQty}/${totalQty}), filtering out`
            );
            return false;
          }

          console.log(
            `Item ${
              item.item.name || 'Unknown'
            }: total=${totalQty}, returned=${returnedQty}, available=${availableQty}, keeping=true`
          );

          // Keep this item as it has available quantity
          return true;
        })
        .map((item) => {
          // Add return properties with the correct types
          const newItem = {
            ...item,
            returnSelected: false, // User can select this item for return
            returnQuantity: 1, // Default quantity to return
            returnReason: '', // Reason for return
            returnComment: '', // Additional comment for the return
            returnedQuantity: Number(item.returnedQuantity || 0),
            returned: item.returned === true,
          };

          return newItem;
        });

      console.log('Filtered and initialized items:', this.order.items);

      if (this.order.items.length === 0) {
        console.log('No items available for return after filtering');
        this.$store.dispatch('setSnackBarText', {
          text: 'There are no items available for return in this order.',
          color: 'info',
        });
      }
    } catch (error) {
      console.error('Error in created hook:', error);
      this.$store.dispatch('setSnackBarText', {
        text:
          'Error loading return data: ' + (error.message || 'Unknown error'),
        color: 'error',
      });
    }
  },
  methods: {
    // Method to navigate back to the order details page
    goBackToOrderDetails() {
      this.$router.push({
        name: 'orderDetails',
        params: { orderId: this.$route.params.orderId },
      });
    },

    // Helper method to get available quantity for an item
    getAvailableQuantity(item) {
      if (!item) return 0;

      // Make sure we're working with numbers
      const quantity = Number(item.quantity || 0);
      const returnedQuantity = Number(item.returnedQuantity || 0);

      // Calculate available quantity
      const availableQty = Math.max(0, quantity - returnedQuantity);

      // For debugging
      if (availableQty <= 0) {
        console.log(
          `Item ${
            item.item?.name || 'unknown'
          } has no available quantity: ${quantity}/${returnedQuantity}`
        );
      }

      return availableQty;
    },

    // Method to refresh order data
    async refreshOrderData() {
      try {
        // Save current selections before refreshing
        const currentSelections = {};
        if (this.order && this.order.items) {
          this.order.items.forEach((item) => {
            if (item.item && item.item._id) {
              currentSelections[item.item._id] = {
                returnSelected: item.returnSelected || false,
                returnQuantity: item.returnQuantity || 1,
                returnReason: item.returnReason || '',
                returnComment: item.returnComment || '',
              };
            }
          });
        }

        // Get the order ID from the route
        const orderId = this.$route.params.orderId;
        if (!orderId) {
          console.error('No order ID found in route params during refresh');
          return false;
        }

        console.log('Refreshing order data for ID:', orderId);

        // Try to get the latest data from API first
        let refreshedOrder = null;
        try {
          refreshedOrder = await this.$store.dispatch('getSingleOrderGql', {
            orderId,
          });
          console.log(
            'API refresh result:',
            refreshedOrder ? 'Success' : 'Failed'
          );
        } catch (apiError) {
          console.error('Error refreshing from API:', apiError);
        }

        // If API fails, try to get from store as fallback
        if (
          !refreshedOrder &&
          this.filteredOrders &&
          this.filteredOrders.length
        ) {
          console.log('API refresh failed, falling back to filteredOrders');
          const storeOrder = this.filteredOrders.find(
            (order) => order._id === orderId
          );

          if (storeOrder) {
            console.log('Found order in store during refresh');
            refreshedOrder = storeOrder;
          }
        }

        // If we have refreshed order data, process it
        if (refreshedOrder) {
          console.log(
            'Found order during refresh, original items count:',
            refreshedOrder.items.length
          );

          // Make a deep copy to avoid modifying store data
          this.order = JSON.parse(JSON.stringify(refreshedOrder));

          // Process and initialize items with the same filtering logic as in created()
          this.order.items = this.order.items
            .filter((item) => {
              const returnedQty = Number(item.returnedQuantity || 0);
              const totalQty = Number(item.quantity);

              // If "returned" flag is true, filter out the item
              if (item.returned === true) {
                console.log(
                  `Refresh: Item ${
                    item.item.name || 'Unknown'
                  } is marked as fully returned, filtering out`
                );
                return false;
              }

              // Calculate available quantity
              const availableQty = totalQty - returnedQty;

              // If returnedQuantity equals or exceeds quantity, filter out
              if (returnedQty >= totalQty) {
                console.log(
                  `Refresh: Item ${
                    item.item.name || 'Unknown'
                  } has no available quantity (${returnedQty}/${totalQty}), filtering out`
                );
                return false;
              }

              console.log(
                `Refresh: Item ${
                  item.item.name || 'Unknown'
                }: total=${totalQty}, returned=${returnedQty}, available=${availableQty}, keeping=true`
              );

              // Keep this item as it has available quantity
              return true;
            })
            .map((item) => {
              // Get the saved selections for this item if available
              const savedSelection =
                item.item && item.item._id && currentSelections[item.item._id];

              // Calculate available quantity for this item
              const availableQty =
                Number(item.quantity) - Number(item.returnedQuantity || 0);

              // Only restore selection if the item still has enough available quantity
              const canRestoreSelection =
                savedSelection && savedSelection.returnQuantity <= availableQty;

              if (savedSelection && !canRestoreSelection) {
                console.log(
                  `Cannot restore selection for ${item.item.name} - requested: ${savedSelection.returnQuantity}, available: ${availableQty}`
                );
              }

              return {
                ...item,
                // Restore user selections if available and valid, otherwise use defaults
                returnSelected: canRestoreSelection
                  ? savedSelection.returnSelected
                  : false,
                returnQuantity: canRestoreSelection
                  ? Math.min(savedSelection.returnQuantity, availableQty)
                  : 1,
                returnReason: canRestoreSelection
                  ? savedSelection.returnReason
                  : '',
                returnComment: canRestoreSelection
                  ? savedSelection.returnComment
                  : '',
                returnedQuantity: Number(item.returnedQuantity || 0),
                returned: item.returned === true,
              };
            });

          console.log(
            'Order refreshed:',
            this.order.items.length,
            'items available for return'
          );

          if (this.order.items.length === 0) {
            console.log('No items available for return after refresh');
            this.$store.dispatch('setSnackBarText', {
              text: 'There are no items available for return in this order.',
              color: 'info',
            });
          }

          return true;
        }

        console.error('Failed to refresh order data');
        return false;
      } catch (error) {
        console.error('Error refreshing order data:', error);
        return false;
      }
    },

    // Method to generate a new return label and download it immediately
    async generateReturnLabel() {
      try {
        this.loading = true;

        const orderId = this.$route.params.orderId;
        console.log(`Generating return label for order: ${orderId}`);

        // Check if there are any returnable items before submission
        await this.refreshOrderData();

        // After refresh, validate all selected items again
        const invalidItems = this.order.items.filter((item) => {
          if (!item.returnSelected) return false;

          // Check if the requested quantity is available to return
          const availableQty = this.getAvailableQuantity(item);
          // More strict validation to prevent server errors
          return (
            Number(availableQty) < Number(item.returnQuantity) ||
            Number(availableQty) <= 0
          );
        });

        if (invalidItems.length > 0) {
          console.log('Invalid items found:', invalidItems);
          // Show error message for invalid items
          this.$store.dispatch('setSnackBarText', {
            text: 'Some items are not available for return in the requested quantity.',
            color: 'error',
          });
          return;
        }

        // Get the selected items with their return quantity, reason, and comment
        const returnItems = this.order.items
          .filter(
            (item) =>
              item.returnSelected === true &&
              Number(item.returnQuantity) > 0 &&
              this.getAvailableQuantity(item) > 0 // Double-check available quantity
          )
          .map((item) => ({
            itemId: item.item._id,
            quantity: Number(item.returnQuantity),
            reason: item.returnReason,
            comment: item.returnComment || '',
          }));

        console.log('Items to return:', returnItems);

        if (returnItems.length === 0) {
          this.$store.dispatch('setSnackBarText', {
            text: 'Please select at least one item to return',
            color: 'warning',
          });
          this.loading = false;
          return;
        }

        // Use Vuex action to generate return label - the action will automatically open the download
        const data = await this.$store.dispatch('generateReturnLabel', {
          orderId,
          items: returnItems,
        });

        console.log('Return label generation successful:', data);

        this.$store.dispatch('setSnackBarText', {
          text: 'Return request submitted successfully! Check your email for details.',
          color: 'success',
        });

        // Go back to order details after a short delay
        setTimeout(() => {
          this.goBackToOrderDetails();
        }, 2000);
      } catch (error) {
        console.error('Error generating return label:', error);

        // Check for specific error responses
        if (error.response) {
          // Log detailed information about the error for debugging
          console.log(`Status code: ${error.response.status}`);
          console.log('Response data:', error.response.data);
          console.log('Response headers:', error.response.headers);

          if (error.response.status === 404) {
            this.$store.dispatch('setSnackBarText', {
              text: 'The return label service is temporarily unavailable. Please try again later or contact support.',
              color: 'error',
            });
          } else if (error.response.status === 403) {
            this.$store.dispatch('setSnackBarText', {
              text: 'You are not authorized to generate a return label for this order. Please try logging in again.',
              color: 'error',
            });
          } else if (error.response.status === 500) {
            // Handle specific S3 error codes
            if (error.response.data && error.response.data.error) {
              if (error.response.data.error.includes('S3-ACL-CONFIG')) {
                this.$store.dispatch('setSnackBarText', {
                  text: "We're experiencing issues with our storage system. Our team has been notified. Please try again later.",
                  color: 'error',
                });
              } else if (error.response.data.error.includes('S3-AUTH')) {
                this.$store.dispatch('setSnackBarText', {
                  text: "We're experiencing authentication issues with our storage system. Our team has been notified.",
                  color: 'error',
                });
              } else if (error.response.data.error.includes('S3-UPLOAD-ERR')) {
                this.$store.dispatch('setSnackBarText', {
                  text: 'Failed to upload your return label. Please try again later.',
                  color: 'error',
                });
              } else if (
                error.response.data.error.includes(
                  'Invalid return request for items'
                )
              ) {
                // Refresh the data to get the latest state
                await this.refreshOrderData();

                this.$store.dispatch('setSnackBarText', {
                  text: 'Some items are no longer available for return. The page has been refreshed with the latest data.',
                  color: 'error',
                });
              } else {
                // Handle other API error messages
                this.$store.dispatch('setSnackBarText', {
                  text: error.response.data.error,
                  color: 'error',
                });
              }
            } else {
              this.$store.dispatch('setSnackBarText', {
                text: 'A server error occurred while processing your return. Please try again later.',
                color: 'error',
              });
            }
          } else {
            this.$store.dispatch('setSnackBarText', {
              text: 'Failed to submit return request. Please try again.',
              color: 'error',
            });
          }
        } else if (error.request) {
          // The request was made but no response was received
          this.$store.dispatch('setSnackBarText', {
            text: 'No response from server. Please check your internet connection and try again.',
            color: 'error',
          });
        } else {
          // Something happened in setting up the request
          this.$store.dispatch('setSnackBarText', {
            text:
              error.message ||
              'Failed to submit return request. Please try again.',
            color: 'error',
          });
        }
      } finally {
        this.loading = false;
      }
    },
  },

  // Don't automatically fetch return labels on page load
  watch: {
    'order._id': {
      handler: async function (newVal) {
        // Don't automatically fetch return labels on page load
        // Let the user generate labels when needed
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.v-card-title {
  font-weight: bold;
}
</style>
