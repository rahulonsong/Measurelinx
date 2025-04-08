<template>
  <v-container fluid>
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
    <!-- Main pageRow -->
    <v-row justify="center" align="center" class="ma-0 pa-0">
      <v-col
        cols="12"
        md="12"
        sm="12"
        style="max-width: 1200px"
        class="text-center ma-0 pa-0"
      >
        <!-- Data Available after Sync actions -->
        <div class="mt-0 pt-0" v-if="activePageDataReceived">
          <!-- <v-btn @click="test">Test</v-btn> -->
          <v-card class="ma-0 pa-0" elevation="0">
            <!-- Create Page title -->
            <v-row wrap justify="start" align="start" class="ma-0 pa-0">
              <v-col cols="12" md="12" sm="12" class="text-left ma-0 pa-0">
                <v-toolbar
                  :style="appLightBackground"
                  class="page__editor-toolbar ma-0 pa-0"
                  elevation="0"
                >
                  <v-row class="ma-0 pa-0" justify="start">
                    <!-- text -->
                    <v-col
                      class="ma-0 pa-0 text-left"
                      cols="12"
                      md="11"
                      sm="11"
                    >
                      <!-- If editing -->
                      <v-text-field
                        class="ma-0 pa-0"
                        v-if="isEditingPageName"
                        v-click-outside="{
                          handler: disableEditingPageName,
                          include,
                        }"
                        style="min-width: 150px"
                        v-model="activePage.name"
                        placeholder="Enter a unique name"
                        label="Name"
                        :rules="validationRules.required"
                        type="text"
                        hide-details
                        dense
                        outlined
                      >
                      </v-text-field>
                      <!-- displaying -->
                      <v-toolbar-title
                        v-if="!isEditingPageName"
                        class="ma-0 pa-0"
                      >
                        {{
                          activePage.name ? activePage.name : 'Name of the Page'
                        }}</v-toolbar-title
                      >
                    </v-col>
                    <v-col class="ma-0 pa-0 text-right" cols="12" md="1" sm="1">
                      <!-- EDit button -->
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="mx-2 my-0 py-0 custom-transform-class text-none edit__pageName-button text-right"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="isEditingPageName = true"
                          >
                            <v-icon>edit</v-icon>
                          </v-btn>
                        </template>
                        <span>Edit page title</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-toolbar>
              </v-col>
            </v-row>
            <!-- Displaying Page Data-->
            <div>
              <!-- Displaying Page Data-->
              <v-card
                :style="appLightBackground"
                elevation="0"
                class="pa-0 my-2 mx-0 pointerMouse app"
              >
                <v-card-text
                  class="pt-3 my-0 px-1 mx-0 pb-0"
                  :style="appThemeFontColor1"
                >
                  <!-- Displaying isItemPage option -->
                  <v-row class="pt-2 pb-0 my-0 d-flex" justify="center">
                    <v-col
                      class="text-left d-flex"
                      align="center"
                      cols="12"
                      md="12"
                      sm="12"
                    >
                      <p class="my-0 py-0">Is this page for Item category?</p>
                      <v-spacer></v-spacer>
                      <v-switch
                        class="my-0 py-0"
                        v-model="activePage.isItemPage"
                        @change="getItemCategoryData()"
                        dense
                        hide-details
                        :label="
                          activePage.isItemPage
                            ? 'Items Displayed'
                            : 'Items Hidden'
                        "
                      >
                      </v-switch>
                    </v-col>
                  </v-row>
                  <!-- Displaying description -->
                  <v-row class="pt-2 pb-0 my-0" justify="start">
                    <!-- text -->
                    <v-col
                      class="my-0 py-0 text-left"
                      cols="12"
                      md="11"
                      sm="11"
                    >
                      <p v-if="!isEditingPageDescription">
                        {{ activePage.description }}
                      </p>
                      <!-- description-->
                      <v-textarea
                        v-if="isEditingPageDescription"
                        v-click-outside="{
                          handler: disableEditingDescription,
                          include,
                        }"
                        style="min-width: 150px"
                        v-model="activePage.description"
                        placeholder="Describe the page"
                        label="Description"
                        :readonly="!isEditingPageDescription"
                        type="text"
                        hide-details
                        dense
                        outlined
                      >
                      </v-textarea>
                    </v-col>
                    <!-- Edit  button -->
                    <v-col
                      class="my-0 py-0 text-right edit__description-button"
                      cols="12"
                      md="1"
                      sm="1"
                    >
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="mx-2 my-0 py-0 custom-transform-class text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="isEditingPageDescription = true"
                          >
                            <v-icon>edit</v-icon>
                          </v-btn>
                        </template>
                        <span>Edit description</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <!-- Add pageRow button -->
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
                            @click="handleAddPageRow()"
                            :disabled="newPageRowCheck"
                          >
                            <v-icon>library_add</v-icon>
                          </v-btn>
                        </template>
                        <span>Add pageRow</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <!-- Displaying PageRows -->
                  <v-row class="ma-0 pa-0">
                    <v-col class="ma-0 pa-0">
                      <v-card
                        class="ma-0 pa-0"
                        v-for="(pageRow, pageRowIndex) in activePage.pageRows"
                        :key="pageRowIndex"
                        elevation="0"
                      >
                        <v-card-text class="ma-0 pa-0">
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
                                    activePage.pageRows,
                                    pageRowIndex,
                                    pageRowIndex == 0
                                      ? activePage.pageRows.length - 1
                                      : pageRowIndex - 1
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
                                    activePage.pageRows,
                                    pageRowIndex,
                                    pageRowIndex ==
                                      activePage.pageRows.length - 1
                                      ? 0
                                      : pageRowIndex + 1
                                  )
                                "
                                style="height: 20px"
                                >fas fa-arrow-down</v-icon
                              >
                            </v-col>
                          </v-row>
                          <!-- Row displaying layout 1 col / 2 cols/ 3 cols -->
                          <v-row
                            class="ma-0 pa-0 d-flex"
                            :id="'pageRow' + (pageRowIndex + 1)"
                          >
                            <!-- setting number of columns -->
                            <v-col class="ma-0 pa-0" cols="12" md="5" sm="11">
                              <v-radio-group
                                row
                                @change="
                                  setPageRowColumns(
                                    pageRowIndex,
                                    pageRow.numberOfCols
                                  )
                                "
                                v-model="pageRow.numberOfCols"
                              >
                                <v-radio
                                  class="my-1"
                                  label="1 Column"
                                  value="single"
                                ></v-radio>
                                <v-radio
                                  class="my-1"
                                  label="2 Columns"
                                  value="double"
                                ></v-radio>
                                <v-radio
                                  class="my-1"
                                  label="3 Columns"
                                  value="triple"
                                ></v-radio>
                              </v-radio-group>
                            </v-col>
                            <!-- Row displaying leftprominent, equal, rightProminent options when 2 cols selected -->
                            <v-col
                              v-if="pageRow.numberOfCols === 'double'"
                              class="ma-0 pa-0"
                              cols="12"
                              md="6"
                              sm="11"
                            >
                              <v-radio-group v-model="pageRow.rowType" row>
                                <v-radio
                                  class="my-1"
                                  label="Left Prominent"
                                  value="leftProminent"
                                ></v-radio>
                                <v-radio
                                  class="my-1"
                                  label="Equal"
                                  value="equal"
                                ></v-radio>
                                <v-radio
                                  class="my-1"
                                  label="Right Prominent"
                                  value="rightProminent"
                                ></v-radio>
                              </v-radio-group>
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col cols="1" class="text-right ma-0 pa-0">
                              <!-- Delete row -->
                              <v-tooltip left>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    class="ma-2 error--text text--darken-3 custom-transform-class text-none edit__pageName-button"
                                    medium
                                    icon
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="deletePageRow(pageRowIndex)"
                                  >
                                    <v-icon>delete</v-icon>
                                  </v-btn>
                                </template>
                                <span>Delete this Row</span>
                              </v-tooltip>
                            </v-col>
                          </v-row>
                          <!-- 3 columns  for assigning resources -->
                          <v-row class="my-0 ml-2 mr-6 pa-0">
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
                              <!--  enabling navigation -->
                              <v-row class="my-2 pa-0">
                                <v-col class="ma-0 pa-0">
                                  <!-- switch -->
                                  <v-row class="ma-0 pa-0">
                                    <v-col
                                      class="ma-2 pa-0"
                                      md="10"
                                      sm="10"
                                      cols="10"
                                    >
                                      <v-switch
                                        class="my-0 py-0"
                                        v-model="
                                          pageRow.col1.navigation.isEnabled
                                        "
                                        dense
                                        hide-details
                                        @click="
                                          setNavigableItems(
                                            pageRowIndex,
                                            'col1',
                                            pageRow.col1.navigation.component
                                          )
                                        "
                                        :label="
                                          pageRow.col1.navigation.isEnabled
                                            ? 'Nvaigation Enabled'
                                            : 'Navigation Disabled'
                                        "
                                      >
                                      </v-switch>
                                    </v-col>
                                    <v-spacer></v-spacer>
                                    <!-- View resource -->
                                    <v-col
                                      v-if="
                                        pageRow.col1.resource &&
                                        pageRow.col1.resource._id
                                      "
                                      class="ma-0 pa-0 b text-right"
                                      md="1"
                                      sm="1"
                                      cols="2"
                                    >
                                      <!-- View resource -->
                                      <v-tooltip left>
                                        <template
                                          v-slot:activator="{ on, attrs }"
                                        >
                                          <v-btn
                                            class="ma-0 pr-8 cyan--text text--darken-3 custom-transform-class text-none"
                                            medium
                                            icon
                                            v-bind="attrs"
                                            v-on="on"
                                            @click="
                                              goToResource(
                                                pageRow.col1.resource._id
                                              )
                                            "
                                          >
                                            <v-icon>preview</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>View Resource</span>
                                      </v-tooltip>
                                    </v-col>
                                  </v-row>
                                  <!-- Navigation component -->
                                  <v-row class="ma-0 pa-0">
                                    <v-col
                                      v-if="pageRow.col1.navigation.isEnabled"
                                      class="ma-2 pa-0"
                                      :md="
                                        pageRow.numberOfCols === 'single'
                                          ? '5'
                                          : '11'
                                      "
                                      sm="12"
                                      cols="12"
                                    >
                                      <v-select
                                        v-model="
                                          pageRow.col1.navigation.component
                                        "
                                        @change="
                                          setNavigableItems(
                                            pageRowIndex,
                                            'col1',
                                            pageRow.col1.navigation.component
                                          )
                                        "
                                        dense
                                        hide-details
                                        outlined
                                        :rules="validationRules.required"
                                        placeholder="select a component"
                                        :items="navigablePageComponents"
                                        label="Component Type"
                                        :menu-props="{
                                          bottom: true,
                                          offsetY: true,
                                        }"
                                      >
                                      </v-select>
                                    </v-col>
                                  </v-row>
                                  <!-- Name of the component  -->
                                  <v-row class="ma-0 pa-0">
                                    <v-col
                                      v-if="
                                        pageRow.col1.navigation &&
                                        pageRow.col1.navigation.isEnabled
                                      "
                                      class="ma-2 pa-0"
                                      :md="
                                        pageRow.numberOfCols === 'single'
                                          ? '5'
                                          : '11'
                                      "
                                      sm="12"
                                      cols="12"
                                    >
                                      <v-autocomplete
                                        v-model="
                                          pageRow.col1.navigation.routeParam
                                        "
                                        dense
                                        hide-details
                                        return-object
                                        item-text="name"
                                        item-value="routeParam"
                                        :rules="validationRules.required"
                                        outlined
                                        placeholder="select an item"
                                        :items="pageRow.col1.navigation.items"
                                        label="name of Component"
                                      >
                                      </v-autocomplete>
                                    </v-col>
                                  </v-row>
                                </v-col>
                              </v-row>
                              <!-- Assign constructor resource -->
                              <v-row class="my-0 pa-0">
                                <v-col
                                  class="ma-2 pa-0"
                                  :md="
                                    pageRow.numberOfCols === 'single'
                                      ? '5'
                                      : '11'
                                  "
                                  sm="12"
                                  cols="12"
                                >
                                  <v-autocomplete
                                    @change="getResourceData(pageRow.col1)"
                                    v-model="pageRow.col1.resource"
                                    dense
                                    hide-details
                                    return-object
                                    item-text="title"
                                    item-value="_id"
                                    outlined
                                    placeholder="select a resource to build"
                                    :items="constructorAlphaResources"
                                    label="Resource for Column"
                                  >
                                  </v-autocomplete>
                                </v-col>
                              </v-row>
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
                                    <v-row class="ma-0 pa-0">
                                      <v-col
                                        class="ma-2 pa-0"
                                        :md="
                                          pageRow.numberOfCols === 'single'
                                            ? '5'
                                            : '11'
                                        "
                                        sm="12"
                                        cols="12"
                                      >
                                        <!-- optional title -->
                                        <v-text-field
                                          v-model="pageRow.col1.title"
                                          placeholder="Optional Name for Column"
                                          label="Column Name"
                                          type="text"
                                          hide-details
                                          dense
                                          outlined
                                          clearable
                                        >
                                        </v-text-field>
                                      </v-col>
                                    </v-row>
                                    <!-- Displaying resource -->
                                    <v-row class="ma-0 pa-0">
                                      <v-col
                                        v-if="pageRow.col1.navigation"
                                        class="ma-0 pa-0"
                                      >
                                        <constructor-resource-template
                                          :navigableComponent="
                                            pageRow.col1.navigation.component
                                          "
                                          :routeParam="
                                            pageRow.col1.navigation.routeParam
                                              ? pageRow.col1.navigation
                                                  .routeParam.routeParam
                                              : ''
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
                                        ></constructor-resource-template>
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
                              <!-- switch for enabling navigation -->
                              <v-row class="my-2 pa-0">
                                <v-col class="ma-0 pa-0">
                                  <v-row class="ma-0 pa-0">
                                    <!-- switch -->
                                    <v-col
                                      class="ma-2 pa-0"
                                      md="9"
                                      sm="9"
                                      cols="9"
                                    >
                                      <v-switch
                                        style="min-width: 200px"
                                        class="my-0 py-0"
                                        @click="
                                          setNavigableItems(
                                            pageRowIndex,
                                            'col2',
                                            pageRow.col2.navigation.component
                                          )
                                        "
                                        v-model="
                                          pageRow.col2.navigation.isEnabled
                                        "
                                        dense
                                        hide-details
                                        :label="
                                          pageRow.col2.navigation.isEnabled
                                            ? 'Nvaigation Enabled'
                                            : 'Navigation Disabled'
                                        "
                                      >
                                      </v-switch>
                                    </v-col>
                                    <v-spacer></v-spacer>
                                    <!-- View resource -->
                                    <v-col
                                      v-if="
                                        pageRow.col2.resource &&
                                        pageRow.col2.resource._id
                                      "
                                      class="ma-0 pa-0"
                                      md="1"
                                      sm="1"
                                      cols="2"
                                    >
                                      <!-- View resource -->
                                      <v-tooltip left>
                                        <template
                                          v-slot:activator="{ on, attrs }"
                                        >
                                          <v-btn
                                            class="ma-0 pr-0 cyan--text text--darken-3 custom-transform-class text-none"
                                            medium
                                            icon
                                            v-bind="attrs"
                                            v-on="on"
                                            @click="
                                              goToResource(
                                                pageRow.col2.resource._id
                                              )
                                            "
                                          >
                                            <v-icon>preview</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>View Resource</span>
                                      </v-tooltip>
                                    </v-col>
                                  </v-row>
                                  <!-- Navigation component -->
                                  <v-row class="ma-0 pa-0">
                                    <v-col
                                      v-if="pageRow.col2.navigation.isEnabled"
                                      class="ma-2 pa-0"
                                      md="12"
                                      sm="12"
                                      cols="12"
                                    >
                                      <v-select
                                        v-model="
                                          pageRow.col2.navigation.component
                                        "
                                        @change="
                                          setNavigableItems(
                                            pageRowIndex,
                                            'col2',
                                            pageRow.col2.navigation.component
                                          )
                                        "
                                        dense
                                        hide-details
                                        outlined
                                        :rules="validationRules.required"
                                        placeholder="select a component"
                                        :items="navigablePageComponents"
                                        label="Component for Navigation"
                                        :menu-props="{
                                          bottom: true,
                                          offsetY: true,
                                        }"
                                      >
                                      </v-select>
                                    </v-col>
                                  </v-row>
                                  <!-- Name of the component  -->
                                  <v-row class="ma-0 pa-0">
                                    <v-col
                                      v-if="
                                        pageRow.col2.navigation &&
                                        pageRow.col2.navigation.isEnabled
                                      "
                                      class="ma-2 pa-0"
                                      md="12"
                                      sm="12"
                                      cols="12"
                                    >
                                      <v-autocomplete
                                        v-model="
                                          pageRow.col2.navigation.routeParam
                                        "
                                        dense
                                        hide-details
                                        return-object
                                        item-text="name"
                                        item-value="routeParam"
                                        outlined
                                        placeholder="select an item"
                                        :items="pageRow.col2.navigation.items"
                                        label="Component for Navigation"
                                      >
                                      </v-autocomplete>
                                    </v-col>
                                  </v-row>
                                </v-col>
                              </v-row>
                              <!-- Assign constructor resource -->
                              <v-row class="my-0 pa-0">
                                <v-col
                                  class="ma-2 pa-0"
                                  md="12"
                                  sm="12"
                                  cols="12"
                                >
                                  <v-autocomplete
                                    @change="getResourceData(pageRow.col2)"
                                    v-model="pageRow.col2.resource"
                                    dense
                                    hide-details
                                    return-object
                                    item-text="title"
                                    item-value="_id"
                                    outlined
                                    :rules="validationRules.required"
                                    placeholder="select a resource to build"
                                    :items="constructorAlphaResources"
                                    label="Resource for Column"
                                  >
                                  </v-autocomplete>
                                </v-col>
                              </v-row>
                              <!-- display constructor resource -->
                              <v-row class="my-0 pa-0">
                                <v-col
                                  class="ma-0 pa-0"
                                  md="12"
                                  sm="12"
                                  cols="12"
                                >
                                  <div v-if="pageRow.col2.resourceDataReceived">
                                    <v-row class="ma-0 pa-0">
                                      <v-col
                                        class="ma-2 pa-0"
                                        md="12"
                                        sm="12"
                                        cols="12"
                                      >
                                        <!-- optional title -->
                                        <v-text-field
                                          v-model="pageRow.col2.title"
                                          placeholder="Optional Name for Column"
                                          label="Column Name"
                                          type="text"
                                          hide-details
                                          dense
                                          outlined
                                          clearable
                                        >
                                        </v-text-field>
                                      </v-col>
                                    </v-row>
                                    <v-row class="ma-0 pa-0">
                                      <v-col
                                        class="ma-0 pa-0"
                                        v-if="pageRow.col2.navigation"
                                      >
                                        <constructor-resource-template
                                          :navigableComponent="
                                            pageRow.col2.navigation.component
                                          "
                                          :routeParam="
                                            pageRow.col2.navigation.routeParam
                                              ? pageRow.col2.navigation
                                                  .routeParam.routeParam
                                              : ''
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
                                        ></constructor-resource-template>
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
                              <!-- enabling navigation -->
                              <v-row class="my-2 pa-0">
                                <v-col class="ma-0 pa-0">
                                  <!-- switch -->
                                  <v-row class="ma-0 pa-0">
                                    <v-col
                                      class="ma-2 pa-0"
                                      md="10"
                                      sm="10"
                                      cols="10"
                                    >
                                      <v-switch
                                        @click="
                                          setNavigableItems(
                                            pageRowIndex,
                                            'col3',
                                            pageRow.col3.navigation.component
                                          )
                                        "
                                        style="min-width: 200px"
                                        class="my-0 py-0"
                                        v-model="
                                          pageRow.col3.navigation.isEnabled
                                        "
                                        dense
                                        hide-details
                                        :label="
                                          pageRow.col3.navigation.isEnabled
                                            ? 'Nvaigation Enabled'
                                            : 'Navigation Disabled'
                                        "
                                      >
                                      </v-switch>
                                    </v-col>
                                    <v-spacer></v-spacer>
                                    <!-- View resource -->
                                    <v-col
                                      v-if="
                                        pageRow.col3.resource &&
                                        pageRow.col3.resource._id
                                      "
                                      class="ma-0 pa-0"
                                      md="1"
                                      sm="1"
                                      cols="2"
                                    >
                                      <!-- View resource -->
                                      <v-tooltip left>
                                        <template
                                          v-slot:activator="{ on, attrs }"
                                        >
                                          <v-btn
                                            class="ma-0 pr-0 cyan--text text--darken-3 custom-transform-class text-none"
                                            medium
                                            icon
                                            v-bind="attrs"
                                            v-on="on"
                                            @click="
                                              goToResource(
                                                pageRow.col3.resource._id
                                              )
                                            "
                                          >
                                            <v-icon>preview</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>View Resource</span>
                                      </v-tooltip>
                                    </v-col>
                                  </v-row>
                                  <!-- Navigation component -->
                                  <v-row class="ma-0 pa-0">
                                    <v-col
                                      v-if="pageRow.col3.navigation.isEnabled"
                                      class="ma-2 pa-0"
                                      md="12"
                                      sm="12"
                                      cols="12"
                                    >
                                      <v-select
                                        v-model="
                                          pageRow.col3.navigation.component
                                        "
                                        @change="
                                          setNavigableItems(
                                            pageRowIndex,
                                            'col3',
                                            pageRow.col3.navigation.component
                                          )
                                        "
                                        dense
                                        hide-details
                                        outlined
                                        :rules="validationRules.required"
                                        placeholder="select a component"
                                        :items="navigablePageComponents"
                                        label="Component for Navigation"
                                        :menu-props="{
                                          bottom: true,
                                          offsetY: true,
                                        }"
                                      >
                                      </v-select>
                                    </v-col>
                                  </v-row>
                                  <!-- Name of the component  -->
                                  <v-row class="ma-0 pa-0">
                                    <v-col
                                      v-if="
                                        pageRow.col3.navigation &&
                                        pageRow.col3.navigation.isEnabled
                                      "
                                      class="ma-2 pa-0"
                                      md="12"
                                      sm="12"
                                      cols="12"
                                    >
                                      <v-autocomplete
                                        v-model="
                                          pageRow.col3.navigation.routeParam
                                        "
                                        dense
                                        hide-details
                                        return-object
                                        item-text="name"
                                        item-value="routeParam"
                                        outlined
                                        placeholder="select an item"
                                        :items="pageRow.col3.navigation.items"
                                        label="Component for Navigation"
                                      >
                                      </v-autocomplete>
                                    </v-col>
                                  </v-row>
                                </v-col>
                              </v-row>
                              <!-- Assign constructor resource -->
                              <v-row class="my-0 pa-0">
                                <v-col
                                  class="ma-2 pa-0"
                                  md="12"
                                  sm="12"
                                  cols="12"
                                >
                                  <v-autocomplete
                                    @change="getResourceData(pageRow.col3)"
                                    v-model="pageRow.col3.resource"
                                    dense
                                    hide-details
                                    return-object
                                    item-text="title"
                                    :rules="validationRules.required"
                                    item-value="_id"
                                    outlined
                                    placeholder="select a resource to build"
                                    :items="constructorAlphaResources"
                                    label="Resource for Column"
                                  >
                                  </v-autocomplete>
                                </v-col>
                              </v-row>
                              <!-- display constructor resource -->
                              <v-row class="my-0 pa-0">
                                <v-col
                                  class="ma-0 pa-0"
                                  md="12"
                                  sm="12"
                                  cols="12"
                                >
                                  <div v-if="pageRow.col3.resourceDataReceived">
                                    <v-row class="ma-0 pa-0">
                                      <v-col
                                        class="ma-2 pa-0"
                                        md="12"
                                        sm="12"
                                        cols="12"
                                      >
                                        <!-- optional title -->
                                        <v-text-field
                                          v-model="pageRow.col3.title"
                                          placeholder="Optional Name for Column"
                                          label="Column Name"
                                          type="text"
                                          hide-details
                                          dense
                                          outlined
                                          clearable
                                        >
                                        </v-text-field>
                                      </v-col>
                                    </v-row>
                                    <v-row class="ma-0 pa-0">
                                      <v-col
                                        class="ma-0 pa-0"
                                        v-if="pageRow.col3.navigation"
                                      >
                                        <constructor-resource-template
                                          :navigableComponent="
                                            pageRow.col3.navigation.component
                                          "
                                          :routeParam="
                                            pageRow.col3.navigation.routeParam
                                              ? pageRow.col3.navigation
                                                  .routeParam.routeParam
                                              : ''
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
                                        ></constructor-resource-template>
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
                          <!-- Has button check -->
                          <v-row class="pt-2 pb-0 my-0 d-flex" justify="center">
                            <v-col
                              class="text-left d-flex"
                              align="center"
                              cols="12"
                              md="12"
                              sm="12"
                            >
                              <p class="my-0 py-0">
                                Does the page row require a button?
                              </p>
                              <v-spacer></v-spacer>
                              <v-switch
                                class="my-0 py-0"
                                v-model="pageRow.hasButton"
                                dense
                                hide-details
                                :label="
                                  pageRow.hasButton
                                    ? 'Button Displayed'
                                    : 'Button Hidden'
                                "
                              >
                              </v-switch>
                            </v-col>
                          </v-row>
                          <!-- Assigning page to Button -->
                          <div v-if="pageRow.hasButton">
                            <v-row class="ma-0 pa-0">
                              <!-- Button Text -->
                              <v-col class="ma-2 pa-0" md="5" sm="6" cols="5">
                                <v-text-field
                                  v-model="pageRow.buttonParameters.text"
                                  placeholder="Button Text"
                                  label="Display Text"
                                  :rules="validationRules.required"
                                  type="text"
                                  hide-details
                                  dense
                                  outlined
                                  clearable
                                >
                                </v-text-field>
                              </v-col>
                              <!-- Assign Page -->
                              <v-col class="ma-2 pa-0" md="6" sm="6" cols="6">
                                <v-autocomplete
                                  v-model="pageRow.buttonParameters.routeParam"
                                  dense
                                  hide-details
                                  return-object
                                  item-text="name"
                                  :rules="validationRules.required"
                                  item-value="routeParam"
                                  outlined
                                  placeholder="select a target page for the button"
                                  :items="pages"
                                  label="Page for the button"
                                >
                                </v-autocomplete>
                              </v-col>
                            </v-row>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  <!-- Displaying the  category, subCategory and Group of item-->
                  <div v-if="activePage.isItemPage">
                    <!-- category, subCategory, group -->
                    <v-row class="mt-10 py-5">
                      <!-- item page Category-->
                      <v-col cols="12" md="4" sm="12">
                        <v-select
                          :menu-props="{
                            contentClass: 'model_creator__filters',
                          }"
                          @change="getItemCategoryData"
                          :items="itemCategoryValues"
                          dense
                          prepend-icon="category"
                          v-model="activePage.itemDetails.category"
                          label="Category"
                          :rules="validationRules.required"
                          type="text"
                          required
                        ></v-select>
                      </v-col>
                      <!-- item page Sub Category-->
                      <v-col cols="12" md="4" sm="12">
                        <v-select
                          :menu-props="{
                            contentClass: 'model_creator__filters',
                          }"
                          :items="itemSubCategories"
                          @change="getItemCategoryData"
                          dense
                          prepend-icon="category"
                          v-model="activePage.itemDetails.subCategory"
                          label="Sub Category"
                          type="text"
                          required
                        ></v-select>
                      </v-col>
                      <!-- item page group-->
                      <v-col cols="12" md="4" sm="12">
                        <v-select
                          :menu-props="{
                            contentClass: 'model_creator__filters',
                          }"
                          :items="itemGroups"
                          @change="getItemCategoryData"
                          dense
                          prepend-icon="category"
                          v-model="activePage.itemDetails.group"
                          label="Group"
                          type="text"
                          required
                        ></v-select>
                      </v-col>
                    </v-row>
                    <!-- category items -->
                    <v-row
                      v-if="itemPageDataReceived"
                      no-gutters
                      class="ma-0 pa-0"
                    >
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
                  <!-- Submit Cancel button -->
                  <v-row justify="center">
                    <!-- Submit -->
                    <v-col class="text-right">
                      <v-btn
                        class="primary darken-4 font-weight-bold"
                        raised
                        small
                        @click="handlePage"
                      >
                        {{ pageMode === 'create' ? 'Create' : 'Update' }}
                      </v-btn>
                    </v-col>
                    <!-- Cancel -->
                    <v-col class="text-left">
                      <v-btn
                        class="error darken-4 font-weight-bold"
                        raised
                        small
                        @click="navigateBackToPage"
                      >
                        Cancel
                      </v-btn>
                    </v-col>
                  </v-row>
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
  name: 'pageCreator',
  data() {
    return {
      isEditingPageName: false,
      isEditingPageDescription: false,
      pageMode: '',
      progress: null,
      isDialog: false,
      dialogHeading: '',
      dialogText: '',
      dialogText2: '',
      dialogBtn1: '',
      dialogBtn2: '',
      dialogResult: '',
      dialogContext: '',
      // activePage: {
      //   name: '',
      //   routeParam: '',
      //   description: '',
      //   pageRows: [],
      // },
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
      'appThemeFontColor1',
      'pageCategories',
      'constructorAlphaResources',
      'items',
      'initializeAppComplete',
      'navigablePageComponents',
      'itemPageData',
      'itemCategories',
      'pages',
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
    pageName: {
      get() {
        return this.$store.getters.pageName;
      },
      set(value) {
        this.$store.commit('setPageName', value);
      },
    },
    activePageRow: {
      get() {
        return this.$store.getters.activePageRow;
      },
      set(value) {
        this.$store.commit('setActivePageRow', value);
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
    activePageRowIndex: {
      get() {
        return this.$store.getters.activePageRowIndex;
      },
      set(value) {
        this.$store.commit('setActivePageRowIndex', value);
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
    newPageRowCheck() {
      let proceedToAdd = true;

      if (this.activePage.pageRows.length) {
        for (let index = 0; index < this.activePage.pageRows.length; index++) {
          const pageRow = this.activePage.pageRows[index];
          switch (pageRow.numberOfCols) {
            case 'single':
              if (!pageRow.col1.resource) {
                proceedToAdd = false;
              }
              break;
            case 'double':
              if (!pageRow.col1.resource || !pageRow.col2.resource) {
                proceedToAdd = false;
              }
              break;
            case 'triple':
              if (
                !pageRow.col1.resource ||
                !pageRow.col2.resource ||
                !pageRow.col3.resource
              ) {
                proceedToAdd = false;
              }
              break;
            default:
              break;
          }
        }
      }
      return !proceedToAdd;
    },
    navigableItems() {
      return this.items.map((item) => {
        return {
          name: item.name,
          routeParam: item.routeParam,
        };
      });
    },
    navigableResources() {
      return this.constructorAlphaResources.map((resource) => {
        return {
          name: resource.title,
          routeParam: resource.resourceRouteParam,
        };
      });
    },
    activePageDataReceived: {
      get() {
        return this.$store.getters.activePageDataReceived;
      },
      set(value) {
        this.$store.commit('setActivePageDataReceived', value);
      },
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
    itemCategoryValues() {
      return this.itemCategories.map((category) => category.name);
    },
    itemSubCategories() {
      const currentCategory = this.itemCategories.find(
        (category) => category.name === this.activePage.itemDetails.category
      );
      if (currentCategory) {
        return currentCategory.subCategories.map((subCat) => subCat.name);
      } else {
        return [];
      }
    },
    itemGroups() {
      const currentCategory = this.itemCategories.find(
        (category) => category.name === this.activePage.itemDetails.category
      );
      let subCategory;
      if (currentCategory) {
        subCategory = currentCategory.subCategories.find(
          (subCat) => subCat.name === this.activePage.itemDetails.subCategory
        );
      }
      if (currentCategory && subCategory) {
        return subCategory.subTitles.map((subTitle) => subTitle.name);
      } else {
        return [];
      }
    },
  },
  async created() {
    // console.log('active page:', this.activePage);
    // setting the page mode
    this.pageMode =
      this.$route.params.pageName !== 'newPage' ? 'update' : 'create';
    // set the navigable items for each column
    // get page details if not creating a new page
    if (this.$route.params.pageName !== 'newPage') {
      this.activePageDataReceived = false;
      await this.getPageData();
    } else {
      if (!this.pageCloningActive) {
        this.activePage = {
          name: 'Name of the page',
          routeParam: '',
          description: 'Page Description',
          pageRows: [],
          isItemPage: false,
          itemDetails: {
            category: '',
            subCategory: '',
            group: '',
          },
        };
      }
      this.activePageDataReceived = true;
    }
    await this.getItemCategoryData();
  },
  mounted() {
    this.$nextTick(function () {
      this.progressing = false;
    });
  },
  watch: {
    initializeAppComplete(newValue, oldValue) {
      if (oldValue === false) {
        this.getPageData();
      }
    },
    $route(to, from) {
      if (to.params.pageName === 'newPage') {
        if (!this.pageCloningActive) {
          this.activePage = {
            name: 'Name of the page',
            routeParam: '',
            description: 'Page Description',
            pageRows: [],
          };
        }
        return;
      }
      if (!this.activePageDataReceived) {
        this.getPageData();
      }
    },
    // async itemPageNumber(newValue, oldValue) {
    //   await this.getItemCategoryData();
    // },
  },
  methods: {
    clearDialog(result) {
      this.dialogResult = result;
      if (result === 'yes') {
        if (this.dialogContext === 'deletePageImage') {
          this.removePageImage(this.activePageRowIndex);
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
        case 'deletePageImage':
          this.dialogContext = 'deletePageImage';
          this.activePageRowIndex = pageRow.index;
          break;
        case 'unusedImage':
          this.dialogContext = 'unusedImage';
          break;
        case 'insuffcientInput':
          this.dialogContext = 'insuffcientInput';
          console.log('Reached');

          break;

        default:
          break;
      }
      // performing action
      switch (this.dialogContext) {
        case 'deletePageImage':
          this.dialogHeading = 'Confirm Deleting Page Image';
          this.dialogText =
            'Are you sure you want to delete this image? This will remove the imnage from the database and cannot be undone.';
          this.dialogBtn1 = 'Cancel';
          this.dialogBtn2 = 'Yes';
          this.isDialog = true;
          break;

        case 'unusedImage':
          this.dialogHeading = 'Unused images in this reosurce';
          this.dialogText =
            'Consider deleting the newly uploaded image(s) for this page to save storage';
          this.dialogBtn1 = 'Ok';
          this.dialogBtn2 = '';
          this.isDialog = true;
          break;

        case 'insuffcientInput':
          this.dialogHeading = 'Insuffcient Input';
          this.dialogText =
            'Please ensure that all the required fields are filled before submitting the page, e.g., page name, etc.';
          this.dialogBtn1 = 'Ok';
          this.dialogBtn2 = '';
          this.isDialog = true;
          break;

        default:
          break;
      }
    },
    // Handling Dialogs
    handleDialog2(content, context) {
      this.$store.dispatch('handleDialog', {
        content: content,
        context: context,
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
        // console.log('active Page:', this.activePage);
        // set items
        this.activePage.pageRows.forEach((row) => {
          // col1
          if (row.col1.navigation && row.col1.navigation.isEnabled) {
            switch (row.col1.navigation.component) {
              case 'Resource':
                row.col1.navigation.items = [...this.navigableResources];
                break;
              case 'Item':
                row.col1.navigation.items = [...this.navigableItems];
                break;

              default:
                break;
            }

            row.col1.navigation.routeParam = {
              ...row.col1.navigation.items.find(
                (item) => item.routeParam === row.col1.navigation.routeParam
              ),
            };
          }
          // col2
          if (
            row.col2.exists &&
            row.col2.navigation &&
            row.col2.navigation.isEnabled
          ) {
            switch (row.col2.navigation.component) {
              case 'Resource':
                row.col2.navigation.items = [...this.navigableResources];
                break;
              case 'Item':
                row.col2.navigation.items = [...this.navigableItems];
                break;

              default:
                break;
            }
            row.col2.navigation.routeParam = {
              ...row.col2.navigation.items.find(
                (item) => item.routeParam === row.col2.navigation.routeParam
              ),
            };
          }
          // col3
          if (
            row.col3.exists &&
            row.col3.navigation &&
            row.col3.navigation.isEnabled
          ) {
            switch (row.col3.navigation.component) {
              case 'Resource':
                row.col3.navigation.items = [...this.navigableResources];
                break;
              case 'Item':
                row.col3.navigation.items = [...this.navigableItems];
                break;

              default:
                break;
            }
            row.col3.navigation.routeParam = {
              ...row.col3.navigation.items.find(
                (item) => item.routeParam === row.col3.navigation.routeParam
              ),
            };
          }
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
        console.log('payload:', payload);
        // fetching items
        await this.$store.dispatch('getSingleCategoryGroupItems', payload);
      }
    },
    test() {
      // console.log('page rows:', this.activePage.pageRows);
      // console.log('constructorAlphaResources:', this.constructorAlphaResources);
    },
    // Add New page pageRow
    handleAddPageRow() {
      if (!this.activePage.pageRows) {
        this.activePage.pageRows = [];
      }
      this.activePage.pageRows.push({
        rowType: 'leftProminent', // When 2 columns are selected
        numberOfCols: 'triple',
        col1: {
          title: '',
          exists: true,
          height: null,
          width: null,
          navigation: {
            isEnabled: false,
            component: 'Resource',
            routeParam: '',
          },
          resource: {
            _id: '',
          },
          resourceDataReceived: true,
        },
        col2: {
          title: '',
          exists: true,
          height: null,
          width: null,
          navigation: {
            isEnabled: false,
            component: 'Resource',
            routeParam: '',
          },
          resource: {
            _id: '',
          },
          resourceDataReceived: true,
        },
        col3: {
          title: '',
          exists: true,
          height: null,
          width: null,
          navigation: {
            isEnabled: false,
            component: 'Resource',
            routeParam: '',
          },
          resource: {
            _id: '',
          },
          resourceDataReceived: true,
        },
        hasButton: false,
        buttonParameters: {
          text: '',
          targetType: 'pageViewer',
          routeParam: '',
        },
      });
      // Set focus on the new row
      this.$nextTick(() => {
        var newRow = document.getElementById(
          'pageRow' + this.activePage.pageRows.length
        );
        newRow.scrollIntoView();
        newRow.focus();
      });
    },
    setPageRowColumns(index, numberOfCols) {
      // Setting columns for a particular page row
      switch (numberOfCols) {
        // single column
        case 'single':
          this.activePage.pageRows[index].col1.exists = true;
          this.activePage.pageRows[index].col2.exists = false;
          this.activePage.pageRows[index].col3.exists = false;
          break;
        // 2 columns
        case 'double':
          this.activePage.pageRows[index].col1.exists = true;
          this.activePage.pageRows[index].col2.exists = true;
          this.activePage.pageRows[index].col3.exists = false;
          break;
        // 3 columns
        case 'triple':
          this.activePage.pageRows[index].col1.exists = true;
          this.activePage.pageRows[index].col2.exists = true;
          this.activePage.pageRows[index].col3.exists = true;
          break;

        default:
          break;
      }
    },
    // set navigable component (e.g., resource/item) and reset the route param
    setNavigableItems(index, col, component) {
      if (index !== undefined) {
        this.activePage.pageRows[index][col].navigation.routeParam = '';
        // set items
        switch (component) {
          case 'Resource':
            this.activePage.pageRows[index][col].navigation.items = [
              ...this.navigableResources,
            ];
            break;
          case 'Item':
            this.activePage.pageRows[index][col].navigation.items = [
              ...this.navigableItems,
            ];
            break;

          default:
            break;
        }
      }
    },
    async handlePage() {
      console.log('reached handle page');

      // alert("this will create a page");
      if (this.activePage.name === 'Name of the page') {
        this.handleDialog(null, 'insuffcientInput');
        return;
      }
      let pageRows = [];
      // console.log('Active page:', this.activePage);
      this.activePage.pageRows.forEach((pageRow) => {
        pageRows.push({
          rowType: pageRow.rowType,
          numberOfCols: pageRow.numberOfCols,
          col1: pageRow.col1,
          col2: pageRow.col2,
          col3: pageRow.col3,
          hasButton: pageRow.hasButton,
          buttonParameters: {
            text: pageRow.buttonParameters.text,
            targetType: pageRow.buttonParameters.targetType
              ? pageRow.buttonParameters.targetType
              : 'page',
            routeParam:
              pageRow.buttonParameters.routeParam.routeParam !== undefined
                ? pageRow.buttonParameters.routeParam.routeParam
                : pageRow.buttonParameters.routeParam,
          },
        });
      });
      // console.log('active Page:', this.activePage);
      // return;`
      // check for valid Navigation
      pageRows.forEach((row) => {
        if (
          // col1
          (row.col1.navigation &&
            row.col1.navigation.isEnabled &&
            !row.col1.navigation.routeParam) ||
          (row.col1.navigation &&
            row.col1.navigation.isEnabled &&
            row.col1.navigation.routeParam &&
            !row.col1.navigation.routeParam.routeParam) ||
          // col2
          (row.col2.navigation &&
            row.col2.navigation.isEnabled &&
            !row.col2.navigation.routeParam) ||
          (row.col2.navigation &&
            row.col2.navigation.isEnabled &&
            row.col2.navigation.routeParam &&
            !row.col2.navigation.routeParam.routeParam) ||
          // col3
          (row.col3.navigation &&
            row.col3.navigation.isEnabled &&
            !row.col3.navigation.routeParam) ||
          (row.col3.navigation &&
            row.col3.navigation.isEnabled &&
            row.col3.navigation.routeParam &&
            !row.col3.navigation.routeParam.routeParam)
        ) {
          this.handleDialog2(null, 'formNotValid');
          return;
        }
      });

      pageRows.forEach((row) => {
        // assigning only resourceIds
        // Assigning only resource Ids
        if (row.col1.resource) {
          row.col1.resource = row.col1.resource._id
            ? row.col1.resource._id
            : null;
        }
        // Assigning only resource Ids
        if (row.col2.resource) {
          row.col2.resource = row.col2.resource._id
            ? row.col2.resource._id
            : null;
        }
        // Assigning only resource Ids
        if (row.col3.resource) {
          row.col3.resource = row.col3.resource._id
            ? row.col3.resource._id
            : null;
        }

        // col 1
        // removing data reecivd flag
        if (row.col1.resourceDataReceived) delete row.col1.resourceDataReceived;
        // correcting the route param for each column for each row
        if (row.col1.navigation.isEnabled) {
          row.col1.navigation.routeParam =
            row.col1.navigation.routeParam.routeParam;
        }
        // removing items
        if (row.col1.navigation && row.col1.navigation.items) {
          delete row.col1.navigation.items;
        }

        //  removing expanded flag and limitedHeight
        if (row.col1.hasOwnProperty('expanded')) {
          delete row.col1['expanded'];
        }
        if (row.col1.hasOwnProperty('limitedHeight')) {
          delete row.col1['limitedHeight'];
        }
        // col2
        // removing data reecivd flag
        delete row.col2.resourceDataReceived;
        // correcting the route param for each column for each row
        if (row.col2.navigation.isEnabled) {
          row.col2.navigation.routeParam =
            row.col2.navigation.routeParam.routeParam;
        }
        // removing items
        if (row.col2.navigation && row.col2.navigation.items) {
          delete row.col2.navigation.items;
        }
        //  removing expanded flag and limitedHeight
        if (row.col2.hasOwnProperty('expanded')) {
          delete row.col2['expanded'];
        }
        if (row.col2.hasOwnProperty('limitedHeight')) {
          delete row.col2['limitedHeight'];
        }
        // col3
        // removing data reecivd flag
        if (row.col3.resourceDataReceived) delete row.col3.resourceDataReceived;
        // correcting the route param for each column for each row
        if (row.col3.navigation.isEnabled) {
          row.col3.navigation.routeParam =
            row.col3.navigation.routeParam.routeParam;
        }
        // removing items
        if (row.col3.navigation && row.col3.navigation.items) {
          delete row.col3.navigation.items;
        }
        //  removing expanded flag and limitedHeight
        if (row.col3.hasOwnProperty('expanded')) {
          delete row.col3['expanded'];
        }
        if (row.col3.hasOwnProperty('limitedHeight')) {
          delete row.col3['limitedHeight'];
        }
      });
      // Adding
      let payload;
      // creating page
      if (this.pageMode === 'create' || this.pageCloningActive) {
        payload = {
          pageCreatorInput: {
            name: this.activePage.name,
            // routeParam: this.activePage.routeParam,
            description: this.activePage.description,
            pageRows: pageRows,
            isItemPage: this.activePage.isItemPage,
            itemDetails: {
              category: this.activePage.itemDetails.category
                ? this.activePage.itemDetails.category
                : '',
              subCategory: this.activePage.itemDetails.subCategory
                ? this.activePage.itemDetails.subCategory
                : '',
              group: this.activePage.itemDetails.group
                ? this.activePage.itemDetails.group
                : '',
            },
            user: this.user._id,
          },
        };
      }
      // Updating page
      else {
        payload = {
          id: this.activePage._id,
          pageCreatorInput: {
            name: this.activePage.name,
            // routeParam: this.activePage.routeParam,
            description: this.activePage.description,
            pageRows: pageRows,
            isItemPage: this.activePage.isItemPage,
            itemDetails: {
              category: this.activePage.itemDetails.category
                ? this.activePage.itemDetails.category
                : '',
              subCategory: this.activePage.itemDetails.subCategory
                ? this.activePage.itemDetails.subCategory
                : '',
              group: this.activePage.itemDetails.group
                ? this.activePage.itemDetails.group
                : '',
            },
            user: this.user._id,
          },
        };
      }
      // console.log('payload:', payload);
      // return;
      let pageResult;
      //Adding new page
      if (this.pageMode === 'create') {
        pageResult = await this.$store.dispatch('addPage', payload);
        // Adding new page to store
        // console.log('pages:', this.pages);
        if (pageResult) {
          this.pages.push(pageResult);
        }
      }
      // updating page
      else {
        // console.log('update payload:', payload);
        pageResult = await this.$store.dispatch('updatePage', payload);
        const activePageIndex = this.pages.indexOf(
          this.pages.find((page) => page._id === this.activePage._id)
        );

        this.pages.splice(activePageIndex, 1, pageResult);
      }
      // console.log('page result:', pageResult);
      //  Routing to the page view page
      this.$router.push({
        name: 'pageViewer',
        params: { pageName: pageResult.routeParam },
      });

      // resetting cloneFlag
      if (this.cloneFlag) this.cloneFlag = false;
    },
    handleDeletePageRow(pageRowIndex) {
      this.activePage.pageRows.splice(pageRowIndex, 1);
    },
    navigateBackToPage() {
      // checck if any new images were uploaded
      this.$router.go(-1);
    },
    disableEditingDescription() {
      this.isEditingPageDescription = false;
    },
    include() {
      return [
        document.querySelector('.edit__description-button'),
        document.querySelector('.edit__pageName-button'),
      ];
    },
    // includePageName() {
    //   return [document.querySelector('.edit__pageName-button')];
    // },
    disableEditingPageName() {
      this.isEditingPageName = false;
    },
    // Getting alpha resource data ifn not available
    async getResourceData(column) {
      // console.log('column received:', column);
      const _id = column.resource._id;

      // Check if thr alpha resource is available
      const matchingResource = this.constructorAlphaResources.find(
        (resource) => resource._id === _id
      );
      if (matchingResource && !matchingResource.dataReceived) {
        // Get the resource data from backend
        column.resourceDataReceived = false;
        const alphaResource = await this.$store.dispatch(
          'getSingleAlphaResource',
          {
            alphaResourceId: _id,
          }
        );
        column.resource = { ...alphaResource };
        column.resourceDataReceived = true;
      }
    },
    // Delete page row
    deletePageRow(index) {
      // deleting page row without confirmation
      this.activePage.pageRows.splice(index, 1);
    },
    // Go to resource
    goToResource(_id) {
      // get constructor resource
      const resource = this.constructorAlphaResources.find(
        (resource) => resource._id === _id
      );
      if (resource) {
        const resolvedRoute = this.$router.resolve({
          name: 'resource',
          params: { resourceTitle: resource.resourceRouteParam },
        });

        window.open(resolvedRoute.href, '_blank');
      }
    },
    // Sorting page rows
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
.page__editor-toolbar .v-toolbar__content,
.v-toolbar__extension {
  padding: 0px 0px;
}
</style>
