<template>
  <v-container fluid>
    <!-- Displayig the Expanded Image Dialog-->
    <v-row wrap class="ma-0 pa-0">
      <v-col
        class="text-left my-0 py-0"
        align="center"
        cols="12"
        md="12"
        sm="12"
      >
        <v-dialog
          content-class="display__itemModel-image"
          v-model="isExpandedImageDialog"
        >
          <v-card class="ma-0 pa-0">
            <v-card-text class="ma-0 pa-0">
              <v-carousel v-model="itemModelCarouselIndex" height="auto">
                <v-carousel-item
                  v-for="(image, index) in activeItemModel.images"
                  :key="'image' + index"
                  :src="image.imageUrl"
                >
                  <v-card-title>
                    <v-btn
                      class="ml-n8 mt-n8 floating-left-top-btn white"
                      style="z-index: 9999"
                      medium
                      icon
                      @click="isExpandedImageDialog = false"
                    >
                      <v-icon class="black--text">close</v-icon>
                    </v-btn>
                  </v-card-title>
                </v-carousel-item>
              </v-carousel>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <!-- itemModel disable Dialog -->
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
    <div v-if="itemModelDataReceived">
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
              <!--  ItemModel title -->
              <v-row wrap justify="center" align="center" class="ma-0 pa-0">
                <v-col cols="12" md="12" sm="12" class="text-center ma-0 pa-0">
                  <v-toolbar :style="appLightBackground" elevation="0">
                    <v-toolbar-title class="mx-auto text-h5">
                      {{ activeItemModel.name }}</v-toolbar-title
                    >
                    <!-- Disable ItemModel -->
                    <v-tooltip bottom v-if="user.admin">
                      <template
                        style="max-width: 30px"
                        v-slot:activator="{ on, attrs }"
                      >
                        <v-btn
                          class="ma-2 custom-transform-class text-none"
                          small
                          icon
                          v-bind="attrs"
                          v-on="on"
                          @click="handleDialog(null, 'disableItemModel')"
                        >
                          <v-icon>disabled_visible</v-icon>
                        </v-btn>
                      </template>
                      <span>Disable this Item Model</span>
                    </v-tooltip>
                    <!-- Edit itemModel -->
                    <v-tooltip bottom v-if="user.admin">
                      <template
                        v-slot:activator="{ on, attrs }"
                        style="max-width: 30px"
                      >
                        <v-btn
                          class="ma-2 custom-transform-class text-none"
                          small
                          icon
                          v-bind="attrs"
                          v-on="on"
                          @click="handleEditItemModel(false)"
                        >
                          <v-icon>edit</v-icon>
                        </v-btn>
                      </template>
                      <span>Edit this itemModel</span>
                    </v-tooltip>
                    <!-- Clone the itemModel as new itemModel -->
                    <v-tooltip bottom v-if="user.admin">
                      <template
                        v-slot:activator="{ on, attrs }"
                        style="max-width: 30px"
                      >
                        <v-btn
                          class="ma-2 custom-transform-class text-none"
                          small
                          icon
                          v-bind="attrs"
                          v-on="on"
                          @click="handleEditItemModel(true)"
                        >
                          <v-icon>control_point_duplicate</v-icon>
                        </v-btn>
                      </template>
                      <span>Clone as new item model</span>
                    </v-tooltip>
                  </v-toolbar>
                </v-col>
              </v-row>
              <!-- Displayting itemModel Images -->
              <v-row
                justify="center"
                class="my-0 py-0 mx-2"
                v-if="activeItemModel.images.length"
              >
                <v-col class="text-right" style="width: 60%">
                  <v-carousel>
                    <v-carousel-item
                      @click="expandImage(index)"
                      v-for="(image, index) in activeItemModel.images"
                      :key="'image' + index"
                      :src="image.imageUrl"
                      reverse-transition="fade-transition"
                      transition="fade-transition"
                    >
                    </v-carousel-item>
                  </v-carousel>
                </v-col>
              </v-row>
              <!-- <v-btn @click="test">Test</v-btn> -->
              <!-- Displaying Item Model Data-->
              <div>
                <!-- Displaying Item Model Data-->
                <v-card
                  :style="appLightBackground"
                  elevation="0"
                  class="pa-0 pointerMouse"
                >
                  <v-card-text class="pt-3">
                    <!-- Displaying Description caption-->
                    <v-row class="mx-0" justify="start">
                      <v-col class="text-left" align="center">
                        <p
                          class="body-1 font-weight-medium my-0 py-0"
                          :style="appThemeFontColor"
                        >
                          Description:
                        </p>
                      </v-col>
                    </v-row>
                    <!-- Displaying Description card-->
                    <v-row class="py-2 mt-2 mx-0" justify="center">
                      <v-col
                        class="text-left py-0 my-0"
                        align="center"
                        cols="12"
                        md="12"
                        sm="12"
                      >
                        <!-- Displaying Description text -->
                        <v-row class="my-0 py-0">
                          <!-- text -->
                          <v-col class="my-0 py-0" cols="12" md="12" sm="12">
                            <p :style="appThemeFontColor">
                              {{ activeItemModel.description }}
                            </p>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <!-- Displaying Category caption-->
                    <v-row class="mx-0 mb-5" justify="start">
                      <v-col class="text-left" align="center">
                        <p
                          class="body-1 font-weight-medium my-0 py-0"
                          :style="appThemeFontColor"
                        >
                          Category:
                        </p>
                      </v-col>
                    </v-row>
                    <!-- Displaying Category -->
                    <v-row class="py-0 my-0 mx-0" justify="start">
                      <!-- text -->
                      <v-col
                        class="text-left py-0 my-0"
                        align="text-left"
                        cols="12"
                        md="5"
                        sm="5"
                      >
                        <p :style="appThemeFontColor">
                          Category of the item model:
                          {{ activeItemModel.category }}
                        </p>
                      </v-col>
                    </v-row>
                    <!-- Displaying SubCategory -->
                    <v-row class="py-0 my-0 mx-0" justify="start">
                      <!-- text -->
                      <v-col
                        class="text-left py-0 my-0"
                        align="text-left"
                        cols="12"
                        md="5"
                        sm="5"
                      >
                        <p :style="appThemeFontColor">
                          Subcategory of the item model:
                          {{ activeItemModel.subCategory }}
                        </p>
                      </v-col>
                    </v-row>
                    <!-- Displaying Group -->
                    <v-row class="py-0 my-0 mx-0" justify="start">
                      <!-- text -->
                      <v-col
                        class="text-left py-0 my-0"
                        align="text-left"
                        cols="12"
                        md="5"
                        sm="5"
                      >
                        <p :style="appThemeFontColor">
                          Group of the item model:
                          {{ activeItemModel.group }}
                        </p>
                      </v-col>
                    </v-row>
                    <!-- Specs title-->
                    <v-row class="mx-0 py-0 mt-0 mb-5" justify="start">
                      <v-col class="text-left py-0 my-0" align="center">
                        <p
                          class="body-1 font-weight-medium my-0 py-0"
                          :style="appThemeFontColor"
                        >
                          Technical Details:
                        </p>
                      </v-col>
                    </v-row>
                    <!-- Displaying Specs -->
                    <div
                      class="py-0 my-0 mx-5"
                      justify="start"
                      v-for="(spec, index) in activeItemModel.specs"
                      :key="'spec' + index"
                      :class="getRowClass(index)"
                    >
                      <v-row
                        no-gutters
                        justify="start"
                        class="d-flex align-center mx-2"
                      >
                        <!-- name -->
                        <v-col
                          class="text-left my-0 py-0"
                          align="center"
                          cols="6"
                          md="3"
                          sm="6"
                          style="max-width: 200px"
                        >
                          <p :style="appThemeFontColor" class="ma-0 pa-0">
                            {{ spec.specName }}
                          </p>
                        </v-col>
                        <!-- spec value -->
                        <v-col
                          v-if="
                            spec.specValueType === 'value' ||
                            spec.specValueType === 'text' ||
                            spec.specValueType === 'value with unit'
                          "
                          class="text-left my-0 py-0"
                          align="center"
                          cols="6"
                          md="7"
                          sm="6"
                        >
                          <p
                            v-if="spec.specValueType === 'text'"
                            class="ma-0 pa-0"
                            :style="appThemeFontColor"
                          >
                            {{ spec.specText }}
                          </p>
                          <p
                            v-else
                            class="ma-0 pa-0"
                            :style="appThemeFontColor"
                          >
                            {{
                              spec.specValueType === 'value'
                                ? spec.specValue
                                : spec.specValue + ' ' + spec.specUnitSelect
                            }}
                          </p>
                        </v-col>
                        <!-- spec value options -->
                        <v-col
                          v-if="
                            spec.specValueType === 'options' ||
                            spec.specValueType === 'value options' ||
                            spec.specValueType === 'options with unit'
                          "
                          class="text-left my-0 py-0"
                          align="center"
                          cols="6"
                          md="7"
                          sm="6"
                        >
                          <!-- text options -->
                          <p
                            v-if="spec.specValueType === 'options'"
                            class="ma-0 pa-0"
                            :style="appThemeFontColor"
                          >
                            {{ spec.specTextSelect }}
                          </p>
                          <!-- value options / with unit -->
                          <p
                            v-else
                            class="ma-0 pa-0"
                            :style="appThemeFontColor"
                          >
                            {{
                              spec.specValueType === 'value options'
                                ? spec.specValueSelect
                                : spec.specValueSelect +
                                  ' ' +
                                  spec.specUnitSelect
                            }}
                          </p>
                        </v-col>
                      </v-row>
                      <!-- <hr style="width: 90%" /> -->
                    </div>
                    <!-- Color variannts title-->
                    <v-row class="mx-0 py-0 my-5" justify="start">
                      <v-col class="text-left py-0 my-0" align="center">
                        <p
                          class="body-1 font-weight-medium my-0 py-0"
                          :style="appThemeFontColor"
                        >
                          Color Variants:
                        </p>
                      </v-col>
                    </v-row>
                    <!-- color selection -->
                    <v-row class="my-0 py-0 mx-0" justify="start">
                      <v-col cols="12" class="my-2 py-0 text-left">
                        <!-- Chip for each color -->
                        <v-chip
                          v-for="(color, index) in activeItemModel.colors"
                          :key="index"
                          class="ma-2"
                          style="height: 25px"
                          :color="color"
                          :text-color="appDark ? 'black' : 'white'"
                        >
                          {{ color.charAt(0).toUpperCase() + color.slice(1) }}
                        </v-chip>
                      </v-col>
                    </v-row>
                    <!-- View tags -->
                    <v-row class="mt-5 py-3" justify="start">
                      <v-col
                        cols="12"
                        md="12"
                        sm="12"
                        class="my-0 py-0 text-left"
                      >
                        <!-- Chip for tag -->
                        <v-chip
                          dense
                          small
                          v-for="(tag, index) in activeItemModel.tags"
                          :key="index"
                          class="ma-2"
                          :style="appThemeFontColor"
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
            <!-- Displaying The Spinner while loading database from Firebase-->
          </div>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <progress-circular></progress-circular>
    </div>
  </v-container>
