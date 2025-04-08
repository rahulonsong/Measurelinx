<template>
  <div>
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
    <!-- Main Data -->
    <v-dialog
      scrollable
      v-model="isItemInitiateDialog"
      persistent
      max-width="600px"
    >
      <v-card
        class="mx-auto"
        min-width="500"
        max-width="600"
        style="overflow: hidden"
      >
        <!-- <v-btn @click="test">Test</v-btn> -->
        <!-- Import Header Image -->
        <v-card-title
          style="height: 100px"
          class="title font-weight-bold manageProjectsBackground d-flex justfy-center"
        >
          Initiate an Item
        </v-card-title>
        <!-- Listing Item models -->
        <v-card-text
          class="text--primary my-0 py-0"
          style="min-height: 100px; max-height: 600px"
        >
          <v-form
            id="initiateItem--form"
            v-model="initiateItemIsFormValid"
            lazy-validation
            ref="initiateItemForm"
            class="text-xs-center my-0 py-0"
            v-if="itemModels.length > 0"
          >
            <!-- Combobox for Selecting Files to be deleted -->
            <v-row justify="start" class="my-2">
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete
                  v-model="itemModelSelect"
                  dense
                  :items="itemModels"
                  item-text="name"
                  item-value="name"
                  return-object
                  :rules="validationRules.required"
                  clearable
                  label="Select the Item Model"
                  prepend-icon="token"
                >
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-form>
          <v-row v-else style="margin-top: 80px; margin-bottom: 80px">
            <v-col cols="12" md="6" sm="6" class="d-flex justify-end">
              <img src="@/assets/icons/file_search.png" height="80" alt="app" />
            </v-col>
            <v-col cols="12" md="6" sm="6" class="d-flex justify-start mt-6">
              <p>No Item Models Found!</p>
            </v-col>
          </v-row>
        </v-card-text>
        <!-- Action Buttons -->
        <v-card-actions>
          <v-container>
            <!-- Buttons for adding item-->
            <v-row justify="center">
              <v-col
                v-if="itemModels.length"
                cols="12"
                sm="6"
                md="6"
                class="text-center"
              >
                <v-btn
                  @click="handleInitiateItem"
                  rounded
                  small
                  color="error"
                  type="submit"
                  :disabled="loading || !initiateItemIsFormValid"
                  class="bold font-weight-bold"
                >
                  Initiate
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="6" class="text-center">
                <v-btn
                  @click="itemInitiateExit"
                  rounded
                  small
                  color="primary"
                  type="submit"
                  :disabled="loading"
                  class="bold font-weight-bold"
                >
                  Cancel
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      initiateItemIsFormValid: true,
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
      'progressing',
      'errorStatus',
      'loading',
      'appDark',
      'appLightBackground',
      'appThemeFontColor',
      'validationRules',
      'itemModels',
      'randomColor',
      'items',
      'cleanItem',
    ]),
    activeItemModel: {
      get() {
        return this.$store.getters.activeItemModel;
      },
      set(value) {
        this.$store.commit('setActiveItemModel', value);
      },
    },
    activeItem: {
      get() {
        return this.$store.getters.activeItem;
      },
      set(value) {
        this.$store.commit('setActiveItem', value);
      },
    },
    isItemInitiateDialog: {
      get() {
        return this.$store.getters.isItemInitiateDialog;
      },
      set(value) {
        this.$store.commit('setIsItemInitiateDialog', value);
      },
    },
    itemModelSelect: {
      get() {
        return this.$store.getters.itemModelSelect;
      },
      set(value) {
        this.$store.commit('setItemModelSelect', value);
      },
    },
  },
  methods: {
    async handleInitiateItem() {
      if (this.$refs.initiateItemForm.validate()) {
        let itemModelId = this.itemModelSelect._id;
        const payload = {
          itemModelId: itemModelId,
        };
        // fethcing selected itemmodel data
        let itemModel = await this.$store.dispatch(
          'getSingleItemModel',
          payload
        );
        if (itemModel) {
          // assigning activeitemModel data
          this.$store.commit('setActiveItemModel', itemModel);
          // initiating the item
          this.activeItem = { ...this.cleanItem };
          this.activeItem.tags = [...itemModel.tags];
          this.activeItem.specs = itemModel.specs.map((spec) => {
            return {
              specName: spec.specName,
              specDescription: spec.specDescription,
              specValueType: spec.specValueType,
              specUnit: spec.specUnitSelect,
              specValue: spec.specValue,
              specText: spec.specText,
              specValueSelect: spec.specValueSelect,
              specTextSelect: spec.specTextSelect,
              specValueOptions: [...spec.specValueOptions],
              specTextOptions: [...spec.specTextOptions],
            };
          });
          // if (itemModel.images.length)
          //   this.activeItem.defaultImage = itemModel.images[0].imageLink;
          this.activeItem.category = itemModel.category;
          this.activeItem.description = itemModel.description;
          this.activeItem.model = this.activeItemModel._id;
          // exiting the dialog
          this.isItemInitiateDialog = false;
          this.itemModelSelect = {};
          // console.log('activeItem', this.activeItem);
          // setting item mode
          this.$store.commit('setItemMode', 'create');
          // routing to item creator
          if (this.$route.name !== 'itemCreator') {
            this.$router.push({ name: 'itemCreator' });
          }
        }
      } else {
        this.handleDialog(null, 'formNotValid');
      }
    },
    itemInitiateExit() {
      this.isItemInitiateDialog = false;
      this.itemModelSelect = {};
    },
    // Handling Dialogs
    handleDialog(content, context) {
      this.$store.dispatch('handleDialog', {
        content: content,
        context: context,
      });
    },
    // Remove item
    remove(item, array) {
      array.splice(array.indexOf(item), 1);
      array = [...array];
    },
    test() {
      // console.log(this.projectsToBeDeleted);
    },
  },
  created() {
    //   projects minial data
    // await this.$store.dispatch("getItemModels");
    this.itemModelSelect = {};
  },
};
</script>
<style>
.myfont1 {
  font-size: 14px;
}
.inputValue input::-webkit-outer-spin-button,
.inputValue input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.manageProjectsBackground {
  background: linear-gradient(90deg, #0a0c4a 0%, #8291cd 100%);
  color: white;
}
.btnCase {
  text-transform: none !important;
}
</style>
