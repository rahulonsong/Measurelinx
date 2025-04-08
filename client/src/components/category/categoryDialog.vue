<!-- Ediatable Dialog -->
<template>
  <!-- Dialog for Add/Update Categories -->
  <v-row class="my-0 py-0" style="width: 100%">
    <v-col class="my-0 py-0">
      <v-dialog
        v-model="categoryDialog"
        persistent
        scrollable
        max-width="800px"
      >
        <v-card>
          <v-card-title
            class="font-weight-bold"
            :class="appDark ? 'cyan darken-4' : 'light-blue lighten-3'"
          >
            {{
              categoryContext === 'add'
                ? 'Add a new category'
                : 'Update Category'
            }}
          </v-card-title>
          <!-- Category Data -->
          <v-card-text
            style="height: 800px"
            class="justify__text mx-0 py-0 px-0 my-0"
          >
            <!-- container -->
            <v-container class="mx-0 py-0 px-0 my-0">
              <v-form
                :style="appThemeFontColor"
                v-model="isCategoryFormValid"
                lazy-validation
                ref="appCategoryForm"
                class="py-0 my-0 mx-5"
              >
                <!-- Type of Category-->
                <v-row class="my-0 py-0" justify="space-between">
                  <v-col class="my-0 py-0">
                    <v-radio-group
                      v-model="activeCategory.categoryType"
                      row
                      @change="santizeCategoryContent()"
                    >
                      <v-row class="my-0 py-0" justify="space-around">
                        <!-- Single -->
                        <v-col class="my-1 py-0" cols="4" md="4" sm="4">
                          <v-radio
                            label="Single Level"
                            value="single"
                          ></v-radio>
                        </v-col>
                        <!-- Double -->
                        <v-col class="my-1 py-0" cols="4" md="4" sm="4">
                          <v-radio
                            label="Double Level"
                            value="double"
                          ></v-radio>
                        </v-col>
                        <!-- Triple -->
                        <v-col class="my-1 py-0" cols="4" md="4" sm="4">
                          <v-radio
                            label="Triple Level"
                            value="triple"
                          ></v-radio>
                        </v-col>
                      </v-row>
                    </v-radio-group>
                  </v-col>
                </v-row>
                <!-- Displaying Publish option -->
                <v-row class="my-0 py-0" justify="center">
                  <v-col
                    class="text-left d-flex"
                    align="center"
                    cols="12"
                    md="12"
                    sm="12"
                  >
                    <p class="my-0 py-0">
                      Do you want to publish this category?
                    </p>
                    <v-spacer></v-spacer>
                    <v-switch
                      class="my-0 py-0"
                      v-model="activeCategory.published"
                      dense
                      hide-details
                      :label="
                        activeCategory.published ? 'Published' : 'Unpublished'
                      "
                    >
                    </v-switch>
                  </v-col>
                </v-row>
                <!-- Displaying disabled option -->
                <v-row
                  v-if="user.admin"
                  class="pt-2 pb-0 my-0 d-flex"
                  justify="center"
                >
                  <v-col
                    class="text-left d-flex"
                    align="center"
                    cols="12"
                    md="12"
                    sm="12"
                  >
                    <p class="my-0 py-0">
                      Do you want to disable this Category?
                    </p>
                    <v-spacer></v-spacer>
                    <v-switch
                      class="my-0 py-0"
                      v-model="activeCategory.disabled"
                      dense
                      hide-details
                      :label="
                        activeCategory.disabled ? 'Disabled' : 'Not Disabled'
                      "
                    >
                    </v-switch>
                  </v-col>
                </v-row>
                <!-- Displaying category content -->
                <!-- single Level Category -->
                <div v-if="activeCategory.categoryType === 'single'">
                  <v-row class="ma-0 pa-0">
                    <!-- Category name -->
                    <v-col class="ma-2 pa-0">
                      <v-text-field
                        v-model="activeCategory.name"
                        placeholder="Name of Category"
                        label="Category Name"
                        :rules="validationRules.required"
                        type="text"
                        hide-details
                        dense
                        outlined
                        clearable
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </div>
                <!-- Double Level category -->
                <div v-if="activeCategory.categoryType === 'double'">
                  <v-row class="my-0 py-0">
                    <v-col class="my-0 py-0">
                      <v-text-field
                        v-model="activeCategory.name"
                        placeholder="Name of Category"
                        :rules="validationRules.required"
                        label="Category Name"
                        type="text"
                        hide-details
                        dense
                        outlined
                        clearable
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <!-- Add subcategory -->
                  <v-row justify="start" class="my-0 py-0">
                    <v-col align="center" class="text-left ma-0 pa-0">
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ma-2 success--text text--darken-3 text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="addCategoryItem(null)"
                          >
                            <v-icon>playlist_add</v-icon>
                          </v-btn>
                        </template>
                        <span>Add subcategory</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <!-- Subcategories -->
                  <v-row
                    class="my-0 ml-10 pa-0"
                    v-for="(
                      subCategory, subCategoryIndex
                    ) in activeCategory.subCategories"
                    :key="'subCategory' + subCategoryIndex"
                  >
                    <!-- Category name -->
                    <v-col class="ma-2 pa-0">
                      <v-text-field
                        v-model="subCategory.name"
                        placeholder="Name of sub-category"
                        label="Sub-category Name"
                        :rules="validationRules.required"
                        type="text"
                        hide-details
                        dense
                        outlined
                        clearable
                      >
                      </v-text-field>
                    </v-col>
                    <!-- Delete Category item -->
                    <v-col cols="1" class="text-right ma-0 pa-0">
                      <!-- Delete category item -->
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ma-2 error--text text--darken-3 custom-transform-class text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="deleteCategoryItem(subCategoryIndex, null)"
                          >
                            <v-icon>delete</v-icon>
                          </v-btn>
                        </template>
                        <span>Delete this category</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </div>
                <!-- Triple Level Category-->
                <div v-if="activeCategory.categoryType === 'triple'">
                  <v-row class="my-0 py-0">
                    <v-col class="my-0 py-0">
                      <v-text-field
                        v-model="activeCategory.name"
                        :rules="validationRules.required"
                        placeholder="Name of Category"
                        label="Category Name"
                        type="text"
                        hide-details
                        dense
                        outlined
                        clearable
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <!-- Add subcategory -->
                  <v-row justify="start" class="my-0 py-0">
                    <v-col align="center" class="text-left ma-0 pa-0">
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ma-2 success--text text--darken-3 custom-transform-class text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click.stop="addCategoryItem(null)"
                          >
                            <v-icon>playlist_add</v-icon>
                          </v-btn>
                        </template>
                        <span>Add subcategory</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <!-- Subcategories -->
                  <v-row
                    class="my-0 ml-10 pa-0"
                    v-for="(
                      subCategory, subCategoryIndex
                    ) in activeCategory.subCategories"
                    :key="'subCategory' + subCategoryIndex"
                  >
                    <v-col class="my-0 py-0">
                      <!-- subcategory name -->
                      <v-row
                        ><v-col cols="11">
                          <v-text-field
                            v-model="subCategory.name"
                            placeholder="Name of Sub-Category"
                            label="Sub-Category Name"
                            :rules="validationRules.required"
                            type="text"
                            hide-details
                            dense
                            outlined
                            clearable
                          >
                          </v-text-field>
                        </v-col>
                        <!-- Delete Category item -->
                        <v-col cols="1" class="text-right ma-0 pa-0">
                          <v-tooltip left>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                class="ma-2 error--text text--darken-3 custom-transform-class text-none"
                                medium
                                icon
                                v-bind="attrs"
                                v-on="on"
                                @click.stop="
                                  deleteCategoryItem(subCategoryIndex, null)
                                "
                              >
                                <v-icon>delete</v-icon>
                              </v-btn>
                            </template>
                            <span>Delete this subcategory</span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                      <!-- Add subtitle -->
                      <v-row justify="start" class="my-0 py-0">
                        <v-col align="center" class="text-left ma-0 pa-0">
                          <v-tooltip right>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                class="ma-2 success--text text--darken-3 custom-transform-class text-none"
                                medium
                                icon
                                v-bind="attrs"
                                v-on="on"
                                @click.stop="addCategoryItem(subCategoryIndex)"
                              >
                                <v-icon>playlist_add</v-icon>
                              </v-btn>
                            </template>
                            <span>Add Deep Subcategory</span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                      <!-- subTitles -->
                      <v-row
                        class="my-0 ml-10 pa-0"
                        v-for="(
                          subTitle, subTitleIndex
                        ) in subCategory.subTitles"
                        :key="'subTitle' + subTitleIndex"
                      >
                        <!-- Category name -->
                        <v-col class="ma-2 pa-0">
                          <v-text-field
                            v-model="subTitle.name"
                            placeholder="Name of List"
                            :rules="validationRules.required"
                            label="List Name"
                            type="text"
                            hide-details
                            dense
                            outlined
                            clearable
                          >
                          </v-text-field>
                        </v-col>
                        <v-spacer></v-spacer>
                        <!-- Delete Category item -->
                        <v-col cols="1" class="text-right ma-0 pa-0">
                          <v-tooltip left>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                class="ma-2 error--text text--darken-3 custom-transform-class text-none"
                                medium
                                icon
                                v-bind="attrs"
                                v-on="on"
                                @click.stop="
                                  deleteCategoryItem(
                                    subCategoryIndex,
                                    subTitleIndex
                                  )
                                "
                              >
                                <v-icon>delete</v-icon>
                              </v-btn>
                            </template>
                            <span>Delete this Deep Subcategory</span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </div>
              </v-form>
            </v-container>
          </v-card-text>
          <!-- Close/cancel buttons -->
          <v-card-actions>
            <v-row justify="center" class="my-2">
              <!-- Save -->
              <v-col md="2" sm="3" class="text-center">
                <v-btn
                  rounded
                  small
                  class="primary darken-4 font-weight-bold"
                  :disabled="!isCategoryFormValid"
                  raised
                  color="blue"
                  @click="saveCategoryDialog()"
                >
                  Submit
                </v-btn>
              </v-col>
              <!-- Cancel -->
              <v-col md="2" sm="3" class="text-center">
                <v-btn
                  rounded
                  small
                  class="error darken-4 font-weight-bold"
                  raised
                  @click="clearCategoryDialog()"
                >
                  Cancel
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {};
  },
  props: [
    'isDialog',
    'dialogHeading',
    'dialogText',
    'dialogText2',
    'dialogBtn1',
    'dialogBtn2',
    'dialogResult',
    'dialogContext',
  ],

  computed: {
    ...mapGetters([
      'user',
      'error',
      'errorStatus',
      'appDark',
      'appThemeFontColor',
      'validationRules',
    ]),
    categoryContext: {
      get() {
        return this.$store.getters.categoryContext;
      },
      set(value) {
        this.$store.commit('setCategoryContext', value);
      },
    },
    appCategories: {
      get() {
        return this.$store.getters.appCategories;
      },
      set(value) {
        this.$store.commit('setAppCategories', value);
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
    isCategoryFormValid: {
      get() {
        return this.$store.getters.isCategoryFormValid;
      },
      set(value) {
        this.$store.commit('setIsCategoryFormValid', value);
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
  },
  methods: {
    clearCategoryDialog() {
      this.categoryDialog = false;
      this.activeCategory.categoryType = 'single';
      this.activeCategory.name = '';
      this.activeCategory.description = '';
      this.activeCategory.disabled = false;
      this.activeCategory.published = false;
      this.activeCategory.subCategories = [];
      // alert("This will handle category dialog action");
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
    santizeCategoryContent() {
      this.$forceUpdate();
    },
    async saveCategoryDialog() {
      // console.log('this will add category');
      // Adding Category to database
      if (this.$refs.appCategoryForm.validate()) {
        let categoryInput = {
          ...this.activeCategory,
        };
        let payload;
        payload = {
          categoryInput,
        };
        if (this.categoryContext !== 'add') {
          payload.id = this.activeCategory._id;
        }
        delete payload.categoryInput._id;
        // return;
        if (this.categoryContext === 'add') {
          let category = await this.$store.dispatch('addItemCategory', payload);
          if (category) {
            this.appCategories.push(category);
            console.log('appCategories:', this.appCategories);
          }
        } else {
          let category = await this.$store.dispatch(
            'updateItemCategory',
            payload
          );
          if (category) {
            const existingCategory = this.appCategories.find(
              (category) => category._id === payload.id
            );
            const index = this.appCategories.indexOf(existingCategory);
            this.appCategories.splice(index, 1, category);
          }
        }
        this.clearCategoryDialog();
        // console.log('current user:', this.user);
        this.$forceUpdate();
        this.categoryDialog = false;
      } else {
        this.$store.dispatch('handleDialog', {
          context: 'formNotValid',
          content: null,
        });
      }
    },
    deleteCategoryItem(subCategoryIndex, subTitleIndex) {
      if (this.activeCategory.categoryType === 'double') {
        this.activeCategory.subCategories.splice(subCategoryIndex, 1);
      } else if (this.activeCategory.categoryType === 'triple') {
        // Check explicitly for undefined instead of falsy
        if (subTitleIndex === undefined || subTitleIndex == null) {
          // Correctly use splice to remove exactly one element
          this.activeCategory.subCategories.splice(subCategoryIndex, 1);
        } else {
          this.activeCategory.subCategories[subCategoryIndex].subTitles.splice(
            subTitleIndex,
            1
          );
        }
      }
      this.$forceUpdate();
    },
    addCategoryItem(subCategoryIndex) {
      // Ensure subCategories array is initialized
      if (!this.activeCategory.subCategories) {
        this.activeCategory.subCategories = [];
      }

      if (this.activeCategory.categoryType === 'double') {
        this.activeCategory.subCategories.push({ name: '' });
      } else {
        // Handle 'triple' categoryType
        if (subCategoryIndex !== null) {
          // Ensure the subcategory and its subtitles are initialized
          if (!this.activeCategory.subCategories[subCategoryIndex]) {
            this.activeCategory.subCategories[subCategoryIndex] = {
              name: '',
              subTitles: [],
            };
          } else if (
            !this.activeCategory.subCategories[subCategoryIndex].subTitles
          ) {
            this.activeCategory.subCategories[subCategoryIndex].subTitles = [];
          }
          this.activeCategory.subCategories[subCategoryIndex].subTitles.push({
            name: '',
          });
        } else {
          // Add a new subcategory with one empty subtitle
          this.activeCategory.subCategories.push({
            name: '',
            subTitles: [{ name: '' }],
          });
        }
      }

      this.$forceUpdate();
    },
  },
  watch: {
    categoryDialog() {
      this.$nextTick(() => {
        this.$refs.appCategoryForm.resetValidation();
      });
    },
  },
};
</script>
