<template>
  <v-container fluid>
    <!-- Dialog for Editing itemModel -->
    <v-row class="my-0 py-0">
      <v-col class="my-0 py-0">
        <v-dialog
          v-model="editItemModelDialog"
          persistent
          scrollable
          max-width="600px"
        >
          <v-card max-width="600" max-height="600" style="overflow: hidden">
            <v-card-title
              class="font-weight-bold"
              :class="appDark ? 'cyan darken-4' : 'light-blue lighten-3'"
            >
              {{ editItemDialogHeading }}
            </v-card-title>
            <!-- <v-btn @click="test">Test</v-btn> -->
            <!-- Edit itemModel Data -->
            <v-card-text
              style="max-height: 800px"
              class="justify__text mx-0 py-0 px-0 py-0"
            >
              <!-- Adding the Text block field -->
              <v-container class="mx-0 py-0 px-0 py-0">
                <v-form
                  class="py-5 mx-5"
                  ref="saveItemModelDataForm"
                  lazy-validation
                  v-model="isItemModelDataFormValid"
                >
                  <!-- Image uploader -->
                  <div v-if="editContext === 'addImage'">
                    <v-row justify="center">
                      <!-- Image before upload -->
                      <v-col
                        v-if="
                          !activeItemModel.images.length ||
                          !activeItemModel.images[
                            activeItemModel.images.length - 1
                          ].imageUrl
                        "
                        cols="12"
                        sm="12"
                        md="12"
                        class="text-center"
                      >
                        <div style="width: 500px; margin: 0 auto">
                          <vue-image-chooser
                            id="imagePicker"
                            name="imageChooser"
                            @change="uploadFile"
                            :progress="progress"
                            :error="error"
                          />
                        </div>
                      </v-col>
                      <!-- Image after upload -->
                      <v-col v-else class="text-center my-0 py-0">
                        <v-img
                          :src="
                            activeItemModel.images[
                              activeItemModel.images.length - 1
                            ].imageUrl
                          "
                          alt="ItemModel Image"
                          background-color="rgba(200,200,200,0.3)"
                          height="200"
                          id="thumbnail"
                          contain
                        >
                        </v-img>
                      </v-col>
                    </v-row>
                    <!-- Action buttons -->
                    <v-row justify="center" class="mt-2">
                      <!-- upload -->
                      <v-col cols="12" md="2" sm="6" class="text-center">
                        <v-btn
                          :disabled="
                            !activeItemModel.images.length ||
                            !activeItemModel.images[
                              activeItemModel.images.length - 1
                            ].image
                          "
                          class="primary darken-4 font-weight-bold"
                          raised
                          rounded
                          small
                          @click="uploadItemModelImage"
                        >
                          Upload
                        </v-btn>
                      </v-col>
                      <!-- Cancel -->
                      <v-col cols="12" md="2" sm="6" class="text-center">
                        <v-btn
                          rounded
                          raised
                          small
                          class="custom-transform-class text-none secondary"
                          @click="clearEditItemDialog"
                        >
                          Cancel
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>
                  <!-- itemModel Name -->
                  <v-row v-if="editContext === 'name'">
                    <v-col>
                      <v-text-field
                        class="mt-2"
                        style="font-size: 1.1em"
                        v-model="name"
                        :rules="validationRules.required"
                        required
                        auto-grow
                        prepend-icon="title"
                        placeholder="Enter the name for the itemModel"
                        label="Name"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <!-- itemModel Description-->
                  <v-row v-if="editContext === 'description'">
                    <v-col>
                      <v-textarea
                        class="mt-2"
                        style="font-size: 1.1em"
                        v-model="description"
                        :rules="validationRules.required"
                        required
                        auto-grow
                        prepend-icon="article"
                        placeholder="Describe the itemModel"
                        label="Description"
                      >
                      </v-textarea>
                    </v-col>
                  </v-row>
                  <!-- itemModel Category-->
                  <v-row v-if="editContext === 'category'">
                    <v-col>
                      <v-select
                        :menu-props="{ contentClass: 'model_creator__filters' }"
                        :items="itemCategoryValues"
                        dense
                        prepend-icon="category"
                        v-model="category"
                        label="Category"
                        :rules="validationRules.required"
                        type="text"
                        required
                      ></v-select>
                    </v-col>
                  </v-row>
                  <!-- itemModel Sub Category-->
                  <v-row v-if="editContext === 'subCategory'">
                    <v-col>
                      <v-select
                        :menu-props="{ contentClass: 'model_creator__filters' }"
                        :items="itemSubCategories"
                        dense
                        prepend-icon="category"
                        v-model="subCategory"
                        label="Sub Category"
                        type="text"
                        required
                      ></v-select>
                    </v-col>
                  </v-row>
                  <!-- itemModel group-->
                  <v-row v-if="editContext === 'group'">
                    <v-col>
                      <v-select
                        :menu-props="{ contentClass: 'model_creator__filters' }"
                        :items="itemGroups"
                        dense
                        prepend-icon="category"
                        v-model="group"
                        label="Group"
                        type="text"
                        required
                      ></v-select>
                    </v-col>
                  </v-row>
                  <!-- itemModel Tags-->
                  <v-row v-if="editContext === 'tags'">
                    <v-col>
                      <v-combobox
                        v-model="tags"
                        :items="appResourceTags"
                        chips
                        clearable
                        label="Add tags related to this itemModel"
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
                            @click:close="removeTag(item)"
                          >
                            <strong>{{ item }}</strong
                            >&nbsp;
                          </v-chip>
                        </template>
                      </v-combobox>
                    </v-col>
                  </v-row>
                  <!-- itemModel Tags-->
                  <v-row v-if="editContext === 'colors'">
                    <v-col>
                      <v-combobox
                        v-model="colors"
                        :items="colorItems"
                        chips
                        clearable
                        label="Add colors related to this item model"
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
                            :color="item"
                            close
                            @click="select"
                            @click:close="removeColor(item)"
                          >
                            <strong>{{ item }}</strong
                            >&nbsp;
                          </v-chip>
                        </template>
                      </v-combobox>
                    </v-col>
                  </v-row>
                  <!-- Spec  -->
                  <div
                    v-if="
                      editContext === 'addSpec' || editContext === 'editSpec'
                    "
                  >
                    <!-- Spec Type -->
                    <v-row>
                      <v-col>
                        <v-radio-group
                          dense
                          row
                          class="ma-0 pa-0"
                          v-model="activeSpec.specValueType"
                        >
                          <v-radio
                            style="font-size: 1em"
                            class="mx-1 my-1"
                            v-for="(type, index) in specTypes"
                            :key="'specType' + index"
                            :label="type"
                            :value="type"
                          >
                            <span></span>
                          </v-radio>
                        </v-radio-group>
                      </v-col>
                    </v-row>
                    <!-- Spec Name -->
                    <v-row>
                      <v-col>
                        <v-text-field
                          class="mt-2"
                          style="font-size: 1.1em"
                          v-model="activeSpec.specName"
                          :rules="validationRules.required"
                          required
                          auto-grow
                          prepend-icon="title"
                          placeholder="Enter the name of spec"
                          label="Name"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <!-- Spec Description-->
                    <v-row>
                      <v-col>
                        <v-textarea
                          class="mt-2"
                          style="font-size: 1.1em"
                          v-model="activeSpec.specDescription"
                          required
                          auto-grow
                          rows="2"
                          prepend-icon="article"
                          placeholder="Describe the spec"
                          label="Spec Description"
                        >
                        </v-textarea>
                      </v-col>
                    </v-row>
                    <!-- Spec value -->
                    <v-row
                      v-if="
                        activeSpec.specValueType === 'value' ||
                        activeSpec.specValueType === 'text' ||
                        activeSpec.specValueType === 'value with unit'
                      "
                    >
                      <v-col>
                        <!-- text spec -->
                        <v-text-field
                          v-if="activeSpec.specValueType === 'text'"
                          class="mt-2"
                          style="font-size: 1.1em"
                          v-model="activeSpec.specText"
                          type="text"
                          :rules="validationRules.required"
                          required
                          auto-grow
                          rows="2"
                          prepend-icon="mdi-alpha-s-box"
                          placeholder="Enter the value of spec"
                          label="Spec Text"
                        >
                          <!-- number spec  -->
                        </v-text-field>
                        <v-text-field
                          v-else
                          class="mt-2"
                          style="font-size: 1.1em"
                          v-model="activeSpec.specValue"
                          type="number"
                          :rules="validationRules.required"
                          required
                          auto-grow
                          rows="2"
                          prepend-icon="mdi-alpha-s-box"
                          placeholder="Enter the value of spec"
                          label="Spec Value"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <!-- Spec value options -->
                    <div
                      v-if="
                        activeSpec.specValueType === 'options' ||
                        activeSpec.specValueType === 'value options' ||
                        activeSpec.specValueType === 'options with unit'
                      "
                      class="my-2"
                    >
                      <!-- Spec value options title-->
                      <v-row class="mx-0 my-1 py-0" justify="start">
                        <v-col class="text-left py-0 py-0" align="center">
                          <p
                            class="body-1 font-weight-medium my-0 py-0"
                            :style="appThemeFontColor"
                          >
                            Spec Options:
                          </p>
                        </v-col>
                      </v-row>
                      <!-- Add spec value option -->
                      <v-row justify="start" class="my-0 py- mx-0 px-0">
                        <v-col class="ma-0 pa-0">
                          <v-tooltip right>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                class="my-2 custom-transform-class text-none"
                                medium
                                icon
                                v-bind="attrs"
                                v-on="on"
                                @click="
                                  handleAddSpecOption(activeSpec.specValueType)
                                "
                              >
                                <v-icon>add_circle</v-icon>
                              </v-btn>
                            </template>
                            <span>Add an option for spec value</span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                      <!-- Listing spec value options -->
                      <div v-if="activeSpec.specValueType === 'options'">
                        <v-row
                          v-for="(option, index) in activeSpec.specTextOptions"
                          :key="'option' + index"
                          class="my-2 py-0"
                        >
                          <!-- Displaying Option -->
                          <v-col cols="12" sm="10" md="10" class="my-0 py-0">
                            <v-text-field
                              class="mt-2"
                              style="font-size: 1.1em"
                              v-model="option.text"
                              type="text"
                              :id="'specTextOption' + (index + 1)"
                              :rules="validationRules.required"
                              required
                              auto-grow
                              placeholder="Name of the spec choice"
                              label="Choice Value"
                            >
                            </v-text-field>
                          </v-col>
                          <!-- Delete button -->
                          <v-col cols="12" sm="1" md="1">
                            <v-tooltip left>
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  class="ma-2 custom-transform-class text-none"
                                  medium
                                  icon
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="
                                    handleDeleteSpecOption(
                                      index,
                                      activeSpec.specValueType
                                    )
                                  "
                                >
                                  <v-icon>delete</v-icon>
                                </v-btn>
                              </template>
                              <span>Delete this option</span>
                            </v-tooltip>
                          </v-col>
                        </v-row>
                      </div>
                      <div v-else>
                        <v-row
                          v-for="(option, index) in activeSpec.specValueOptions"
                          :key="'option' + index"
                          class="my-2 py-0"
                        >
                          <!-- Displaying Option -->
                          <v-col cols="12" sm="10" md="10" class="my-0 py-0">
                            <v-text-field
                              class="mt-2"
                              style="font-size: 1.1em"
                              type="number"
                              v-model="option.value"
                              :id="'specValueOption' + (index + 1)"
                              :rules="validationRules.required"
                              required
                              auto-grow
                              placeholder="Name of the spec choice"
                              label="Choice Value"
                            >
                            </v-text-field>
                          </v-col>
                          <!-- Delete button -->
                          <v-col cols="12" sm="1" md="1">
                            <v-tooltip left>
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  class="ma-2 custom-transform-class text-none"
                                  medium
                                  icon
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="
                                    handleDeleteSpecOption(
                                      index,
                                      activeSpec.specValueType
                                    )
                                  "
                                >
                                  <v-icon>delete</v-icon>
                                </v-btn>
                              </template>
                              <span>Delete this option</span>
                            </v-tooltip>
                          </v-col>
                        </v-row>
                      </div>
                    </div>
                    <!-- Unit property and unit -->
                    <div
                      v-if="
                        activeSpec.specValueType === 'value with unit' ||
                        activeSpec.specValueType === 'options with unit'
                      "
                    >
                      <!-- Spec Unit property-->
                      <v-row class="my-0 py-0">
                        <v-col class="my-0 py-0" style="max-width: 300px">
                          <v-select
                            :menu-props="{
                              contentClass: 'model_creator__filters',
                            }"
                            :items="specUnitTypes"
                            dense
                            v-model="propertySelect"
                            prepend-icon="category"
                            @change="assignSpecUnitOptions(propertySelect)"
                            label="Property"
                            :rules="validationRules.required"
                            type="text"
                            required
                          ></v-select>
                        </v-col>
                      </v-row>
                      <!-- Spec Unit select-->
                      <v-row class="my-0 py-0">
                        <v-col class="my-0 py-0" style="max-width: 300px">
                          <v-select
                            :menu-props="{
                              contentClass: 'model_creator__filters',
                            }"
                            :items="specUnitOptions"
                            dense
                            prepend-icon="scale"
                            v-model="activeSpec.specUnitSelect"
                            label="Unit"
                            :rules="validationRules.required"
                            type="text"
                            required
                          ></v-select>
                        </v-col>
                      </v-row>
                    </div>
                  </div>
                </v-form>
              </v-container>
            </v-card-text>
            <!-- Close/cancel buttons -->
            <v-card-actions v-if="!(editContext === 'addImage')">
              <v-row justify="center" class="my-2">
                <!-- Save -->
                <v-col cols="12" md="2" sm="6" class="text-center">
                  <v-btn
                    rounded
                    small
                    :disabled="!isItemModelDataFormValid"
                    class="custom-transform-class text-none"
                    color="blue"
                    @click="saveEditItemModelDialog"
                  >
                    Save
                  </v-btn>
                </v-col>
                <!-- Cancel -->
                <v-col cols="12" md="2" sm="6" class="text-center">
                  <v-btn
                    rounded
                    small
                    class="custom-transform-class text-none secondary"
                    @click="clearEditItemDialog"
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
    <v-row justify="center" align="center">
      <v-col
        cols="12"
        md="12"
        sm="12"
        style="max-width: 1200px"
        class="text-center"
      >
        <!-- Data Available after Sync actions -->
        <div class="mt-0 pt-0">
          <!-- <v-btn @click="test">Test</v-btn> -->
          <v-card class="mt-0 pt-0" elevation="0">
            <!-- Create itemModel name -->
            <v-row wrap justify="center" align="center" class="ma-0 pa-0">
              <v-col cols="12" md="12" sm="12" class="text-center ma-0 pa-0">
                <v-toolbar :style="appLightBackground" elevation="0">
                  <v-toolbar-title class="mx-auto">
                    {{ activeItemModel.name }}</v-toolbar-title
                  >
                  <v-tooltip left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="ma-2 custom-transform-class text-none"
                        medium
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="handleEditItemModel('name')"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </template>
                    <span>Edit itemModel name</span>
                  </v-tooltip>
                </v-toolbar>
              </v-col>
            </v-row>
            <!-- Displaying Publish option -->
            <v-row class="pt-2 pb-0 my-0 d-flex" justify="center">
              <v-col
                class="text-left d-flex"
                align="center"
                cols="12"
                md="12"
                sm="12"
              >
                <p class="my-0 py-0">Do you want to publish this item model?</p>
                <v-spacer></v-spacer>
                <v-switch
                  class="my-0 py-0"
                  v-model="activeItemModel.published"
                  dense
                  hide-details
                  :label="
                    activeItemModel.published ? 'Published' : 'Unpublished'
                  "
                >
                </v-switch>
              </v-col>
            </v-row>
            <!-- Displaying disabled option -->
            <v-row
              v-if="user.masterAdmin"
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
                <p class="my-0 py-0">Do you want to disable this item model?</p>
                <v-spacer></v-spacer>
                <v-switch
                  class="my-0 py-0"
                  v-model="activeItemModel.disabled"
                  dense
                  hide-details
                  :label="
                    activeItemModel.disabled ? 'Disabled' : 'Not Disabled'
                  "
                >
                </v-switch>
              </v-col>
            </v-row>
            <!-- Displaying itemModel Data-->
            <div>
              <!-- Add image  button -->
              <v-row justify="end" class="my-0 py-0 mx-2">
                <v-col class="my-0 py-0 text-right">
                  <v-tooltip left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="ma-2 custom-transform-class text-none"
                        medium
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="handleEditItemModel('addImage')"
                      >
                        <v-icon>add_a_photo</v-icon>
                      </v-btn>
                    </template>
                    <span>Add Item Model Image</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <!-- Displayting itemModel Images -->
              <v-row
                justify="center"
                class="my-0 py-0 mx-2"
                v-if="activeItemModel.images.length"
              >
                <v-col class="text-right">
                  <v-carousel v-model="currentImageIndex">
                    <v-carousel-item
                      v-for="(image, index) in activeItemModel.images"
                      :key="'image' + index"
                      :src="image.imageUrl"
                      reverse-transition="fade-transition"
                      transition="fade-transition"
                    >
                      <!-- Delete Image -->
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ma-2 custom-transform-class text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="
                              handleDialog(
                                { index: index },
                                'deleteItemModelImage'
                              )
                            "
                          >
                            <v-icon :class="appDark ? 'black' : 'white'"
                              >delete</v-icon
                            >
                          </v-btn>
                        </template>
                        <span>Delete Image</span>
                      </v-tooltip>
                    </v-carousel-item>
                  </v-carousel>
                </v-col>
              </v-row>
              <!-- Displaying ItemModel Data-->
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
                        <v-col class="my-0 py-0" cols="12" md="11" sm="11">
                          <p>{{ activeItemModel.description }}</p>
                        </v-col>
                        <!-- Edit  button -->
                        <v-col
                          class="my-0 py-0 text-right"
                          cols="12"
                          md="1"
                          sm="1"
                        >
                          <v-tooltip left>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                class="ma-2 custom-transform-class text-none"
                                medium
                                icon
                                v-bind="attrs"
                                v-on="on"
                                @click="handleEditItemModel('description')"
                              >
                                <v-icon>edit</v-icon>
                              </v-btn>
                            </template>
                            <span>Edit itemModel description</span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <!-- Displaying Category -->
                  <v-row class="pt-2 mx-0" justify="start">
                    <!-- text -->
                    <v-col
                      class="text-left"
                      align="center"
                      cols="12"
                      md="11"
                      sm="11"
                    >
                      <p class="appFont1">
                        Category of the item model:
                        {{ activeItemModel.category }}
                      </p>
                    </v-col>
                    <!-- Edit category -->
                    <v-col cols="1" md="1" sm="1" class="my-0 py-0 text-right">
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ma-2 custom-transform-class text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="handleEditItemModel('category')"
                          >
                            <v-icon>edit</v-icon>
                          </v-btn>
                        </template>
                        <span>Edit Item Category</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <!-- Displaying SubCategory -->
                  <v-row class="pt-2 mx-0" justify="start">
                    <!-- text -->
                    <v-col
                      class="text-left"
                      align="center"
                      cols="12"
                      md="11"
                      sm="11"
                    >
                      <p class="appFont1">
                        Subcategory of the item model:
                        {{ activeItemModel.subCategory }}
                      </p>
                    </v-col>
                    <!-- Edit subCategory -->
                    <v-col cols="1" md="1" sm="1" class="my-0 py-0 text-right">
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ma-2 custom-transform-class text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="handleEditItemModel('subCategory')"
                          >
                            <v-icon>edit</v-icon>
                          </v-btn>
                        </template>
                        <span>Edit Item Subcategory</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <!-- Displaying Group -->
                  <v-row class="pt-2 mx-0" justify="start">
                    <!-- text -->
                    <v-col
                      class="text-left"
                      align="center"
                      cols="12"
                      md="11"
                      sm="11"
                    >
                      <p class="appFont1">
                        Group of the item model:
                        {{ activeItemModel.group }}
                      </p>
                    </v-col>
                    <!-- Edit Group -->
                    <v-col cols="1" md="1" sm="1" class="my-0 py-0 text-right">
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ma-2 custom-transform-class text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="handleEditItemModel('group')"
                          >
                            <v-icon>edit</v-icon>
                          </v-btn>
                        </template>
                        <span>Edit Item Group</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <!-- Specs title-->
                  <v-row class="mx-0 py-0 py-0" justify="start">
                    <v-col class="text-left py-0 py-0" align="center">
                      <p
                        class="body-1 font-weight-medium my-0 py-0"
                        :style="appThemeFontColor"
                      >
                        Technical Details:
                      </p>
                    </v-col>
                  </v-row>
                  <!-- Add Spec -->
                  <v-row justify="start">
                    <v-col align="center" class="text-left">
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ma-2 custom-transform-class text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="handleEditItemModel('addSpec')"
                          >
                            <v-icon>library_add</v-icon>
                          </v-btn>
                        </template>
                        <span>Add spec</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <!-- Displaying Specs -->
                  <div
                    class="pt-2 mx-5"
                    justify="start"
                    v-for="(spec, index) in activeItemModel.specs"
                    :key="'spec' + index"
                  >
                    <v-row>
                      <!-- name -->
                      <v-col
                        class="text-left my-0 py-0"
                        align="center"
                        cols="12"
                        md="4"
                        sm="4"
                        style="max-width: 200px"
                      >
                        <p :style="appThemeFontColor" class="mt-2">
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
                        cols="12"
                        md="6"
                        sm="7"
                      >
                        <p
                          v-if="spec.specValueType === 'text'"
                          class="mt-2"
                          :style="appThemeFontColor"
                        >
                          {{ spec.specText }}
                        </p>
                        <p v-else class="mt-2" :style="appThemeFontColor">
                          {{
                            spec.specValueType === 'value'
                              ? spec.specValue
                              : spec.specValue + ' ' + spec.specUnitSelect
                          }}
                        </p>
                      </v-col>
                      <!-- spec  options -->
                      <v-col
                        v-if="
                          spec.specValueType === 'options' ||
                          spec.specValueType === 'value options' ||
                          spec.specValueType === 'options with unit'
                        "
                        class="text-left my-0 py-0"
                        align="center"
                        cols="12"
                        md="6"
                        sm="7"
                      >
                        <!-- text options -->
                        <p
                          v-if="spec.specValueType === 'options'"
                          class="mt-2"
                          :style="appThemeFontColor"
                        >
                          {{ spec.specTextSelect }}
                        </p>
                        <!-- value options / with unit -->
                        <p v-else class="mt-2" :style="appThemeFontColor">
                          {{
                            spec.specValueType === 'value options'
                              ? spec.specValueSelect
                              : spec.specValueSelect + ' ' + spec.specUnitSelect
                          }}
                        </p>
                      </v-col>
                      <!-- Edit spec -->
                      <v-col
                        v-if="activeItemModel.specs.length"
                        cols="1"
                        md="1"
                        sm="1"
                        class="my-0 py-0 text-right"
                      >
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              class="ma-2 custom-transform-class text-none"
                              medium
                              icon
                              v-bind="attrs"
                              v-on="on"
                              @click="handleEditItemModel('editSpec', index)"
                            >
                              <v-icon>edit</v-icon>
                            </v-btn>
                          </template>
                          <span>Edit Spec</span>
                        </v-tooltip>
                      </v-col>
                      <!-- Delete spec -->
                      <v-col
                        v-if="activeItemModel.specs.length"
                        cols="1"
                        md="1"
                        sm="1"
                        class="my-0 py-0 text-right"
                      >
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              class="ma-2 custom-transform-class text-none"
                              medium
                              icon
                              v-bind="attrs"
                              v-on="on"
                              @click="handleDeleteSpec(index)"
                            >
                              <v-icon>delete</v-icon>
                            </v-btn>
                          </template>
                          <span>Delete Spec</span>
                        </v-tooltip>
                      </v-col>
                      <!-- soerting -->
                      <v-col
                        cols="1"
                        md="1"
                        sm="1"
                        class="my-auto py-0 text-right"
                        style="width: 60px"
                      >
                        <v-icon
                          small
                          class="pointerCursor"
                          color="primary"
                          @click="
                            array_move(
                              activeItemModel.specs,
                              index,
                              index == 0
                                ? activeItemModel.specs.length - 1
                                : index - 1
                            )
                          "
                          >fas fa-arrow-up</v-icon
                        >
                        <v-icon
                          small
                          color="primary"
                          class="pointerCursor ml-2"
                          @click="
                            array_move(
                              activeItemModel.specs,
                              index,
                              index == activeItemModel.specs.length - 1
                                ? 0
                                : index + 1
                            )
                          "
                          >fas fa-arrow-down</v-icon
                        >
                      </v-col>
                    </v-row>
                    <hr style="width: 100%" />
                  </div>
                  <!-- Add tags -->
                  <v-row class="my-0 py-0 mx-0" justify="start">
                    <v-col
                      cols="12"
                      md="11"
                      sm="11"
                      class="my-2 py-0 text-left"
                    >
                      <!-- Chip for tag -->
                      <v-chip
                        dense
                        small
                        v-for="(tag, index) in activeItemModel.tags"
                        :key="index"
                        class="ma-2"
                        style="height: 25px"
                        :color="randomColor"
                        :text-color="appDark ? 'black' : 'white'"
                      >
                        #{{ tag }}
                      </v-chip>
                    </v-col>
                    <!-- Add/Edit Tags -->
                    <v-col
                      cols="12"
                      md="1"
                      sm="1"
                      align="end"
                      class="my-0 py-0 text-right"
                    >
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ma-2 custom-transform-class text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="handleEditItemModel('tags')"
                          >
                            <v-icon>sell</v-icon>
                          </v-btn>
                        </template>
                        <span>Add or Edit Tags</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <!-- color selection -->
                  <v-row class="my-0 py-0 mx-0" justify="start">
                    <v-col cols="11" class="my-2 py-0 text-left">
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
                    <!-- Add/Edit Colors -->
                    <v-col
                      cols="12"
                      md="1"
                      sm="1"
                      align="end"
                      class="my-0 py-0 text-right"
                    >
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ma-2 custom-transform-class text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="handleEditItemModel('colors')"
                          >
                            <v-icon>edit</v-icon>
                          </v-btn>
                        </template>
                        <span>Add or Edit Colors</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>

                  <!-- Submit button -->
                  <v-row justify="center">
                    <v-col class="text-right">
                      <v-btn
                        class="primary darken-4 font-weight-bold"
                        raised
                        small
                        @click="handleItemModel"
                      >
                        {{ itemModelMode === 'create' ? 'Create' : 'Update' }}
                      </v-btn>
                    </v-col>
                    <v-col class="text-left">
                      <v-btn
                        class="error darken-4 font-weight-bold"
                        raised
                        small
                        @click="navigateBack"
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
  name: 'itemModelCreator',
  data() {
    return {
      progress: null,
      editContext: '',
      name: '',
      description: '',
      category: '',
      subCategory: '',
      group: '',
      tags: [],
      colors: [],
      editItemModelDialog: false,
      editItemDialogHeading: '',
      // itemCategories: [
      //   "itemModel Type 1",
      //   "itemModel Type 2",
      //   "itemModel type 3",
      // ],
      specTypes: [
        'value',
        'text',
        'value with unit',
        'options',
        'value options',
        'options with unit',
      ],
      specUnitTypes: [
        'Length',
        'Volume',
        'Volumetric Flowrate',
        'Temperature',
        'Pressure',
        'Pressure Difference',
        'Viscosity',
        'Time',
        'Density',
        'Stress',
        'Velocity',
      ],
      specValueOptions: [],
      activeSpecType: 'value',
      activeSpec: {
        specName: '',
        specDescription: '',
        specValueType: 'value',
        specValue: null,
        specText: null,
        specValueSelect: null,
        specTextSelect: '',
        specUnitOptions: [],
        specUnitSelect: '',
        specValueOptions: [],
        specTextOptions: [],
      },
      currentImageIndex: null,
      activeSpecIndex: null,
      activeImageIndex: null,
      specUnitOptions: [],
      propertySelect: '',
      isDialog: false,
      dialogHeading: '',
      dialogText: '',
      dialogText2: '',
      dialogBtn1: '',
      dialogBtn2: '',
      dialogResult: '',
      dialogContext: '',
      isItemModelDataFormValid: false,
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
      'itemModelMode',
      'randomColor',
      'lengthUnits',
      'volumeUnits',
      'volumetricFlowrateUnits',
      'tempUnits',
      'pressureUnits',
      'pressureDiffUnits',
      'viscosityUnits',
      'timeUnits',
      'densityUnits',
      'stressUnits',
      'velocityUnits',
      'itemModels',
      'itemModelDataReceived',
      'unitMatrices',
      'itemCategories',
      'colorItems',
    ]),
    progressing: {
      get() {
        return this.$store.getters.progressing;
      },
      set(value) {
        this.$store.commit('setProgressing', value);
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
    activeItemModel: {
      get() {
        return this.$store.getters.activeItemModel;
      },
      set(value) {
        this.$store.commit('setActiveItemModel', value);
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
    itemCategoryValues() {
      return this.itemCategories.map((category) => category.name);
    },
    itemCatId() {
      const currentCategory = this.itemCategories.find(
        (category) => category.name === this.activeItemModel.category
      );
      if (currentCategory) {
        return currentCategory._id;
      } else {
        return null;
      }
    },
    itemSubCategories() {
      const currentCategory = this.itemCategories.find(
        (category) => category.name === this.activeItemModel.category
      );
      if (currentCategory) {
        return currentCategory.subCategories.map((subCat) => subCat.name);
      } else {
        return [];
      }
    },
    itemGroups() {
      const currentCategory = this.itemCategories.find(
        (category) => category.name === this.activeItemModel.category
      );
      let subCategory;
      if (currentCategory) {
        subCategory = currentCategory.subCategories.find(
          (subCat) => subCat.name === this.activeItemModel.subCategory
        );
      }
      if (currentCategory && subCategory) {
        return subCategory.subTitles.map((subTitle) => subTitle.name);
      } else {
        return [];
      }
    },
  },
  created() {},
  mounted() {
    this.$nextTick(function () {
      this.progressing = false;
    });
  },
  watch: {
    editItemModelDialog() {
      this.$nextTick(() => {
        this.$refs.saveItemModelDataForm.resetValidation();
      });
    },
  },
  methods: {
    onDismissed() {
      this.$store.dispatch('clearError');
    },
    test() {},
    clearDialog(result) {
      this.dialogResult = result;
      if (result === 'yes') {
        if (this.dialogContext === 'deleteItemModelImage') {
          this.removeItemModelImage(this.activeImageIndex);
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
        case 'deleteItemModelImage':
          this.dialogContext = 'deleteItemModelImage';
          this.activeImageIndex = content.index;
          break;
        case 'unusedImage':
          this.dialogContext = 'unusedImage';
          break;

        case 'invalidSpecName':
          this.dialogContext = 'invalidSpecName';
          break;
        case 'insufficientData':
          this.dialogContext = 'insufficientData';
          break;

        default:
          break;
      }
      // performing action
      switch (this.dialogContext) {
        case 'deleteItemModelImage':
          this.dialogHeading = 'Confirm Deleting Item Model Image';
          this.dialogText =
            'Are you sure you want to delete this image? This will remove the imnage from the database and cannot be undone.';
          this.dialogBtn1 = 'Cancel';
          this.dialogBtn2 = 'Yes';
          this.isDialog = true;
          break;

        case 'unusedImage':
          this.dialogHeading = 'Unused images in this reosurce';
          this.dialogText =
            'Consider deleting the newly uploaded image(s) for this Item Model';
          this.dialogBtn1 = 'Ok';
          this.dialogBtn2 = '';
          this.isDialog = true;
          break;

        case 'invalidSpecName':
          this.dialogHeading = 'Duplicate Spec name';
          this.dialogText =
            'The spec name entered already exists for this item. Try a unique name.';
          this.dialogBtn1 = 'Ok';
          this.dialogBtn2 = '';
          this.isDialog = true;
          break;

        case 'insufficientData':
          this.dialogHeading = 'Insufficient Data';
          this.dialogText = 'Complete all required fields.';
          this.dialogBtn1 = 'Ok';
          this.dialogBtn2 = '';
          this.isDialog = true;
          break;

        default:
          break;
      }
    },
    // Add New itemModel content
    handleAddSpec() {
      this.activeItemModel.specs.push({
        specName: '',
        specDescription: '',
        specValueType: 'value',
        specValue: null,
        specValueSelect: null,
        specText: '',
        specTextSelect: '',
        specUnitOptions: [],
        specValueOptions: [],
        specTextOptions: [],
      });
    },
    uploadFile(file) {
      // console.log('file:', file);
      let formData = new FormData();
      formData.append('image', file.file);
      this.activeItemModel.images[
        this.activeItemModel.images.length - 1
      ].image = file;
      this.activeItemModel.images[
        this.activeItemModel.images.length - 1
      ].formData = formData;
    },
    onFilePicked(event) {
      const files = event.target.files;
      let filename = files[0].name;
      this.activeItemModel.images[
        this.activeItemModel.images.length - 1
      ].imageName = filename;
      if (filename.lastIndexOf('.') <= 0) {
        return alert('Please choose a valid file!');
      }
      const fileReader = new FileReader();
      fileReader.addEventListener(
        'load',
        () => {
          if (fileReader.result) {
            this.activeItemModel.images[
              this.activeItemModel.images.length - 1
            ].imageURL = fileReader.result;
          }
        },
        false
      );
      fileReader.readAsDataURL(files[0]);
      this.activeItemModel.images[
        this.activeItemModel.images.length - 1
      ].image = files[0];
    },
    async uploadItemModelImage() {
      // console.log('this will upload itemModel');
      // uploading itemModel Image to server
      let imageData;
      // Graphql
      // imageURL = await this.$store.dispatch("uploadItemModelImage", {
      //   image:
      //     this.activeItemModel.images[this.activeItemModel.images.length - 1]
      //       .image.file,
      // });
      // REST API
      imageData = await this.$store.dispatch('uploadItemModelImage2', {
        image:
          this.activeItemModel.images[this.activeItemModel.images.length - 1]
            .formData,
      });
      if (imageData.path) {
        this.activeItemModel.images[
          this.activeItemModel.images.length - 1
        ].imageLink = imageData.path;
        this.activeItemModel.images[
          this.activeItemModel.images.length - 1
        ].imageUrl = imageData.path;
        this.activeItemModel.images[
          this.activeItemModel.images.length - 1
        ].filename = imageData.filename;
        this.activeItemModel.images[
          this.activeItemModel.images.length - 1
        ].newImage = true;
      }
      this.currentImageIndex = this.activeItemModel.images.length - 1;
      this.editItemModelDialog = false;
      this.clearEditItemDialog();
    },
    async removeItemModelImage(index) {
      let payload;
      // WHile creating itemModel
      if (this.itemModelMode === 'create') {
        payload = {
          itemModelId: null,
          imageFilenameInput: this.activeItemModel.images[index].filename,
        };
      }
      // WHile updating itemModel
      else {
        payload = {
          itemModelId: this.activeItemModel._id,
          imageFilenameInput: this.activeItemModel.images[index].filename,
        };
      }
      // console.log('payload:', payload);
      // performing backend operation
      try {
        await this.$store.dispatch('deleteItemModelImage', payload);
      } catch (error) {
        // console.log(error);
        return;
      }
      // }
      // updating local data
      this.activeItemModel.images.splice(index, 1);
    },
    async handleItemModel() {
      // alert("this will create a itemModel");
      let itemModelImages = [];
      this.activeItemModel.images.forEach((image) => {
        itemModelImages.push({
          imageRequired: true,
          imageLink: image.imageLink,
          filename: image.filename,
        });
      });

      let payload;
      // creating itemModel
      if (this.itemModelMode === 'create') {
        payload = {
          itemModelInput: {
            name: this.activeItemModel.name,
            description: this.activeItemModel.description,
            catId: this.itemCatId,
            category: this.activeItemModel.category,
            subCategory: this.activeItemModel.subCategory,
            group: this.activeItemModel.group,
            tags: this.activeItemModel.tags,
            colors: this.activeItemModel.colors,
            images: itemModelImages,
            specs: this.sanitizeSpecs(),
            published: this.activeItemModel.published,
            disabled: this.activeItemModel.disabled,
          },
        };
      }

      // Updating itemModel
      else {
        payload = {
          itemModelId: this.activeItemModel._id,
          itemModelInput: {
            name: this.activeItemModel.name,
            description: this.activeItemModel.description,
            catId: this.itemCatId,
            category: this.activeItemModel.category,
            subCategory: this.activeItemModel.subCategory,
            group: this.activeItemModel.group,
            tags: this.activeItemModel.tags,
            colors: this.activeItemModel.colors,
            images: itemModelImages,
            specs: this.sanitizeSpecs(),
            published: this.activeItemModel.published,
            disabled: this.activeItemModel.disabled,
          },
        };
      }
      // console.log('payload:', payload);
      // return;
      let result;
      //Adding new itemModel
      if (this.itemModelMode === 'create') {
        result = await this.$store.dispatch('addItemModel', payload);
        // Adding new itemModel to store
        if (result) {
          this.itemModels.push(result);
        }
        //  Routing to the itemModel view page
        this.$router.push(`/itemModels/${result.routeParam}`);
      }
      // updating new itemModel
      else {
        // console.log('itemModels:', this.itemModels);
        // console.log('activeItemModel:', this.activeItemModel);
        const currentItemModel = this.itemModels.find(
          (model) => model._id === this.activeItemModel._id
        );
        const activeIndex = this.itemModels.indexOf(currentItemModel);
        // console.log('active res index:', activeIndex);
        // console.log('update payload:', payload);
        result = await this.$store.dispatch('updateItemModel', payload);
        // console.log('response minimal:', result);
        // console.log('updated result', result);
        this.itemModels.splice(activeIndex, 1, result);
        // console.log('updated result', result);
        // console.log('updated itemModels array:', this.itemModels);

        //  Routing to the itemModel view page
        this.$router.push(`/itemModels/${result.routeParam}`);
      }

      // resetting cloneFlag
      if (this.cloneFlag) this.cloneFlag = false;
    },
    navigateBack() {
      // checck if any new images were uploaded
      for (let index = 0; index < this.activeItemModel.images.length; index++) {
        const el = this.activeItemModel.images[index];
        if (el.newImage) {
          this.handleDialog(null, 'unusedImage');
          return;
        }
      }
      this.$router.go(-1);
    },
    removeTag(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
      this.tags = [...this.tags];
    },
    removeColor(color) {
      this.colors.splice(this.colors.indexOf(color), 1);
      this.colors = [...this.colors];
    },
    assignSpecUnitOptions(property) {
      this.specUnitOptions = [];
      switch (property) {
        case 'Length':
          this.specUnitOptions = [...this.lengthUnits];
          break;
        case 'Volume':
          this.specUnitOptions = [...this.volumeUnits];
          break;
        case 'Volumetric Flowrate':
          this.specUnitOptions = [...this.volumetricFlowrateUnits];
          break;
        case 'Temperature':
          this.specUnitOptions = [...this.tempUnits];
          break;
        case 'Pressure':
          this.specUnitOptions = [...this.pressureUnits];
          break;
        case 'Pressure Difference':
          this.specUnitOptions = [...this.pressureDiffUnits];
          break;
        case 'Viscosity':
          this.specUnitOptions = [...this.viscosityUnits];
          break;
        case 'Time':
          this.specUnitOptions = [...this.timeUnits];
          break;
        case 'Density':
          this.specUnitOptions = [...this.densityUnits];
          break;
        case 'Stress':
          this.specUnitOptions = [...this.stressUnits];
          break;
        case 'Velocity':
          this.specUnitOptions = [...this.velocityUnits];
          break;

        default:
          break;
      }
      this.activeSpec.specUnitSelect = this.specUnitOptions[0];
    },
    handleAddSpecOption(specType) {
      if (specType === 'options') {
        this.activeSpec.specTextOptions.push({
          text: '',
        });
        this.$nextTick(() => {
          var newOption = document.getElementById(
            'specTextOption' + this.activeSpec.specTextOptions.length
          );
          newOption.scrollIntoView();
          newOption.focus();
        });
      } else {
        this.activeSpec.specValueOptions.push({
          value: null,
        });
        this.$nextTick(() => {
          var newOption = document.getElementById(
            'specValueOption' + this.activeSpec.specValueOptions.length
          );
          newOption.scrollIntoView();
          newOption.focus();
        });
      }
    },
    handleDeleteSpecOption(index, specType) {
      if (specType === 'options') {
        this.activeSpec.specTextOptions.splice(index, 1);
      } else {
        this.activeSpec.specValueOptions.splice(index, 1);
      }
    },
    // Editing Item model
    handleEditItemModel(context, index) {
      switch (context) {
        case 'name':
          this.editContext = context;
          this.editItemDialogHeading = 'Edit Name of Item Model';
          this.name = this.activeItemModel.name;
          break;

        case 'description':
          this.editContext = context;
          this.editItemDialogHeading = 'Edit Description of Item Model';
          this.description = this.activeItemModel.description;
          break;

        case 'category':
          this.editContext = context;
          this.editItemDialogHeading = 'Edit Category of Item Model';
          this.category = this.activeItemModel.category;
          break;

        case 'subCategory':
          this.editContext = context;
          this.editItemDialogHeading = 'Edit Subcategory of Item Model';
          this.subCategory = this.activeItemModel.subCategory;
          break;

        case 'group':
          this.editContext = context;
          this.editItemDialogHeading = 'Edit group of Item Model';
          this.group = this.activeItemModel.group;
          break;

        case 'tags':
          this.editContext = context;
          this.editItemDialogHeading = 'Edit Tags of Item Model';
          this.tags = this.activeItemModel.tags;
          break;
        case 'colors':
          this.editContext = context;
          this.editItemDialogHeading = 'Edit Colors of Item Model';
          this.colors = this.activeItemModel.colors;
          break;
        case 'addImage':
          // Checking if there are more than or equal to 5 images
          if (this.activeItemModel.images.length >= 5) {
            alert('Maximum number of images (5) exceeded!');
            return;
          }
          this.editContext = context;
          this.editItemDialogHeading = 'Add new image';
          this.activeItemModel.images.push({
            image: null,
            imageUrl: '',
            imageRequired: true,
            imageLink: '',
            filename: '',
          });
          break;

        case 'addSpec':
          this.editContext = context;
          this.editItemDialogHeading = 'Add new spec';
          this.activeSpec = {
            specName: '',
            specDescription: '',
            specValueType: 'value',
            specValue: null,
            specValueSelect: null,
            specTextSelect: '',
            specText: '',
            specUnitOptions: [],
            specUnitSelect: '',
            specValueOptions: [],
            specTextOptions: [],
          };
          break;

        case 'editSpec':
          this.editContext = context;
          this.editItemDialogHeading = 'Edit spec';
          this.activeSpecIndex = index;
          this.activeSpec = this.activeItemModel.specs[index];
          let found = false;
          const activeUnit = this.activeSpec.specUnitSelect;
          // settign the unit
          if (activeUnit) {
            // finding property
            for (let index = 0; index < this.unitMatrices.length; index++) {
              const unitMatrix = this.unitMatrices[index];
              for (
                let unitIndex = 0;
                unitIndex < unitMatrix.conversionMatrix.length;
                unitIndex++
              ) {
                const unitObject = unitMatrix.conversionMatrix[unitIndex];
                if (unitObject.unit === activeUnit) {
                  this.propertySelect = unitMatrix.propertyName;
                  this.assignSpecUnitOptions(this.propertySelect);
                  this.activeSpec.specUnitSelect = activeUnit;
                  found = true;
                  break;
                }
              }
              if (found) break;
            }
          }
          if (this.activeSpec.specValueType === 'options') {
            let specTextOptions = this.activeItemModel.specs[
              index
            ].specTextOptions.map((option) => {
              return typeof option !== 'object' ? { text: option } : option;
            });
            this.activeSpec['specTextOptions'] = [...specTextOptions];
          } else {
            let specValueOptions = this.activeItemModel.specs[
              index
            ].specValueOptions.map((option) => {
              return typeof option !== 'object' ? { value: option } : option;
            });
            this.activeSpec['specValueOptions'] = specValueOptions;
          }
          break;

        default:
          break;
      }
      // opening Dialog
      this.editItemModelDialog = true;
    },
    // removing a spec
    handleDeleteSpec(index) {
      this.activeItemModel.specs.splice(index, 1);
    },
    // Saving data from Edit dialog
    saveEditItemModelDialog() {
      if (this.$refs.saveItemModelDataForm.validate()) {
        let specValueOptions = [];
        let specTextOptions = [];
        switch (this.editContext) {
          case 'name':
            this.activeItemModel.name = this.name;
            break;

          case 'description':
            this.editItemDialogHeading = 'Edit Description of Item Model';
            this.activeItemModel.description = this.description;
            break;

          case 'category':
            this.editItemDialogHeading = 'Edit Category of Item Model';
            this.activeItemModel.category = this.category;
            break;

          case 'subCategory':
            this.editItemDialogHeading = 'Edit Subcategory of Item Model';
            this.activeItemModel.subCategory = this.subCategory;
            break;

          case 'group':
            this.editItemDialogHeading = 'Edit group of Item Model';
            this.activeItemModel.group = this.group;
            break;

          case 'tags':
            this.editItemDialogHeading = 'Edit Tags of Item Model';
            this.activeItemModel.tags = this.tags;
            break;
          case 'colors':
            this.editItemDialogHeading = 'Edit Colors of Item Model';
            this.activeItemModel.colors = this.colors;
            break;

          case 'addImage':
            this.editItemDialogHeading = 'Add new image';
            break;

          case 'addSpec':
            this.editItemDialogHeading = 'Add new Spec';
            if (this.duplicateSpecName(this.activeSpec.specName) === true) {
              this.handleDialog(null, 'invalidSpecName');
              return;
            }
            // text options
            if (this.activeSpec.specValueType === 'options') {
              specTextOptions = this.activeSpec.specTextOptions.map(
                (option) => option.text
              );
              this.activeSpec['specTextOptions'] = specTextOptions;
            }
            // value options
            else {
              specValueOptions = this.activeSpec.specValueOptions.map(
                (option) => option.value
              );
              this.activeSpec['specValueOptions'] = specValueOptions;
            }
            this.activeItemModel.specs.push(this.activeSpec);
            // setting specTextSelect
            if (this.activeSpec.specValueType === 'options') {
              this.activeItemModel.specs[
                this.activeItemModel.specs.length - 1
              ].specTextSelect = specTextOptions[0];
            }
            // setting specValueSelect
            else {
              this.activeItemModel.specs[
                this.activeItemModel.specs.length - 1
              ].specValueSelect = specValueOptions[0];
            }

            break;

          case 'editSpec':
            this.editItemDialogHeading = 'Edit Spec';
            // text options
            if (this.activeSpec.specValueType === 'options') {
              specTextOptions = this.activeSpec.specTextOptions.map(
                (option) => option.text
              );
              this.activeSpec['specTextOptions'] = specTextOptions;
              this.activeItemModel.specs[this.activeSpecIndex] =
                this.activeSpec;
              this.activeItemModel.specs[this.activeSpecIndex].specTextSelect =
                specTextOptions[0];
            }
            // value options
            else {
              specValueOptions = this.activeSpec.specValueOptions.map(
                (option) => option.value
              );
              this.activeSpec['specValueOptions'] = specValueOptions;
              this.activeItemModel.specs[this.activeSpecIndex] =
                this.activeSpec;
              this.activeItemModel.specs[this.activeSpecIndex].specValueSelect =
                specValueOptions[0];
            }
            break;
        }
        // Clearing dialog
        this.clearEditItemDialog();
      } else {
        this.handleDialog(null, 'insufficientData');
      }
    },
    clearEditItemDialog() {
      this.editItemModelDialog = false;
      this.editItemDialogHeading = '';
      // If image upload operation canceled
      if (
        this.editContext === 'addImage' &&
        !this.activeItemModel.images[this.activeItemModel.images.length - 1]
          .imageLink
      ) {
        this.activeItemModel.images.pop();
      }
      this.activeSpec = {
        specName: '',
        specDescription: '',
        specValueType: 'value',
        specValue: null,
        specText: '',
        specValueSelect: null,
        specTextSelect: '',
        specUnitOptions: [],
        specUnitSelect: '',
        specValueOptions: [],
        specTextOptions: [],
      };
      this.specValueOptions = [];
      this.specTextOptions = [];
      this.activeIndex = null;
      this.editContext = '';
      this.name = '';
      this.description = '';
      this.category = '';
      this.tags = [];
      this.colors = [];
    },
    sanitizeSpecs() {
      let modifiedSpecs = [];

      modifiedSpecs = [
        ...this.activeItemModel.specs.map((spec) => {
          return {
            ...spec,
            specValue:
              spec.specValueType === 'value' ||
              spec.specValueType === 'value with unit'
                ? parseFloat(spec.specValue)
                : spec.specValue,
            specValueSelect:
              spec.specValueType === 'value options' ||
              spec.specValueType === 'options with unit'
                ? parseFloat(spec.specValueSelect)
                : spec.specValueSelect,
            specTextOptions:
              spec.specValueType === 'options'
                ? spec.specTextOptions.map((option) => {
                    return typeof option === 'object' ? option.text : option;
                  })
                : [],
            specValueOptions:
              spec.specValueType === 'options'
                ? []
                : spec.specValueOptions.map((option) => {
                    return typeof option === 'object'
                      ? parseFloat(option.value)
                      : parseFloat(option);
                  }),
          };
        }),
      ];
      // sanitizing for any text values for float fields
      modifiedSpecs.forEach((spec) => {
        switch (spec.specValueType) {
          case 'value':
            spec.specValue = parseFloat(spec.specValue);
            break;
          case 'value with unit':
            spec.specValue = parseFloat(spec.specValue);
            break;
          case 'value options':
            spec.specValueOptions.forEach((option) => {
              option = parseFloat(option);
            });
            break;

          case 'value options':
            spec.specValueOptions.forEach((option) => {
              option = parseFloat(option);
            });
            break;

          case 'options with unit':
            spec.specValueOptions.forEach((option) => {
              option = parseFloat(option);
            });
            break;

          default:
            break;
        }
      });
      return modifiedSpecs;
    },
    duplicateSpecName(specName) {
      let duplicateFound = false;

      for (let i = 0; i < this.activeItemModel.specs.length; i++) {
        const spec = this.activeItemModel.specs[i];
        if (spec.specName.toLowerCase() === specName.toLowerCase()) {
          duplicateFound = true;
          // delete the last created spec
          // this.activeItemModel.specs.pop();
          break;
        }
      }
      return duplicateFound;
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
.font-weight-black.v-text-field > .v-input__control > .v-input__slot:before {
  border-style: none;
}
.font-weight-black.v-text-field > .v-input__control > .v-input__slot:after {
  border-style: none;
}
.image_required__checkbox .v-input__control .v-input__slot label {
  font-size: 14px;
  font-weight: 500;
  min-width: 100px;
}
</style>
