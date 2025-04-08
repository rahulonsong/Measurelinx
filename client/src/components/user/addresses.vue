<template>
  <v-container fluid class="ma-0 pa-0">
    <!-- Edit /  Update address -->
    <address-dialog></address-dialog>
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
      <v-row justify="center" align="center">
        <v-col
          cols="12"
          md="12"
          sm="12"
          style="max-width: 1200px"
          class="text-center"
        >
          <div class="mt-0 pt-0">
            <v-card
              class="mt-0 pt-0"
              min-height="500"
              scrollable
              style="border-radius: 0"
            >
              <v-card-title>Your Addresses</v-card-title>
              <v-card-text class="mx-0 px-0">
                <address-card
                  :addresses="userAddresses"
                  :selectedAddressId="null"
                  address-type="all"
                  :readonly="false"
                  @add-new-address="addNewAddress"
                  @edit-address="editAddress"
                  @delete-address="handleDialog($event, 'deleteAddress')"
                />
              </v-card-text>
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
import { mapGetters } from 'vuex';
import AddressCard from '@/components/shared/AddressCard.vue';

export default {
  name: 'addressesByUser',
  components: {
    AddressCard,
  },
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
      activeAddressIndex: null,
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
      'cart',
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
    userAddresses() {
      return this.user.addresses;
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
    addressContext: {
      get() {
        return this.$store.getters.addressContext;
      },
      set(value) {
        this.$store.commit('setAddressContext', value);
      },
    },
    activeAddress: {
      get() {
        return this.$store.getters.activeAddress;
      },
      set(value) {
        this.$store.commit('setActiveAddress', value);
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
    async clearDialog(result) {
      this.dialogResult = result;
      let payload = {};
      if (result === 'yes') {
        if (this.dialogContext === 'deleteAddress') {
          const addressId = this.userAddresses[this.activeAddressIndex]._id;
          payload = {
            addressId,
          };
          try {
            await this.$store.dispatch('deleteAddress', payload);
            let user = this.user;
            user.addresses.splice(this.activeAddressIndex, 1);
            if (this.cart.shippingAddress == addressId) {
              this.cart.shippingAddress = null;
            }
            if (this.cart.billingAddress == addressId) {
              this.cart.billingAddress = null;
            }

            // Updating store
            this.$store.commit('setUser', user);
          } catch (error) {
            // console.log(error);
          }
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
        case 'deleteAddress':
          this.dialogContext = 'deleteAddress';
          break;

        default:
          break;
      }
      // performing action
      switch (this.dialogContext) {
        case 'deleteAddress':
          this.dialogHeading = 'Confirm Deleting Address';
          this.dialogText = 'Are you sure you want to delete this address?';
          this.dialogBtn1 = 'Cancel';
          this.dialogBtn2 = 'Yes';
          this.isDialog = true;
          this.activeAddressIndex = content.index;
          break;

        default:
          break;
      }
    },
    test() {
      // console.log('cart:', this.cart);
    },
    addNewAddress() {
      this.addressContext = 'add';
      this.addressDialog = true;
    },
    editAddress(address) {
      this.addressContext = 'edit';
      this.activeAddress = { ...address };
      this.activeAddress.phoneNumber = { ...address.phoneNumber };
      this.addressDialog = true;
    },
    deleteAddress(address) {
      // delete the address
      // this.$store.dispatch('deleteAddress', {
      //   addressId: address._id,
      // });
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
  },
};
</script>
<style>
.shipping-address__card {
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
