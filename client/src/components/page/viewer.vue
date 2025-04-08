<template>
  <v-container fluid class="my-0 py-0">
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
    <!-- Main pageRow -->
    <v-row justify="center" align="center" class="ml-2 mr-0 my-0 pa-0">
      <v-col cols="12" md="12" sm="12" class="text-center ma-0 pa-0">
        <!-- Data Available after Sync actions -->
        <div
          class="mt-0 pt-0"
          v-if="
            isTemplate
              ? homePageDataReceived && homePageData
              : activePageDataReceived
          "
        >
          <!-- <v-btn @click="test">Test</v-btn> -->
          <v-card class="ma-0 pa-0" elevation="0">
            <!-- Create Page title -->
            <v-row wrap justify="start" align="start" class="ma-0 pa-0">
              <v-col cols="12" md="12" sm="12" class="text-left ma-0 pa-0">
                <v-toolbar
                  :style="appLightBackground"
                  elevation="0"
                  class="text-left toolbar--title"
                >
                  <!-- displaying -->
                  <v-toolbar-title class="text-h5 ma-0 pa-0 ml-n2">
                    {{
                      isTemplate
                        ? homePageData.name
                          ? homePageData.name
                          : 'Name of the Page'
                        : activePage.name
                        ? activePage.name
                        : 'Name of the Page'
                    }}</v-toolbar-title
                  >
                  <v-spacer></v-spacer>
                  <!-- <v-btn @click="test">Test</v-btn> -->
                  <div
                    v-if="user && user.admin && !isTemplate"
                    class="hidden-xs-only"
                  >
                    <!-- Disable Page -->
                    <v-tooltip bottom v-if="user && user.admin">
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
                          @click="handleDialog(null, 'disablePage')"
                        >
                          <v-icon>disabled_visible</v-icon>
                        </v-btn>
                      </template>
                      <span>Disable this Page</span>
                    </v-tooltip>
                    <!-- Edit Page -->
                    <v-tooltip bottom v-if="user && user.admin">
                      <template
                        v-slot:activator="{ on, attrs }"
                        style="max-width: 30px"
                      >
                        <v-btn
                          class="mx-2 py-0 my-0 custom-transform-class text-none"
                          small
                          icon
                          v-bind="attrs"
                          v-on="on"
                          @click="handleEditPage(!cloning)"
                        >
                          <v-icon>{{ icons.mdiPencil }}</v-icon>
                        </v-btn>
                      </template>
                      <span>Edit this page</span>
                    </v-tooltip>
                    <!-- Clone the page as new page -->
                    <v-tooltip bottom v-if="user && user.admin">
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
                          @click="handleEditPage(cloning)"
                        >
                          <v-icon>control_point_duplicate</v-icon>
                        </v-btn>
                      </template>
                      <span>Clone as a new page</span>
                    </v-tooltip>
                  </div>
                </v-toolbar>
              </v-col>
            </v-row>
            <!-- Displaying Page Data-->
            <div>
              <!-- Displaying Page Data-->
              <v-card
                id="pageHtmlExport"
                :style="appLightBackground"
                flat
                class="pa-0 pointerMouse app ma-0 pa-0"
                elevation="0"
              >
                <v-card-text class="pt-3 ma-0 px-0" :style="appThemeFontColor1">
                  <!-- Displaying description -->
                  <v-row
                    v-if="
                      isTemplate
                        ? homePageData.description &&
                          homePageData.description != 'Page Description'
                        : activePage.description &&
                          activePage.description != 'Page Description'
                    "
                    class="pt-2 pb-0 my-0"
                    justify="start"
                  >
                    <!-- text -->
                    <v-col
                      class="ma-0 pa-0 text-left"
                      cols="12"
                      md="12"
                      sm="12"
                    >
                      <!-- description-->
                      <v-card-text class="ma-0 pa-0">
                        <v-row class="ma-0 pa-0">
                          <v-col class="ma-0 pa-0">
                            <p class="mr-0 ml-1 px-0">
                              {{
                                isTemplate
                                  ? homePageData.description
                                  : activePage.description
                              }}
                            </p>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-col>
                  </v-row>
                  <!-- Displaying PageRows -->
                  <v-row class="ma-0 pa-0">
                    <v-col class="ma-0 pa-0 text-left">
                      <v-card
                        flat
                        class="ma-0 pa-0"
                        v-for="(pageRow, pageRowIndex) in isTemplate
                          ? homePageData.pageRows
                          : activePage.pageRows"
                        :key="pageRowIndex"
                        elevation="0"
                      >
                        <v-card-text class="ma-0 pa-0">
                          <!-- 3 columns for assigning resources -->
                          <v-row class="ma-0 pa-0">
                            <!-- Col 1 -->
                            <v-col
                              cols="12"
                              :md="
                                pageRow.numberOfCols === 'single'
                                  ? '12'
                                  : pageRow.numberOfCols === 'triple'
                                  ? '4'
                                  : pageRow.rowType === 'leftProminent'
                                  ? '8'
                                  : pageRow.rowType === 'equal'
                                  ? '6'
                                  : '4'
                              "
                              sm="12"
                              class="ma-0 pa-0"
                            >
                              <!-- display constructor resource -->
                              <v-row class="my-0 pa-0">
                                <v-col
                                  class="ma-0 py-0 pl-0"
                                  :class="pageRow.col2.exists ? 'pr-8' : 'pr-0'"
                                  md="12"
                                  sm="12"
                                  cols="12"
                                >
                                  <div v-if="pageRow.col1.resourceDataReceived">
                                    <!-- Displaying resource -->
                                    <v-row class="ma-0 pa-0">
                                      <v-col class="ma-0 pa-0">
                                        <div
                                          :id="'row' + pageRowIndex + 'col1'"
                                          :class="
                                            pageRow.numberOfCols !== 'single' &&
                                            (isTemplate
                                              ? homePageData.pageRows.length > 1
                                              : activePage.pageRows.length >
                                                1) &&
                                            !isHomeRoute
                                              ? 'limited-height'
                                              : ''
                                          "
                                          :style="
                                            pageRow.numberOfCols !== 'single' &&
                                            (isTemplate
                                              ? homePageData.pageRows.length > 1
                                              : activePage.pageRows.length >
                                                1) &&
                                            !isHomeRoute
                                              ? {
                                                  height:
                                                    pageRow.col1.limitedHeight,
                                                }
                                              : {}
                                          "
                                        >
                                          <!-- Your component content goes here -->
                                          <constructor-resource-template
                                            :navigableComponent="
                                              pageRow.col1.navigation.component
                                            "
                                            :routeParam="
                                              pageRow.col1.navigation.routeParam
                                            "
                                            :isNavigationEnabled="
                                              pageRow.col1.navigation.isEnabled
                                            "
                                            :constructorResource="
                                              pageRow.col1.resource
                                            "
                                            :title="pageRow.col1.title"
                                            :pageResourceDataReceived="
                                              pageRow.col1.resourceDataReceived
                                            "
                                            :numberOfRows="
                                              activePage.pageRows.length
                                            "
                                            :numberOfCols="pageRow.numberOfCols"
                                          ></constructor-resource-template>
                                        </div>
                                      </v-col>
                                    </v-row>
                                    <!-- "Show More/Less" button -->
                                    <v-row
                                      v-if="
                                        pageRow.numberOfCols !== 'single' &&
                                        pageRow.col1.shouldShowMoreButton &&
                                        (isTemplate
                                          ? homePageData.pageRows.length > 1
                                          : activePage.pageRows.length > 1) &&
                                        !isHomeRoute
                                      "
                                      class="my-2 pa-0"
                                      justify="center"
                                    >
                                      <v-col class="ma-0 pa-0 text-center">
                                        <!-- Show More/Less button -->
                                        <v-btn
                                          @click="
                                            toggleFullHeight(pageRow, 'col1')
                                          "
                                          text
                                          small
                                          class="app__button mx-0 px-2"
                                          :class="
                                            appDark
                                              ? 'blue darken-4'
                                              : 'blue lighten-4'
                                          "
                                        >
                                          {{
                                            pageRow.col1.expanded
                                              ? 'Show Less'
                                              : 'Show More'
                                          }}
                                        </v-btn>
                                      </v-col>
                                    </v-row>
                                  </div>
                                  <div v-else>
                                    <v-progress-linear></v-progress-linear>
                                  </div>
                                </v-col>
                              </v-row>
                            </v-col>
                            <!-- Col 2 -->
                            <v-col
                              v-if="
                                pageRow.numberOfCols === 'double' ||
                                pageRow.numberOfCols === 'triple'
                              "
                              cols="12"
                              :md="
                                pageRow.numberOfCols === 'triple'
                                  ? '4'
                                  : pageRow.rowType === 'leftProminent'
                                  ? '4'
                                  : pageRow.rowType === 'equal'
                                  ? '6'
                                  : '8'
                              "
                              sm="12"
                              class="ma-0 pa-0"
                              :class="
                                pageRow.numberOfCols === 'triple' ? 'pr-8' : ''
                              "
                            >
                              <!-- display constructor resource -->
                              <v-row class="my-0 pa-0">
                                <v-col
                                  class="ma-0 pa-0"
                                  md="12"
                                  sm="12"
                                  cols="12"
                                >
                                  <div v-if="pageRow.col2.resourceDataReceived">
                                    <!-- displaying resource -->
                                    <v-row class="ma-0 pa-0">
                                      <v-col class="ma-0 pa-0">
                                        <div
                                          :id="'row' + pageRowIndex + 'col2'"
                                          :class="
                                            pageRow.numberOfCols !== 'single' &&
                                            (isTemplate
                                              ? homePageData.pageRows.length > 1
                                              : activePage.pageRows.length >
                                                1) &&
                                            !isHomeRoute
                                              ? 'limited-height'
                                              : ''
                                          "
                                          :style="
                                            pageRow.numberOfCols !== 'single' &&
                                            (isTemplate
                                              ? homePageData.pageRows.length > 1
                                              : activePage.pageRows.length >
                                                1) &&
                                            !isHomeRoute
                                              ? {
                                                  height:
                                                    pageRow.col2.limitedHeight,
                                                }
                                              : {}
                                          "
                                        >
                                          <constructor-resource-template
                                            :navigableComponent="
                                              pageRow.col2.navigation.component
                                            "
                                            :routeParam="
                                              pageRow.col2.navigation.routeParam
                                            "
                                            :isNavigationEnabled="
                                              pageRow.col2.navigation.isEnabled
                                            "
                                            :constructorResource="
                                              pageRow.col2.resource
                                            "
                                            :title="pageRow.col2.title"
                                            :pageResourceDataReceived="
                                              pageRow.col2.resourceDataReceived
                                            "
                                            :numberOfRows="
                                              activePage.pageRows.length
                                            "
                                            :numberOfCols="pageRow.numberOfCols"
                                          ></constructor-resource-template>
                                        </div>
                                      </v-col>
                                    </v-row>
                                    <!-- "Show More" button -->
                                    <v-row
                                      v-if="
                                        pageRow.numberOfCols !== 'single' &&
                                        pageRow.col2.shouldShowMoreButton &&
                                        (isTemplate
                                          ? homePageData.pageRows.length > 1
                                          : activePage.pageRows.length > 1) &&
                                        !isHomeRoute
                                      "
                                      class="my-2 pa-0"
                                      justify="center"
                                    >
                                      <v-col class="ma-0 pa-0 text-center">
                                        <v-btn
                                          @click="
                                            toggleFullHeight(pageRow, 'col2')
                                          "
                                          text
                                          small
                                          class="app__button mx-0 px-2"
                                          :class="
                                            appDark
                                              ? 'blue darken-4'
                                              : 'blue lighten-4'
                                          "
                                        >
                                          {{
                                            pageRow.col2.expanded
                                              ? 'Show Less'
                                              : 'Show More'
                                          }}
                                        </v-btn>
                                      </v-col>
                                    </v-row>
                                  </div>
                                  <div v-else>
                                    <v-progress-linear></v-progress-linear>
                                  </div>
                                </v-col>
                              </v-row>
                            </v-col>
                            <!-- Col 3 -->
                            <v-col
                              v-if="pageRow.numberOfCols === 'triple'"
                              cols="12"
                              md="4"
                              sm="12"
                              class="ma-0 pa-0"
                            >
                              <!-- display constructor resource -->
                              <v-row class="my-0 pa-0">
                                <v-col
                                  class="ma-0 pa-0"
                                  md="12"
                                  sm="12"
                                  cols="12"
                                >
                                  <div v-if="pageRow.col3.resourceDataReceived">
                                    <!-- displaying resource -->
                                    <v-row class="ma-0 pa-0">
                                      <v-col class="ma-0 pa-0">
                                        <div
                                          :id="'row' + pageRowIndex + 'col3'"
                                          :class="
                                            pageRow.numberOfCols !== 'single' &&
                                            (isTemplate
                                              ? homePageData.pageRows.length > 1
                                              : activePage.pageRows.length >
                                                1) &&
                                            !isHomeRoute
                                              ? 'limited-height'
                                              : ''
                                          "
                                          :style="
                                            pageRow.numberOfCols !== 'single' &&
                                            (isTemplate
                                              ? homePageData.pageRows.length > 1
                                              : activePage.pageRows.length >
                                                1) &&
                                            !isHomeRoute
                                              ? {
                                                  height:
                                                    pageRow.col3.limitedHeight,
                                                }
                                              : {}
                                          "
                                        >
                                          <constructor-resource-template
                                            :navigableComponent="
                                              pageRow.col3.navigation.component
                                            "
                                            :routeParam="
                                              pageRow.col3.navigation.routeParam
                                            "
                                            :isNavigationEnabled="
                                              pageRow.col3.navigation.isEnabled
                                            "
                                            :constructorResource="
                                              pageRow.col3.resource
                                            "
                                            :title="pageRow.col3.title"
                                            :pageResourceDataReceived="
                                              pageRow.col3.resourceDataReceived
                                            "
                                            :numberOfRows="
                                              activePage.pageRows.length
                                            "
                                            :numberOfCols="pageRow.numberOfCols"
                                          ></constructor-resource-template>
                                        </div>
                                      </v-col>
                                    </v-row>
                                    <!-- "Show More" button -->
                                    <v-row
                                      v-if="
                                        pageRow.numberOfCols !== 'single' &&
                                        pageRow.col3.shouldShowMoreButton &&
                                        (isTemplate
                                          ? homePageData.pageRows.length > 1
                                          : activePage.pageRows.length > 1) &&
                                        !isHomeRoute
                                      "
                                      class="my-2 pa-0"
                                      justify="center"
                                    >
                                      <v-col class="ma-0 pa-0 text-center">
                                        <!-- Show More/Less button -->
                                        <v-btn
                                          @click="
                                            toggleFullHeight(pageRow, 'col3')
                                          "
                                          text
                                          small
                                          class="app__button mx-0 px-2"
                                          :class="
                                            appDark
                                              ? 'blue darken-4'
                                              : 'blue lighten-4'
                                          "
                                        >
                                          {{
                                            pageRow.col3.expanded
                                              ? 'Show Less'
                                              : 'Show More'
                                          }}
                                        </v-btn>
                                      </v-col>
                                    </v-row>
                                  </div>
                                  <div v-else>
                                    <v-progress-linear></v-progress-linear>
                                  </div>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                          <!-- button for Page row -->
                          <v-row
                            v-if="pageRow.hasButton"
                            class="my-2 pa-0"
                            justify="center"
                          >
                            <v-col class="ma-0 pa-0 text-center">
                              <!-- page row button -->
                              <v-btn
                                @click="
                                  navigateToTarget(
                                    pageRow.buttonParameters.targetType,
                                    pageRow.buttonParameters.routeParam
                                  )
                                "
                                text
                                small
                                class="app__button mx-0 px-2"
                                :class="
                                  appDark ? 'blue darken-4' : 'blue lighten-4'
                                "
                              >
                                {{ pageRow.buttonParameters.text }}
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  <!-- Displaying the  category, subCategory and Group of item-->
                  <div
                    v-if="
                      isTemplate
                        ? homePageData.isItemPage
                        : activePage.isItemPage
                    "
                  >
                    <v-row no-gutters class="ma-0 pa-0">
                      <v-col cols="12" class="my-0 pa-0">
                        <div class="mt-5" v-if="itemPageDataReceived">
                          <item-pagination
                            :itemData="itemPageData"
                            :itemPageNumber="itemPageNumber"
                            :numberOfPages="itemPageNumberOfPages"
                            @pageChanged="getItemCategoryData"
                          ></item-pagination>
                        </div>
                        <div v-else>
                          <progress-circular></progress-circular>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-card>
        </div>
        <!-- Displaying The Spinner while loading database -->
        <div v-else class="mt-0 pt-0">
          <progress-linear></progress-linear>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
