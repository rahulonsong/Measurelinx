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
    <!-- Main data -->
    <div>
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
            <v-card class="mt-0 pt-0" elevation="0">
              <!--  title -->
              <v-row wrap justify="center" align="center" class="ma-0 pa-0">
                <v-col cols="12" md="12" sm="12" class="text-center ma-0 pa-0">
                  <v-toolbar :style="appLightBackground" elevation="0">
                    <v-toolbar-title class="mx-auto text-h5 font-weight-bold">
                      {{ pageTitle }}</v-toolbar-title
                    >
                  </v-toolbar>
                </v-col>
              </v-row>
              <!-- <v-btn @click="test">Test</v-btn> -->
              <!-- Displaying main Data-->
              <div>
                <v-card class="ma-0 pa-0" elevation="0">
                  <v-card-text :style="appThemeFontColor" class="mx-0 px-0">
                    <!-- <v-card-title>Your items in Cart</v-card-title> -->
                    <div v-if="cart && cart.items.length">
                      <v-row class="ma-0 pa-0" justify="center">
                        <!-- cart items -->
                        <v-col sm="12" md="8" class="ma-0 pa-0" align="start">
                          <v-row class="ma-0 pa-0" justify="center">
                            <v-col
                              cols="12"
                              class="ma-0 pa-0 text-center"
                              align="center"
                            >
                              <v-card-title class="justify-start ml-1"
                                >Your Cart</v-card-title
                              >
                            </v-col>
                          </v-row>
                          <v-row class="ma-0 pa-0">
                            <v-col class="ma-0 pa-0">
                              <cart-items
                                class="ml-5"
                                style="overflow: auto; max-height: 600px"
                              ></cart-items>
                            </v-col>
                          </v-row>
                        </v-col>
                        <!-- order summary -->
                        <v-col
                          v-if="user && token"
                          sm="12"
                          md="4"
                          align="center"
                          style="poistion: fixed"
                        >
                          <order-summary></order-summary>
                        </v-col>
                        <v-col
                          v-else
                          sm="12"
                          md="4"
                          align="center"
                          style="poistion: fixed"
                        >
                          <!-- Continue -->
                          <v-btn
                            style="width: 100%; max-width: 500px"
                            text
                            class="app__button mx-0 px-0"
                            :class="
                              appDark ? 'blue darken-4' : 'blue lighten-4'
                            "
                            :to="{ name: 'signin' }"
                          >
                            <v-icon>login</v-icon>
                            <span class="ml-2"> Sign in to Continue </span>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </div>
                    <div v-else>
                      <v-card-text class="pb-4 pt-0 my-0">
                        <p class="my-0 py-0">
                          There are no items in the cart!
                          <v-btn text small to="/" color="primary"
                            >Explore the store</v-btn
                          >
                        </p>
                      </v-card-text>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
<script>
// Importing required modules
import moment from 'moment';
import { mapGetters } from 'vuex';
export default {
  name: 'userCart',
  data() {
    return {
      // reviewsByUserDataReceived: false,
      pageTitle: 'Cart & Order Summary',
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
      'appCurrency',
      'appDark',
      'appLightBackground',
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
  },
  async created() {
    // setting resourceReceivedFlag to false
    this.progressing = false;
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
        // //   Do action for this Page
        // this.getReviewsByUser();
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
      // console.log('addresses:', this.user.addresses);
      // console.log('ResourceContent:', this.alphaResourceContent);
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
.pointerCursor {
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
</style>
