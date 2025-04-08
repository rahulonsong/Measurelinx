<template>
  <v-container fluid>
    <!-- Dialog for Editing Resource Title -->
    <v-row class="my-0 py-0">
      <v-col class="my-0 py-0">
        <v-dialog
          v-model="alphaResourceTitleDialog"
          persistent
          max-width="600px"
        >
          <v-card max-width="600" max-height="600">
            <v-card-title
              class="font-weight-bold"
              :class="appDark ? 'cyan darken-4' : 'light-blue lighten-3'"
            >
              Edit Resource Title
            </v-card-title>
            <!-- Text block content -->
            <v-card-text
              style="max-height: 800px"
              class="justify__text mx-0 py-0 px-0 py-0"
            >
              <!-- Adding the Text block field -->
              <v-container class="mx-0 py-0 px-0 py-0">
                <v-text-field
                  class="mt-2"
                  style="font-size: 1.1em"
                  v-model="alphaResourceTitle"
                  :rules="validationRules.required"
                  rows="4"
                  required
                  auto-grow
                  prepend-icon="title"
                  placeholder="Enter the title for the resource"
                  label="Resource Title"
                >
                </v-text-field>
              </v-container>
            </v-card-text>
            <!-- Close buttons -->
            <v-card-actions>
              <v-row justify="center" class="my-2">
                <!-- Close -->
                <v-col cols="12" md="2" sm="3" class="text-center">
                  <v-btn
                    rounded
                    small
                    class="custom-transform-class text-none"
                    color="blue"
                    @click="alphaResourceTitleDialog = false"
                  >
                    Close
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <!-- Displayig the Resource Intro Edit Dialog-->
    <v-row wrap class="ma-0 pa-0">
      <v-col class="text-center mx-auto my-0 py-0" align="center">
        <v-dialog
          scrollable
          content-class="curvedBorder1"
          v-model="isAlphaResourceIntroDialog"
          persistent
          max-width="1100"
        >
          <alpha-resource-intro
            class="mx-auto"
            style="max-width: 1100px"
          ></alpha-resource-intro>
        </v-dialog>
      </v-col>
    </v-row>
    <!-- Displayig the Resource Content Edit Dialog-->
    <v-row wrap class="ma-0 pa-0">
      <v-col class="text-center mx-auto my-0 py-0" align="center">
        <v-dialog
          scrollable
          content-class="curvedBorder1"
          v-model="isAlphaResourceContentDialog"
          persistent
          max-width="1100"
        >
          <alpha-resource-content class="mx-auto" style="max-width: 1100px">
          </alpha-resource-content>
        </v-dialog>
      </v-col>
    </v-row>
    <!-- Displayig the Resource Reference Edit Dialog-->
    <v-row wrap class="ma-0 pa-0">
      <v-col class="text-center mx-auto my-0 py-0" align="center">
        <v-dialog
          scrollable
          content-class="curvedBorder1"
          v-model="alphaResourceReferenceDialog"
          persistent
          max-width="1100"
        >
          <alpha-resource-reference
            class="mx-auto"
            style="max-width: 1100px"
          ></alpha-resource-reference>
        </v-dialog>
      </v-col>
    </v-row>
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
    <!-- Main content -->
    <v-row justify="center" align="center" class="my-0 py-0">
      <v-col
        cols="12"
        md="12"
        sm="12"
        style="max-width: 1200px"
        class="text-center my-0 py-0"
      >
        <!-- Data Available after Sync actions -->
        <div class="mt-0 pt-0">
          <!-- <v-btn @click="test">Test</v-btn> -->
          <v-card class="my-0 py-0">
            <!-- Create Resource title -->
            <v-row wrap justify="center" align="center" class="ma-0 pa-0">
              <v-col cols="12" md="12" sm="12" class="text-center ma-0 pa-0">
                <v-toolbar :style="appLightBackground">
                  <v-toolbar-title class="mx-auto">
                    {{ alphaResourceTitle }}</v-toolbar-title
                  >
                  <v-tooltip left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="ma-2 custom-transform-class text-none"
                        medium
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="handleEditAlphaResourceTitle"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </template>
                    <span>Edit resource title</span>
                  </v-tooltip>
                </v-toolbar>
              </v-col>
            </v-row>
            <!-- <v-btn @click="test">Test</v-btn> -->
            <!-- Displaying Alpha Resource Data-->
            <div>
              <!-- Displaying Alpha Resource Data-->
              <v-card
                :style="appLightBackground"
                elevation="5"
                class="pa-0 my-2 pointerMouse app"
              >
                <v-card-text class="pt-3 my-0 pb-0" :style="appThemeFontColor1">
                  <!-- Displaying Publish option -->
                  <v-row class="pt-2 pb-0 my-0 d-flex" justify="center">
                    <v-col
                      class="text-left d-flex"
                      align="center"
                      cols="12"
                      md="12"
                      sm="12"
                    >
                      <p class="my-0 py-0">
                        Do you want to publish this reesource?
                      </p>
                      <v-spacer></v-spacer>
                      <v-switch
                        class="my-0 py-0"
                        v-model="activeResource.published"
                        dense
                        hide-details
                        :label="
                          activeResource.published ? 'Published' : 'Unpublished'
                        "
                      >
                      </v-switch>
                    </v-col>
                  </v-row>
                  <!-- Displaying disableed option -->
                  <v-row class="pt-2 pb-0 my-0 d-flex" justify="center">
                    <v-col
                      class="text-left d-flex"
                      align="center"
                      cols="12"
                      md="12"
                      sm="12"
                    >
                      <p class="my-0 py-0">
                        Do you want to disable this reesource?
                      </p>
                      <v-spacer></v-spacer>
                      <v-switch
                        class="my-0 py-0"
                        v-model="activeResource.disabled"
                        dense
                        hide-details
                        :label="
                          activeResource.disabled ? 'Disabled' : 'Not Disabled'
                        "
                      >
                      </v-switch>
                    </v-col>
                  </v-row>
                  <!-- Displaying page constructor option -->
                  <v-row class="pt-2 pb-0 my-0 d-flex" justify="center">
                    <v-col
                      class="text-left d-flex"
                      align="center"
                      cols="12"
                      md="12"
                      sm="12"
                    >
                      <p class="my-0 py-0">
                        Is this resource to be used as a page constructor?
                      </p>
                      <v-spacer></v-spacer>
                      <v-switch
                        class="my-0 py-0"
                        @change="checkCategory()"
                        v-model="activeResource.isPageConstructor"
                        dense
                        hide-details
                        :label="activeResource.isPageConstructor ? 'Yes' : 'No'"
                      >
                      </v-switch>
                    </v-col>
                  </v-row>
                  <!-- Displaying Resouce Categor option -->
                  <v-row class="pt-2 pb-0 my-0 d-flex" justify="center">
                    <v-col
                      class="text-left d-flex"
                      align="center"
                      cols="12"
                      md="12"
                      sm="12"
                    >
                      <p class="my-0 py-0">Choose Resource</p>
                      <v-spacer></v-spacer>
                      <v-select
                        v-model="activeResource.category"
                        dense
                        @change="checkConstructor()"
                        style="max-width: 300px"
                        hide-details
                        hide-selected
                        :items="resourceCategories"
                        :rules="validationRules.required"
                        placeholder="Enter resourceCategories"
                        label="Resource Categories"
                        prepend-icon="category"
                      >
                      </v-select>
                    </v-col>
                  </v-row>
                  <!-- Displaying Introduction -->
                  <v-row class="pt-2 pb-0 my-0" justify="start">
                    <v-col class="text-left" cols="12" md="12" sm="12">
                      <v-card class="my-0 py-0">
                        <v-card-text class="my-0 py-2">
                          <!-- Edit intro button -->
                          <v-row justify="end" class="my-0 py-0">
                            <v-col class="my-0 py-0 text-right">
                              <v-tooltip left>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    class="ma-2 custom-transform-class text-none"
                                    medium
                                    icon
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="handleEditAlphaResourceIntro"
                                  >
                                    <v-icon>edit</v-icon>
                                  </v-btn>
                                </template>
                                <span>Edit resource introduction</span>
                              </v-tooltip>
                            </v-col>
                          </v-row>
                          <span
                            v-html="alphaResourceContentIntro"
                            class="appFont1"
                          ></span>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  <!-- Add content button -->
                  <v-row justify="start" class="my-0 py-0">
                    <v-col align="center" class="text-left my-0 py-0">
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ma-2 custom-transform-class text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="handleAddAlphaResourceContent"
                            :disabled="newContentCheck"
                          >
                            <v-icon>library_add</v-icon>
                          </v-btn>
                        </template>
                        <span>Add content</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <!-- Displaying Content -->
                  <v-row class="my-0 py-0">
                    <v-col class="my-0 py-0">
                      <v-card
                        class="my-2 py-0"
                        v-for="(content, contentIndex) in alphaResourceContent"
                        :key="contentIndex"
                      >
                        <v-card-text class="my-0 py-0">
                          <!-- Sorting Icons -->
                          <v-row class="ma-0 pa-0">
                            <v-spacer></v-spacer>
                            <v-col
                              cols="2"
                              md="2"
                              sm="2"
                              class="text-center my-0 py-0"
                              style="width: 60px"
                            >
                              <v-icon
                                small
                                class="pointerCursor"
                                color="primary"
                                @click="
                                  array_move(
                                    alphaResourceContent,
                                    contentIndex,
                                    contentIndex == 0
                                      ? alphaResourceContent.length - 1
                                      : contentIndex - 1
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
                                    alphaResourceContent,
                                    contentIndex,
                                    contentIndex ==
                                      alphaResourceContent.length - 1
                                      ? 0
                                      : contentIndex + 1
                                  )
                                "
                                style="height: 20px"
                                >fas fa-arrow-down</v-icon
                              >
                            </v-col>
                          </v-row>
                          <!-- Image Required checkbox and Edit -->
                          <v-row class="my-0 py-0">
                            <v-col cols="4" md="4" sm="4" class="my-0 py-0">
                              <!-- Image Required check-->
                              <v-checkbox
                                style="min-width: 100px"
                                class="image_required__checkbox my-0 py-0"
                                v-model="content.imageRequired"
                                @change="manageImagePicker(contentIndex)"
                                label="Image Required"
                                color="indigo"
                              ></v-checkbox>
                            </v-col>
                            <!-- Image left / right -->
                            <v-col cols="3" md="3" sm="3" class="my-0 py-0">
                              <v-switch
                                class="my-0 py-0"
                                v-model="content.imageOnLeft"
                                dense
                                hide-details
                                :label="
                                  content.imageOnLeft ? 'On Left' : 'on Right'
                                "
                              >
                              </v-switch>
                            </v-col>
                            <v-spacer></v-spacer>
                            <!-- Delete -->
                            <v-col
                              class="text-right my-0 py-0"
                              cols="1"
                              sm="1"
                              md="1"
                              style="max-width: 50px"
                            >
                              <v-tooltip left>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    class="custom-transform-class text-none"
                                    medium
                                    icon
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="
                                      handleDeleteAlphaResourceContent(
                                        contentIndex
                                      )
                                    "
                                  >
                                    <v-icon>delete</v-icon>
                                  </v-btn>
                                </template>
                                <span>Delete resource content</span>
                              </v-tooltip>
                            </v-col>
                            <!-- Edit button -->
                            <v-col
                              class="text-right my-0 py-0"
                              cols="1"
                              sm="1"
                              md="1"
                              style="max-width: 50px"
                            >
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    class="custom-transform-class text-none"
                                    medium
                                    icon
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="
                                      handleEditAlphaResourceContent(
                                        contentIndex
                                      )
                                    "
                                  >
                                    <v-icon>edit</v-icon>
                                  </v-btn>
                                </template>
                                <span>Edit resource content</span>
                              </v-tooltip>
                            </v-col>
                          </v-row>
                          <!-- Content Detail -->
                          <v-row class="pt-2 my-0 pb-0" justify="start">
                            <!-- Image on Right -->
                            <!-- Resource Image For Upload-->
                            <v-col
                              v-if="
                                content.imageRequired &&
                                !content.imageLink &&
                                content.imageOnLeft
                              "
                              class="text-center my-0 py-0"
                              align="center"
                              cols="12"
                              md="4"
                              sm="12"
                            >
                              <!-- Label Resource image  -->
                              <v-row justify="start" class="my-0 py-0">
                                <v-col
                                  cols="12"
                                  md="4"
                                  sm="4"
                                  class="my-0 py-0"
                                >
                                  <p class="pa-0 appFont1 font-weight-regular">
                                    Resource Image
                                  </p>
                                </v-col>
                              </v-row>
                              <!-- Image picker -->
                              <v-row class="my-0 py-0">
                                <v-col
                                  cols="12"
                                  sm="4"
                                  md="4"
                                  class="mt-n3 text-center py-0"
                                >
                                  <v-row class="my-0 py-0">
                                    <v-col class="my-0 py-0">
                                      <div
                                        style="width: 300px; margin: 0 auto"
                                        @click="
                                          activeContentIndex = contentIndex
                                        "
                                      >
                                        <vue-image-chooser
                                          :id="'image' + contentIndex"
                                          :name="'image-chooser' + contentIndex"
                                          @change="uploadFile"
                                          :progress="progress"
                                          :error="error"
                                        />
                                      </div>
                                    </v-col>
                                  </v-row>
                                </v-col>
                              </v-row>
                              <!-- Upload button -->
                              <v-row justify="center" class="mt-2">
                                <v-col class="text-center">
                                  <v-btn
                                    class="primary darken-4 font-weight-bold"
                                    raised
                                    small
                                    :disabled="
                                      alphaResourceContent[contentIndex]
                                        .image === null
                                    "
                                    @click="uploadResourceImage(contentIndex)"
                                  >
                                    Upload
                                  </v-btn>
                                </v-col>
                              </v-row>
                            </v-col>
                            <!-- Resource Image after upload -->
                            <v-col
                              v-if="
                                content.imageRequired &&
                                content.imageLink &&
                                content.imageOnLeft
                              "
                              class="text-center my-0 py-0"
                              align="center"
                              cols="12"
                              md="4"
                              sm="12"
                            >
                              <v-row class="my-0 py-0" justify="center">
                                <v-col class="text-center my-0 py-0">
                                  <v-img
                                    :src="
                                      alphaResourceContent[contentIndex]
                                        .imageUrl
                                    "
                                    alt="Resource Image"
                                    background-color="rgba(200,200,200,0.3)"
                                    height="200"
                                    id="thumbnail"
                                    contain
                                  >
                                  </v-img>
                                </v-col>
                              </v-row>
                              <v-row class="my-0 py-0" justify="center">
                                <v-col class="text-center my-0 py-0">
                                  <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-btn
                                        class="ma-2 custom-transform-class text-none"
                                        medium
                                        icon
                                        v-bind="attrs"
                                        v-on="on"
                                        @click="
                                          handleDialog(
                                            { index: contentIndex },
                                            'deleteResourceImage'
                                          )
                                        "
                                      >
                                        <v-icon>delete_outline</v-icon>
                                      </v-btn>
                                    </template>
                                    <span>Delete Image</span>
                                  </v-tooltip>
                                </v-col>
                              </v-row>
                            </v-col>
                            <v-spacer v-if="content.imageOnLeft"></v-spacer>
                            <!-- Content text -->
                            <v-col
                              class="text-left my-0 py-0"
                              cols="12"
                              :md="content.imageRequired ? '8' : '12'"
                              :sm="12"
                            >
                              <p
                                v-html="content.contentDetail"
                                class="appFont1 v-html__margin"
                              ></p>
                            </v-col>
                            <v-spacer v-if="!content.imageOnLeft"></v-spacer>
                            <!-- Resource Image For Upload-->
                            <v-col
                              v-if="
                                content.imageRequired &&
                                !content.imageLink &&
                                !content.imageOnLeft
                              "
                              class="text-center my-0 py-0"
                              align="center"
                              cols="12"
                              md="4"
                              sm="12"
                            >
                              <!-- Label Resource image  -->
                              <v-row justify="start" class="my-0 py-0">
                                <v-col
                                  cols="12"
                                  md="4"
                                  sm="4"
                                  class="my-0 py-0"
                                >
                                  <p class="pa-0 appFont1 font-weight-regular">
                                    Resource Image
                                  </p>
                                </v-col>
                              </v-row>
                              <!-- Image picker -->
                              <v-row class="my-0 py-0">
                                <v-col
                                  cols="12"
                                  sm="4"
                                  md="4"
                                  class="mt-n3 text-center py-0"
                                >
                                  <v-row class="my-0 py-0">
                                    <v-col class="my-0 py-0">
                                      <div
                                        style="width: 300px; margin: 0 auto"
                                        @click="
                                          activeContentIndex = contentIndex
                                        "
                                      >
                                        <vue-image-chooser
                                          :id="'image' + contentIndex"
                                          :name="'image-chooser' + contentIndex"
                                          @change="uploadFile"
                                          :progress="progress"
                                          :error="error"
                                        />
                                      </div>
                                    </v-col>
                                  </v-row>
                                </v-col>
                              </v-row>
                              <!-- Upload button -->
                              <v-row justify="center" class="mt-2">
                                <v-col class="text-center">
                                  <v-btn
                                    class="primary darken-4 font-weight-bold"
                                    raised
                                    small
                                    :disabled="
                                      alphaResourceContent[contentIndex]
                                        .image === null
                                    "
                                    @click="uploadResourceImage(contentIndex)"
                                  >
                                    Upload
                                  </v-btn>
                                </v-col>
                              </v-row>
                            </v-col>
                            <!-- Resource Image after upload -->
                            <v-col
                              v-if="
                                content.imageRequired &&
                                content.imageLink &&
                                !content.imageOnLeft
                              "
                              class="text-center my-0 py-0"
                              align="center"
                              cols="12"
                              md="4"
                              sm="12"
                            >
                              <v-row class="my-0 py-0" justify="center">
                                <v-col class="text-center my-0 py-0">
                                  <v-img
                                    :src="
                                      alphaResourceContent[contentIndex]
                                        .imageUrl
                                    "
                                    alt="Resource Image"
                                    background-color="rgba(200,200,200,0.3)"
                                    height="200"
                                    id="thumbnail"
                                    contain
                                  >
                                  </v-img>
                                </v-col>
                              </v-row>
                              <v-row class="my-0 py-0" justify="center">
                                <v-col class="text-center my-0 py-0">
                                  <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-btn
                                        class="ma-2 custom-transform-class text-none"
                                        medium
                                        icon
                                        v-bind="attrs"
                                        v-on="on"
                                        @click="
                                          handleDialog(
                                            { index: contentIndex },
                                            'deleteResourceImage'
                                          )
                                        "
                                      >
                                        <v-icon>delete_outline</v-icon>
                                      </v-btn>
                                    </template>
                                    <span>Delete Image</span>
                                  </v-tooltip>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                          <!-- Content Table -->
                          <!-- Table Required checkbox and Edit -->
                          <v-row class="my-0 py-0">
                            <v-col cols="4" md="4" sm="4" class="my-0 py-0">
                              <!-- Image Required check-->
                              <v-checkbox
                                style="min-width: 100px"
                                class="image_required__checkbox"
                                v-model="
                                  alphaResourceContent[contentIndex]
                                    .contentTable.tableRequired
                                "
                                label="Table Required"
                                color="indigo"
                              ></v-checkbox>
                            </v-col>
                          </v-row>
                          <v-row justify="start" class="my-0 py-0">
                            <v-col class="my-0 py-0 text-left">
                              <alpha-resource-table
                                :activeContentIndex="contentIndex"
                                v-if="
                                  alphaResourceContent[contentIndex]
                                    .contentTable.tableRequired
                                "
                              ></alpha-resource-table>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  <!-- Add tags -->
                  <v-row class="ma-0 pa-0 mt-3">
                    <v-col class="ma-0 pa-0">
                      <v-card-text
                        class="black--text my-0 py-0"
                        style="align-items: center"
                      >
                        <v-combobox
                          v-model="alphaResourceTags"
                          :items="appResourceTags"
                          chips
                          clearable
                          label="Add tags related to this resource"
                          multiple
                          prepend-icon="style"
                          solo
                        >
                          <template
                            v-slot:selection="{ attrs, item, select, selected }"
                          >
                            <v-chip
                              v-bind="attrs"
                              :input-value="selected"
                              close
                              @click="select"
                              @click:close="removeResourceTag(item)"
                            >
                              <strong>{{ item }}</strong
                              >&nbsp;
                            </v-chip>
                          </template>
                        </v-combobox>
                      </v-card-text>
                    </v-col>
                  </v-row>
                  <!-- Add reference button-->
                  <v-row justify="start" class="my-0 py-0">
                    <v-col align="center" class="text-left my-0 py-0">
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ma-2 custom-transform-class text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="handleAddAlphaResourceReference"
                          >
                            <v-icon>bookmark_add</v-icon>
                          </v-btn>
                        </template>
                        <span>Add Reference</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <!-- Displaying Reference -->
                  <v-row
                    v-if="alphaResourceReferences.length"
                    class="my-0 py-0"
                    justify="center"
                  >
                    <v-col
                      class="text-left my-0 py-0"
                      align="center"
                      cols="12"
                      md="12"
                      sm="12"
                    >
                      <v-card class="my-0 py-0 mx-0 px-0">
                        <v-card-title>References</v-card-title>
                        <v-card-text class="my-0 py-2 mx-0 px-0">
                          <div
                            v-for="(
                              reference, referenceIndex
                            ) in alphaResourceReferences"
                            :key="referenceIndex"
                            class="my-0 py-0 mx-0 px-0"
                          >
                            <hr class="my-1" />
                            <!-- Displaying reference-->
                            <v-row justify="end" class="my-0 py-0">
                              <v-col class="my-0 py-0 text-right mx-0 px-0">
                                <v-row
                                  class="my-0 py-0 mx-0 px-0"
                                  justify="center"
                                >
                                  <!-- Display sl no -->
                                  <v-col
                                    cols="1"
                                    sm="1"
                                    md="1"
                                    class="px-2 my-0 py-0 text-left"
                                    style="max-width: 40px"
                                  >
                                    <p class="ma-0 pa-0">
                                      {{ referenceIndex + 1 }}.
                                    </p>
                                  </v-col>
                                  <!-- Displaying reference text-->
                                  <v-col
                                    cols="8"
                                    sm="8"
                                    md="8"
                                    class="text-left mx-0 px-0 my-0 py-0"
                                  >
                                    <span
                                      v-html="reference"
                                      class="appFont1 my-0 py-0"
                                    ></span>
                                  </v-col>
                                  <!-- Delete reference  -->
                                  <v-col
                                    cols="1"
                                    sm="1"
                                    md="1"
                                    class="py-0 mt-n1 text-right mx-2"
                                    style="max-width: 20px"
                                  >
                                    <v-tooltip left>
                                      <template
                                        v-slot:activator="{ on, attrs }"
                                      >
                                        <v-btn
                                          class="custom-transform-class text-none"
                                          medium
                                          icon
                                          v-bind="attrs"
                                          v-on="on"
                                          @click="
                                            handleDeleteAlphaResourceReference(
                                              referenceIndex
                                            )
                                          "
                                        >
                                          <v-icon>delete</v-icon>
                                        </v-btn>
                                      </template>
                                      <span>Delete reference</span>
                                    </v-tooltip>
                                  </v-col>
                                  <!-- Edit reference btn  -->
                                  <v-col
                                    cols="1"
                                    sm="1"
                                    md="1"
                                    class="py-0 mt-n1 text-right mr-4"
                                    style="max-width: 20px"
                                  >
                                    <v-tooltip left>
                                      <template
                                        v-slot:activator="{ on, attrs }"
                                      >
                                        <v-btn
                                          class="custom-transform-class text-none"
                                          medium
                                          icon
                                          v-bind="attrs"
                                          v-on="on"
                                          @click="
                                            handleEditAlphaResourceReference(
                                              referenceIndex
                                            )
                                          "
                                        >
                                          <v-icon>edit</v-icon>
                                        </v-btn>
                                      </template>
                                      <span>Edit reference</span>
                                    </v-tooltip>
                                  </v-col>
                                </v-row>
                              </v-col>
                            </v-row>
                          </div>
                          <hr class="my-1" />
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  <!-- Submit button -->
                  <v-row
                    v-if="
                      alphaResourceContent.length || alphaResourceContentIntro
                    "
                    justify="center"
                  >
                    <v-col class="text-right">
                      <v-btn
                        class="primary darken-4 font-weight-bold"
                        raised
                        small
                        @click="handleAlphaResource"
                      >
                        {{ resourceMode === 'create' ? 'Create' : 'Update' }}
                      </v-btn>
                    </v-col>
                    <v-col class="text-left">
                      <v-btn
                        class="error darken-4 font-weight-bold"
                        raised
                        small
                        @click="navigateBackToResource"
                      >
                        Cancel
                      </v-btn>
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
  </v-container>
