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
    <div v-if="user">
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
              <!--  title -->
              <v-row wrap justify="center" align="center" class="ma-0 pa-0">
                <v-col cols="12" md="12" sm="12" class="text-center ma-0 pa-0">
                  <v-toolbar>
                    <v-toolbar-title class="mx-auto text-h5">
                      {{ pageTitle }}</v-toolbar-title
                    >
                  </v-toolbar>
                </v-col>
              </v-row>
              <!-- <v-btn @click="test">Test</v-btn> -->
              <!-- Displaying main Data-->
              <div>
                <!-- Displaying Data-->
                <v-card elevation="5" class="pa-0 pointerMouse">
                  <v-card-text class="pt-3">
                    <!-- Displaying Content -->
                    <v-row class="my-0 py-0" justify="start">
                      <v-col class="my-0 py-0 text-left">
                        <!-- Displaying Introduction -->
                        <p>Content goes here...</p>
                      </v-col>
                    </v-row>
                    <!-- Resource Tags  -->
                    <v-row class="my-0 py-0" justify="start">
                      <v-col class="my-0 py-0 text-left">
                        <!-- Chip for tag -->
                        <v-chip
                          dense
                          small
                          v-for="(tag, index) in resourceTags"
                          :key="index"
                          class="ma-2"
                          style="height: 25px"
                          :color="randomColor"
                          :text-color="appDark ? 'black' : 'white'"
                        >
                          #{{ tag }}
                        </v-chip>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </div>
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
import { mapGetters } from 'vuex';
export default {
  name: 'somePage',
  data() {
    return {
      // resourceDataReceived: false,
      pageTitle: '',
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
      dataReceived: true,
      resourceTags: [],
    };
  },
  computed: {
    ...mapGetters([
      'user',
      'error',
      'errorStatus',
      'loading',
      'appDark',
      'appThemeFontColor',
      'validationRules',
      //   "dataReceived",
      'initializeAnaceptComplete',
      'randomColor',
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
    alphaResourceTags: {
      get() {
        return this.$store.getters.alphaResourceTags;
      },
      set(value) {
        this.$store.commit('setAlphaResourceTags', value);
      },
    },
  },
  async created() {
    // setting resourceReceivedFlag to false
    this.progressing = true;
    // this.getSomeData();
  },
  mounted() {
    this.$nextTick(function () {
      this.progressing = false;
    });
    // this.resourceDataReceived = true;
  },
  watch: {
    initializeAnaceptComplete(newValue, oldValue) {
      if (oldValue === false) {
        //   Do action for this Page
        // this.getSomeData();
      }
    },
    $route(to, from) {
      // Check data received and perform action
      //     this.getSomeData();
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
    // async getSomeData() {
    //   if (this.initializeAnaceptComplete) {
    //     //    perform async action for this page
    //   }
    // },
    test() {
      // console.log("ResourceContent:", this.alphaResourceContent);
    },
    // async handleSomeAction() {
    //     // find index
    //   let someThing = this.someAray.find(
    //     (el) => el._id === this.item._id
    //   );
    //   let someIndex = this.someAray.indexOf(someThing);
    //   const payload = {
    //     //   some fields
    //   };
    //   // sending to database
    //   await this.$store.dispatch("someAction", payload);
    //   //  Perform steps after receiving server resposne
    //   this.$store.dispatch("someAction2");
    // },
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
.inputValue input[type='number'] {
  appearance: textfield;
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
}
.inputValue input::-webkit-outer-spin-button,
.inputValue input::-webkit-inner-spin-button {
  appearance: none;
  -webkit-appearance: none;
  margin: 0;
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
.resource__image {
  opacity: 1;
}
.resource__image:hover {
  opacity: 0.8;
}
.display__resource-image {
  border-radius: 15px;
}
</style>
