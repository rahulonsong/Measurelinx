<template>
  <v-container fluid class="mx-auto my-0 py-0">
    <!-- <v-btn @click="test">Test</v-btn> -->
    <!-- Dialog for Editing item -->
    <v-row class="my-0 py-0">
      <v-col class="my-0 py-0">
        <v-dialog
          v-model="editItemDialog"
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
            <!-- Edit item Data -->
            <v-card-text
              style="max-height: 800px"
              class="justify__text mx-0 py-0 px-0 py-0"
            >
              <!--Edit container -->
              <v-container class="mx-0 py-0 px-0 py-0">
                <v-form
                  class="py-5 mx-5"
                  lazy-validation
                  ref="saveItemForm"
                  v-model="isItemFormValid"
                >
                  <!-- Image uploader -->
                  <div v-if="editContext === 'addImage'">
                    <v-row justify="center">
                      <!-- Image before upload -->
                      <v-col
                        v-if="
                          !activeItem.images.length ||
                          !activeItem.images[activeItem.images.length - 1]
                            .imageUrl
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
                            activeItem.images[activeItem.images.length - 1]
                              .imageUrl
                          "
                          alt="Item Image"
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
                            !activeItem.images.length ||
                            !activeItem.images[activeItem.images.length - 1]
                              .image
                          "
                          class="primary darken-4 font-weight-bold"
                          raised
                          rounded
                          small
                          @click="uploadItemImage"
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
                  <!-- item Name -->
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
                        placeholder="Enter the name for the item"
                        label="Name"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <!-- item Description-->
                  <v-row v-if="editContext === 'description'">
                    <v-col>
                      <v-textarea
                        class="mt-2"
                        style="font-size: 1.1em"
                        v-model="description"
                        :rules="validationRules.required"
                        required
                        rows="2"
                        auto-grow
                        prepend-icon="article"
                        placeholder="Describe the item"
                        label="Description"
                      >
                      </v-textarea>
                    </v-col>
                  </v-row>
                  <!-- item Tags-->
                  <v-row v-if="editContext === 'tags'">
                    <v-col>
                      <v-combobox
                        v-model="tags"
                        :items="appResourceTags"
                        chips
                        clearable
                        label="Add tags related to this item"
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
                  <!-- Spec  -->
                  <div v-if="editContext === 'editSpec'">
                    <!-- Spec Name -->
                    <v-row>
                      <v-col>
                        <v-text-field
                          class="mt-2"
                          style="font-size: 1.1em"
                          v-model="activeSpec.specName"
                          :rules="validationRules.required"
                          required
                          disabled
                          auto-grow
                          prepend-icon="title"
                          placeholder="Enter the name of spec"
                          label="Name"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <!-- Spec Description-->
                    <v-row class="my-0 py-0" justify="start">
                      <v-col class="text-left py-0 py-0" align="center">
                        <v-textarea
                          class="mt-2"
                          style="font-size: 1.1em"
                          v-model="activeSpec.specDescription"
                          required
                          disabled
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
                        <v-text-field
                          v-if="activeSpec.specValueType === 'text'"
                          class="mt-2"
                          type="text"
                          style="font-size: 1.1em"
                          v-model="activeSpec.specText"
                          :rules="validationRules.required"
                          required
                          prepend-icon="mdi-alpha-s-box"
                          placeholder="Enter the text of spec"
                          label="Spec Text"
                        >
                        </v-text-field>
                        <v-text-field
                          v-else
                          class="mt-2"
                          type="text"
                          style="font-size: 1.1em"
                          v-model="activeSpec.specValue"
                          :rules="validationRules.required"
                          required
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
                      <!-- Listing spec value options -->
                      <v-row class="my-4 py-0">
                        <!-- Displaying Option -->
                        <v-col cols="12" sm="10" md="10" class="my-0 py-0">
                          <v-select
                            v-if="activeSpec.specValueType === 'options'"
                            :menu-props="{
                              contentClass: 'model_creator__filters',
                            }"
                            :items="activeSpec.specTextOptions"
                            dense
                            prepend-icon="scale"
                            v-model="activeSpec.specTextSelect"
                            label="Spec Choice"
                            :rules="validationRules.required"
                            type="text"
                            required
                          ></v-select>
                          <v-select
                            v-else
                            :menu-props="{
                              contentClass: 'model_creator__filters',
                            }"
                            :items="activeSpec.specValueOptions"
                            dense
                            prepend-icon="scale"
                            v-model="activeSpec.specValueSelect"
                            label="Spec Choice"
                            :rules="validationRules.required"
                            type="text"
                            required
                          ></v-select>
                        </v-col>
                      </v-row>
                    </div>
                    <!-- Unit Select -->
                    <div
                      v-if="
                        activeSpec.specValueType === 'value with unit' ||
                        activeSpec.specValueType === 'options with unit'
                      "
                    >
                      <!-- Spec Unit -->
                      <v-row class="my-2 py-0">
                        <v-col class="my-0 py-0" style="max-width: 300px">
                          <v-select
                            :menu-props="{
                              contentClass: 'model_creator__filters',
                            }"
                            :items="specUnitOptions"
                            dense
                            disabled
                            prepend-icon="scale"
                            v-model="activeSpec.specUnit"
                            label="Unit"
                            :rules="validationRules.required"
                            type="text"
                            required
                          ></v-select>
                        </v-col>
                      </v-row>
                    </div>
                  </div>
                  <!-- item Stock -->
                  <v-row v-if="editContext === 'stock'">
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        class="mt-2"
                        style="font-size: 1.1em"
                        v-model="stock"
                        :rules="validationRules.required"
                        required
                        type="number"
                        prepend-icon="inventory"
                        placeholder="Enter the Stock"
                        label="Stock"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <!-- item maximumOrderQuantity -->
                  <v-row v-if="editContext === 'maximumOrderQuantity'">
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        class="mt-2"
                        style="font-size: 1.1em"
                        v-model="maximumOrderQuantity"
                        :rules="validationRules.required"
                        required
                        type="number"
                        placeholder="Enter the Maximum Order Quantity"
                        label="Maximum Order Quantity"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <!-- Price/Discount/Tax -->
                  <div v-if="editContext === 'price'">
                    <!-- item Price -->
                    <v-row class="my-0 py-0">
                      <!-- value -->
                      <v-col class="my-0 py-0" cols="12" sm="6" md="6">
                        <v-text-field
                          style="font-size: 1.1em"
                          v-model="price.value"
                          @input="setFinalPrice"
                          :rules="validationRules.required"
                          required
                          type="number"
                          auto-grow
                          prepend-icon="attach_money"
                          placeholder="Enter the price"
                          label="Price"
                        >
                        </v-text-field>
                      </v-col>
                      <!-- Currency -->
                      <v-col class="my-0 py-0" cols="12" sm="6" md="3">
                        <p class="mt-5">{{ appCurrency }}</p>
                      </v-col>
                    </v-row>
                    <!-- item tax -->
                    <v-row class="my-0 py-0">
                      <!-- value -->
                      <v-col class="my-0 py-0" cols="12" sm="6" md="6">
                        <v-text-field
                          class="mt-2"
                          style="font-size: 1.1em"
                          v-model="tax"
                          @input="setFinalPrice"
                          :rules="validationRules.required"
                          required
                          type="number"
                          prepend-icon="paid"
                          placeholder="Enter the Tax in %"
                          label="Tax %"
                        >
                        </v-text-field>
                      </v-col>
                      <!-- Percentage -->
                      <v-col class="my-0 py-0" cols="12" sm="1" md="1">
                        <p class="mt-5">%</p>
                      </v-col>
                    </v-row>
                    <!-- item List price -->
                    <v-row class="my-0 py-0">
                      <!-- Value -->
                      <v-col class="my-0 py-0" cols="12" sm="6" md="6">
                        <v-text-field
                          class="mt-2"
                          style="font-size: 1.1em"
                          v-model="listPrice"
                          @input="setbyListPrice(listPrice)"
                          :rules="validationRules.required"
                          required
                          type="number"
                          prepend-icon="price_check"
                          placeholder="Enter the Tax in %"
                          label="List Price"
                        >
                        </v-text-field>
                      </v-col>
                      <!-- Currency -->
                      <v-col class="my-0 py-0" cols="12" sm="6" md="3">
                        <p class="mt-5">{{ appCurrency }}</p>
                      </v-col>
                    </v-row>
                    <!-- item Discount -->
                    <v-row class="my-0 py-0">
                      <v-col class="my-0 py-0" cols="12" sm="6" md="6">
                        <v-text-field
                          style="font-size: 1.1em"
                          v-model="discount"
                          @input="setFinalPrice"
                          :rules="validationRules.required"
                          required
                          type="number"
                          prepend-icon="discount"
                          placeholder="Enter the Discount in %"
                          label="Discount %"
                        >
                        </v-text-field>
                      </v-col>
                      <!-- Percentage -->
                      <v-col class="my-0 py-0" cols="12" sm="1" md="1">
                        <p class="mt-5">%</p>
                      </v-col>
                    </v-row>
                    <!-- item Final price -->
                    <v-row class="my-0 py-0">
                      <!-- Value -->
                      <v-col class="my-0 py-0" cols="12" sm="6" md="6">
                        <v-text-field
                          class="mt-2"
                          style="font-size: 1.1em"
                          v-model="finalPrice"
                          :rules="validationRules.required"
                          @input="setPriceComponents(finalPrice)"
                          required
                          type="number"
                          prepend-icon="price_check"
                          placeholder="Enter the Tax in %"
                          label="Final Price"
                        >
                        </v-text-field>
                      </v-col>
                      <!-- Currency -->
                      <v-col class="my-0 py-0" cols="12" sm="6" md="3"> </v-col>
                    </v-row>
                  </div>
                  <!-- Features and Details -->
                  <div
                    v-if="
                      editContext === 'editFeature' ||
                      editContext === 'addFeature'
                    "
                    class="my-2"
                  >
                    <!-- Displaying caption -->
                    <v-row class="my-2 py-0">
                      <!-- Caption -->
                      <v-col cols="12" sm="11" md="11" class="my-0 py-0">
                        <v-text-field
                          class="mt-2"
                          style="font-size: 1.1em"
                          v-model="feature.caption"
                          prepend-icon="title"
                          :rules="validationRules.required"
                          required
                          auto-grow
                          placeholder="Feature caption"
                          label="Caption"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <!-- Displaying feature description -->
                    <v-row class="my-2 py-0">
                      <!-- description -->
                      <v-col cols="12" sm="12" md="12" class="my-0 py-0">
                        <v-textarea
                          class="mt-2"
                          style="font-size: 1.1em"
                          v-model="feature.description"
                          :rules="validationRules.required"
                          required
                          rows="2"
                          auto-grow
                          prepend-icon="article"
                          placeholder="Describe the feature"
                          label="Description"
                        >
                        </v-textarea>
                      </v-col>
                    </v-row>
                  </div>
                  <!-- Size and color -->
                  <div v-if="editContext === 'sizeColor'">
                    <!-- Displaying size option -->
                    <v-row class="pt-2 pb-0 my-0 d-flex" justify="center">
                      <v-col
                        class="text-left d-flex"
                        align="center"
                        cols="12"
                        md="12"
                        sm="12"
                      >
                        <p class="my-0 py-0">
                          Are color variants appplicable this item?
                        </p>
                        <v-spacer></v-spacer>
                        <v-switch
                          class="my-0 py-0"
                          v-model="isColorApplicable"
                          dense
                          hide-details
                          :label="isColorApplicable ? 'Yes' : 'No'"
                        >
                        </v-switch>
                      </v-col>
                    </v-row>
                    <!-- item Color -->
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          ref="colorSelect"
                          class="mt-2"
                          style="font-size: 1.1em"
                          :items="activeItem.colorOptions"
                          v-model="color"
                          required
                          prepend-icon="gradient"
                          placeholder="Select Color"
                          label="Color"
                        >
                          <template v-slot:item="{ item }">
                            <v-list-item
                              style="cursor: pointer"
                              @click="selectColor(item)"
                            >
                              <v-list-item-avatar>
                                <span
                                  class="d-inline-block circle"
                                  :style="{ backgroundColor: item }"
                                ></span>
                              </v-list-item-avatar>
                              <v-list-item-content>
                                <v-list-item-title>{{
                                  item.charAt(0).toUpperCase() + item.slice(1)
                                }}</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </template>
                        </v-select>
                      </v-col>
                    </v-row>
                    <!-- Displaying size option -->
                    <v-row class="pt-2 pb-0 my-0 d-flex" justify="center">
                      <v-col
                        class="text-left d-flex"
                        align="center"
                        cols="12"
                        md="12"
                        sm="12"
                      >
                        <p class="my-0 py-0">
                          Are size variants appplicable this item?
                        </p>
                        <v-spacer></v-spacer>
                        <v-switch
                          class="my-0 py-0"
                          v-model="isSizeApplicable"
                          dense
                          hide-details
                          :label="isSizeApplicable ? 'Yes' : 'No'"
                        >
                        </v-switch>
                      </v-col>
                    </v-row>
                    <!-- item size -->
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          class="mt-2"
                          style="font-size: 1.1em"
                          :items="sizeOptions"
                          v-model="size"
                          required
                          prepend-icon="crop_free"
                          placeholder="Select Size"
                          label="Size"
                        >
                        </v-select>
                      </v-col>
                    </v-row>
                  </div>
                  <!-- item Dimensions & weight -->
                  <div v-if="editContext === 'dimensions'">
                    <!-- Length -->
                    <v-row>
                      <v-col cols="12" sm="6" md="3">
                        <v-text-field
                          class="mt-2"
                          style="font-size: 1.1em"
                          v-model="length"
                          :rules="validationRules.required"
                          required
                          type="number"
                          prepend-icon="straighten"
                          placeholder="Enter the Length"
                          label="Length"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="3" class="text-left">
                        <p>cm</p>
                      </v-col>
                    </v-row>
                    <!-- Width -->
                    <v-row>
                      <v-col cols="12" sm="6" md="3">
                        <v-text-field
                          class="mt-2"
                          style="font-size: 1.1em"
                          v-model="width"
                          :rules="validationRules.required"
                          required
                          type="number"
                          prepend-icon="straighten"
                          placeholder="Enter the Width"
                          label="Width"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="3" class="text-left">
                        <p>cm</p>
                      </v-col>
                    </v-row>
                    <!-- Height -->
                    <v-row>
                      <v-col cols="12" sm="6" md="3">
                        <v-text-field
                          class="mt-2"
                          style="font-size: 1.1em"
                          v-model="height"
                          :rules="validationRules.required"
                          required
                          type="number"
                          prepend-icon="height"
                          placeholder="Enter the Height/Depth"
                          label="Height/Depth"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="3" class="text-left">
                        <p>cm</p>
                      </v-col>
                    </v-row>
                    <!-- Weight -->
                    <v-row>
                      <v-col cols="12" sm="6" md="3">
                        <v-text-field
                          class="mt-2"
                          style="font-size: 1.1em"
                          v-model="weight"
                          :rules="validationRules.required"
                          required
                          type="number"
                          prepend-icon="mdi-weight-kilogram"
                          placeholder="Enter the Weight"
                          label="Weight"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="3" class="text-left">
                        <p>gram</p>
                      </v-col>
                    </v-row>
                  </div>
                  <v-select
                    v-if="editContext === 'name'"
                    v-model="selectedCategory"
                    :items="categories"
                    item-text="name"
                    item-value="_id"
                    label="Category"
                    :rules="validationRules.required"
                    attach
                    offset-y
                    :menu-props="{ bottom: true, offsetY: true }"
                  ></v-select>
                  <v-select
                    v-if="editContext === 'name'"
                    v-model="selectedSubCategory"
                    :items="subCategories"
                    item-text="name"
                    item-value="name"
                    label="Sub Category"
                    :rules="validationRules.required"
                    attach
                    offset-y
                    :menu-props="{ bottom: true, offsetY: true }"
                  ></v-select>
                  <v-select
                    v-if="
                      editContext === 'name' &&
                      subtitles &&
                      subtitles.length > 0
                    "
                    v-model="selectedSubTitle"
                    :items="subtitles"
                    item-text="name"
                    item-value="name"
                    label="Sub Title"
                    :rules="validationRules.required"
                    attach
                    offset-y
                    :menu-props="{ bottom: true, offsetY: true }"
                  ></v-select>
                  <!-- Item Model dropdown removed as it should not be changeable -->
                </v-form>
              </v-container>
            </v-card-text>
            <!-- Close/cancel buttons -->
            <v-card-actions v-if="!(editContext === 'addImage')">
              <v-row justify="center" class="my-2">
                <!-- Save -->
                <v-col cols="12" md="2" sm="3" class="text-center">
                  <v-btn
                    rounded
                    small
                    :disabled="!isItemFormValid"
                    class="custom-transform-class text-none"
                    color="blue"
                    @click="saveEditItemDialog"
                  >
                    Save
                  </v-btn>
                </v-col>
                <!-- Cancel -->
                <v-col cols="12" md="2" sm="3" class="text-center">
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
    <!-- Displayig the Additional info Edit Dialog-->
    <v-row wrap class="ma-0 pa-0">
      <v-col class="text-center mx-auto my-0 py-0" align="center">
        <v-dialog
          scrollable
          content-class="curvedBorder1"
          v-model="isItemAdditionalInfoDialog"
          persistent
          max-width="1100"
        >
          <item-additional-info class="mx-auto" style="max-width: 1100px">
          </item-additional-info>
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
          <v-card class="mt-0 pt-0" elevation="0">
            <!-- item name -->
            <v-row wrap justify="center" align="center" class="ma-0 pa-0">
              <v-col cols="12" md="12" sm="12" class="text-center ma-0 pa-0">
                <v-toolbar elevation="0">
                  <v-toolbar-title class="mx-auto">
                    {{ activeItem.name }}</v-toolbar-title
                  >
                  <!-- rating -->
                  <v-rating
                    v-if="activeItem.rating.rateCount"
                    readonly
                    dense
                    small
                    half-increments
                    color="yellow darken-4"
                    :background-color="
                      appDark ? 'grey lighten-3' : 'grey darken-3'
                    "
                    empty-icon="star_outline"
                    full-icon="star"
                    half-icon="star_half"
                    length="5"
                    :value="activeItem.rating.rateAvg"
                  ></v-rating>
                  <!-- rating text-->
                  <p v-if="activeItem.rating.rateCount" class="py-0 my-0 ml-2">
                    {{ activeItem.rating.rateCount }} ratings
                  </p>
                  <!-- Edit -->
                  <v-tooltip left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="ma-2 custom-transform-class text-none"
                        medium
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="handleEditItem('name')"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </template>
                    <span>Edit item name</span>
                  </v-tooltip>
                </v-toolbar>
              </v-col>
            </v-row>
            <!-- <v-btn @click="test">Test</v-btn> -->
            <!-- Displaying item Data-->
            <div>
              <!-- Displaying Publish option -->
              <v-row class="pt-2 pb-0 my-0 mx-3 d-flex" justify="center">
                <v-col
                  class="text-left d-flex"
                  align="center"
                  cols="12"
                  md="12"
                  sm="12"
                >
                  <p class="my-0 py-0">Do you want to publish this item?</p>
                  <v-spacer></v-spacer>
                  <v-switch
                    class="my-0 py-0"
                    v-model="activeItem.published"
                    dense
                    hide-details
                    :label="activeItem.published ? 'Published' : 'Unpublished'"
                  >
                  </v-switch>
                </v-col>
              </v-row>
              <!-- Displaying disabled option -->
              <v-row
                v-if="user.masterAdmin"
                class="pt-2 pb-0 my-0 mx-3 d-flex"
                justify="center"
              >
                <v-col
                  class="text-left d-flex"
                  align="center"
                  cols="12"
                  md="12"
                  sm="12"
                >
                  <p class="my-0 py-0">Do you want to disable this item?</p>
                  <v-spacer></v-spacer>
                  <v-switch
                    class="my-0 py-0"
                    v-model="activeItem.disabled"
                    dense
                    hide-details
                    :label="activeItem.disabled ? 'Disabled' : 'Not Disabled'"
                  >
                  </v-switch>
                </v-col>
              </v-row>
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
                        @click="handleEditItem('addImage')"
                      >
                        <v-icon>add_a_photo</v-icon>
                      </v-btn>
                    </template>
                    <span>Add Item Image</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <!-- Displayting item Images -->
              <v-row
                justify="center"
                class="my-0 py-0 mx-2"
                v-if="activeItem.images.length"
              >
                <v-col class="text-right">
                  <v-carousel v-model="currentImageIndex">
                    <v-carousel-item
                      v-for="(image, index) in activeItem.images"
                      :key="'image' + index"
                      :src="image.imageUrl"
                      reverse-transition="fade-transition"
                      transition="fade-transition"
                    >
                      <!-- Make Default Image -->
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ma-2 custom-transform-class text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="setDefaultImage(index)"
                          >
                            <v-icon
                              :style="appLightBackground"
                              small
                              class="pa-0"
                              >{{
                                image.imageLink === activeItem.defaultImage
                                  ? 'star_rate'
                                  : 'star_outline'
                              }}</v-icon
                            >
                          </v-btn>
                        </template>
                        <span>{{
                          image.imageLink === activeItem.defaultImage
                            ? 'Default Image'
                            : 'Make Default Image'
                        }}</span>
                      </v-tooltip>
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
                              handleDialog({ index: index }, 'deleteItemImage')
                            "
                          >
                            <v-icon small>delete</v-icon>
                          </v-btn>
                        </template>
                        <span>Delete Image</span>
                      </v-tooltip>
                    </v-carousel-item>
                  </v-carousel>
                </v-col>
              </v-row>
              <!-- Displaying Item Data-->
              <v-card elevation="0" class="pa-0 pointerMouse">
                <v-card-text class="pt-3">
                  <!-- Displaying Original price-->
                  <v-row class="mx-0 my-0 py-0" justify="start">
                    <v-col
                      cols="12"
                      sm="11"
                      md="11"
                      class="text-left my-0 py-0"
                      align="center"
                    >
                      <p class="body-2 my-0 py-0">
                        List Price:
                        <v-icon small>{{ appCurrencyIconText }}</v-icon>
                        <!-- cad -->
                        <span
                          v-if="appCurrencyText === 'cad'"
                          style="text-decoration: line-through"
                        >
                          {{ parseFloat(activeItem.price.value).toFixed(2) }}
                        </span>
                        <!-- inr -->
                        <span
                          v-if="appCurrencyText === 'inr'"
                          style="text-decoration: line-through"
                        >
                          {{
                            parseFloat(
                              Math.trunc(
                                activeItem.price.value *
                                  (1 + activeItem.tax / 100) *
                                  100
                              ) / 100
                            ).toFixed(2)
                          }}
                        </span>
                      </p>
                    </v-col>
                    <!-- Edit  button -->
                    <v-col class="my-0 py-0 text-right" cols="12" md="1" sm="1">
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="mx-2 my-0py-0 custom-transform-class text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="handleEditItem('price')"
                          >
                            <v-icon>edit</v-icon>
                          </v-btn>
                        </template>
                        <span>Edit price / discount / tax</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <!-- Displaying Discounted price Price -->
                  <v-row class="mx-0 my-0 py-0" justify="start">
                    <v-col class="text-left my-0 py-0" align="center">
                      <p class="body-1 my-0 py-0" :style="appThemeFontColor">
                        <span class="text-h5 red--text"
                          >-{{ activeItem.discount }}%</span
                        >
                        <span class="text-h5 font-weight-medium mx-2">
                          <sup>
                            <v-icon small>{{ appCurrencyIconText }}</v-icon>
                          </sup>
                          <!-- inr -->
                          <span
                            v-if="appCurrencyText === 'inr'"
                            class="ma-0 pa-0"
                          >
                            {{
                              parseFloat(
                                Math.trunc(
                                  activeItem.price.value *
                                    (1 + activeItem.tax / 100) *
                                    (1 - activeItem.discount / 100) *
                                    100
                                ) / 100
                              ).toFixed(2)
                            }}
                          </span>
                          <!-- cad -->
                          <span
                            v-if="appCurrencyText === 'cad'"
                            class="ma-0 pa-0"
                          >
                            {{
                              parseFloat(
                                activeItem.price.value -
                                  (activeItem.price.value *
                                    activeItem.discount) /
                                    100
                              ).toFixed(2)
                            }}
                          </span>
                        </span>
                      </p>
                    </v-col>
                  </v-row>
                  <!-- Displaying You save -->
                  <v-row
                    class="mx-0 mt-0 pt-0"
                    justify="start"
                    v-if="activeItem.discount > 0"
                  >
                    <v-col class="text-left" align="center">
                      <p class="body-1 my-0 py-0" :style="appThemeFontColor">
                        You save:
                        <span class="red--text">
                          <v-icon small>{{ appCurrencyIconText }}</v-icon>
                          <!-- INR -->
                          <span v-if="appCurrencyText === 'inr'">
                            {{
                              (
                                parseFloat(
                                  activeItem.price.value *
                                    (1 + activeItem.tax / 100)
                                ).toFixed(2) -
                                parseFloat(
                                  activeItem.price.value *
                                    (1 - activeItem.discount / 100) *
                                    (1 + activeItem.tax / 100)
                                )
                              ).toFixed(2)
                            }}
                          </span>
                          <!-- CAD -->
                          <span v-if="appCurrencyText === 'cad'">
                            {{
                              (
                                parseFloat(activeItem.price.value).toFixed(2) -
                                parseFloat(
                                  activeItem.price.value *
                                    (1 - activeItem.discount / 100)
                                )
                              ).toFixed(2)
                            }}
                          </span>
                        </span>
                      </p>
                    </v-col>
                  </v-row>
                  <!-- Displaying size and color caption-->
                  <v-row class="mx-0 my-0 py-0" justify="start">
                    <v-col class="text-left" align="center">
                      <p
                        class="body-1 font-weight-medium my-0 py-0"
                        :style="appThemeFontColor"
                      >
                        Size and Color:
                      </p>
                    </v-col>
                  </v-row>
                  <!--Size and Color -->
                  <v-row class="mx-0 my-0 py-0" justify="start">
                    <v-col
                      v-if="!activeItem.size && !activeItem.color"
                      cols="10"
                      class="text-left"
                    >
                      <p>Edit size and color</p>
                    </v-col>
                    <!-- Size applicable chip -->
                    <v-col v-if="activeItem.size" cols="5" class="text-left">
                      <v-chip
                        :color="activeItem.isSizeApplicable ? 'blue' : 'grey'"
                        :class="appDark ? 'darken-4' : 'lighten-4'"
                        filter
                        >{{
                          activeItem.isSizeApplicable
                            ? 'Size variants Applicable'
                            : 'Size variants Not Applicable'
                        }}</v-chip
                      >
                    </v-col>
                    <!-- Column for Size -->
                    <v-col v-if="activeItem.size" cols="5" class="text-left">
                      <p class="body-1 font-weight-medium my-0 py-0">
                        Size: {{ activeItem.size }}
                      </p>
                    </v-col>
                    <!-- Color applicable chip -->
                    <v-col v-if="activeItem.size" cols="5" class="text-left">
                      <v-chip
                        :color="activeItem.isColorApplicable ? 'blue' : 'grey'"
                        :class="appDark ? 'darken-4' : 'lighten-4'"
                        filter
                        >{{
                          activeItem.isColorApplicable
                            ? 'Color variants Applicable'
                            : 'Color variants Not Applicable'
                        }}</v-chip
                      >
                    </v-col>
                    <!-- Column for Color -->
                    <v-col v-if="activeItem.color" cols="6" class="text-left">
                      <p class="body-1 font-weight-medium my-0 py-0">
                        Color:
                        <v-avatar size="24" class="mb-1">
                          <!-- Adjusted size for consistency -->
                          <v-sheet
                            class="d-flex justify-center align-center"
                            :class="[
                              `ma-1`,
                              `rounded-circle`,
                              `${activeItem.color}`,
                            ]"
                            style="width: 16px; height: 16px"
                          ></v-sheet>
                        </v-avatar>
                        {{
                          activeItem.color.charAt(0).toUpperCase() +
                          activeItem.color.slice(1)
                        }}
                      </p>
                    </v-col>
                    <v-spacer></v-spacer>
                    <!-- Edit  button -->
                    <v-col class="my-0 py-0 text-right" cols="1" md="1" sm="1">
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="mx-2 my-0 py-0 custom-transform-class text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="handleEditItem('sizeColor')"
                          >
                            <v-icon>edit</v-icon>
                          </v-btn>
                        </template>
                        <span>Edit Size and Color</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <!-- Displaying Description caption-->
                  <v-row class="mx-0 my-0 py-0" justify="start">
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
                  <v-row class="my-0 py-0 mx-0" justify="center">
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
                          <p style="white-space: pre-line">
                            {{ activeItem.description }}
                          </p>
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
                                class="mx-2 my-0 py-0 custom-transform-class text-none"
                                medium
                                icon
                                v-bind="attrs"
                                v-on="on"
                                @click="handleEditItem('description')"
                              >
                                <v-icon>edit</v-icon>
                              </v-btn>
                            </template>
                            <span>Edit item description</span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <!-- Displaying Features and Details caption-->
                  <v-row class="mx-0 my-0 py-0" justify="start">
                    <v-col class="text-left my-0 py-0" align="center">
                      <p
                        class="body-1 font-weight-medium my-0 py-0"
                        :style="appThemeFontColor"
                      >
                        Features & Details:
                      </p>
                    </v-col>
                  </v-row>
                  <!-- Add feature -->
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
                            @click="handleEditItem('addFeature')"
                          >
                            <v-icon>library_add</v-icon>
                          </v-btn>
                        </template>
                        <span>Add feature</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <!-- Displaying Features and Details-->
                  <v-row class="mx-0 mt-2 py-0" justify="start">
                    <v-col class="text-left my-0 py-0" align="center">
                      <div
                        v-for="(
                          savedFeature, index
                        ) in activeItem.featuresDetails"
                        :key="'detail' + index"
                      >
                        <v-row>
                          <!-- feature text -->
                          <v-col cols="10" sm="10" md="10">
                            <p
                              :style="appThemeFontColor"
                              style="white-space: pre-line"
                              class="my-0 py-0"
                            >
                              <span class="subtitle-2 font-weight-medium"
                                >{{ savedFeature.caption }}:
                              </span>
                            </p>
                            <p class="my-0 py-0" style="white-space: pre-line">
                              {{ savedFeature.description }}
                            </p>
                          </v-col>
                          <v-spacer></v-spacer>
                          <!-- Edit button -->
                          <v-col
                            class="text-right"
                            cols="11"
                            sm="1"
                            md="1"
                            align="center"
                            style="max-width: 20px"
                          >
                            <v-tooltip left>
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  class="ma-2 custom-transform-class text-none"
                                  medium
                                  icon
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="handleEditItem('editFeature', index)"
                                >
                                  <v-icon>edit</v-icon>
                                </v-btn>
                              </template>
                              <span>Edit this feature</span>
                            </v-tooltip>
                          </v-col>
                          <!-- Delete button -->
                          <v-col
                            cols="1"
                            sm="1"
                            md="1"
                            align="center"
                            class="ml-2 text-right"
                          >
                            <v-tooltip left>
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  class="ma-2 custom-transform-class text-none"
                                  medium
                                  icon
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="handleDeleteFeature(index)"
                                >
                                  <v-icon>delete</v-icon>
                                </v-btn>
                              </template>
                              <span>Delete this feature</span>
                            </v-tooltip>
                          </v-col>
                        </v-row>
                        <v-divider></v-divider>
                      </div>
                    </v-col>
                  </v-row>
                  <!-- Specs title-->
                  <v-row class="mx-0 py-0 mt-10" justify="start">
                    <v-col class="text-left py-0 py-0" align="center">
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
                    class="my-1 mx-3 py-0"
                    justify="start"
                    v-for="(spec, index) in activeItem.specs"
                    :key="'spec' + index"
                  >
                    <v-row>
                      <!-- name -->
                      <v-col
                        class="text-left mt-3 py-0"
                        align="center"
                        cols="12"
                        md="4"
                        sm="4"
                        style="max-width: 200px"
                      >
                        <p :style="appThemeFontColor" class="my-0 py-0">
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
                        class="text-left mt-3 py-0"
                        align="center"
                        cols="12"
                        md="7"
                        sm="7"
                      >
                        <!-- Spec text -->
                        <p
                          v-if="spec.specValueType === 'text'"
                          class="my-0 py-0"
                          :style="appThemeFontColor"
                        >
                          {{ spec.specText }}
                        </p>
                        <!-- value or value with unit -->
                        <p v-else class="my-0 py-0" :style="appThemeFontColor">
                          {{
                            spec.specValueType === 'value'
                              ? spec.specValue
                              : spec.specValue + ' ' + spec.specUnit
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
                        class="text-left mt-3 py-0"
                        align="center"
                        cols="12"
                        md="7"
                        sm="7"
                      >
                        <!-- options -->
                        <p
                          v-if="spec.specValueType === 'options'"
                          class="my-0 py-0"
                          :style="appThemeFontColor"
                        >
                          {{ spec.specTextSelect }}
                        </p>
                        <!-- value options or options with unit -->
                        <p v-else class="my-0 py-0" :style="appThemeFontColor">
                          {{
                            spec.specValueType === 'value options'
                              ? spec.specValueSelect
                              : spec.specValueSelect + ' ' + spec.specUnit
                          }}
                        </p>
                      </v-col>
                      <!-- Edit spec -->
                      <v-col
                        v-if="activeItem.specs.length"
                        cols="1"
                        md="1"
                        sm="1"
                        class="my-0 py-0 text-right"
                      >
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              class="mx-2 my-2 custom-transform-class text-none"
                              medium
                              icon
                              v-bind="attrs"
                              v-on="on"
                              @click="handleEditItem('editSpec', index)"
                            >
                              <v-icon>edit</v-icon>
                            </v-btn>
                          </template>
                          <span>Edit Spec</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                    <hr />
                  </div>
                  <!-- Displaying SKU -->
                  <v-row
                    v-if="activeItem.sku"
                    class="py-0 mt-5 mx-0"
                    justify="center"
                  >
                    <!-- text -->
                    <v-col
                      class="text-left"
                      align="center"
                      cols="12"
                      md="12"
                      sm="12"
                    >
                      <p class="appFont1" :style="appThemeFontColor">
                        SKU: {{ activeItem.sku }}
                      </p>
                    </v-col>
                  </v-row>
                  <!-- Displaying Category -->
                  <v-row class="py-0 mt-10 mx-0" justify="center">
                    <!-- text -->
                    <v-col
                      class="text-left my-0 py-0"
                      align="center"
                      cols="12"
                      md="12"
                      sm="12"
                    >
                      <p class="appFont1" :style="appThemeFontColor">
                        Category of the item: {{ activeItem.category }}
                      </p>
                    </v-col>
                  </v-row>
                  <!-- Displaying Stock -->
                  <v-row class="mt-5 py-0 mx-0" justify="start">
                    <!-- value -->
                    <v-col
                      class="text-left my-0 py-0"
                      align="center"
                      cols="12"
                      md="11"
                      sm="11"
                    >
                      <p class="appFont1" :style="appThemeFontColor">
                        Stock:
                        <span class="font-weight-bold">{{
                          typeof activeItem.stock === 'object' &&
                          activeItem.stock !== null
                            ? activeItem.stock.quantity
                            : activeItem.stock
                        }}</span>
                      </p>
                    </v-col>
                    <!-- Edit  button -->
                    <v-col
                      class="mt-n2 py-0 text-right"
                      cols="12"
                      md="1"
                      sm="1"
                    >
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="mx-2 my-0 custom-transform-class text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="handleEditItem('stock')"
                          >
                            <v-icon>edit</v-icon>
                          </v-btn>
                        </template>
                        <span>Update stock</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <!-- Displaying Max Order Quantity -->
                  <v-row class="mt-5 py-0 mx-0" justify="start">
                    <!-- value -->
                    <v-col
                      class="text-left my-0 py-0"
                      align="center"
                      cols="12"
                      md="11"
                      sm="11"
                    >
                      <p class="appFont1" :style="appThemeFontColor">
                        Maximum Order Quantity:
                        <span class="font-weight-bold">{{
                          activeItem.maximumOrderQuantity
                        }}</span>
                      </p>
                    </v-col>
                    <!-- Edit  button -->
                    <v-col
                      class="mt-n2 py-0 text-right"
                      cols="12"
                      md="1"
                      sm="1"
                    >
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="mx-2 my-0 custom-transform-class text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="handleEditItem('maximumOrderQuantity')"
                          >
                            <v-icon>edit</v-icon>
                          </v-btn>
                        </template>
                        <span>Update Maximum Order Quantity</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <!-- Displaying Dimensions and Weight caption -->
                  <v-row class="mx-0 my-0 py-0" justify="start">
                    <v-col class="text-left" align="center">
                      <p
                        class="body-1 font-weight-medium my-0 py-0"
                        :style="appThemeFontColor"
                      >
                        Dimensions and Weight:
                      </p>
                    </v-col>
                    <!-- Edit button for Dimensions and Weight -->
                    <v-col class="my-0 py-0 text-right" cols="12" md="1" sm="1">
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="mx-2 my-0 py-0 custom-transform-class text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="handleEditItem('dimensions')"
                          >
                            <v-icon>edit</v-icon>
                          </v-btn>
                        </template>
                        <span>Edit Dimensions and Weight</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <!-- Displaying Dimensions and Weight card -->
                  <v-row class="my-0 py-0 mx-0" justify="center">
                    <v-col
                      class="text-left py-0 my-0"
                      align="center"
                      cols="12"
                      md="12"
                      sm="12"
                    >
                      <!-- Displaying Length -->
                      <v-row class="my-1 py-0">
                        <v-col class="my-0 py-0" cols="11" md="11" sm="11">
                          <p>Length: {{ activeItem.length }} cm</p>
                        </v-col>
                      </v-row>
                      <!-- Displaying Width -->
                      <v-row class="my-1 py-0">
                        <v-col class="my-0 py-0" cols="11" md="11" sm="11">
                          <p>Width: {{ activeItem.width }} cm</p>
                        </v-col>
                      </v-row>
                      <!-- Displaying Height -->
                      <v-row class="my-1 py-0">
                        <v-col class="my-0 py-0" cols="11" md="11" sm="11">
                          <p>Height: {{ activeItem.height }} cm</p>
                        </v-col>
                      </v-row>
                      <!-- Displaying Weight -->
                      <v-row class="my-1 py-0">
                        <v-col class="my-0 py-0" cols="11" md="11" sm="11">
                          <p>Weight: {{ activeItem.weight }} gram</p>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <!-- Displaying Additioal Info -->
                  <v-row class="pt-2 pb-0 my-0" justify="center">
                    <v-col
                      class="text-left"
                      align="center"
                      cols="12"
                      md="12"
                      sm="12"
                    >
                      <v-card class="my-0 py-0" elevation="0">
                        <v-card-text class="my-0 py-2">
                          <!-- Edit additionl info button -->
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
                                    @click="handleEditItemAdditionalInfo"
                                  >
                                    <v-icon>edit</v-icon>
                                  </v-btn>
                                </template>
                                <span>Edit Item Additional Info</span>
                              </v-tooltip>
                            </v-col>
                          </v-row>
                          <span
                            v-html="itemAdditionalInfo"
                            class="appFont1 v-html__margin"
                          ></span>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  <!-- Customer Questions -->
                  <div v-if="activeItem.customerQuestions.length">
                    <!-- Displaying Customer Questions caption-->
                    <v-row class="mx-0 my-0 py-0" justify="start">
                      <v-col class="text-left my-0 py-0" align="center">
                        <p
                          class="body-1 font-weight-medium my-0 py-0"
                          :style="appThemeFontColor"
                        >
                          Customer Questions & Answers:
                        </p>
                      </v-col>
                    </v-row>
                    <!-- Displaying Questions and Answers-->
                    <v-row class="mx-0" justify="start">
                      <v-col class="text-left" align="center">
                        <div
                          v-for="(qnAns, index) in activeItem.customerQuestions"
                          :key="'detail' + index"
                        >
                          <v-row>
                            <v-col cols="12" sm="12" md="12">
                              <v-card>
                                <v-card-text :style="appThemeFontColor">
                                  <v-list-item-title
                                    >Question:
                                    {{ qnAns.question }}</v-list-item-title
                                  >
                                  <p>Answer: {{ qnAns.answer }}</p>
                                </v-card-text>
                              </v-card>
                            </v-col>
                          </v-row>
                          <v-divider></v-divider>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                  <!-- Customer Rating SUmmary-->
                  <v-row
                    v-if="activeItem.rating.ratings.length"
                    class="mx-0 my-0 py-0"
                    justify="start"
                  >
                    <!-- rating -->
                    <v-col
                      class="text-left mt-2 py-0"
                      align="center"
                      cols="12"
                      md="2"
                      sm="3"
                      style="max-width: 110px"
                    >
                      <v-rating
                        readonly
                        dense
                        small
                        half-increments
                        color="yellow darken-4"
                        :background-color="
                          appDark ? 'grey lighten-3' : 'grey darken-3'
                        "
                        empty-icon="star_outline"
                        full-icon="star"
                        half-icon="star_half"
                        length="5"
                        :value="activeItem.rating.rateAvg"
                      ></v-rating>
                    </v-col>
                    <!-- rating text-->
                    <v-col
                      class="text-left mt-2 py-0"
                      align="center"
                      cols="12"
                      md="6"
                      sm="6"
                    >
                      <p>
                        {{ activeItem.rating.rateAvg.toFixed(1) }} out of 5 ({{
                          activeItem.rating.rateCount
                        }}
                        ratings)
                      </p>
                    </v-col>
                  </v-row>
                  <!-- Customer Individual Rating -->
                  <v-row
                    v-if="activeItem.rating.ratings.length"
                    v-for="(rating, index) in getRatingArray(activeItem.rating)"
                    :key="'rating' + index"
                    class="mx-0 my-0 py-0"
                    justify="start"
                  >
                    <!-- rating -->
                    <v-col
                      class="text-left my-0 py-0"
                      align="center"
                      cols="12"
                      md="2"
                      sm="3"
                      style="max-width: 70px"
                    >
                      <p class="my-0 py-0" :style="appThemeFontColor">
                        {{ 5 - index }} Star
                      </p>
                    </v-col>
                    <!--  rating progress bar-->
                    <v-col
                      class="text-left mt-2 py-0 mx-0 px-0"
                      align="center"
                      cols="12"
                      md="4"
                      sm="6"
                      style="max-width: 300px"
                    >
                      <v-progress-linear
                        color="amber darken-4"
                        :background-color="
                          appDark ? 'grey darken-3' : 'grey lighten-1'
                        "
                        :value="(rating / activeItem.rating.rateCount) * 100"
                        height="10"
                      ></v-progress-linear>
                    </v-col>
                    <v-col
                      class="text-left my-0 py-0"
                      align="center"
                      cols="12"
                      md="1"
                      sm="2"
                    >
                      <p class="my-0 py-0" :style="appThemeFontColor">
                        {{
                          Math.round(
                            (rating / activeItem.rating.rateCount) * 100
                          )
                        }}
                        %
                      </p>
                    </v-col>
                  </v-row>
                  <!-- Add tags -->
                  <v-row class="mt-5 py-0 mx-0" justify="start">
                    <v-col
                      cols="12"
                      md="11"
                      sm="11"
                      class="my-0 py-0 text-left"
                    >
                      <!-- Chip for tag -->
                      <v-chip
                        dense
                        small
                        v-for="(tag, index) in activeItem.tags"
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
                      class="text-right my-0 py-0"
                    >
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="mx-2 my-0 py-0 custom-transform-class text-none"
                            medium
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="handleEditItem('tags')"
                          >
                            <v-icon>sell</v-icon>
                          </v-btn>
                        </template>
                        <span>Add or Edit Tags</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <!-- Submit button -->
                  <v-row justify="center" class="mt-5">
                    <v-col class="text-right">
                      <v-btn
                        class="primary darken-4 font-weight-bold"
                        raised
                        small
                        @click="handleItem"
                      >
                        {{ itemMode === 'create' ? 'Create' : 'Update' }}
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
          <!-- Displaying The  Spinner while loading database from Firebase-->
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
// Importing required modules
import moment from 'moment';
import { mapGetters } from 'vuex';
export default {
  name: 'itemCreator',
  data() {
    return {
      selectedCategory: null,
      selectedSubCategory: null,
      selectedItemModel: null,
      selectedSubTitle: null,
      progress: null,
      editContext: '',
      name: '',
      description: '',
      category: '',
      tags: [],
      color: '',
      size: 'small',
      isSizeApplicable: false,
      isColorApplicable: false,
      length: null,
      width: null,
      height: null,
      weight: null,
      price: {
        value: null,
        currency: process.env.VUE_APP_CURRENCY,
      },
      listPrice: null,
      finalPrice: null,
      stock: null,
      maximumOrderQuantity: null,
      discount: null,
      tax: null,
      editItemDialog: false,
      editItemDialogHeading: '',
      specTypes: ['value', 'value with unit', 'options', 'options with unit'],
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
      specTextOptions: [],
      feature: {
        caption: '',
        description: '',
      },
      activeFeatureIndex: null,
      activeSpecType: 'value',
      activeSpec: {
        specName: '',
        specDescription: '',
        specValueType: 'value',
        specValue: null,
        specText: '',
        specValueOptions: [],
        specTextOptions: [],
        specUnit: '',
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
      itemImageFormData: null,
      isItemFormValid: false,
    };
  },
  computed: {
    ...mapGetters([
      'user',
      'error',
      'errorStatus',
      'loading',
      'appCurrency',
      'appCurrencyText',
      'appCurrencyIconText',
      'appDark',
      'appLightBackground',
      'appThemeFontColor',
      'validationRules',
      'itemAdditionalInfo',
      'itemMode',
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
      'items',
      'itemDataReceived',
      'unitMatrices',
      'sizeOptions',
      'itemModels',
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
    activeItem: {
      get() {
        return this.$store.getters.activeItem;
      },
      set(value) {
        this.$store.commit('setActiveItem', value);
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
    isItemAdditionalInfoDialog: {
      get() {
        return this.$store.getters.isItemAdditionalInfoDialog;
      },
      set(value) {
        this.$store.commit('setIsItemAdditionalInfoDialog', value);
      },
    },
    categories() {
      // itemCategories is defined in the bom object of Vuex store getters
      return this.$store.getters.itemCategories || [];
    },
    subCategories() {
      // Find the selected category object
      const allCategories = this.$store.getters.itemCategories || [];
      const selectedCategoryObj = allCategories.find(
        (cat) => cat._id === this.selectedCategory
      );

      // Return the subcategories of the selected category
      return selectedCategoryObj ? selectedCategoryObj.subCategories || [] : [];
    },
    subtitles() {
      // Find the selected subcategory
      const selectedSubCat = this.subCategories.find(
        (subCat) => subCat.name === this.selectedSubCategory
      );

      // Return the subtitles of the selected subcategory
      return selectedSubCat ? selectedSubCat.subTitles || [] : [];
    },
    models() {
      // itemModels is defined in the bom object of Vuex store getters
      return this.$store.getters.itemModels || [];
    },
  },
  created() {
    // console.log('this.activeItem:', this.activeItem);
    // fetch("https://api.ipregistry.co/?key=tryout")
    //   .then(function (response) {
    //     return response.json();
    //   })
    //   .then(function (payload) {
    //     // console.log(
    //       payload.location.country.name + ", " + payload.location.city
    //     );
    //   });
  },
  mounted() {
    this.$nextTick(function () {
      this.progressing = false;
    });
  },
  watch: {
    editItemDialog() {
      this.$nextTick(() => {
        this.$refs.saveItemForm.resetValidation();
      });
    },
    selectedCategory() {
      // Reset subcategory and subtitle when category changes
      this.selectedSubCategory = null;
      this.selectedSubTitle = null;
      this.selectedItemModel = null;
    },
    selectedSubCategory() {
      // Reset subtitle when subcategory changes
      this.selectedSubTitle = null;
    },
  },
  methods: {
    onDismissed() {
      this.$store.dispatch('clearError');
    },
    test() {
      // console.log('item:', this.activeItem);
    },
    clearDialog(result) {
      this.dialogResult = result;
      if (result === 'yes') {
        if (this.dialogContext === 'deleteItemImage') {
          this.removeItemImage(this.activeImageIndex);
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
        case 'deleteItemImage':
          this.dialogContext = 'deleteItemImage';
          this.activeImageIndex = content.index;
          break;
        case 'unusedImage':
          this.dialogContext = 'unusedImage';
          break;
        case 'insufficientData':
          this.dialogContext = 'insufficientData';
          break;

        default:
          break;
      }
      // performing action
      switch (this.dialogContext) {
        case 'deleteItemImage':
          this.dialogHeading = 'Confirm Deleting Item Image';
          this.dialogText =
            'Are you sure you want to delete this image? This will remove the imnage from the database and cannot be undone.';
          this.dialogBtn1 = 'Cancel';
          this.dialogBtn2 = 'Yes';
          this.isDialog = true;
          break;

        case 'unusedImage':
          this.dialogHeading = 'Unused images in this reosurce';
          this.dialogText =
            'Consider deleting the newly uploaded image(s) for this Item';
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
    uploadFile(file) {
      // console.log('file:', file);
      let formData = new FormData();
      formData.append('image', file.file);
      this.activeItem.images[this.activeItem.images.length - 1].image = file;
      this.activeItem.images[this.activeItem.images.length - 1].formData =
        formData;
    },
    onFilePicked(event) {
      const files = event.target.files;
      let filename = files[0].name;
      this.activeItem.images[this.activeItem.images.length - 1].imageName =
        filename;
      if (filename.lastIndexOf('.') <= 0) {
        return alert('Please choose a valid file!');
      }
      const fileReader = new FileReader();
      fileReader.addEventListener(
        'load',
        () => {
          if (fileReader.result) {
            this.activeItem.images[this.activeItem.images.length - 1].imageURL =
              fileReader.result;
          }
        },
        false
      );
      fileReader.readAsDataURL(files[0]);
      this.activeItem.images[this.activeItem.images.length - 1].image =
        files[0];
    },
    async uploadItemImage() {
      // console.log('this will upload item');
      // uploading item Image to server
      let imageData;
      // GraphQl API
      // imageURL = await this.$store.dispatch("uploadItemImage", {
      //   image:
      //     this.activeItem.images[this.activeItem.images.length - 1].image.file,
      // });
      // REST API
      imageData = await this.$store.dispatch('uploadItemImage2', {
        image:
          this.activeItem.images[this.activeItem.images.length - 1].formData,
      });

      if (imageData.path) {
        this.activeItem.images[this.activeItem.images.length - 1].imageLink =
          imageData.path;
        this.activeItem.images[this.activeItem.images.length - 1].imageUrl =
          imageData.path;
        this.activeItem.images[this.activeItem.images.length - 1].filename =
          imageData.filename;
        this.activeItem.images[
          this.activeItem.images.length - 1
        ].newImage = true;
        delete this.activeItem.images[this.activeItem.images.length - 1].image;
      }
      // console.log(
      //   ' this.activeItem.images[this.activeItem.images.length - 1]:',
      //   this.activeItem.images[this.activeItem.images.length - 1]
      // );
      this.currentImageIndex = this.activeItem.images.length - 1;
      this.editItemDialog = false;
      this.clearEditItemDialog();
    },
    async removeItemImage(index) {
      let payload;
      // WHile creating item
      if (this.itemMode === 'create') {
        payload = {
          itemId: null,
          imageFilenameInput: this.activeItem.images[index].filename,
        };
      }
      // WHile updating item
      else {
        payload = {
          itemId: this.activeItem._id,
          imageFilenameInput: this.activeItem.images[index].filename,
        };
      }
      // console.log('payload:', payload);
      // performing backend operation
      try {
        await this.$store.dispatch('deleteItemImage', payload);
      } catch (error) {
        // console.log(error);
        return;
      }
      // }
      // updating local data
      this.activeItem.images.splice(index, 1);
    },
    async handleItem() {
      // alert("this will create a item");
      const defaultImage =
        !this.activeItem.defaultImage && this.activeItem.images.length
          ? this.activeItem.images[0].imageLink
          : this.activeItem.defaultImage;
      let images = [];

      if (this.activeItem.images.length) {
        this.activeItem.images.forEach((image) => {
          images.push({
            imageLink: image.imageLink,
            filename: image.filename,
            imageRequired: image.imageRequired,
          });
        });
      }
      let payload;
      // creating item
      if (this.itemMode === 'create') {
        // Extract stock quantity as an integer value for the GraphQL API
        const stockQuantity =
          typeof this.activeItem.stock === 'object' &&
          this.activeItem.stock !== null
            ? parseInt(this.activeItem.stock.quantity) || 0
            : parseInt(this.activeItem.stock) || 0;

        payload = {
          itemInput: {
            name: this.activeItem.name,
            description: this.activeItem.description,
            category: this.activeItem.category,
            additionalInfo: this.itemAdditionalInfo,
            price: this.activeItem.price,
            tax: this.activeItem.tax,
            maximumOrderQuantity: this.activeItem.maximumOrderQuantity
              ? this.activeItem.maximumOrderQuantity
              : 5,
            discount: this.activeItem.discount,
            stock: stockQuantity,
            model: this.activeItem.model,
            images: images,
            specs: this.sanitizeSpecs(),
            tags: this.activeItem.tags,
            defaultImage: defaultImage,
            featuresDetails: this.activeItem.featuresDetails,
            supplier: '620f96bd0ad52eedcf97a9f3',
            length: this.activeItem.length,
            width: this.activeItem.width,
            height: this.activeItem.height,
            weight: this.activeItem.weight,
            size: this.activeItem.size,
            color: this.activeItem.color,
            isSizeApplicable: this.activeItem.isSizeApplicable,
            isColorApplicable: this.activeItem.isColorApplicable,
            published: this.activeItem.published,
            disabled: this.activeItem.disabled,
          },
        };
      }

      // Updating item
      else {
        // Extract stock quantity as an integer value for the GraphQL API
        const stockQuantity =
          typeof this.activeItem.stock === 'object' &&
          this.activeItem.stock !== null
            ? parseInt(this.activeItem.stock.quantity) || 0
            : parseInt(this.activeItem.stock) || 0;

        payload = {
          itemId: this.activeItem._id,
          itemInput: {
            name: this.activeItem.name,
            description: this.activeItem.description,
            category: this.activeItem.category,
            additionalInfo: this.itemAdditionalInfo,
            price: this.activeItem.price,
            tax: this.activeItem.tax,
            discount: this.activeItem.discount,
            stock: stockQuantity,
            maximumOrderQuantity: this.activeItem.maximumOrderQuantity,
            model: this.activeItem.model,
            images: images,
            specs: this.sanitizeSpecs(),
            tags: this.activeItem.tags,
            defaultImage: defaultImage,
            featuresDetails: this.activeItem.featuresDetails,
            supplier: this.activeItem.supplier,
            length: this.activeItem.length,
            width: this.activeItem.width,
            height: this.activeItem.height,
            weight: this.activeItem.weight,
            size: this.activeItem.size,
            color: this.activeItem.color,
            isSizeApplicable: this.activeItem.isSizeApplicable,
            isColorApplicable: this.activeItem.isColorApplicable,
            published: this.activeItem.published,
            disabled: this.activeItem.disabled,
          },
        };
      }
      // console.log('item payload:', payload);
      // return;
      let result;
      //Adding new item
      if (this.itemMode === 'create') {
        result = await this.$store.dispatch('addItem', payload);
        // Adding new item to store
        if (result) {
          this.items.push(result);
        }
        //  Routing to the item view page
        this.$router.push(`/items/${result.routeParam}`);
      }
      // updating new item
      else {
        // console.log('items:', this.items);
        const currentItem = this.items.find(
          (item) => item._id === this.activeItem._id
        );
        const activeIndex = this.items.indexOf(currentItem);
        // console.log('active res index:', activeIndex);
        // console.log('update payload:', payload);
        // return;
        result = await this.$store.dispatch('updateItem', payload);
        // console.log('response minimal:', result);
        if (result) {
          this.items.splice(activeIndex, 1, result);
          //  Routing to the item view page
          setTimeout(() => {
            this.$router.push(`/items/${result.routeParam}`);
          }, 500); // Adjust the delay as needed
          // this.$router.push(`/items/${result.routeParam}`);
        }
      }
      // resetting cloneFlag
      if (this.cloneFlag) this.cloneFlag = false;
    },
    navigateBack() {
      // checck if any new images were uploaded
      for (let index = 0; index < this.activeItem.images.length; index++) {
        const el = this.activeItem.images[index];
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
      this.activeSpec.specUnit = this.specUnitOptions[0];
    },
    // Editing Item
    handleEditItem(context, index) {
      this.editContext = context;
      switch (context) {
        case 'name':
          this.editItemDialogHeading = 'Edit Name of Item';
          this.name = this.activeItem.name;
          // Set category, subcategory and subtitle values from active item
          this.selectedCategory = this.activeItem.catId;
          this.selectedSubCategory = this.activeItem.subCategory;
          if (this.activeItem.group) {
            this.selectedSubTitle = this.activeItem.group;
          }
          break;

        case 'description':
          this.editItemDialogHeading = 'Edit Description of Item';
          this.description = this.activeItem.description;
          break;

        case 'tags':
          this.editItemDialogHeading = 'Edit Tags of Item';
          this.tags = this.activeItem.tags;
          break;

        case 'stock':
          this.editItemDialogHeading = 'Update Stock of Item';
          // Handle updating stock based on current structure
          const parsedStock = parseInt(this.stock);
          if (
            typeof this.activeItem.stock === 'object' &&
            this.activeItem.stock !== null
          ) {
            // Update quantity property if stock is an object
            this.activeItem.stock.quantity = parsedStock;

            // Update related properties
            this.activeItem.stock.outOfStock = parsedStock <= 3;
            this.activeItem.stock.runningLow =
              parsedStock < this.activeItem.maximumOrderQuantity * 2 &&
              parsedStock > 3;
          } else {
            // Replace direct value if stock is a primitive
            this.activeItem.stock = parsedStock;
          }
          break;
        case 'maximumOrderQuantity':
          this.editItemDialogHeading = 'Update Maximum Order Quantity of Item';
          this.maximumOrderQuantity = this.activeItem.maximumOrderQuantity;
          break;

        case 'price':
          this.editItemDialogHeading = 'Edit Price / Discount / Tax';
          this.price = { ...this.activeItem.price };
          this.discount = this.activeItem.discount;
          this.tax = this.activeItem.tax;
          this.setFinalPrice();
          break;

        case 'addFeature':
          this.editItemDialogHeading = 'Add Feature';
          break;

        case 'editFeature':
          this.activeFeatureIndex = index;
          this.editItemDialogHeading = 'Edit Feature';
          this.feature = {
            ...this.activeItem.featuresDetails[this.activeFeatureIndex],
          };
          break;

        case 'addImage':
          // Checking if there are more than or equal to 5 images
          if (this.activeItem.images.length >= 5) {
            alert('Maximum number of images (5) exceeded!');
            return;
          }
          this.editItemDialogHeading = 'Add new image';
          this.activeItem.images.push({
            image: null,
            imageUrl: '',
            imageRequired: true,
            imageLink: '',
            filename: '',
          });
          break;

        case 'editSpec':
          this.editItemDialogHeading = 'Edit spec';
          this.activeSpecIndex = index;
          this.activeSpec = { ...this.activeItem.specs[index] };
          let found = false;
          const activeUnit = this.activeSpec.specUnit;
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
                  this.activeSpec.specUnit = activeUnit;
                  found = true;
                  break;
                }
              }
              if (found) break;
            }
          }
          break;
        case 'dimensions':
          this.editItemDialogHeading = 'Update Dimensions and weight';
          this.length = this.activeItem.length;
          this.width = this.activeItem.width;
          this.height = this.activeItem.height;
          this.weight = this.activeItem.weight;
          break;
        case 'sizeColor':
          this.editItemDialogHeading = 'Update Size and Color of Item';
          this.size = this.activeItem.size;
          this.color = this.activeItem.color;
          this.isSizeApplicable = this.activeItem.isSizeApplicable;
          this.isColorApplicable = this.activeItem.isColorApplicable;
          break;
        default:
          break;
      }
      // opening Dialog
      this.editItemDialog = true;
    },
    // Saving data from Edit dialog
    saveEditItemDialog() {
      if (this.$refs.saveItemForm.validate()) {
        switch (this.editContext) {
          case 'name':
            this.activeItem.name = this.name;
            // Save category, subcategory and subtitle values
            this.activeItem.catId = this.selectedCategory;
            this.activeItem.subCategory = this.selectedSubCategory;
            if (this.selectedSubTitle) {
              this.activeItem.group = this.selectedSubTitle;
            }
            break;

          case 'description':
            this.activeItem.description = this.description;
            break;

          case 'tags':
            this.activeItem.tags = this.tags;
            break;

          case 'stock':
            // Handle updating stock based on current structure
            const parsedStock = parseInt(this.stock);
            if (
              typeof this.activeItem.stock === 'object' &&
              this.activeItem.stock !== null
            ) {
              // Update quantity property if stock is an object
              this.activeItem.stock.quantity = parsedStock;

              // Update related properties
              this.activeItem.stock.outOfStock = parsedStock <= 3;
              this.activeItem.stock.runningLow =
                parsedStock < this.activeItem.maximumOrderQuantity * 2 &&
                parsedStock > 3;
            } else {
              // Replace direct value if stock is a primitive
              this.activeItem.stock = parsedStock;
            }
            break;

          case 'maximumOrderQuantity':
            this.activeItem.maximumOrderQuantity = parseInt(
              this.maximumOrderQuantity
            );
            break;

          case 'price':
            this.price.value = parseFloat(this.price.value);
            this.activeItem.price = this.price;
            this.activeItem.discount = parseFloat(this.discount);
            this.activeItem.tax = parseFloat(this.tax);
            break;

          case 'addFeature':
            // console.log('Reacahed');
            // console.log();
            this.activeItem.featuresDetails.push(this.feature);
            break;

          case 'editFeature':
            this.activeItem.featuresDetails[this.activeFeatureIndex] = {
              ...this.feature,
            };
            break;

          case 'addImage':
            this.editItemDialogHeading = 'Add new image';
            break;

          case 'editSpec':
            this.editItemDialogHeading = 'Edit Spec';
            this.activeItem.specs[this.activeSpecIndex] = this.activeSpec;
            break;

          case 'sizeColor':
            console.log();
            this.activeItem.isSizeApplicable = this.isSizeApplicable;
            this.activeItem.isColorApplicable = this.isColorApplicable;
            this.activeItem.color = this.color;
            this.activeItem.size = this.size;
            break;

          case 'dimensions':
            this.activeItem.length = parseFloat(this.length);
            this.activeItem.width = parseFloat(this.width);
            this.activeItem.height = parseFloat(this.height);
            this.activeItem.weight = parseFloat(this.weight);
            break;
        }
        // Clearing dialog
        this.clearEditItemDialog();
      } else {
        this.handleDialog(null, 'insufficientData');
      }
    },
    clearEditItemDialog() {
      this.editItemDialog = false;
      this.editItemDialogHeading = '';
      // If image upload operation canceled
      if (
        this.editContext === 'addImage' &&
        !this.activeItem.images[this.activeItem.images.length - 1].imageLink
      ) {
        this.activeItem.images.pop();
      }
      this.activeSpec = {
        specName: '',
        specDescription: '',
        specValueType: 'value',
        specValue: null,
        specValueSelect: null,
        specTextSelect: '',
        specText: '',
        specUnit: '',
        specValueOptions: [],
        specTextOptions: [],
      };
      this.feature = {
        caption: '',
        description: '',
      };
      this.price = {
        value: null,
        currency: process.env.VUE_APP_CURRENCY,
      };
      this.tax = null;
      this.discopunt = null;
      this.finalPrice = null;
      this.listPrice = null;
      this.specValueOptions = [];
      this.specTextOptions = [];
      this.activeIndex = null;
      this.editContext = '';
      this.name = '';
      this.stock = null;
      this.maximumOrderQuantity = null;
      this.description = '';
      this.category = '';
      this.tags = [];
      this.color = '';
      isSizeApplicable: false;
      isColorApplicable: false;
      this.size = 'small';
      this.length = null;
      this.width = null;
      this.height = null;
      this.weight = null;
    },
    handleAddFeature() {
      alert('This adds new feature');
    },
    handleDeleteFeature() {
      alert('This deletes a feature');
    },
    getRatingArray(rating) {
      return [
        rating.rateCount5,
        rating.rateCount4,
        rating.rateCount3,
        rating.rateCount2,
        rating.rateCount1,
      ];
    },
    // Converting time stamp to preferred format
    convertTimestamp(date) {
      return moment(date).format('MMM DD, YYYY');
    },
    setPriceComponents(finalPrice) {
      switch (this.appCurrencyText) {
        case 'cad':
          // this.price.value = parseFloat(
          //   finalPrice / (1 - this.discount / 100)
          // ).toFixed(2);

          this.discount = parseFloat(
            ((this.price.value - finalPrice) / this.price.value) * 100
          ).toFixed(2);
          this.listPrice = parseFloat(this.price.value).toFixed(2);
          break;
        case 'inr':
          // this.price.value = parseFloat(
          //   finalPrice / ((1 + this.tax / 100) * (1 - this.discount / 100))
          // ).toFixed(2);
          this.discount = parseFloat(
            ((this.price.value * (1 + this.tax / 100) - finalPrice) /
              (this.price.value * (1 + this.tax / 100))) *
              100
          ).toFixed(2);

          this.listPrice = parseFloat(
            this.price.value * (1 + this.tax / 100)
          ).toFixed(2);
          break;
        default:
          break;
      }
    },
    setFinalPrice() {
      switch (this.appCurrencyText) {
        case 'cad':
          this.listPrice = parseFloat(this.price.value).toFixed(2);
          this.finalPrice = parseFloat(
            this.price.value * (1 - this.discount / 100)
          ).toFixed(2);
          break;
        case 'inr':
          this.listPrice = parseFloat(
            this.price.value * (1 + this.tax / 100)
          ).toFixed(2);
          this.finalPrice = parseFloat(
            this.price.value *
              ((1 + this.tax / 100) * (1 - this.discount / 100))
          ).toFixed(2);
          break;
        default:
          break;
      }
    },
    setbyListPrice(listPrice) {
      switch (this.appCurrencyText) {
        case 'cad':
          this.price.value = parseFloat(this.listPrice).toFixed(2);
          this.finalPrice = parseFloat(
            this.price.value * (1 - this.discount / 100)
          ).toFixed(2);
          break;
        case 'inr':
          this.price.value = parseFloat(
            this.listPrice / (1 + this.tax / 100)
          ).toFixed(2);
          this.finalPrice = parseFloat(
            this.price.value *
              ((1 + this.tax / 100) * (1 - this.discount / 100))
          ).toFixed(2);
          break;
        default:
          break;
      }
    },
    setDefaultImage(index) {
      this.activeItem.defaultImage = this.activeItem.images[index].imageLink;
      const tempImageLink = this.activeItem.images[0].imageLink;
      const tempImageUrl = this.activeItem.images[0].imageUrl;
      this.activeItem.images[0].imageUrl =
        this.activeItem.images[index].imageUrl;
      this.activeItem.images[0].imageLink =
        this.activeItem.images[index].imageLink;
      this.activeItem.images[index].imageUrl = tempImageUrl;
      this.activeItem.images[index].imageLink = tempImageLink;
      this.currentImageIndex = 0;
      this.snackBarText = 'Default Image changed';
      this.$store.commit('setTargetRequired', false);
      this.$store.commit('setSnackBar', true);
    },
    handleAddReview() {
      alert('This will create a review');
    },
    sanitizeSpecs() {
      return this.activeItem.specs.map((spec) => {
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
        };
      });
    },
    // Edit item additional info
    handleEditItemAdditionalInfo() {
      // alert("This will modify Intro of resource!");
      // Setting rich text editor data
      this.$store.commit('setEditorData', this.itemAdditionalInfo);
      this.isItemAdditionalInfoDialog = true;
    },
    selectColor(item) {
      this.color = item; // Update the model with the selected item
      this.$nextTick(() => {
        this.$refs.colorSelect.blur(); // Programmatically blur the select to close the dropdown
      });
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
