<template>
  <v-container fluid class="mx-auto my-0 py-0">
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
          content-class="display__item-image"
          v-model="isExpandedImageDialog"
        >
          <v-card class="ma-0 pa-0">
            <v-card-text class="ma-0 pa-0">
              <v-carousel v-model="itemCarouselIndex" height="auto">
                <v-carousel-item
                  v-for="(image, index) in activeItem.images"
                  :key="'image' + index"
                  :src="image.imageUrl"
                >
                  <v-card-title>
                    <v-btn
                      class="ml-n6 mt-n6 floating-left-top-btn white"
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
    <!-- Dialog for Add/Update review -->
    <v-row class="my-0 py-0">
      <v-col class="my-0 py-0">
        <v-dialog
          v-model="itemReviewDialog"
          persistent
          scrollable
          max-width="800px"
        >
          <v-card max-width="800" max-height="800" style="overflow: hidden">
            <v-card-title
              class="font-weight-bold"
              :class="appDark ? 'cyan darken-4' : 'light-blue lighten-3'"
            >
              Write a Review
            </v-card-title>
            <!-- Review Data -->
            <v-card-text
              style="max-height: 800px"
              class="justify__text mx-0 py-0 px-0 py-0"
            >
              <!-- container -->
              <v-container class="mx-0 py-0 px-0 py-0">
                <v-form
                  v-model="isItemReviewFormValid"
                  lazy-validation
                  ref="itemReviewForm"
                  class="py-5 mx-5"
                >
                  <!-- Rating Caption -->
                  <v-row class="my-0 py-0" justify="start">
                    <v-col class="my-0 py-0 text-left" align="center">
                      <p
                        class="body-1 font-weight-medium"
                        :style="appThemeFontColor"
                      >
                        Overall Rating
                      </p>
                    </v-col>
                  </v-row>
                  <!-- Rating -->
                  <v-row class="my-2 py-0" justify="start">
                    <!-- rating Display -->
                    <v-col
                      class="my-0 py-0 text-left"
                      align="center"
                      cols="12"
                      sm="6"
                      md="6"
                    >
                      <v-rating
                        dense
                        large
                        color="yellow darken-4"
                        required
                        :background-color="
                          appDark ? 'grey lighten-3' : 'grey darken-3'
                        "
                        empty-icon="star_outline"
                        full-icon="star"
                        half-icon="star_half"
                        length="5"
                        v-model="reviewRatingValue"
                      ></v-rating>
                    </v-col>
                    <!-- Clear rating -->
                    <v-col
                      v-if="reviewRatingValue"
                      class="my-0 py-0 text-right"
                      align="center"
                      sm="6"
                      md="6"
                    >
                      <v-btn
                        dense
                        x-small
                        class="primary darken-4 font-weight-bold ma-0 pa-0"
                        color="primary"
                        @click="reviewRatingValue = null"
                        >Clear</v-btn
                      >
                    </v-col>
                  </v-row>
                  <!-- Nick Name Caption -->
                  <v-row class="my-0 py-0" justify="start">
                    <v-col class="mt-5 py-0 text-left" align="center">
                      <p
                        class="body-1 font-weight-medium"
                        :style="appThemeFontColor"
                      >
                        Nick Name
                      </p>
                    </v-col>
                  </v-row>
                  <!-- User Nick name -->
                  <v-row class="my-0 py-0" justify="start">
                    <v-col class="my-0 py-0 text-left" align="center">
                      <v-text-field
                        dense
                        outlined
                        class="my-0 py-0"
                        style="font-size: 1.1em"
                        v-model="reviewNickName"
                        prepend-icon="badge"
                        placeholder="How would you like your name to appear on the review"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <!-- Title  -->
                  <v-row class="mt-2 py-0" justify="start">
                    <v-col class="my-0 py-0 text-left" align="center">
                      <p
                        class="body-1 font-weight-medium my-0 py-0"
                        :style="appThemeFontColor"
                      >
                        Add a Title
                      </p>
                    </v-col>
                  </v-row>
                  <!-- Review Title -->
                  <v-row class="mt-5 py-0" justify="start">
                    <v-col class="my-0 py-0 text-left" align="center">
                      <v-text-field
                        dense
                        outlined
                        class="my-0 py-0"
                        style="font-size: 1.1em"
                        v-model="reviewTitle"
                        prepend-icon="title"
                        placeholder="What's your impression in a few words"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <!-- Review Text Caption  -->
                  <v-row class="mt-5 py-0" justify="start">
                    <v-col class="my-0 py-0 text-left" align="center">
                      <p
                        class="body-1 font-weight-medium py-0 my-0"
                        :style="appThemeFontColor"
                      >
                        Add Review Comment
                      </p>
                    </v-col>
                  </v-row>
                  <!-- review text-->
                  <v-row>
                    <v-col>
                      <v-textarea
                        outlined
                        class="my-0 py-0"
                        style="font-size: 1.1em"
                        v-model="reviewText"
                        required
                        rows="4"
                        auto-grow
                        prepend-icon="article"
                        placeholder="How do you find the product? What do you like or dislike about it?"
                      >
                      </v-textarea>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>
            <!-- Close/cancel buttons -->
            <v-card-actions>
              <v-row justify="center" class="my-2">
                <!-- Save -->
                <v-col cols="12" md="2" sm="3" class="text-center">
                  <v-btn
                    rounded
                    small
                    class="primary darken-4 font-weight-bold"
                    raised
                    color="blue"
                    @click="saveItemReviewDialog"
                  >
                    Submit
                  </v-btn>
                </v-col>
                <!-- Cancel -->
                <v-col cols="12" md="2" sm="3" class="text-center">
                  <v-btn
                    rounded
                    small
                    class="error darken-4 font-weight-bold"
                    raised
                    @click="clearItemReviewDialog"
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
    <div v-if="itemDataReceived" class="mx-auto py-0 my-0">
      <v-row justify="center" class="my-0 py-0">
        <!-- <v-btn @click="test">Test</v-btn> -->
        <v-col
          cols="12"
          md="12"
          sm="12"
          style="max-width: 1200px"
          class="text-left my-0 py-0"
        >
          <!-- Data Available after Sync actions -->
          <div class="mt-0 pt-0">
            <v-card class="mt-0 pt-0 mx-0 px-0" elevation="0">
              <!-- Back to Search Results -->
              <v-row
                justify="start"
                align="start"
                class="ma-0 pa-0"
                v-if="showSearchResultsButton"
              >
                <v-col cols="12" md="12" sm="12" class="text-left ma-0 pa-0">
                  <v-btn
                    text
                    small
                    color="primary"
                    @click="showSearchresults()"
                  >
                    <v-icon>mdi-step-backward</v-icon>Search Results</v-btn
                  >
                </v-col>
              </v-row>
              <!-- rating -->
              <v-row
                :style="appLightBackground"
                justify="end"
                align="start"
                class="ma-0 pa-0"
              >
                <v-col cols="12" md="12" sm="12" class="text-right ma-0 pa-0">
                  <!-- rating -->
                  <v-menu
                    content-class="my-menu"
                    v-model="ratingCard"
                    nudge-bottom="5"
                    :close-on-content-click="false"
                    bottom
                    offset-y
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <div v-on="on" v-bind="attrs">
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
                      </div>
                    </template>
                    <v-card min-width="300" class="py-2">
                      <v-card-title
                        class="my-0 py-0 ml-0 pl-3 body-1 font-weight-medium"
                      >
                        Overall Rating:
                        {{
                          activeItem.rating.rateAvg
                            ? activeItem.rating.rateAvg.toFixed(1)
                            : 0
                        }}
                      </v-card-title>
                      <v-card-title
                        class="mt-2 py-0 ml-0 pl-3 body-2 font-weight-medium"
                      >
                        Individual Ratings:
                      </v-card-title>
                      <v-card-text class="body-2 mb-5 pa-0">
                        <v-row
                          v-if="activeItem.rating.ratings.length"
                          v-for="(rating, index) in getRatingArray(
                            activeItem.rating
                          )"
                          :key="'rating' + index"
                          class="mx-0 my-0 py-0"
                          justify="start"
                        >
                          <!-- rating -->
                          <v-col
                            class="text-left my-0 py-0"
                            align="center"
                            md="3"
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
                            md="6"
                            sm="6"
                            style="max-width: 300px"
                          >
                            <v-progress-linear
                              color="amber darken-4"
                              :background-color="
                                appDark ? 'grey darken-3' : 'grey lighten-1'
                              "
                              :value="
                                (rating / activeItem.rating.rateCount) * 100
                              "
                              height="10"
                            ></v-progress-linear>
                          </v-col>
                          <v-col
                            class="text-left my-0 py-0"
                            align="center"
                            md="3"
                            sm="3"
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
                      </v-card-text>
                      <v-card-actions class="my-0 py-0">
                        <!-- Add Review -->
                        <v-row
                          class="mx-0 my-2 py-0"
                          justify="start"
                          v-if="!itemReviewed"
                        >
                          <!-- Add  button -->
                          <v-col
                            class="my-0 py-0 text-right"
                            cols="12"
                            md="1"
                            sm="1"
                          >
                            <v-btn
                              class="my-0 py-0 custom-transform-class text-none"
                              small
                              elevation="1"
                              @click="handleAddReview"
                            >
                              Write a Review
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card-actions>
                    </v-card>
                  </v-menu>
                  <!-- rating text-->
                  <p
                    v-if="activeItem.rating.rateCount"
                    class="caption py-0 my-0 ml-2"
                  >
                    {{ activeItem.rating.rateCount }} Ratings
                  </p>
                </v-col>
              </v-row>
              <!--  Item title -->
              <v-row justify="start" align="start" class="ma-0 pa-0">
                <v-col cols="12" md="12" sm="12" class="text-left ma-0 pa-0">
                  <v-toolbar
                    :style="appLightBackground"
                    elevation="0"
                    class="text-left"
                  >
                    <v-toolbar-title class="text-h5">
                      {{ activeItem.name }}</v-toolbar-title
                    >
                  </v-toolbar>
                </v-col>
              </v-row>
              <!-- Item editing -->
              <v-row justify="end" align="start" class="ma-0 pa-0">
                <v-col cols="12" md="12" sm="12" class="text-right ma-0 pa-0">
                  <v-spacer></v-spacer>
                  <!-- Editing -->
                  <div v-if="user && user.admin" class="hidden-xs-only">
                    <!-- Disable Item -->
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
                          @click="handleDialog(null, 'disableItem')"
                        >
                          <v-icon>disabled_visible</v-icon>
                        </v-btn>
                      </template>
                      <span>Disable this Item</span>
                    </v-tooltip>
                    <!-- Edit item -->
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
                          @click="handleEditItem(false)"
                        >
                          <v-icon>{{ icons.mdiPencil }}</v-icon>
                        </v-btn>
                      </template>
                      <span>Edit this item</span>
                    </v-tooltip>
                    <!-- Clone the item as new item -->
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
                          @click="handleEditItem(true)"
                        >
                          <v-icon>control_point_duplicate</v-icon>
                        </v-btn>
                      </template>
                      <span>Clone as new Item</span>
                    </v-tooltip>
                  </div>
                </v-col>
              </v-row>
              <!-- Displayting item Images -->
              <v-row justify="center" class="ma-0 pa-0">
                <!-- Carousel for item imges -->
                <v-col
                  v-if="activeItem.images.length"
                  cols="12"
                  md="6"
                  sm="6"
                  class="text-left ma-0 pa-0"
                  style="width: 60%"
                >
                  <v-card class="ma-0 pa-0" elevation="0">
                    <div>
                      <v-carousel
                        height="300"
                        class="ma-0 pa-0"
                        :value="activeIndex"
                        @input="activeIndex = $event"
                      >
                        <v-carousel-item
                          class="ma-0 pa-0"
                          v-for="(image, index) in activeItem.images"
                          :key="'image' + index"
                          :src="image.imageUrl"
                          reverse-transition="fade-transition"
                          transition="fade-transition"
                          @click="expandImage(index)"
                        ></v-carousel-item>
                      </v-carousel>

                      <v-row justify="center">
                        <v-col class="ma-1 text-center d-flex justify-center">
                          <v-img
                            @click="activeIndex = index"
                            class="mx-1 text-center"
                            v-for="(image, index) in activeItem.images"
                            :key="'thumbnail' + index"
                            :src="image.imageUrl"
                            height="50"
                            width="50"
                            style="
                              cursor: pointer;
                              max-width: 50px;
                              max-height: 50px;
                            "
                          ></v-img>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card>
                </v-col>
                <!-- If no item images and defaultImage -->
                <v-col
                  v-else
                  cols="12"
                  md="6"
                  sm="6"
                  class="text-left ma-0 pa-0"
                  style="width: 60%"
                >
                  <v-card class="ma-0 pa-0" elevation="0">
                    <v-carousel height="300" class="ma-0 pa-0">
                      <v-carousel-item
                        class="ma-0 pa-0"
                        :src="
                          activeItem.defaultImage !== ''
                            ? activeItem.defaultImage
                            : alternateDefaultImage
                        "
                        reverse-transition="fade-transition"
                        transition="fade-transition"
                      >
                      </v-carousel-item>
                    </v-carousel>
                  </v-card>
                </v-col>
                <!-- Item Price and description info -->
                <v-col cols="12" md="6" sm="6">
                  <!-- item Chips -->
                  <v-row class="mx-0 my-0 py-0" justify="start">
                    <!-- deal -->
                    <v-col
                      v-if="activeItem.dealName"
                      class="ma-0 pa-0 text-left"
                    >
                      <v-chip
                        class="ma-2"
                        color="error darken-3"
                        label
                        small
                        text-color="white"
                      >
                        {{ activeItem.dealName }}
                      </v-chip>
                    </v-col>
                    <v-spacer></v-spacer>
                    <!-- Add to cart, wishlist -->
                    <v-col class="d-flex ma-0 pa-0">
                      <!-- To cart -->
                      <v-btn
                        class="my-0 py-0 custom-transform-class text-none orange"
                        :class="appDark ? 'darken-4' : 'lighten-2'"
                        :disabled="activeItem.stock.outOfStock"
                        small
                        dense
                        elevation="1"
                        @click="handleAddToCart"
                      >
                        <span v-if="!activeItem.stock.outOfStock">
                          <v-icon class="my-0 py-0">add_shopping_cart</v-icon>
                          Add to Cart
                        </span>
                        <span v-else> Out of Stock </span>
                      </v-btn>
                      <v-spacer></v-spacer>
                      <!-- To Favorites -->
                      <v-btn
                        class="ml-2 mt-n2 py-0 custom-transform-class text-none"
                        small
                        fab
                        icon
                        dense
                        @click="handleAddToFavorites"
                      >
                        <v-icon
                          class="my-0 py-0"
                          :color="favorited ? 'red darken-4' : ''"
                          >{{
                            favorited ? 'favorite' : 'favorite_border'
                          }}</v-icon
                        >
                      </v-btn>
                    </v-col>
                  </v-row>
                  <!-- Displaying Original price-->
                  <v-row class="mx-0 mt-4 mb-0 py-0" justify="start">
                    <v-col
                      v-if="activeItem.discount > 0"
                      cols="12"
                      :sm="isItemInCart ? '6' : '8'"
                      :md="isItemInCart ? '6' : '8'"
                      class="text-left my-2 py-0"
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
                          {{
                            (
                              Math.round(activeItem.price.value * 100) / 100
                            ).toFixed(2)
                          }}
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
                    <!-- Quantity -->
                    <v-col
                      v-if="isItemInCart"
                      cols="12"
                      sm="3"
                      md="3"
                      class="text-left mt-n1 mb-2 py-0 d-flex"
                      align="end"
                    >
                      <p class="mt-2 py-0 mx-0 px-0">Qty:</p>
                      <v-btn
                        class="mr-0 mb-0 mt-1 ml-1 0"
                        @click="decrementQuantity"
                        x-small
                        fab
                        icon
                        color="error"
                      >
                        <v-icon>
                          {{ itemQuantity <= 1 ? 'delete' : 'remove' }}
                        </v-icon>
                      </v-btn>
                      <v-text-field
                        style="max-width: 45px; min-width: 45px"
                        class="ma-0 pa-0 item__quantity"
                        dense
                        single-line
                        v-model="itemQuantity"
                        solo
                        readonly
                      ></v-text-field>
                      <v-btn
                        class="mr-0 ml-0 mb-0 mt-1 mx-0 mb-0 py-0"
                        @click="incrementQuantity"
                        icon
                        x-small
                        fab
                        color="primary"
                      >
                        <v-icon class="my-0 py-0"> add </v-icon>
                      </v-btn>
                    </v-col>
                    <!-- Add actions -->
                    <v-col
                      cols="12"
                      sm="4"
                      md="4"
                      class="text-left mb-0 mt-n3 py-0 d-flex"
                      align="center"
                    >
                      <!-- To wishlist -->
                      <!-- <v-btn
                          class="my-2 py-0 custom-transform-class text-none orange"
                          :class="appDark ? 'darken-4': 'lighten-2'"
                          small
                          dense
                          elevation=1
                          @click="handleAddToWishList"
                        >
                          <v-icon>add_shopping_cart</v-icon>
                          Add to Wishlist
                        </v-btn> -->
                      <!-- <v-row class="ma-0 pa-0">
                          <v-col class="ma-0 pa-0">
                            <p>{{favorited ? 'favorited':'favorite'}}</p>

                          </v-col>
                        </v-row> -->
                    </v-col>
                  </v-row>
                  <!-- Displaying Discounted price Price -->
                  <v-row class="mx-0 mb-0 mt-n3 py-0" justify="start">
                    <v-col class="text-left my-0 py-0" align="center">
                      <p class="body-1 my-0 py-0" :style="appThemeFontColor">
                        <span
                          v-if="activeItem.discount > 0"
                          class="text-h5 red--text"
                          >-{{ activeItem.discount }}%</span
                        >
                        <span
                          class="text-h5 font-weight-medium"
                          :class="activeItem.discount > 0 ? 'mx-2' : ''"
                        >
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
                              (
                                Math.round(
                                  activeItem.price.value *
                                    (1 - activeItem.discount / 100) *
                                    100
                                ) / 100
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
                                Math.round(activeItem.price.value * 100) / 100 -
                                Math.round(
                                  activeItem.price.value *
                                    (1 - activeItem.discount / 100) *
                                    100
                                ) /
                                  100
                              ).toFixed(2)
                            }}
                          </span>
                        </span>
                      </p>
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
                        <v-col class="my-0 py-0" cols="12" md="12" sm="12">
                          <p style="white-space: pre-line">
                            {{ activeItem.description }}
                          </p>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <!--Size and Color -->
                  <v-row
                    v-if="
                      activeItem.isColorApplicable ||
                      activeItem.isSizeApplicable
                    "
                    class="mx-0 my-2 py-2"
                    justify="start"
                  >
                    <!-- Column for Size -->
                    <v-col
                      v-if="activeItem.isSizeApplicable"
                      cols="6"
                      class="text-left"
                    >
                      <p class="body-1 my-0 py-0">
                        Size:
                        <span class="font-weight-medium">
                          {{
                            activeItem.size.charAt(0).toUpperCase() +
                            activeItem.size.slice(1)
                          }}</span
                        >
                      </p>
                    </v-col>

                    <!-- Column for Color -->
                    <v-col
                      v-if="activeItem.isColorApplicable"
                      cols="6"
                      class="text-left"
                    >
                      <p class="body-1 my-0 py-0">
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
                        <span class="font-weight-medium">
                          {{
                            activeItem.color.charAt(0).toUpperCase() +
                            activeItem.color.slice(1)
                          }}
                        </span>
                      </p>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <!-- <v-btn @click="test">Test</v-btn> -->
              <!-- Displaying Item Data-->
              <div>
                <!-- Displaying Item Data-->
                <v-card
                  :style="appLightBackground"
                  elevation="0"
                  class="pa-0 ma-0 pointerMouse"
                >
                  <v-card-text class="pt-3 mx-0 px-0">
                    <!-- Tabs -->
                    <v-row
                      class="mx-0 px-0 mt-5 py-0 hidden-sm-and-down"
                      justify="start"
                      ref="tabsContainer"
                    >
                      <v-col class="text-left ma-0 pa-0" align="center">
                        <v-tabs
                          color="orange accent-4"
                          left
                          v-model="tab_selected"
                        >
                          <v-tabs
                            color="orange accent-4"
                            left
                            v-model="tab_selected"
                          >
                            <v-tab
                              @click="handleTabClick(index)"
                              v-for="(category, index) in tabCategories"
                              :key="index"
                            >
                              {{ category }}
                            </v-tab>
                          </v-tabs>
                        </v-tabs>
                      </v-col>
                    </v-row>
                    <!-- Features and Detais -->
                    <div
                      :id="'sec_' + getTabIndex('Features & Details')"
                      class="section mt-10"
                    >
                      <!-- Displaying Features and Details caption-->
                      <v-row class="mx-0 mt-0 py-0 px-0" justify="start">
                        <v-col class="text-left my-0 py-0" align="center">
                          <p
                            class="body-1 font-weight-medium my-0 py-0"
                            :style="appThemeFontColor"
                          >
                            Features & Details:
                          </p>
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
                            class="my-2 py-0"
                          >
                            <v-row class="my-0 py-0">
                              <!-- feature text -->
                              <v-col
                                cols="12"
                                sm="12"
                                md="12"
                                class="my-0 py-0"
                              >
                                <p
                                  :style="appThemeFontColor"
                                  style="white-space: pre-line"
                                  class="my-0 py-0"
                                >
                                  <span class="subtitle-2 font-weight-medium"
                                    >{{ savedFeature.caption }}:
                                  </span>
                                </p>
                                <p
                                  class="my-0 py-0"
                                  style="white-space: pre-line"
                                  :style="appThemeFontColor"
                                >
                                  {{ savedFeature.description }}
                                </p>
                              </v-col>
                              <v-spacer></v-spacer>
                            </v-row>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                    <!-- Specs tab -->
                    <div
                      :id="'sec_' + getTabIndex('Specs')"
                      class="section mt-10"
                    >
                      <!-- Specs title-->
                      <v-row class="mx-0 mt-10 mb-5 py-0" justify="start">
                        <v-col class="text-left py-0 py-0" align="center">
                          <p
                            class="body-1 font-weight-medium my-0 py-0"
                            :style="appThemeFontColor"
                          >
                            Specs:
                          </p>
                        </v-col>
                      </v-row>
                      <!-- Displaying Specs -->
                      <div
                        class="mx-3 py-0 my-0"
                        justify="start"
                        v-for="(spec, index) in activeItem.specs"
                        :key="'spec' + index"
                        :class="getRowClass(index)"
                      >
                        <v-row
                          no-gutters
                          justify="start"
                          class="d-flex align-center mx-2"
                        >
                          <!-- Spec name -->
                          <v-col
                            class="text-left my-0 py-0"
                            cols="6"
                            md="3"
                            sm="6"
                          >
                            <p :style="appThemeFontColor" class="my-0 py-0">
                              {{ spec.specName }}
                            </p>
                          </v-col>
                          <!-- Spec value or spec text -->
                          <v-col
                            v-if="
                              spec.specValueType === 'value' ||
                              spec.specValueType === 'text' ||
                              spec.specValueType === 'value with unit'
                            "
                            class="text-left my-0 py-0"
                            cols="6"
                            md="7"
                            sm="6"
                          >
                            <p class="my-0 py-0" :style="appThemeFontColor">
                              {{
                                spec.specValueType === 'text'
                                  ? spec.specText
                                  : spec.specValueType === 'value'
                                  ? spec.specValue
                                  : spec.specValue + ' ' + spec.specUnit
                              }}
                            </p>
                          </v-col>
                          <!-- Spec options -->
                          <v-col
                            v-if="
                              spec.specValueType === 'options' ||
                              spec.specValueType === 'value options' ||
                              spec.specValueType === 'options with unit'
                            "
                            class="text-left my-0 py-0"
                            cols="6"
                            md="7"
                            sm="6"
                          >
                            <p class="my-0 py-0" :style="appThemeFontColor">
                              {{
                                spec.specValueType === 'options'
                                  ? spec.specTextSelect
                                  : spec.specValueType === 'value options'
                                  ? spec.specValueSelect
                                  : spec.specValueSelect + ' ' + spec.specUnit
                              }}
                            </p>
                          </v-col>
                        </v-row>
                        <!-- <v-divider class="my-3" style="width: 70%"></v-divider> -->
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
                      <v-row class="py-0 my-0 mx-0" justify="center">
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
                    </div>
                    <!-- Additional Info -->
                    <div
                      v-if="activeItem.additionalInfo"
                      :id="'sec_' + getTabIndex('Additional Info')"
                      class="section mt-10"
                    >
                      <!-- Additional info title-->
                      <v-row class="mx-0 mt-10 py-0" justify="start">
                        <v-col class="text-left py-0 py-0" align="center">
                          <p
                            class="body-1 font-weight-medium my-0 py-0"
                            :style="appThemeFontColor"
                          >
                            Additional Info:
                          </p>
                        </v-col>
                      </v-row>
                      <v-row class="py-0 mt-10 mx-0" justify="center">
                        <v-col
                          class="text-left my-0 py-0"
                          align="center"
                          cols="12"
                          md="12"
                          sm="12"
                        >
                          <!-- Displaying Additional Info -->
                          <v-card-text class="ma-0 pa-0" elevation="0">
                            <span
                              :style="appThemeFontColor"
                              v-html="activeItem.additionalInfo"
                              class="appFont1 v-html__margin"
                              style="white-space: pre-line"
                            ></span>
                          </v-card-text>
                        </v-col>
                      </v-row>
                    </div>
                    <!-- Dimensons & Weight -->
                    <div
                      :id="'sec_' + getTabIndex('Dimensons & Weight')"
                      class="section mt-10"
                    >
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
                              <p class="ma-0 pa-0">
                                Length: {{ activeItem.length }} cm
                              </p>
                            </v-col>
                          </v-row>
                          <!-- Displaying Width -->
                          <v-row class="my-1 py-0">
                            <v-col class="my-0 py-0" cols="11" md="11" sm="11">
                              <p class="ma-0 pa-0">
                                Width: {{ activeItem.width }} cm
                              </p>
                            </v-col>
                          </v-row>
                          <!-- Displaying Height -->
                          <v-row class="my-1 py-0">
                            <v-col class="my-0 py-0" cols="11" md="11" sm="11">
                              <p class="ma-0 pa-0">
                                Height: {{ activeItem.height }} cm
                              </p>
                            </v-col>
                          </v-row>
                          <!-- Displaying Weight -->
                          <v-row class="my-1 py-0">
                            <v-col class="my-0 py-0" cols="11" md="11" sm="11">
                              <p class="ma-0 pa-0">
                                Weight: {{ activeItem.weight }} gram
                              </p>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </div>
                    <!-- Customer Questions -->
                    <div
                      v-if="activeItem.customerQuestions.length"
                      :id="'sec_' + getTabIndex('Questions')"
                      class="section mt-10"
                    >
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
                              v-for="(
                                qnAns, index
                              ) in activeItem.customerQuestions"
                              :key="'detail' + index"
                            >
                              <v-row>
                                <v-col cols="12" sm="12" md="12">
                                  <v-card elevation="0">
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
                    </div>
                    <!-- Ratings -->
                    <div
                      v-if="activeItem.rating.ratings.length"
                      :id="'sec_' + getTabIndex('Ratings')"
                      class="section mt-10"
                    >
                      <!-- Customer Ratings caption-->
                      <v-row class="mx-0 my-0 py-0" justify="start">
                        <v-col class="text-left" align="center">
                          <p
                            class="body-1 font-weight-medium my-0 py-0"
                            :style="appThemeFontColor"
                          >
                            Customer Ratings:
                          </p>
                        </v-col>
                      </v-row>
                      <!-- Customer Rating SUmmary-->
                      <v-row
                        v-if="
                          activeItem.rating && activeItem.rating.ratings.length
                        "
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
                          md="6"
                          sm="5"
                        >
                          <p :style="appThemeFontColor">
                            {{ activeItem.rating.rateAvg.toFixed(1) }} out of 5
                            ({{ activeItem.rating.rateCount }} ratings)
                          </p>
                        </v-col>
                      </v-row>
                      <!-- Customer Individual Rating -->
                      <v-row
                        v-if="
                          activeItem.rating && activeItem.rating.ratings.length
                        "
                        v-for="(rating, index) in getRatingArray(
                          activeItem.rating
                        )"
                        :key="'rating' + index"
                        class="mx-0 my-0 py-0"
                        justify="start"
                      >
                        <!-- rating -->
                        <v-col
                          class="text-left my-0 py-0"
                          align="center"
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
                          md="4"
                          sm="7"
                          style="max-width: 300px"
                        >
                          <v-progress-linear
                            color="amber darken-4"
                            :background-color="
                              appDark ? 'grey darken-3' : 'grey lighten-1'
                            "
                            :value="
                              (rating / activeItem.rating.rateCount) * 100
                            "
                            height="10"
                          ></v-progress-linear>
                        </v-col>
                        <v-col
                          class="text-left my-0 py-0"
                          align="center"
                          md="1"
                          sm="3"
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
                    </div>
                    <!-- Reviews -->
                    <div
                      :id="'sec_' + getTabIndex('Reviews')"
                      class="section mt-10"
                    >
                      <!-- Customer Reviews caption-->
                      <v-row class="mx-0 my-0 py-0" justify="start">
                        <v-col class="text-left" align="center">
                          <p
                            class="body-1 font-weight-medium my-0 py-0"
                            :style="appThemeFontColor"
                          >
                            Customer Reviews:
                          </p>
                        </v-col>
                      </v-row>
                      <!-- Fist Review -->
                      <v-row
                        v-if="!activeItem.reviews.length"
                        class="mx-0 my-0 py-0"
                        justify="start"
                      >
                        <v-col class="text-left" align="center">
                          <p class="my-0 py-0">
                            Be the first one to write a review
                          </p>
                        </v-col>
                      </v-row>
                      <!-- Add Review -->
                      <v-row
                        class="mx-0 my-2 py-0"
                        justify="start"
                        v-if="!itemReviewed"
                      >
                        <!-- Add  button -->
                        <v-col
                          class="my-0 py-0 text-right"
                          cols="12"
                          md="1"
                          sm="1"
                        >
                          <v-btn
                            class="my-0 py-0 custom-transform-class text-none"
                            small
                            elevation="1"
                            @click="handleAddReview"
                          >
                            Write a Review
                          </v-btn>
                        </v-col>
                      </v-row>
                      <!-- Reviews -->
                      <v-row
                        class="py-0 mx-0 my-5"
                        v-for="(review, index) in itemReviews"
                        :key="'review' + index"
                      >
                        <v-col class="my-0 py-0 text-left">
                          <!-- name -->
                          <v-row justify="start" class="my-0 py-0">
                            <v-col
                              class="text-left my-0 py-0"
                              align="center"
                              cols="12"
                              md="1"
                              sm="2"
                              style="max-width: 30px"
                            >
                              <v-icon>account_circle</v-icon>
                            </v-col>
                            <v-col
                              class="text-left my-0 py-0"
                              align="center"
                              cols="12"
                              md="4"
                              sm="4"
                              style="max-width: 200px"
                            >
                              <p class="my-0 py-0">
                                {{
                                  review.nickName
                                    ? review.nickName
                                    : appName + ' User'
                                }}
                              </p>
                            </v-col>
                          </v-row>
                          <!-- User rating -->
                          <v-row
                            v-if="review.rating"
                            class="mx-0 my-0 py-0"
                            justify="start"
                          >
                            <v-col
                              class="text-left mx-0 px-0 my-0 py-0"
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
                                :value="review.rating.value"
                              ></v-rating>
                            </v-col>
                          </v-row>
                          <!-- review caption -->
                          <v-row justify="start" class="my-0 py-0">
                            <v-col
                              class="text-left my-0 py-0"
                              align="center"
                              cols="12"
                              md="12"
                              sm="12"
                            >
                              <p
                                class="my-0 py-0 body-1 font-weight-medium"
                                :style="appThemeFontColor"
                              >
                                {{ review.caption }}
                              </p>
                            </v-col>
                          </v-row>
                          <!-- review location,date -->
                          <v-row justify="start" class="my-0 py-0">
                            <v-col
                              class="text-left my-0 py-0"
                              align="center"
                              cols="12"
                              md="12"
                              sm="12"
                            >
                              <p class="my-0 py-0 subtitle-2">
                                Reviewed
                                {{
                                  review.country ? 'in ' + review.country : ''
                                }}
                                on
                                {{
                                  convertTimestamp(parseInt(review.updatedAt))
                                }}
                              </p>
                            </v-col>
                          </v-row>
                          <!-- review text -->
                          <v-row justify="start" class="my-0 py-0">
                            <v-col
                              class="text-left my-0 py-0"
                              align="center"
                              cols="12"
                              md="12"
                              sm="12"
                            >
                              <p class="my-0 py-0" :style="appThemeFontColor">
                                {{ review.text }}
                              </p>
                            </v-col>
                          </v-row>
                          <!-- Found Helpful -->
                          <v-row
                            v-if="review.helpful"
                            justify="start"
                            class="mt-0 mb-1 py-0"
                          >
                            <!-- thumbs up button -->
                            <v-col
                              v-if="!review.helpful.applied && !itemReviewed"
                              class="text-left my-0 py-0"
                              align="center"
                              cols="12"
                              md="1"
                              sm="1"
                              style="max-width: 10px"
                            >
                              <v-tooltip right>
                                <template
                                  v-slot:activator="{ on, attrs }"
                                  style="max-width: 30px"
                                >
                                  <v-btn
                                    fav
                                    icon
                                    class="ma-0 pa-0"
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="incrementHelpful(review)"
                                    :color="
                                      review.helpful.applied ? 'blue' : ''
                                    "
                                  >
                                    <v-icon>thumb_up</v-icon>
                                  </v-btn>
                                </template>
                                <span>I found this helpful</span>
                              </v-tooltip>
                            </v-col>
                            <!-- text showing count -->
                            <v-col
                              v-if="review.helpful.count"
                              class="text-left my-1 py-0"
                              :class="review.helpful.applied ? 'ml-0' : 'ml-5'"
                              align="center"
                              cols="12"
                              md="11"
                              sm="11"
                            >
                              <p>
                                {{
                                  review.helpful.applied
                                    ? review.helpful.count > 1
                                      ? 'You and ' +
                                        (review.helpful.count - 1) +
                                        ' other'
                                      : 'You'
                                    : review.helpful.count
                                }}
                                {{
                                  review.helpful.applied &&
                                  review.helpful.count === 1
                                    ? ''
                                    : review.helpful.count > 1
                                    ? 'people'
                                    : 'person'
                                }}
                                found this helpful
                              </p>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </div>
                    <!-- tags -->
                    <div
                      v-if="activeItem.tags.length"
                      :id="'sec_' + getTabIndex('Tags')"
                      class="section mt-10"
                    >
                      <v-row class="mt-10 py-0 mx-0" justify="start">
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
                      </v-row>
                    </div>
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
import moment from 'moment';
import { mapGetters } from 'vuex';
// import { mdiPencil } from "@mdi/js";
import store from '@/store';
import AlternateDefaultImage from '@/assets/images/alternateDefaultImage.webp';
function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
export default {
  name: 'itemPreview',
  data() {
    return {
      // itemDataReceived: false,
      progress: null,
      isExpandedImageDialog: false,
      expandedImageUrl: '',
      itemCarouselIndex: null,
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
      itemReviewDialog: false,
      reviewRatingValue: null,
      reviewNickName: '',
      reviewTitle: '',
      reviewText: '',
      isItemReviewFormValid: false,
      ratingCard: false,
      // icons: {
      //   mdiPencil,
      // },
      alternateDefaultImage: AlternateDefaultImage,
      activeIndex: 0,
      tab_selected: 0,
      isTabClick: false,
      programmaticScroll: true,
    };
  },
  computed: {
    ...mapGetters([
      'user',
      'token',
      'error',
      'errorStatus',
      'loading',
      'appCurrencyIconText',
      'appCurrency',
      'appCurrencyText',
      'appDark',
      'appLightBackground',
      'appThemeFontColor',
      'validationRules',
      'items',
      'itemDataReceived',
      'initializeAppComplete',
      'randomColor',
      'showSearchResultsButton',
      'icons',
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
    itemMode: {
      get() {
        return this.$store.getters.itemMode;
      },
      set(value) {
        this.$store.commit('setItemMode', value);
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
    itemReviewed() {
      if (!this.user || !this.token || !this.user.reviews) return false;
      const review = this.user.reviews.find(
        (review) => review.item === this.activeItem._id
      );
      return review ? true : false;
    },
    itemReviews() {
      return this.activeItem.reviews;
    },
    appName() {
      return process.env.VUE_APP_NAME;
    },
    favorited() {
      if (this.user && this.token && this.user.favorites) {
        const itemInFavorites = this.user.favorites.find(
          (item) => item._id === this.activeItem._id
        );
        return itemInFavorites ? true : false;
      } else {
        return false;
      }
    },
    isItemInCart() {
      if (this.user) {
        const itemIncart = this.cart.items.find(
          (el) => el.item._id === this.activeItem._id
        );
        return itemIncart ? true : false;
      } else {
        return false;
      }
    },
    itemQuantity() {
      const itemIncart = this.cart.items.find(
        (el) => el.item._id === this.activeItem._id
      );
      return itemIncart ? itemIncart.quantity : 0;
    },
    cart: {
      get() {
        return this.$store.getters.cart;
      },
      set(value) {
        this.$store.commit('setCart', value);
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
    itemAdditionalInfo: {
      get() {
        return this.$store.getters.itemAdditionalInfo;
      },
      set(value) {
        this.$store.commit('setItemAdditionalInfo', value);
      },
    },
    tabCategories() {
      let categories = ['Features & Details', 'Specs'];
      // checking for additional info
      if (this.activeItem.additionalInfo !== '') {
        categories.push('Additional Info');
      }
      // pushing dimensions and wight
      categories.push('Dimensons & Weight');

      // checking for customer questions
      if (this.activeItem.customerQuestions.length > 0) {
        categories.push('Questions');
      }
      // checking for Ratings
      if (this.activeItem.rating.ratings.length > 0) {
        categories.push('Ratings');
      }
      // checking for Reviews
      if (this.activeItem.reviews.length > 0) {
        categories.push('Reviews');
      }
      // checking for Tags
      if (this.activeItem.tags.length > 0) {
        categories.push('Tags');
      }
      return categories;
    },
    activeSectionIndex() {
      for (let i = 0; i < this.tabCategories.length; i++) {
        const section = this.$el.querySelector(`#sec_${i}`);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            return i;
          }
        }
      }
      return null;
    },
  },
  async created() {
    // setting itemReceivedFlag to false
    this.$store.commit('setItemDataReceived', false);
    this.progressing = true;
    await this.getItemData();
    // this.uniqueKey = Math.round(Math.random() * 1000000);
    this.handleIntersect = this.handleIntersect.bind(this);
  },
  mounted() {
    this.$nextTick(() => {
      this.progressing = false;

      // Attach scroll event listener for immediate handling
      window.addEventListener('scroll', this.handleScroll);

      // Observer for section intersection
      const observer = new IntersectionObserver(this.handleIntersect);

      // Observe each section
      for (let i = 0; i < this.tabCategories.length; i++) {
        const section = this.$el.querySelector(`#sec_${i}`);

        // Ensure the section exists before observing
        if (section) {
          observer.observe(section);
        }
      }
    });
  },
  watch: {
    initializeAppComplete(newValue, oldValue) {
      if (oldValue === false) {
        this.getItemData();
      }
    },
    itemReviewDialog(newValue, oldValue) {
      this.$nextTick(() => {
        this.$refs.itemReviewForm.resetValidation();
      });
    },
    // itemDataReceived(newValue, oldValue) {
    //   if (oldValue === false) {
    //     this.getItemData();
    //   }
    // },
    async $route(to, from) {
      // if (!this.itemDataReceived) {
      await this.getItemData();
      // }
    },
  },
  methods: {
    clearDialog(result) {
      this.dialogResult = result;
      if (result === 'yes') {
        if (this.dialogContext === 'disableItem') {
          this.handleDisableItem();
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
        case 'disableItem':
          this.dialogContext = 'disableItem';
          break;

        case 'formNotValid':
          this.dialogContext = 'formNotValid';
          break;

        default:
          break;
      }
      // performing action
      switch (this.dialogContext) {
        case 'disableItem':
          this.dialogHeading = 'Confirm Disabling Item';
          this.dialogText =
            'Are you sure you want to disable this item? This can be enabled later from database. data will remain in the database.';
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
    async getItemData() {
      if (this.initializeAppComplete) {
        // Finding matching item
        let currentItem = this.items.find(
          (item) => item.routeParam === this.$route.params.itemName
        );

        if (!currentItem) {
          this.$store.dispatch('handleCatchError', {
            message: 'Invalid Item',
          });
          if (this.$route.name !== 'home') {
            this.$router.push({ name: 'home' });
          }
          return;
        }
        const result = await this.$store.dispatch('getSingleItem', {
          itemId: currentItem._id,
        });
        // Use Object.assign to ensure reactivity
        this.activeItem = Object.assign({}, result);
        this.$store.commit('setItemDataReceived', true);
        this.$forceUpdate();
      }
    },
    test() {},
    // Edit current item by contributors
    handleEditItem(cloneFlag) {
      if (!cloneFlag) {
        // Set item mode to edit
        this.itemMode = 'edit';
      } else {
        this.cloneFlag = true;
        // Set item mode to create
        this.itemMode = 'create';
        if (this.activeItem._id) delete this.activeItem._id;
        this.activeItem.name = this.activeItem.name + ' - cloned';
      }
      this.$store.commit(
        'setItemAdditionalInfo',
        this.activeItem.additionalInfo
      );
      // Directing to alpha item creator/edit page
      if (this.$route.name !== 'itemCreator') {
        this.$router.push({ name: 'itemCreator' });
      }
    },
    async handleDisableItem() {
      let currentItem = this.items.find(
        (item) => item._id === this.activeItem._id
      );
      let currentItemIndex = this.items.indexOf(currentItem);
      // sending to database
      await this.$store.dispatch('disableItem', {
        itemId: this.activeItem._id,
      });
      // if (disableSuccessMessage) {
      this.items.splice(currentItemIndex, 1);
      // }
      //   routing to previous Item/home
      if (this.items.length) {
        //  Routing to the item view page
        if (currentItemIndex === 0) {
          this.$router.push(`/items/${this.items[0].routeParam}`);
        } else {
          this.$router.push(
            `/items/${this.items[currentItemIndex - 1].routeParam}`
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
      this.itemCarouselIndex = index;
      // this.expandedImageUrl = this.activeItem.images[index].imageUrl;
      this.isExpandedImageDialog = true;
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
    convertTimestamp(date) {
      const convertedDate = moment(date).format('MMM DD, YYYY');
      return convertedDate;
    },
    handleAddReview() {
      if (!this.user) {
        this.$router.push({ name: 'signin' });
        return;
      }
      this.itemReviewDialog = true;
    },
    async saveItemReviewDialog() {
      // uploading item Image to server
      if (
        this.$refs.itemReviewForm.validate() ||
        this.reviewTitle ||
        this.reviewText ||
        this.reviewRatingValue
      ) {
        let rating;
        let payload;
        if (this.reviewRatingValue) {
          payload = {
            ratingInput: {
              value: this.reviewRatingValue,
              item: this.activeItem._id,
            },
          };
          rating = await this.$store.dispatch('addRating', payload);
        }
        let review;
        payload = {
          reviewInput: {
            rating: rating ? rating._id : null,
            caption: this.reviewTitle,
            nickName: this.reviewNickName,
            text: this.reviewText,
            item: this.activeItem._id,
          },
        };
        review = await this.$store.dispatch('addReview', payload);
        if (review || rating) {
          await this.getItemData();
        }
        this.clearItemReviewDialog();
        this.itemReviewDialog = false;
      } else {
        this.handleDialog(null, 'formNotValid');
      }
    },
    clearItemReviewDialog() {
      this.itemReviewDialog = false;
      this.reviewRatingValue = null;
      this.reviewTitle = '';
      this.reviewText = '';
      this.reviewNickName = '';
    },
    async incrementHelpful(review) {
      try {
        const payload = {
          reviewId: review._id,
        };
        // console.log('payload:', payload);
        // return;
        await this.$store.dispatch('incrementFoundHelpful', payload);
        const reviewIndex = this.activeItem.reviews.indexOf(review);
        // incrementing foundHelpful for this review
        this.activeItem.reviews[reviewIndex].helpful.count++;
        this.activeItem.reviews[reviewIndex].helpful.applied = true;
        // console.log('item:', this.activeItem);
        // this.$nextTick(() => {
        // });
      } catch (error) {
        this.$store.commit('setError', error);
      }
    },
    async handleAddToCart() {
      if (!this.isItemInCart) {
        this.snackBarText = 'Item added to Cart';
        this.cart.items.push({
          item: {
            _id: this.activeItem._id,
            name: this.activeItem.name,
            defaultImage: this.activeItem.defaultImage,
            price: this.activeItem.price,
            tax: this.activeItem.tax,
            discount: this.activeItem.discount,
          },
          quantity: 1,
        });
        // Update database
        await this.updateCart();
        this.enableSnackBar(true, 'View Cart', '/cart');
      } else {
        this.incrementQuantity();
      }
    },
    handleAddToWishList() {
      this.snackBarText = 'Item added to Wishlist';
      alert('this will add item to wishlist');
    },
    async handleAddToFavorites() {
      if (!this.user) {
        if (this.$route.name !== 'signin') {
          this.$router.push({ name: 'signin' });
        }
        return;
      }
      if (!this.favorited) {
        // this.snackBarText = "Item added to favorites";
        this.user.favorites.push(this.activeItem);
        const payload = {
          itemId: this.activeItem._id,
          operation: 'add',
          arrayType: 'favorites',
        };
        await this.$store.dispatch('updateItemArray', payload);
      } else {
        const index = this.user.favorites.indexOf(
          this.user.favorites.find((item) => item._id === this.activeItem._id)
        );
        // this.snackBarText = "Item removed from favorites";
        const payload = {
          itemId: this.activeItem._id,
          operation: 'remove',
          arrayType: 'favorites',
        };
        this.user.favorites.splice(index, 1);
        await this.$store.dispatch('updateItemArray', payload);
      }
    },
    async incrementQuantity() {
      if (this.activeItem.maximumOrderQuantity <= this.itemQuantity) {
        alert(
          'Sorry! This is the maximum quantity that can be ordered at this point.'
        );
        return;
      }
      const itemInCartIndex = this.cart.items.indexOf(
        this.cart.items.find((el) => el.item._id === this.activeItem._id)
      );
      this.cart.items[itemInCartIndex].quantity++;
      // Update database
      await this.updateCart();
    },
    async decrementQuantity() {
      let itemRemoved = false;
      const itemInCartIndex = this.cart.items.indexOf(
        this.cart.items.find((el) => el.item._id === this.activeItem._id)
      );
      if (this.cart.items[itemInCartIndex].quantity === 1) {
        this.snackBarText = 'item removed from the cart';
        this.cart.items.splice(itemInCartIndex, 1);
        itemRemoved = true;
      } else {
        this.snackBarText = 'item removed from the cart';
        this.cart.items[itemInCartIndex].quantity--;
      }
      // Update database
      await this.updateCart();
      // Snackbar
      if (itemRemoved) this.enableSnackBar(true, 'View Cart', '/cart');
    },
    enableSnackBar(targetRequired, targetText, targetLink) {
      // Assign snackbar parameters
      this.targetRequired = targetRequired;
      this.targetText = targetText;
      this.targetLink = targetLink;
      // show snackbar
      // console.log("targetRequired:", this.targetRequired);
      // console.log("targetText:", this.targetText);
      // console.log("targetLink:", this.targetLink);
      // console.log("snackBarText:", this.snackBarText);
      this.$store.commit('setSnackBar', true);
      // show snackbar
      this.$store.commit('setSnackBar', true);
    },
    async updateCart() {
      try {
        await this.$store.dispatch('updateCart');
      } catch (error) {
        // console.log(error);
      }
    },
    showSearchresults() {
      this.$router.go(-1);
    },
    changeImage(index) {
      this.activeIndex = index;
    },
    handleTabClick(index) {
      // Set the programmaticScroll flag to true to indicate programmatic scrolling
      this.programmaticScroll = true;
      // Your existing logic for scrolling to section
      this.$vuetify.goTo(`#sec_${index}`, {
        offset: this.getOffsetMargin(index),
      });
    },
    handleScroll() {
      // Get the tabs container reference
      const tabsContainer = this.$refs.tabsContainer;
      // Calculate the offset based on the height of the tabs
      let offset;
      if (tabsContainer) {
        offset = tabsContainer.clientHeight; // or offsetHeight

        // Define a threshold value
        const threshold = 400; // Adjust this value as needed
        // Check if the user has scrolled past the tabs section
        const isScrolledPastTabs =
          window.scrollY >= (tabsContainer.offsetTop || 0) + offset + threshold;

        // Apply a class to make the tabs sticky when scrolled past
        tabsContainer.classList.toggle('sticky-tabs', isScrolledPastTabs);

        // If it's a manual scroll and not programmatic, update the active tab
        if (!this.programmaticScroll) {
          let activeSectionIndex = null;
          for (let i = 0; i < this.tabCategories.length; i++) {
            const section = this.$el.querySelector(`#sec_${i}`);
            if (section) {
              const rect = section.getBoundingClientRect();
              if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                activeSectionIndex = i;
              }
            }
          }

          // Update the active tab based on the section in the viewport
          if (activeSectionIndex !== null) {
            this.tab_selected = activeSectionIndex;
          }
        }
      }
      // Reset the programmaticScroll flag
      setTimeout(() => {
        this.programmaticScroll = false;
      }, 1000);
    },
    getOffsetMargin(tabIndex) {
      const tabsContainerHeight = this.$refs.tabsContainer.clientHeight;
      let sectionHeight = this.$el.querySelector(
        `#sec_${tabIndex}`
      ).clientHeight; // Adjust as needed
      if (tabIndex === 0) {
        sectionHeight += 150;
      }

      return tabsContainerHeight + sectionHeight;
    },
    handleIntersect(entries, observer) {
      if (this.isTabClick) {
        this.isTabClick = false;
        return;
      }
      let intersecting_element = entries[0];
      if (intersecting_element.isIntersecting) {
        let id = intersecting_element.target.id;
        let index = Number(id.split('_')[1]);
        this.tab_selected = index;
      }
    },
    getTabIndex(category) {
      return this.tabCategories.indexOf(category);
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
  beforeRouteEnter(to, from, next) {
    if (from.name === 'itemSearchResults') {
      // Show button for search results
      store.commit('setShowSearchResultsButton', true);
    } else {
      store.commit('setShowSearchResultsButton', false);
    }
    next();
  },
  beforeDestroy() {
    // Remove scroll event listener when component is destroyed
    window.removeEventListener('scroll', this.handleScroll);
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
.item__image {
  opacity: 1;
}
.item__image:hover {
  opacity: 0.8;
}
.display__item-image {
  border-radius: 15px;
}
.floating-left-top-btn {
  position: fixed;
}
hr {
  /* display: block; */
  height: 0.1px;
  /* border: 0; */
  /* border-top: 1px solid #ccc; */
  /* padding: 0; */
}
.my-menu {
  contain: initial;
  overflow: visible;
}
.my-menu::before {
  position: absolute;
  content: '';
  top: 0;
  right: 200px;
  transform: translateY(-100%);
  width: 10px;
  height: 13px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 13px solid hsla(0, 2%, 25%, 0.31);
}
.item__quantity .v-input__control .v-input__slot {
  min-height: auto !important;
  display: flex !important;
  height: 30px;
  margin-top: 5px;
  margin-left: 0;
  margin-right: 0;
  padding-left: 0px;
  padding-right: 0px;
}
</style>

<style scoped>
.v-card__subtitle,
.v-card__text,
.v-card__title {
  padding: 0;
}
.sticky-tabs {
  position: fixed;
  top: 30px;
  margin-left: -20px;
  /* width: 100%; */
  z-index: 1000;
}
</style>
