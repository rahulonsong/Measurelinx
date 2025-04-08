<template>
  <v-container fluid class="ma-0 pa-0">
    <!-- Displayig the Expanded Image Dialog-->
    <v-row wrap class="ma-0 pa-0" justify="center">
      <v-col
        class="text-center mx-auto my-0 py-0"
        align="center"
        cols="12"
        md="12"
        sm="12"
      >
        <v-dialog
          content-class="display__resource-image"
          v-model="isExpandedImageDialog"
          max-width="1100"
        >
          <v-card class="ma-0 pa-0">
            <v-img
              :src="expandedImageUrl"
              alt="Resource Image"
              style="max-height: 90%"
              id="thumbnail"
              class="mx-auto"
            >
              <v-card-title
                class="align-start jsutify-end fill-height ma-0 pa-0"
                primary-title
              >
                <v-btn
                  style="z-index: 9999"
                  medium
                  icon
                  @click="isExpandedImageDialog = false"
                >
                  <v-icon :class="appDark ? 'black' : 'white'">close</v-icon>
                </v-btn>
              </v-card-title>
            </v-img>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <!-- resource disable Dialog -->
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
    <div v-if="isTemplate ? pageResourceDataReceived : resourceDataReceived">
      <v-row align="center" justify="center" class="my-0 mx-1 pa-0">
        <!-- <v-btn @click="test">Test</v-btn> -->
        <v-col cols="12" md="12" sm="12" class="ma-0 pa-0">
          <!-- Data Available after Sync actions -->
          <div class="ma-0 pa-0">
            <v-card
              @click="showRelatedContent"
              class="ma-0 pa-0"
              flat
              :ripple="false"
              :class="
                isNavigationEnabled
                  ? 'navigation__resource--page'
                  : 'navigation__disabled'
              "
            >
              <!--  Resource title -->
              <v-row
                wrap
                justify="center"
                align="center"
                class="ma-0 pa-0"
                v-if="
                  isTemplate
                    ? numberOfCols &&
                      numberOfCols !== 'single' &&
                      numberOfRows &&
                      numberOfRows > 1
                    : true
                "
              >
                <v-col cols="12" md="12" sm="12" class="text-left ma-0 pa-0">
                  <v-toolbar
                    :style="appLightBackground"
                    elevation="0"
                    class="toolbar--title"
                  >
                    <v-toolbar-title class="text-h5">
                      {{
                        isTemplate
                          ? title
                            ? title
                            : constructorResource.title
                          : alphaResourceViewTitle
                      }}</v-toolbar-title
                    >
                    <v-spacer v-if="!isTemplate"></v-spacer>
                    <div
                      v-if="
                        !isTemplate &&
                        user &&
                        (user.admin || user.resourceCreator)
                      "
                    >
                      <!-- Disable Resource -->
                      <v-tooltip bottom>
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
                            @click="handleDialog(null, 'disableResource')"
                          >
                            <v-icon>disabled_visible</v-icon>
                          </v-btn>
                        </template>
                        <span>Disable this resource</span>
                      </v-tooltip>
                      <!-- Edit resource -->
                      <v-tooltip bottom>
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
                            @click="handleEditAlphaResource(false)"
                          >
                            <v-icon>edit</v-icon>
                          </v-btn>
                        </template>
                        <span>Edit this resource</span>
                      </v-tooltip>
                      <!-- Clone the resource as new resource -->
                      <v-tooltip bottom>
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
                            @click="handleEditAlphaResource(true)"
                          >
                            <v-icon>control_point_duplicate</v-icon>
                          </v-btn>
                        </template>
                        <span>Clone as new resource</span>
                      </v-tooltip>
                    </div>
                  </v-toolbar>
                </v-col>
              </v-row>
              <!-- Displaying Alpha Resource Data-->
              <div>
                <v-card
                  :style="appLightBackground"
                  elevation="0"
                  class="ma-0 pa-0 pointerMouse"
                >
                  <v-card-text class="pa-0 ma-0" elevation="0">
                    <v-card class="ma-0 pa-0" elevation="0">
                      <!-- Displaying Content & Intro -->
                      <v-row class="ma-0 pa-0" justify="start">
                        <v-col class="ma-0 pa-0 text-left">
                          <!-- Displaying intro -->
                          <v-card-text
                            class="ma-0 pa-0"
                            elevation="0"
                            :class="
                              isNavigationEnabled
                                ? 'navigation__resource--page'
                                : 'navigation__disabled'
                            "
                          >
                            <span
                              v-html="
                                isTemplate
                                  ? constructorResource.contentIntro
                                  : alphaResourceViewIntro
                              "
                              class="appFont1"
                            ></span>
                          </v-card-text>
                          <div
                            v-if="
                              isTemplate
                                ? constructorResource.content &&
                                  constructorResource.content.length
                                : alphaResourceViewContent &&
                                  alphaResourceViewContent.length
                            "
                          >
                            <v-card-text
                              elevation="0"
                              v-for="(content, contentIndex) in isTemplate
                                ? constructorResource.content
                                : alphaResourceViewContent"
                              :key="contentIndex"
                              class="ma-0 pa-0"
                              :class="
                                isNavigationEnabled
                                  ? 'navigation__resource--page'
                                  : 'navigation__disabled'
                              "
                            >
                              <!-- Content data -->
                              <v-row
                                class="px-0 py-3 mx-0 mt-2"
                                justify="center"
                              >
                                <!-- Resource Image after upload -->
                                <v-col
                                  v-if="
                                    content.imageRequired &&
                                    content.imageLink &&
                                    content.imageOnLeft
                                  "
                                  class="text-left ma-0 pa-0"
                                  cols="12"
                                  :md="!content.contentDetail ? 12 : 4"
                                  :sm="!content.contentDetail ? 12 : 4"
                                  xs="12"
                                >
                                  <v-row class="ma-0 pa-0" justify="start">
                                    <v-col
                                      class="ma-0 pa-0"
                                      :class="
                                        !content.contentDetail
                                          ? 'text-center'
                                          : 'text-left'
                                      "
                                    >
                                      <v-img
                                        class="ma-0 pa-0"
                                        :src="content.imageUrl"
                                        alt="Resource Image"
                                        background-color="rgba(200,200,200,0.3)"
                                        :height="
                                          !content.contentDetail ? 500 : 200
                                        "
                                        cover
                                        id="thumbnail"
                                      ></v-img>
                                    </v-col>
                                  </v-row>
                                </v-col>
                                <v-spacer
                                  v-if="
                                    content.contentDetail && content.imageOnLeft
                                  "
                                ></v-spacer>
                                <!-- Content text -->
                                <v-col
                                  v-if="content.contentDetail"
                                  class="text-left ma-0 pa-0"
                                  cols="12"
                                  :md="content.imageRequired ? '8' : '12'"
                                  :sm="content.imageRequired ? '8' : '12'"
                                  xs="12"
                                >
                                  <div
                                    v-html="content.contentDetail"
                                    class="appFont1 v-html__margin"
                                    :class="
                                      content.imageOnLeft ? 'ml-2' : 'mr-2'
                                    "
                                    style="overflow: auto"
                                  ></div>
                                </v-col>
                                <v-spacer
                                  v-if="
                                    content.contentDetail &&
                                    !content.imageOnLeft
                                  "
                                ></v-spacer>
                                <!-- Resource Image after upload -->
                                <v-col
                                  v-if="
                                    content.imageRequired &&
                                    content.imageLink &&
                                    !content.imageOnLeft
                                  "
                                  class="ma-0 pa-0"
                                  :class="
                                    !content.contentDetail
                                      ? 'text-center'
                                      : 'text-right'
                                  "
                                  align="center"
                                  cols="12"
                                  :md="!content.contentDetail ? 12 : 4"
                                  :sm="!content.contentDetail ? 12 : 4"
                                  xs="12"
                                >
                                  <v-row class="my-0 py-0" justify="center">
                                    <v-col class="text-center my-0 py-0">
                                      <v-img
                                        :src="content.imageUrl"
                                        contain
                                        cover
                                        alt="Resource Image"
                                        background-color="rgba(200,200,200,0.3)"
                                        :height="
                                          !content.contentDetail ? 500 : 200
                                        "
                                        id="thumbnail"
                                      >
                                      </v-img>
                                    </v-col>
                                  </v-row>
                                </v-col>
                              </v-row>
                              <!-- Resource table  -->
                              <v-row
                                justify="start"
                                v-if="
                                  content.contentTable &&
                                  content.contentTable.tableRequired
                                "
                                class="ma-0 py-5"
                              >
                                <v-col
                                  style="max-width: 100%"
                                  class="text-left ma-0 pa-0"
                                >
                                  <v-data-table
                                    :headers="
                                      content.contentTable.tableHeaders.filter(
                                        (header) => header.text !== 'Actions'
                                      )
                                    "
                                    :items="content.contentTable.tableItems"
                                    hide-default-footer
                                    class="elevation-1"
                                    style="
                                      border: rgb(33, 210, 210) solid 0.1em;
                                    "
                                  >
                                    <template v-slot:top>
                                      <v-toolbar
                                        flat
                                        :class="
                                          appDark
                                            ? 'black darken-3 white--text'
                                            : 'blue lighten-4 black--text'
                                        "
                                      >
                                        <v-toolbar-title>{{
                                          content.contentTable.tableDescription
                                        }}</v-toolbar-title>
                                      </v-toolbar>
                                    </template>
                                  </v-data-table>
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </div>
                        </v-col>
                      </v-row>
                      <!-- tags -->
                      <v-row
                        v-if="!isTemplate && alphaResourceViewTags.length"
                        class="ma-0 px-0 py-3 mt-3"
                      >
                        <v-col class="ma-0 pa-0">
                          <v-card-text class="ma-0 pa-0">
                            <!-- Resource Tags  -->
                            <v-row class="ma-0 pa-0" justify="start">
                              <v-col class="ma-0 pa-0 text-left">
                                <!-- Chip for tag -->
                                <v-chip
                                  dense
                                  small
                                  v-for="(tag, index) in isTemplate
                                    ? constructorResource.tags
                                    : alphaResourceViewTags"
                                  :key="index"
                                  class="ma-1"
                                  style="height: 25px"
                                  :color="randomColor"
                                  :text-color="appDark ? 'black' : 'white'"
                                >
                                  #{{ tag }}
                                </v-chip>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-col>
                      </v-row>
                      <!-- Displaying Reference -->
                      <v-row
                        v-if="!isTemplate && alphaResourceViewReferences.length"
                        class="my-2 py-0"
                        justify="start"
                      >
                        <v-col
                          class="text-left my-0 py-0"
                          align="center"
                          cols="12"
                          md="12"
                          sm="12"
                        >
                          <v-card-title class="text-h6"
                            >References</v-card-title
                          >
                          <v-card-text class="mt-2 mb-5 py-0 ml-2 px-0">
                            <div
                              v-for="(
                                reference, referenceIndex
                              ) in alphaResourceViewReferences"
                              :key="referenceIndex"
                              class="my-0 py-0 mx-0 px-0"
                            >
                              <v-row justify="start" class="my-0 py-0">
                                <v-col
                                  class="my-0 py-0 text-right mx-0 px-0"
                                  cols="12"
                                >
                                  <v-row
                                    class="my-0 py-0 ml-5 px-0"
                                    justify="start"
                                  >
                                    <v-col
                                      cols="1"
                                      sm="1"
                                      md="1"
                                      class="pl-2 my-0 py-0 text-left"
                                      style="max-width: 35px"
                                    >
                                      <p class="ma-0 pa-0">
                                        {{ referenceIndex + 1 }}.
                                      </p>
                                    </v-col>
                                    <v-col
                                      cols="8"
                                      sm="8"
                                      md="8"
                                      class="text-left ml-n2 px-0 my-0 py-0"
                                    >
                                      <span
                                        v-html="reference"
                                        class="appFont1 my-0 py-0"
                                      ></span>
                                    </v-col>
                                  </v-row>
                                </v-col>
                              </v-row>
                            </div>
                          </v-card-text>
                        </v-col>
                      </v-row>
                    </v-card>
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
  name: 'alphaResourcePreview',
  data() {
    return {
      // resourceDataReceived: false,
      progress: null,
      isExpandedImageDialog: false,
      expandedImageUrl: '',
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
  props: [
    'constructorResource',
    'title',
    'pageResourceDataReceived',
    'isNavigationEnabled',
    'navigableComponent',
    'routeParam',
    'numberOfRows',
    'numberOfCols',
  ],
  computed: {
    ...mapGetters([
      'user',
      'error',
      'errorStatus',
      'loading',
      'appDark',
      'appLightBackground',
      'validationRules',
      'alphaResources',
      'constructorAlphaResources',
      'resourceDataReceived',
      'initializeAppComplete',
      'randomColor',
      'appThemeFontColor1',
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
    alphaResourceViewTitle: {
      get() {
        return this.$store.getters.alphaResourceViewTitle;
      },
      set(value) {
        this.$store.commit('setAlphaResourceViewTitle', value);
      },
    },
    alphaResourceViewIntro: {
      get() {
        return this.$store.getters.alphaResourceViewIntro;
      },
      set(value) {
        this.$store.commit('setAlphaResourceViewIntro', value);
      },
    },
    alphaResourceViewCategory: {
      get() {
        return this.$store.getters.alphaResourceViewCategory;
      },
      set(value) {
        this.$store.commit('setAlphaResourceViewCategory', value);
      },
    },
    alphaResourceViewContent: {
      get() {
        return this.$store.getters.alphaResourceViewContent;
      },
      set(value) {
        this.$store.commit('setAlphaResourceViewContent', value);
      },
    },
    alphaResourceViewTags: {
      get() {
        return this.$store.getters.alphaResourceViewTags;
      },
      set(value) {
        this.$store.commit('setAlphaResourceViewTags', value);
      },
    },
    alphaResourceViewReferences: {
      get() {
        return this.$store.getters.alphaResourceViewReferences;
      },
      set(value) {
        this.$store.commit('setAlphaResourceViewReferences', value);
      },
    },
    resourceMode: {
      get() {
        return this.$store.getters.resourceMode;
      },
      set(value) {
        this.$store.commit('setResourceMode', value);
      },
    },
    activeResource: {
      get() {
        return this.$store.getters.activeResource;
      },
      set(value) {
        this.$store.commit('setActiveResource', value);
      },
    },
    alphaResourceTitle: {
      get() {
        return this.$store.getters.alphaResourceTitle;
      },
      set(value) {
        this.$store.commit('setAlphaResourceTitle', value);
      },
    },
    alphaResourceContentIntro: {
      get() {
        return this.$store.getters.alphaResourceContentIntro;
      },
      set(value) {
        this.$store.commit('setAlphaResourceContentIntro', value);
      },
    },
    alphaResourceCategory: {
      get() {
        return this.$store.getters.alphaResourceCategory;
      },
      set(value) {
        this.$store.commit('setAlphaResourceCategory', value);
      },
    },
    alphaResourceContent: {
      get() {
        return this.$store.getters.alphaResourceContent;
      },
      set(value) {
        this.$store.commit('setAlphaResourceContent', value);
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
    alphaResourceReferences: {
      get() {
        return this.$store.getters.alphaResourceReferences;
      },
      set(value) {
        this.$store.commit('setAlphaResourceReferences', value);
      },
    },
    isTemplate() {
      return this.$route.name !== 'resource';
    },
  },
  async created() {
    console.log();
    if (this.$route.name === 'resource') {
      // setting resourceReceivedFlag to false
      this.$store.commit('setResourceDataReceived', false);
      this.progressing = true;
      await this.getResourceData();
    }
    // console.log('alphaResource:', this.activeResource);
  },
  mounted() {
    if (this.$route.name === 'resource') {
      this.$nextTick(function () {
        this.progressing = false;
      });
    }
    // this.resourceDataReceived = true;
  },
  watch: {
    initializeAppComplete(newValue, oldValue) {
      if (oldValue === false) {
        this.getResourceData();
      }
    },
    // resourceDataReceived(newValue, oldValue) {
    //   // if (oldValue === false) {
    //   this.getResourceData();
    //   // }
    // },
    $route(to, from) {
      if (this.resourceDataReceived) {
        this.getResourceData();
      }
    },
  },
  methods: {
    clearDialog(result) {
      this.dialogResult = result;
      if (result === 'yes') {
        if (this.dialogContext === 'disableResource') {
          this.handleDisableAlphaResource();
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
        case 'disableResource':
          this.dialogContext = 'disableResource';
          break;

        default:
          break;
      }
      // performing action
      switch (this.dialogContext) {
        case 'disableResource':
          this.dialogHeading = 'Confirm Disabling Resource';
          this.dialogText =
            'Are you sure you want to disable this resource? This can be enabled later from database. data will remain in the database.';
          this.dialogBtn1 = 'Cancel';
          this.dialogBtn2 = 'Yes';
          this.isDialog = true;
          break;

        default:
          break;
      }
    },
    async getResourceData() {
      // console.log('getResourceData executed');
      if (this.initializeAppComplete) {
        // Finding matchinf resource
        const mergedResources = [
          ...this.alphaResources,
          ...this.constructorAlphaResources,
        ];
        this.activeResource = mergedResources.find(
          (resource) =>
            resource.resourceRouteParam === this.$route.params.resourceTitle
        );

        if (!this.activeResource) {
          this.$store.dispatch('handleCatchError', {
            message: 'Invalid Resource',
          });
          if (this.$route.name !== 'home') {
            this.$router.push({ name: 'home' });
          }
          return;
        }
        let activeResource = await this.$store.dispatch(
          'getSingleAlphaResource',
          {
            alphaResourceId: this.activeResource._id,
          }
        );
        this.activeResource = { ...activeResource };
        // console.log('Active resource:', this.activeResource);
        // assigning resource parameters.
        this.alphaResourceViewTitle = activeResource.title;
        this.alphaResourceViewIntro = activeResource.contentIntro;
        this.alphaResourceViewContent = activeResource.content;
        this.alphaResourceViewCategory = activeResource.category;
        this.alphaResourceViewTags = activeResource.tags;
        this.alphaResourceViewReferences = activeResource.references;
      }
    },
    test() {
      // console.log('ResourceContent:', this.alphaResourceContent);
      // console.log('disabled check:', this.newContentCheck);
      // console.log(
      //   'last content:',
      //   this.alphaResourceContent[this.alphaResourceContent.length - 1]
      // );
    },
    // Edit current resource by contributors
    handleEditAlphaResource(cloneFlag) {
      // Getting current resource
      let activeResource = this.activeResource;
      // console.log('active res:', this.activeResource);
      this.alphaResourceTitle = activeResource.title;
      this.alphaResourceContentIntro = activeResource.contentIntro;
      this.alphaResourceContent = activeResource.content;
      this.alphaResourceCategory = activeResource.category;
      this.alphaResourceTags = activeResource.tags;
      this.alphaResourceReferences = activeResource.references;

      // this.activeResource = this.alphaResources.find(
      //   (resource) =>
      //     resource.resourceRouteParam === this.$route.params.resourceTitle
      // );
      if (!cloneFlag) {
        // Set resource mode to edit
        this.resourceMode = 'edit';
      } else {
        this.cloneFlag = true;
        // Set resource mode to create
        this.resourceMode = 'create';
        this.alphaResourceTitle = this.alphaResourceTitle + ' - cloned';
      }
      // Directing to alpha resource creator/edit page
      if (this.$route.name !== 'alphaResourceCreator') {
        this.$router.push({ name: 'alphaResourceCreator' });
      }
    },
    async handleDisableAlphaResource() {
      let currentResource = this.alphaResources.find(
        (resource) => resource._id === this.activeResource._id
      );
      let currentResourceIndex = this.alphaResources.indexOf(currentResource);
      // // Finding matching resource
      // this.activeResource = this.alphaResources.find(
      //   (resource) =>
      //     resource.resourceRouteParam === this.$route.params.resourceTitle
      // );
      // sending to database
      await this.$store.dispatch('disableAlphaResource', {
        alphaResourceId: this.activeResource._id,
      });
      // if (disableSuccessMessage) {
      this.alphaResources.splice(currentResourceIndex, 1);
      // }
      // prompting resource categorization
      this.$store.dispatch('categorizeResources');
      if (this.alphaResources.length) {
        //  Routing to the resource view page
        this.$router.push(
          `/resources/${
            this.alphaResources[currentResourceIndex - 1].resourceRouteParam
          }`
        );
      } else {
        // route  to home page
        if (this.$route.name !== 'home') {
          this.$router.push({ name: 'home' });
        }
      }
    },
    // Bring up image dialog
    expandImage(contentIndex) {
      this.expandedImageUrl =
        this.alphaResourceViewContent[contentIndex].imageUrl;
      this.isExpandedImageDialog = true;
    },
    showRelatedContent() {
      // console.log('test');
      // console.log('component:', this.navigableComponent);
      // console.log('routeParam:', this.routeParam);
      if (this.navigableComponent && this.routeParam) {
        // directing to the related content
        switch (this.navigableComponent) {
          case 'Resource':
            this.$router.push({
              name: 'resource',
              params: { resourceTitle: this.routeParam },
            });
            break;
          case 'Item':
            this.$router.push({
              name: 'itemViewer',
              params: { itemName: this.routeParam },
            });
            break;
          default:
            break;
        }
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
.resource__image {
  opacity: 1;
}
.resource__image:hover {
  opacity: 0.8;
}
.display__resource-image {
  border-radius: 3px;
}
</style>