</template>
<script>
// Importing required modules
import { mapGetters } from 'vuex';
export default {
  name: 'itemModelPreview',
  data() {
    return {
      // itemModelDataReceived: false,
      progress: null,
      isExpandedImageDialog: false,
      expandedImageUrl: '',
      itemModelCarouselIndex: null,
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
      'error',
      'errorStatus',
      'loading',
      'appDark',
      'appLightBackground',
      'appThemeFontColor',
      'validationRules',
      'itemModels',
      'itemModelDataReceived',
      'initializeAppComplete',
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
    itemModelMode: {
      get() {
        return this.$store.getters.itemModelMode;
      },
      set(value) {
        this.$store.commit('setItemModelMode', value);
      },
    },
    activeItemModel: {
      get() {
        return this.$store.getters.activeItemModel;
      },
      set(value) {
        this.$store.commit('setActiveItemModel', value);
      },
    },
  },
  async created() {
    // setting itemModelReceivedFlag to false
    this.$store.commit('setItemModelDataReceived', false);
    this.progressing = true;
    // console.log('item model viewer reached!');
    await this.getItemModelData();
    // console.log('activeItemModel:', this.activeItemModel);
  },
  beforeDistroyed() {
    this.$store.commit('setItemModelDataReceived', false);
  },
  mounted() {
    this.$nextTick(function () {
      this.progressing = false;
    });
    // this.itemModelDataReceived = true;
  },
  watch: {
    initializeAppComplete(newValue, oldValue) {
      if (oldValue === false) {
        this.getItemModelData();
      }
    },
    // itemModelDataReceived(newValue, oldValue) {
    //   if (oldValue === false) {
    //     this.getItemModelData();
    //   }
    // },
    async $route(to, from) {
      // if (!this.itemModelDataReceived) {
      this.getItemModelData();
      // }
    },
  },
  methods: {
    clearDialog(result) {
      this.dialogResult = result;
      if (result === 'yes') {
        if (this.dialogContext === 'disableItemModel') {
          this.handleDisableItemModel();
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
        case 'disableItemModel':
          this.dialogContext = 'disableItemModel';
          break;

        default:
          break;
      }
      // performing action
      switch (this.dialogContext) {
        case 'disableItemModel':
          this.dialogHeading = 'Confirm Disabling ItemModel';
          this.dialogText =
            'Are you sure you want to disable this itemModel? This can be enabled later from database. data will remain in the database.';
          this.dialogBtn1 = 'Cancel';
          this.dialogBtn2 = 'Yes';
          this.isDialog = true;
          break;

        default:
          break;
      }
    },
    async getItemModelData() {
      if (this.initializeAppComplete) {
        // Finding matchinf itemModel
        let currentItemModel = this.itemModels.find(
          (itemModel) =>
            itemModel.routeParam === this.$route.params.itemModelName
        );

        if (!currentItemModel) {
          this.$store.dispatch('handleCatchError', {
            message: 'Invalid ItemModel',
          });
          if (this.$route.name !== 'home') {
            this.$router.push({ name: 'home' });
          }
          return;
        }
        // console.log('active res:', this.activeItemModel);
        this.activeItemModel = await this.$store.dispatch(
          'getSingleItemModel',
          { itemModelId: currentItemModel._id }
        );
      }
    },
    test() {},
    // Edit current itemModel by contributors
    handleEditItemModel(cloneFlag) {
      if (!cloneFlag) {
        // Set itemModel mode to edit
        this.itemModelMode = 'edit';
      } else {
        this.cloneFlag = true;
        // Set itemModel mode to create
        this.itemModelMode = 'create';
        if (this.activeItemModel._id) delete this.activeItemModel._id;
        this.activeItemModel.name = this.activeItemModel.name + ' - cloned';
      }
      // Directing to alpha itemModel creator/edit page
      if (this.$route.name !== 'itemModelCreator') {
        this.$router.push({ name: 'itemModelCreator' });
      }
    },
    async handleDisableItemModel() {
      let currentItemModel = this.itemModels.find(
        (itemModel) => itemModel._id === this.activeItemModel._id
      );
      let currentItemModelIndex = this.itemModels.indexOf(currentItemModel);
      // sending to database
      await this.$store.dispatch('disableItemModel', {
        itemModelId: this.activeItemModel._id,
      });
      // if (disableSuccessMessage) {
      this.itemModels.splice(currentItemModelIndex, 1);
      // }
      //   routing to previous item Model/home
      if (this.itemModels.length) {
        //  Routing to the itemModel view page
        if (currentItemModelIndex === 0) {
          this.$router.push(`/itemModels/${this.itemModels[0].routeParam}`);
        } else {
          this.$router.push(
            `/itemModels/${
              this.itemModels[currentItemModelIndex - 1].routeParam
            }`
          );
        }
      } else {
        // route  to home page
        if (this.$route.name !== 'home') {
          this.$router.push({ name: 'home' });
        }
      }
    },
    // Bring up image dialog
    expandImage(index) {
      this.itemModelCarouselIndex = index;
      // this.expandedImageUrl = this.activeItemModel.images[index].imageUrl;
      this.isExpandedImageDialog = true;
    },
    getRowClass(index) {
      if (this.appDark) {
        // For dark mode, you might want to reverse the shading logic or adjust it
        return {
          'grey darken-4 py-2': index % 2 === 0, // Darker for even rows
          'grey darken-3 py-2': index % 2 !== 0, // Lighter for odd rows
        };
      } else {
        // For light mode, as per your original logic
        return {
          'grey lighten-4 py-2': index % 2 === 0, // Lighter for even rows
          'grey lighten-2 py-2': index % 2 !== 0, // Slightly darker for odd rows
        };
      }
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
.itemModel__image {
  opacity: 1;
}
.itemModel__image:hover {
  opacity: 0.8;
}
.display__itemModel-image {
  border-radius: 15px;
}
.floating-left-top-btn {
  position: fixed;
}
</style>