</template>
<script>
// Importing required modules
import { mapGetters } from 'vuex';
export default {
  name: 'alphaResourcePreview',
  data() {
    return {
      progress: null,
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
      'validationRules',
      'resourceMode',
      'activeResource',
      'appThemeFontColor1',
      'resourceCategories',
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
    appResourceTags: {
      get() {
        return this.$store.getters.appResourceTags;
      },
      set(value) {
        this.$store.commit('setAppResourceTags', value);
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
    activeResourceContent: {
      get() {
        return this.$store.getters.activeResourceContent;
      },
      set(value) {
        this.$store.commit('setActiveResourceContent', value);
      },
    },
    activeContentIndex: {
      get() {
        return this.$store.getters.activeContentIndex;
      },
      set(value) {
        this.$store.commit('setActiveContentIndex', value);
      },
    },
    alphaResourceTitleDialog: {
      get() {
        return this.$store.getters.alphaResourceTitleDialog;
      },
      set(value) {
        this.$store.commit('setAlphaResourceTitleDialog', value);
      },
    },
    alphaResourceReferenceDialog: {
      get() {
        return this.$store.getters.alphaResourceReferenceDialog;
      },
      set(value) {
        this.$store.commit('setAlphaResourceReferenceDialog', value);
      },
    },
    isAlphaResourceIntroDialog: {
      get() {
        return this.$store.getters.isAlphaResourceIntroDialog;
      },
      set(value) {
        this.$store.commit('setIsAlphaResourceIntroDialog', value);
      },
      isAlphaResourceContentDialog: {
        get() {
          return this.$store.getters.isAlphaResourceContentDialog;
        },
        set(value) {
          this.$store.commit('setIsAlphaResourceContentDialog', value);
        },
      },
    },
    isAlphaResourceContentDialog: {
      get() {
        return this.$store.getters.isAlphaResourceContentDialog;
      },
      set(value) {
        this.$store.commit('setIsAlphaResourceContentDialog', value);
      },
    },
    alphaResources: {
      get() {
        return this.$store.getters.alphaResources;
      },
      set(value) {
        this.$store.commit('setAlphaResources', value);
      },
    },
    constructorAlphaResources: {
      get() {
        return this.$store.getters.constructorAlphaResources;
      },
      set(value) {
        this.$store.commit('setConstructorAlphaResources', value);
      },
    },
    resourceType: {
      get() {
        return this.$store.getters.resourceType;
      },
      set(value) {
        this.$store.commit('setResourceType', value);
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
    activeReferenceIndex: {
      get() {
        return this.$store.getters.activeReferenceIndex;
      },
      set(value) {
        this.$store.commit('setActiveReferenceIndex', value);
      },
    },
    newContentCheck() {
      let proceedToAdd = true;

      if (this.alphaResourceContent.length) {
        for (let index = 0; index < this.alphaResourceContent.length; index++) {
          const content = this.alphaResourceContent[index];
          if (
            content.imageRequired &&
            content.image != null &&
            !content.imageLink
          ) {
            proceedToAdd = false;
          }
        }
      }
      return !proceedToAdd;
    },
  },
  created() {
    // console.log('active res:', this.activeResource);
  },
  mounted() {
    this.$nextTick(function () {
      this.progressing = false;
    });
  },
  watch: {},
  methods: {
    clearDialog(result) {
      this.dialogResult = result;
      if (result === 'yes') {
        if (this.dialogContext === 'deleteResourceImage') {
          this.removeResourceImage(this.activeContentIndex);
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
        case 'deleteResourceImage':
          this.dialogContext = 'deleteResourceImage';
          this.activeContentIndex = content.index;
          break;
        case 'unusedImage':
          this.dialogContext = 'unusedImage';
          break;

        default:
          break;
      }
      // performing action
      switch (this.dialogContext) {
        case 'deleteResourceImage':
          this.dialogHeading = 'Confirm Deleting Resource Image';
          this.dialogText =
            'Are you sure you want to delete this image? This will remove the imnage from the database and cannot be undone.';
          this.dialogBtn1 = 'Cancel';
          this.dialogBtn2 = 'Yes';
          this.isDialog = true;
          break;

        case 'unusedImage':
          this.dialogHeading = 'Unused images in this reosurce';
          this.dialogText =
            'Consider deleting the newly uploaded image(s) for this resource to save storage';
          this.dialogBtn1 = 'Ok';
          this.dialogBtn2 = '';
          this.isDialog = true;
          break;

        default:
          break;
      }
    },
    onDismissed() {
      this.$store.dispatch('clearError');
    },
    test() {
      // console.log('ResourceContent:', this.alphaResourceContent);
      // console.log('disabled check:', this.newContentCheck);
      // console.log(' content:', this.alphaResourceContent);
    },
    // Edit Title
    handleEditAlphaResourceTitle() {
      // alert("handle Edit resource title");
      this.alphaResourceTitleDialog = true;
    },
    // Edit Resource Intro
    handleEditAlphaResourceIntro() {
      // alert("This will modify Intro of resource!");
      // Setting rich text editor data
      this.$store.commit('setEditorData', this.alphaResourceContentIntro);
      this.isAlphaResourceIntroDialog = true;
    },
    // Edit Resource content
    handleEditAlphaResourceContent(contentIndex) {
      this.activeContentIndex = contentIndex;
      // Setting rich text editor data
      this.$store.commit(
        'setEditorData',
        this.alphaResourceContent[this.activeContentIndex].contentDetail
      );
      this.isAlphaResourceContentDialog = true;
    },
    // Add New resource content
    handleAddAlphaResourceContent() {
      this.alphaResourceContent.push({
        contentDetail: 'Write resource content here',
        imageLink: '',
        filename: '',
        imageUrl: '',
        imageOnLeft: false,
        imageRequired: true,
        image: null,
        contentTable: {
          tableRequired: false,
          tableDescription: 'Resource Table Description',
          tableHeaders: [],
          tableItems: [],
        },
      });
    },
    uploadFile(file) {
      // console.log('file:', file);
      let formData = new FormData();
      formData.append('image', file.file);
      // var config = {
      //   onUploadProgress: (progressEvent) => {
      //     var percentCompleted = Math.round(
      //       (progressEvent.loaded * 100) / progressEvent.total
      //     );
      //     this.progress = percentCompleted;
      //   },
      // };
      this.alphaResourceContent[this.activeContentIndex].image = file;
      this.alphaResourceContent[this.activeContentIndex].formData = formData;
    },
    onFilePicked(event) {
      const files = event.target.files;
      let filename = files[0].name;
      this.alphaResourceContent[this.activeContentIndex].imageName = filename;
      if (filename.lastIndexOf('.') <= 0) {
        return alert('Please choose a valid file!');
      }
      const fileReader = new FileReader();
      fileReader.addEventListener(
        'load',
        () => {
          if (fileReader.result) {
            this.alphaResourceContent[this.activeContentIndex].imageURL =
              fileReader.result;
          }
        },
        false
      );
      fileReader.readAsDataURL(files[0]);
      this.alphaResourceContent[this.activeContentIndex].image = files[0];
    },
    async uploadResourceImage(contentIndex) {
      // console.log('this will upload resource');
      // uploading Resource Image to server
      let imageData;
      // GraphQl API
      // imageURL = await this.$store.dispatch("uploadResourceImage", {
      //   image: this.alphaResourceContent[contentIndex].image.file,
      // });
      // REST API
      imageData = await this.$store.dispatch('uploadResourceImage2', {
        image: this.alphaResourceContent[contentIndex].formData,
      });

      if (imageData.path) {
        this.alphaResourceContent[contentIndex].imageLink = imageData.path;
        this.alphaResourceContent[contentIndex].imageUrl = imageData.path;
        this.alphaResourceContent[contentIndex].filename = imageData.filename;
        this.alphaResourceContent[contentIndex].newImage = true;
      }
    },
    async removeResourceImage(contentIndex) {
      // if (this.alphaResourceContent[contentIndex].newImage) {
      let payload;
      // WHile creating resource
      if (this.resourceMode === 'create') {
        payload = {
          alphaResourceId: null,
          contentIndexInput: contentIndex,
          imageFilenameInput: this.alphaResourceContent[contentIndex].filename,
        };
      }
      // WHile updating resource
      else {
        payload = {
          alphaResourceId: this.activeResource._id,
          contentIndexInput: contentIndex,
          imageFilenameInput: this.alphaResourceContent[contentIndex].filename,
        };
      }
      // console.log('payload:', payload);
      // performing backend operation
      try {
        await this.$store.dispatch('deleteAlphaResourceImage', payload);
      } catch (error) {
        // console.log(error);
        return;
      }
      // }
      // updating local data
      this.alphaResourceContent[contentIndex].imageLink = '';
      this.alphaResourceContent[contentIndex].filename = '';
      this.alphaResourceContent[contentIndex].imageUrl = '';
      this.alphaResourceContent[contentIndex].imageOnLeft = false;
      this.alphaResourceContent[contentIndex].imageRequired = false;
      if (this.alphaResourceContent[contentIndex].newImage) {
        this.alphaResourceContent[contentIndex].newImage = false;
      }
    },
    async handleAlphaResource() {
      // alert("this will create a resource");
      let alphaResourceContentInput = [];
      this.alphaResourceContent.forEach((content) => {
        // Removeing actions field from table Items
        if (content.contentTable.tableItems.length) {
          // if (content.contentTable.tableItems[0].actions) {
          content.contentTable.tableItems.forEach((item) => {
            delete item.actions;
          });
        }
        alphaResourceContentInput.push({
          contentDetail:
            content.contentDetail === 'Write resource content here'
              ? ''
              : content.contentDetail,
          imageRequired: content.imageRequired,
          imageLink: content.imageLink,
          imageOnLeft: content.imageOnLeft,
          filename: content.filename,
          contentTable: content.contentTable,
        });
      });
      let payload;
      // creating resource
      if (this.resourceMode === 'create') {
        payload = {
          alphaResourceContentInput: alphaResourceContentInput,
          alphaResourceInput: {
            title: this.alphaResourceTitle,
            published: this.activeResource.published,
            disabled: this.activeResource.disabled,
            isPageConstructor: this.activeResource.isPageConstructor,
            contentIntro: this.alphaResourceContentIntro,
            category: this.activeResource.category,
            type: this.resourceType,
            references: this.alphaResourceReferences,
            tags: [...this.alphaResourceTags],
          },
        };
      }

      // Updating resource
      else {
        payload = {
          alphaResourceId: this.activeResource._id,
          alphaResourceContentInput: alphaResourceContentInput,
          alphaResourceInput: {
            title: this.alphaResourceTitle,
            published: this.activeResource.published,
            disabled: this.activeResource.disabled,
            isPageConstructor: this.activeResource.isPageConstructor,
            contentIntro: this.alphaResourceContentIntro,
            category: this.activeResource.category,
            type: this.resourceType,
            references: this.alphaResourceReferences,
            tags: [...this.alphaResourceTags],
          },
        };
      }
      // console.log('payload:', payload);
      // return;
      let resourceResult;
      //Adding new resource
      if (this.resourceMode === 'create') {
        resourceResult = await this.$store.dispatch(
          'addAlphaResource',
          payload
        );
        // Adding new resource to store
        if (resourceResult) {
          if (resourceResult.category === 'Constructor') {
            this.constructorAlphaResources.push(resourceResult);
          } else {
            this.alphaResources.push(resourceResult);
          }
        }
        // prompting resource categorization
        this.$store.dispatch('categorizeResources');
        //  Routing to the resource view page
        this.$router.push(`/resources/${resourceResult.resourceRouteParam}`);
      }
      // updating resource
      else {
        let mergedResources = [
          ...this.alphaResources,
          ...this.constructorAlphaResources,
        ];
        const activeResourceIndex = mergedResources.indexOf(
          mergedResources.find(
            (resource) =>
              resource.resourceRouteParam ===
              this.activeResource.resourceRouteParam
          )
        );
        // console.log('active res index:', activeResourceIndex);
        // console.log('update payload:', payload);
        resourceResult = await this.$store.dispatch(
          'updateAlphaResource',
          payload
        );

        mergedResources.splice(activeResourceIndex, 1, resourceResult);
        // console.log('merged res:', mergedResources);
        // Setting Alpha Resources
        this.$store.commit(
          'setAlphaResources',
          mergedResources.filter((res) => res.category !== 'Constructor')
        );
        // console.log('updated result', resourceResult);
        // console.log('updated alpha res:', this.alphaResources);
        // Setting Constructor Alpha Resources
        this.$store.commit(
          'setConstructorAlphaResources',
          mergedResources.filter((res) => res.category === 'Constructor')
        );
        // prompting resource categorization
        this.$store.dispatch('categorizeResources');

        //  Routing to the resource view page
        this.$router.push(`/resources/${resourceResult.resourceRouteParam}`);
      }
      // resetting cloneFlag
      if (this.cloneFlag) this.cloneFlag = false;
    },
    handleDeleteAlphaResourceContent(contentIndex) {
      if (
        this.alphaResourceContent[contentIndex].imageRequired &&
        this.alphaResourceContent[contentIndex].image
      ) {
        const imageId = 'image' + contentIndex;
        var imageElement = document.getElementById(imageId);
        imageElement.parentNode.removeChild(imageElement);
      }
      this.alphaResourceContent.splice(contentIndex, 1);
    },
    removeResourceTag(tag) {
      // const tagIndex =
      //   this.alphaResourceTags.indexOf(tag);
      this.alphaResourceTags.splice(this.alphaResourceTags.indexOf(tag), 1);
      // this.chips.splice(this.chips.indexOf(item), 1)
      this.alphaResourceTags = [...this.alphaResourceTags];
    },
    handleAddAlphaResourceReference() {
      this.alphaResourceReferences.push('Add new reference here...');
      this.activeReferenceIndex = this.alphaResourceReferences.length - 1;
      this.alphaResourceReferenceDialog = true;
    },
    handleEditAlphaResourceReference(referenceIndex) {
      this.activeReferenceIndex = referenceIndex;
      this.alphaResourceReferenceDialog = true;
    },
    handleDeleteAlphaResourceReference(referenceIndex) {
      this.alphaResourceReferences.splice(referenceIndex, 1);
    },
    manageImagePicker(contentIndex) {
      // this.alphaResourceContent[contentIndex].imageRequired =
      //   !this.alphaResourceContent[contentIndex].imageRequired;
      if (!this.alphaResourceContent[contentIndex].imageRequired) {
        // console.log('deleting image;');
        this.alphaResourceContent[contentIndex].image = null;
      }
    },
    navigateBackToResource() {
      // checck if any new images were uploaded
      for (let index = 0; index < this.alphaResourceContent.length; index++) {
        const content = this.alphaResourceContent[index];
        if (content.newImage) {
          this.handleDialog(null, 'unusedImage');
          return;
        }
      }
      this.$router.go(-1);
    },
    checkConstructor() {
      if (this.activeResource.category === 'Constructor') {
        this.activeResource.isPageConstructor = true;
      } else {
        this.activeResource.isPageConstructor = false;
      }
    },
    checkCategory() {
      if (!this.activeResource.isPageConstructor) {
        this.activeResource.category = this.resourceCategories[0];
      } else {
        this.activeResource.category = 'Constructor';
      }
    },
    array_move(arr, old_index, new_index) {
      if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
          arr.push(undefined);
        }
      }
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
      return arr; // for testing
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
  min-width: 100px;
}
table,
th,
td {
  border: 1px solid;
}
</style>
