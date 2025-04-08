<template>
  <v-container fluid>
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
                      sm="7"
                      md="8"
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
    <!-- Main data -->
    <div v-if="reviewsByUserDataReceived">
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
            <v-card class="mt-0 pt-0">
              <!--  title -->
              <v-row wrap justify="center" align="center" class="ma-0 pa-0">
                <v-col cols="12" md="12" sm="12" class="text-center ma-0 pa-0">
                  <v-toolbar>
                    <v-toolbar-title class="mx-auto text-h5">
                      {{ pageTitle }}</v-toolbar-title
                    >
                  </v-toolbar>
                </v-col>
              </v-row>
              <!-- <v-btn @click="test">Test</v-btn> -->
              <!-- Displaying main Data-->
              <div>
                <!-- Displaying Data-->
                <v-card elevation="5" class="pa-0 pointerMouse">
                  <v-card-text class="pt-3">
                    <!-- Displaying Content -->
                    <v-row
                      v-for="(review, index) in user.reviewsByUser"
                      :key="'review' + index"
                      class="my-0 py-0"
                      justify="start"
                    >
                      <!-- Item image -->
                      <v-col
                        cols="12"
                        sm="4"
                        md="2"
                        class="my-0 py-0 text-left"
                      >
                        <v-img
                          v-if="
                            review.item.images.length &&
                            review.item.images[0].imageUrl
                          "
                          :src="review.item.images[0].imageUrl"
                          alt="Item Image"
                          background-color="rgba(200,200,200,0.3)"
                          max-height="100"
                          id="thumbnail"
                          contain
                        >
                        </v-img>
                        <v-img
                          v-else
                          src="@/assets/images/cart_item.png"
                          alt="Item Image"
                          background-color="rgba(200,200,200,0.3)"
                          max-height="100"
                          id="thumbnail"
                          contain
                        >
                        </v-img>
                      </v-col>
                      <!-- Review details -->
                      <v-col
                        cols="12"
                        sm="8"
                        md="10"
                        class="my-0 py-0 text-left"
                      >
                        <v-list three-line>
                          <v-list-item :key="review.item.name">
                            <v-list-item-content>
                              <v-list-item-title
                                v-text="review.item.name"
                                class="primary--text"
                              ></v-list-item-title>
                              <v-list-item-subtitle
                                class="text--primary font-weight-medium subtitle-1"
                                v-text="review.caption"
                              ></v-list-item-subtitle>
                              <v-list-item-subtitle
                                :style="appThemeFontColor"
                                v-text="review.text"
                              ></v-list-item-subtitle>
                              <v-list-item-subtitle>
                                Reviewed
                                {{
                                  review.country ? 'in ' + review.country : ''
                                }}
                                on
                                {{
                                  convertTimestamp(review.updatedAt)
                                }}</v-list-item-subtitle
                              >
                            </v-list-item-content>
                            <!-- Edit action -->
                            <v-list-item-action>
                              <v-list-item-action-text>
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
                                      @click="handleEditReview(review)"
                                    >
                                      <v-icon>edit</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Edit this review</span>
                                </v-tooltip>
                              </v-list-item-action-text>
                              <v-rating
                                v-if="review.rating && review.rating.value"
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
                            </v-list-item-action>
                          </v-list-item>
                          <!-- Divider -->
                          <v-divider
                            v-if="index < user.reviewsByUser.length - 1"
                            :key="index"
                          ></v-divider>
                        </v-list>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </div>
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
  name: 'reviewsByUser',
  data() {
    return {
      // reviewsByUserDataReceived: false,
      pageTitle: 'Reviews Written by You',
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
      resourceTags: [],
      itemReviewDialog: false,
      reviewRatingValue: null,
      reviewNickName: '',
      reviewTitle: '',
      reviewText: '',
      isItemReviewFormValid: false,
      activeReviewId: '',
      activeRatingId: '',
      activeItemId: '',
    };
  },
  computed: {
    ...mapGetters([
      'user',
      'error',
      'errorStatus',
      'loading',
      'appDark',
      'appThemeFontColor',
      'validationRules',
      'reviewsByUserDataReceived',
      'initializeAppComplete',
      'randomColor',
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
    alphaResourceTags: {
      get() {
        return this.$store.getters.alphaResourceTags;
      },
      set(value) {
        this.$store.commit('setAlphaResourceTags', value);
      },
    },
  },
  async created() {
    // setting resourceReceivedFlag to false
    this.progressing = true;
    this.getReviewsByUser();
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
        //   Do action for this Page
        this.getReviewsByUser();
      }
    },
    $route(to, from) {
      // Check data received and perform action
      this.getReviewsByUser();
    },
  },
  methods: {
    clearDialog(result) {
      this.dialogResult = result;
      if (result === 'yes') {
        // if (this.dialogContext === "disableResource") {
        //   this.handleDisableAlphaResource();
        // }
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
    async getReviewsByUser() {
      if (this.initializeAppComplete) {
        this.$store.commit('setReviewsByUserDataReceived', false);
        //    perform async action for this page
        await this.$store.dispatch('getReviewsByUser');
      }
    },
    test() {
      // console.log('ResourceContent:', this.alphaResourceContent);
    },
    // handleEditReview(review) {
    //   alert("this opens up review dialog!");
    // },
    // async handleSomeAction() {
    //     // find index
    //   let someThing = this.someAray.find(
    //     (el) => el._id === this.item._id
    //   );
    //   let someIndex = this.someAray.indexOf(someThing);
    //   const payload = {
    //     //   some fields
    //   };
    //   // sending to database
    //   await this.$store.dispatch("someAction", payload);
    //   //  Perform steps after receiving server resposne
    //   this.$store.dispatch("someAction2");
    // },
    convertTimestamp(date) {
      return moment(date).format('MMM DD, YYYY');
    },
    handleEditReview(review) {
      this.activeReviewId = review._id;
      this.activeRatingId = review.rating ? review.rating._id : null;
      this.activeItemId = review.item._id;
      this.reviewRatingValue = review.rating ? review.rating.value : null;
      this.reviewNickName = review.nickName;
      this.reviewTitle = review.caption;
      this.reviewText = review.text;
      this.itemReviewDialog = true;
    },
    async saveItemReviewDialog() {
      // console.log('this will upload item');
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
            ratingId: this.activeRatingId,
            ratingInput: {
              value: this.reviewRatingValue,
              item: this.activeItemId,
            },
          };
          // Update rating
          if (payload.ratingId) {
            rating = await this.$store.dispatch('updateRating', payload);
          }
          // add rating
          else {
            delete payload.ratingId;
            rating = await this.$store.dispatch('addRating', payload);
          }
        }
        let review;
        payload = {
          reviewId: this.activeReviewId,
          reviewInput: {
            rating: rating ? rating._id : '',
            caption: this.reviewTitle,
            nickName: this.reviewNickName,
            text: this.reviewText,
            item: this.activeItemId,
          },
        };
        review = await this.$store.dispatch('updateReview', payload);
        if (review || rating) {
          await this.getReviewsByUser();
        }
        this.clearItemReviewDialog();
        this.itemReviewDialog = false;
      } else {
        this.$store.dispatch('handleDialog', {
          context: 'formNotValid',
          content: null,
        });
      }
    },
    clearItemReviewDialog() {
      this.itemReviewDialog = false;
      this.reviewRatingValue = null;
      this.reviewTitle = '';
      this.reviewText = '';
      this.reviewNickName = '';
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
  border-radius: 15px;
}
</style>