// Importing required modules
import { mapGetters } from 'vuex';
export default {
  name: 'pageViewer',
  data() {
    return {
      pageMode: '',
      progress: null,
      isDialog: false,
      cloning: true,
      dialogHeading: '',
      dialogText: '',
      dialogText2: '',
      dialogBtn1: '',
      dialogBtn2: '',
      dialogResult: '',
      dialogContext: '',
    };
  },
  props: ['homePageDataReceived', 'homePageData'],
  computed: {
    ...mapGetters([
      'user',
      'error',
      'errorStatus',
      'loading',
      'appDark',
      'appLightBackground',
      'validationRules',
      'appThemeFontColor1',
      'pageCategories',
      'constructorAlphaResources',
      'items',
      'icons',
      'initializeAppComplete',
      'navigablePageComponents',
      'itemPageData',
    ]),
    progressing: {
      get() {
        return this.$store.getters.progressing;
      },
      set(value) {
        this.$store.commit('setProgressing', value);
      },
    },
    pageCloningActive: {
      get() {
        return this.$store.getters.pageCloningActive;
      },
      set(value) {
        this.$store.commit('setPageCloningActive', value);
      },
    },
    activePage: {
      get() {
        return this.$store.getters.activePage;
      },
      set(value) {
        this.$store.commit('setActivePage', value);
      },
    },
    pages: {
      get() {
        return this.$store.getters.pages;
      },
      set(value) {
        this.$store.commit('setPages', value);
      },
    },
    constructorPages: {
      get() {
        return this.$store.getters.constructorPages;
      },
      set(value) {
        this.$store.commit('setConstructorPages', value);
      },
    },
    activePageDataReceived: {
      get() {
        return this.$store.getters.activePageDataReceived;
      },
      set(value) {
        this.$store.commit('setActivePageDataReceived', value);
      },
    },
    limitedHeight() {
      return process.env.VUE_APP_PAGE_RESOURCE_HEIGHT;
    },
    isHomeRoute() {
      return this.$route.name === 'home';
    },
    isTemplate() {
      return this.$route.name !== 'pageViewer';
    },
    itemPageNumber: {
      get() {
        return this.$store.getters.itemPageNumber;
      },
      set(value) {
        this.$store.commit('setItemPageNumber', value);
      },
    },
    itemPageNumberOfPages: {
      get() {
        return this.$store.getters.itemPageNumberOfPages;
      },
      set(value) {
        this.$store.commit('setItemPageNumberOfPages', value);
      },
    },
    itemPageDataReceived: {
      get() {
        return this.$store.getters.itemPageDataReceived;
      },
      set(value) {
        this.$store.commit('setItemPageDataReceived', value);
      },
    },
  },
  async created() {
    // console.log('active page:', this.activePage);

    // set the navigable items for each column
    // get page details if not creating a new page
    if (!this.isTemplate) {
      this.activePageDataReceived = false;
      await this.getPageData();
      this.$nextTick(() => {
        this.setButtonVisibility();
        this.$forceUpdate();
      });
    }
    await this.getItemCategoryData();
  },
  mounted() {
    if (!this.isTemplate) {
      this.$nextTick(function () {
        this.progressing = false;
      });
    }
  },
  watch: {
    initializeAppComplete(newValue, oldValue) {
      if (oldValue === false) {
        this.getPageData();
      }
    },
    async $route(to, from) {
      if (this.activePageDataReceived) {
        await this.getPageData();
        await this.getItemCategoryData();
      }
      this.setButtonVisibility();
      this.$forceUpdate();
    },
    // // Watch for changes in content height and decide whether to show the "Show More" button
    // '`$el.offsetHeight': function (newHeight) {
    //   this.activePage.pageRows.forEach(row => {
    //     if(row.col1.exists) row.col1.showMoreButton = newHeight > parseInt(this.limitedHeight);
    //   });

    // },`
  },
  methods: {
    clearDialog(result) {
      this.dialogResult = result;
      if (result === 'yes') {
        if (this.dialogContext === 'disablePage') {
          this.handleDisablePage();
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
        case 'disablePage':
          this.dialogContext = 'disablePage';
          break;

        case 'formNotValid':
          this.dialogContext = 'formNotValid';
          break;

        default:
          break;
      }
      // performing action
      switch (this.dialogContext) {
        case 'disablePage':
          this.dialogHeading = 'Confirm Disabling Page';
          this.dialogText =
            'Are you sure you want to disable this Page? This can be enabled later from database. data will remain in the database.';
          this.dialogBtn1 = 'Cancel';
          this.dialogBtn2 = 'Yes';
          this.isDialog = true;
          break;

        case 'formNotValid':
          this.dialogHeading = 'Incomplete form';
          this.dialogText = 'Add the required field to submit';
          this.dialogBtn1 = 'Ok';
          this.dialogBtn2 = '';
          this.isDialog = true;
          break;

        default:
          break;
      }
    },
    handleEditPage(cloneFlag) {
      // if cloning
      if (cloneFlag) {
        this.pageCloningActive = true;
        // pushing to editor
        this.$router.push({
          name: 'pageCreator',
          params: { pageName: 'newPage' },
        });
        return;
      }
      // pushing to editor
      this.$router.push({
        name: 'pageCreator',
        params: { pageName: this.$route.params.pageName },
      });
    },
    onDismissed() {
      this.$store.dispatch('clearError');
    },
    async getPageData() {
      if (
        this.$route.params.pageName !== 'newPage' &&
        this.initializeAppComplete
      ) {
        // Finding matching item
        // console.log('active res:', this.activeItem);
        this.activePageDataReceived = false;
        this.activePage = await this.$store.dispatch('getSinglePage', {
          routeParam: this.$route.params.pageName,
        });
        this.activePageDataReceived = true;
      }
    },
    async getItemCategoryData(page) {
      const isNumber = (value) => typeof value === 'number' && !isNaN(value);
      if (page != undefined && isNumber(page)) {
        this.itemPageNumber = page;
      }
      // console.log('page:', page);
      if (
        this.activePage &&
        this.activePage.isItemPage &&
        this.activePage.itemDetails.category
      ) {
        this.itemPageDataReceived = false;
        let categoryFilters = {
          category: this.activePage.itemDetails.category,
        };
        // Checking for subCategory
        categoryFilters['subCategory'] =
          this.activePage.itemDetails.subCategory;
        // Checking for group
        categoryFilters['group'] = this.activePage.itemDetails.group;
        // setting itempagenumber
        this.itemPageNumber
          ? (categoryFilters['itemPageNumber'] = this.itemPageNumber)
          : (categoryFilters['itemPageNumber'] = 1);

        // defining payload for item catgories
        const payload = {
          itemPageDetailsInput: categoryFilters,
        };
        // console.log('payload:', payload);
        // fetching items
        await this.$store.dispatch('getSingleCategoryGroupItems', payload);
      }
    },
    async handleDisablePage() {
      let currentPage = this.pages.find(
        (page) => page._id === this.activePage._id
      );
      let currentPageIndex = this.pages.indexOf(currentPage);
      const payload = {
        id: this.activePage._id,
      };
      // console.log('disable page payload:', payload);
      // sending to database
      await this.$store.dispatch('disablePage', payload);
      // if (disableSuccessMessage) {
      this.pages.splice(currentPageIndex, 1);
      // }
      // console.log('page index:', currentPageIndex);
      // console.log('pages :', this.pages);
      //   routing to previous page/home
      if (this.pages.length) {
        //  Routing to the page view page
        if (currentPageIndex === 0) {
          this.$router.push(`/pages/${this.pages[0].routeParam}`);
        } else {
          this.$router.push(
            `/pages/${this.pages[currentPageIndex - 1].routeParam}`
          );
        }
      } else {
        // route  to home page
        if (this.$route.name !== 'home') {
          this.$router.push({ name: 'home' });
        }
      }
    },
    toggleFullHeight(row, column) {
      switch (column) {
        case 'col1':
          row.col1.expanded = !row.col1.expanded;
          row.col1.limitedHeight = row.col1.expanded
            ? 'auto'
            : process.env.VUE_APP_PAGE_RESOURCE_HEIGHT; // Set to your desired full height
          break;
        case 'col2':
          row.col2.expanded = !row.col2.expanded;
          row.col2.limitedHeight = row.col2.expanded
            ? 'auto'
            : process.env.VUE_APP_PAGE_RESOURCE_HEIGHT; // Set to your desired full height
          break;
        case 'col3':
          row.col3.expanded = !row.col3.expanded;
          row.col3.limitedHeight = row.col3.expanded
            ? 'auto'
            : process.env.VUE_APP_PAGE_RESOURCE_HEIGHT; // Set to your desired full height
          break;
        default:
          break;
      }
    },
    setButtonVisibility() {
      for (
        let i = 0;
        i <
        (this.isTemplate
          ? this.homePageData.pageRows.length
          : this.activePage.pageRows.length);
        i++
      ) {
        const row = this.isTemplate
          ? this.homePageData.pageRows[i]
          : this.activePage.pageRows[i];
        // col1
        if (row.col1.exists) {
          const limitedHeightDiv = this.$el.querySelector(`#row${i}col1`);
          if (limitedHeightDiv) {
            // console.log('scroll height:', limitedHeightDiv.scrollHeight);
            row.col1.shouldShowMoreButton =
              limitedHeightDiv.scrollHeight > limitedHeightDiv.clientHeight;
          }
        }
        // col2
        if (row.col2.exists) {
          const limitedHeightDiv = this.$el.querySelector(`#row${i}col2`);
          if (limitedHeightDiv) {
            row.col2.shouldShowMoreButton =
              limitedHeightDiv.scrollHeight > limitedHeightDiv.clientHeight;
          }
        }
        // col3
        if (row.col3.exists) {
          const limitedHeightDiv = this.$el.querySelector(`#row${i}col3`);
          if (limitedHeightDiv) {
            row.col3.shouldShowMoreButton =
              limitedHeightDiv.scrollHeight > limitedHeightDiv.clientHeight;
          }
        }
      }
      // console.log('modified active page:', this.activePage);
    },
    navigateToTarget(target = 'pageViewer', paramValue) {
      let params = {};

      switch (target) {
        case 'pageViewer':
          params.pageName = paramValue;
          break;
        // Add more cases as needed for other targets
        default:
          console.warn(`Unknown target: ${target}`);
          return;
      }

      // Check if the current route matches the target and parameter
      const currentRouteMatches =
        this.$route.name === target &&
        this.$route.params[Object.keys(params)[0]] === paramValue;

      if (currentRouteMatches) {
        return;
      }

      // Navigate to the target route with the specified parameter
      this.$router.push({
        name: target,
        params: params,
      });
    },
    test() {
      console.log('page data:', this.homePageData);
      // console.log('constructorAlphaResources:', this.constructorAlphaResources);
    },
  },
};
</script>
<style scoped>
.limited-height {
  overflow: hidden;
  transition: height 0.5s ease; /* Add a smooth transition effect */
}
</style>
