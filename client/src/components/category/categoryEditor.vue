<template>
  <v-container fluid class="ma-0 pa-0">
    <!-- Edit /  Update category -->
    <category-dialog></category-dialog>
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
    <!-- Main data -->
    <div v-if="user && token">
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
            <v-card
              class="mt-0 pt-0"
              min-height="500"
              scrollable
              style="border-radius: 0"
            >
              <!-- Category title -->
              <v-row class="ma-0 pa-0 d-flex">
                <v-col class="ma-0 pa-0">
                  <v-card-title> Categories Editor </v-card-title>
                </v-col>
                <v-col class="mt-5 mr-5 pa-0 text-right">
                  <v-btn
                    small
                    class="blue app__button"
                    :class="appDark ? 'darken-3' : 'lighten-4'"
                    @click="addNewCategory()"
                  >
                    <v-icon>category</v-icon>
                    <span class="ml-2">New Category</span>
                  </v-btn>
                </v-col>
              </v-row>
              <!--  categories and Create New Category -->
              <v-card-text class="mx-0 px-0">
                <div
                  v-for="(category, index) in itemCategories"
                  :key="'category' + index"
                >
                  <!-- Category Card -->
                  <div>
                    <v-card
                      class="mx-3 my-2"
                      style="border: 1px solid grey"
                      hover
                    >
                      <v-row class="ma-0 pa-0" justify="start">
                        <!-- Category -->
                        <v-col
                          cols="8"
                          md="8"
                          sm="8"
                          class="ma-0 pa-0 text-left"
                          align="start"
                        >
                          <v-card-text>
                            <category-template
                              :category="category"
                            ></category-template>
                          </v-card-text>
                        </v-col>
                        <v-spacer></v-spacer>
                        <!-- sort categories -->
                        <v-col
                          cols="2"
                          md="2"
                          sm="2"
                          class="text-center my-auto py-0"
                          style="width: 60px"
                        >
                          <v-icon
                            small
                            class="pointerCursor"
                            color="primary"
                            @click="
                              array_move(
                                itemCategories,
                                index,
                                index == 0
                                  ? itemCategories.length - 1
                                  : index - 1
                              )
                            "
                            style="height: 20px"
                            >fas fa-arrow-up</v-icon
                          >
                          <v-icon
                            small
                            color="primary"
                            class="pointerCursor ml-2"
                            @click="
                              array_move(
                                itemCategories,
                                index,
                                index == itemCategories.length - 1
                                  ? 0
                                  : index + 1
                              )
                            "
                            style="height: 20px"
                            >fas fa-arrow-down</v-icon
                          >
                        </v-col>
                        <!-- Edit Category -->
                        <v-col
                          cols="2"
                          md="1"
                          sm="2"
                          class="my-0 pa-0 text-right"
                          align-self="center"
                          style="max-width: 50px"
                        >
                          <v-btn
                            icon
                            fab
                            small
                            class="mr-2"
                            @click="editCategory(category)"
                          >
                            <v-icon>edit</v-icon>
                          </v-btn>
                        </v-col>
                        <!-- delete Category -->
                        <v-col
                          v-if="false"
                          cols="2"
                          md="1"
                          sm="2"
                          class="my-0 pa-0 text-right"
                          align-self="center"
                          style="max-width: 50px"
                        >
                          <v-btn
                            icon
                            fab
                            small
                            class="mr-5"
                            @click="
                              handleDialog(
                                { index: index },
                                'deleteItemCategory'
                              )
                            "
                          >
                            <v-icon>delete</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card>
                  </div>
                </div>
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
// Importing required modules
import moment from 'moment';
import { mapGetters } from 'vuex';
export default {
  name: 'categoryEditor',
  data() {
    return {
      // reviewsByUserDataReceived: false,
      pageTitle: 'Categories',
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
      activeCategoryIndex: null,
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
      'itemCategories',
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
    categoryContext: {
      get() {
        return this.$store.getters.categoryContext;
      },
      set(value) {
        this.$store.commit('setCategoryContext', value);
      },
    },
    activeCategory: {
      get() {
        return this.$store.getters.activeCategory;
      },
      set(value) {
        this.$store.commit('setActiveCategory', value);
      },
    },
    categoryDialog: {
      get() {
        return this.$store.getters.categoryDialog;
      },
      set(value) {
        this.$store.commit('setCategoryDialog', value);
      },
    },
  },
  async created() {
    // setting categoriesReceived to false
    // this.$store.commit('setItemCategoriesReceived', false);
    this.progressing = true;
    // await this.getItemCategories();
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
        //   Get app categories
        // this.getItemCategories();
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
        if (this.dialogContext === 'deleteCategory') {
          const id = this.itemCategories[this.activeCategoryIndex]._id;
          payload = {
            id,
          };
          try {
            await this.$store.dispatch('deleteCategory', payload);
            let user = this.user;
            this.itemCategories.splice(this.activeCategoryIndex, 1);
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
        case 'deleteCategory':
          this.dialogContext = 'deleteCategory';
          break;

        default:
          break;
      }
      // performing action
      switch (this.dialogContext) {
        case 'deleteCategory':
          this.dialogHeading = 'Confirm Deleting Category';
          this.dialogText = 'Are you sure you want to delete this category?';
          this.dialogBtn1 = 'Cancel';
          this.dialogBtn2 = 'Yes';
          this.isDialog = true;
          this.activeCategoryIndex = content.index;
          break;

        default:
          break;
      }
    },
    // async getItemCategories() {
    //   if (this.initializeAppComplete) {
    //     // getting App categories
    //     const result = await this.$store.dispatch('getItemCategories');
    //     this.$forceUpdate();
    //   }
    // },
    test() {
      console.log('itemCategories:', this.itemCategories);
    },
    addNewCategory() {
      this.categoryContext = 'add';
      this.activeCategory = {
        categoryType: 'single',
        name: '',
        description: '',
        disabled: false,
        published: false,
        subCategories: [],
      };
      this.categoryDialog = true;
    },
    editCategory(category) {
      this.categoryContext = 'edit';
      this.activeCategory = { ...category };
      this.categoryDialog = true;
    },
    deleteCategory(category) {
      alert('this will delete the category');
    },
    enableSnackBar(targetRequired, targetText, targetLink) {
      // Assign snackbar parameters
      this.targetRequired = targetRequired;
      this.targetText = targetText;
      this.targetLink = targetLink;
      // show snackbar
      this.$store.commit('setSnackBar', true);
    },
    // Sorting categories and updating positions
    async array_move(arr, old_index, new_index) {
      // Validation omitted for brevity
      let tempPosition = arr[old_index].position;
      arr[old_index].position = arr[new_index].position;
      arr[new_index].position = tempPosition;

      // Move item in the array
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);

      // Update the database
      for (const index of [old_index, new_index]) {
        try {
          let categoryInput = arr[index];
          const id = categoryInput._id;
          delete categoryInput._id; // Clone and modify as needed
          const payload = { id, categoryInput: { ...categoryInput } };

          let category = await this.$store.dispatch(
            'updateItemCategory',
            payload
          );
          if (category) {
            // Assume arr[index] is still the correct item to replace
            arr[index] = category;
          }
        } catch (error) {
          console.error('Failed to update category:', error);
          // Handle error appropriately
        }
      }

      return arr; // For testing
    },
  },
};
</script>
<style></style>
