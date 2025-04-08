<template>
  <!-- Dialog for Add/Update review -->
  <div>
    <!-- Rating Caption -->
    <v-row
      class="my-0 py-0"
      justify="start"
    >
      <v-col
        class="my-0 py-0 text-left"
        align="center"
      >
        <p
          class="body-1 font-weight-medium"
          :style="appThemeFontColor"
        >Overall Rating</p>
      </v-col>
    </v-row>
    <!-- Rating -->
    <v-row
      class="my-2 py-0"
      justify="start"
    >
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
          :background-color=" appDark? 'grey lighten-3': 'grey darken-3'"
          empty-icon="star_outline"
          full-icon="star"
          half-icon="star_half"
          length="5"
          :value="reviewRatingValue"
        ></v-rating>
      </v-col>
      <v-spacer></v-spacer>
      <!-- Clear rating -->
      <v-col
        v-if="reviewRatingValue"
        class="my-0 py-0 text-right"
        align="center"
        cols="12"
        sm="5"
        md="4"
      >
        <v-btn
          dense
          x-small
          class="primary darken-4 font-weight-bold"
          color="primary"
        >Clear</v-btn>
      </v-col>
    </v-row>
    <!-- Nick Name Caption -->
    <v-row
      class="my-0 py-0"
      justify="start"
    >
      <v-col
        class="mt-5 py-0 text-left"
        align="center"
      >
        <p
          class="body-1 font-weight-medium"
          :style="appThemeFontColor"
        >Nick Name</p>
      </v-col>
    </v-row>
    <!-- User Nick name -->
    <v-row
      class="my-0 py-0"
      justify="start"
    >
      <v-col
        class="my-0 py-0 text-left"
        align="center"
      >
        <v-text-field
          dense
          outlined
          class="my-0 py-0"
          style="font-size:1.1em;"
          :value="reviewNickName"
          prepend-icon="badge"
          placeholder="How would you like your name to appear on the review"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <!-- Title  -->
    <v-row
      class="mt-2 py-0"
      justify="start"
    >
      <v-col
        class="my-0 py-0 text-left"
        align="center"
      >
        <p
          class="body-1 font-weight-medium my-0 py-0"
          :style="appThemeFontColor"
        >Add a Title</p>
      </v-col>
    </v-row>
    <!-- Review Title -->
    <v-row
      class="mt-5 py-0"
      justify="start"
    >
      <v-col
        class="my-0 py-0 text-left"
        align="center"
      >
        <v-text-field
          dense
          outlined
          class="my-0 py-0"
          style="font-size:1.1em;"
          :value="reviewTitle"
          prepend-icon="title"
          placeholder="What's your impression in a few words"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <!-- Review Text Caption  -->
    <v-row
      class="mt-5 py-0"
      justify="start"
    >
      <v-col
        class="my-0 py-0 text-left"
        align="center"
      >
        <p
          class="body-1 font-weight-medium py-0 my-0"
          :style="appThemeFontColor"
        >Add Review Comment</p>
      </v-col>
    </v-row>
    <!-- review text-->
    <v-row>
      <v-col>
        <v-textarea
          outlined
          class="my-0 py-0"
          style="font-size:1.1em;"
          :value="reviewText"
          required
          rows="4"
          auto-grow
          prepend-icon="article"
          placeholder="How do you find the product? What do you like or dislike about it?"
        >
        </v-textarea>
      </v-col>
    </v-row>
  </div>
</template> 

<script>
import { mapGetters } from "vuex";
export default {
  props: ["reviewRatingValue", "reviewNickName", "reviewTitle", "reviewText"],

  computed: {
    ...mapGetters([
      "error",
      "errorStatus",
      "appDark",
      "appThemeFontColor",
    ]),
  },
  methods: {
    clearRatingValue() {
      this.$emit("clearRatingValue");
    },
    saveItemReviewDialog() {
      this.$emit("saveItemReviewDialog");
    },
    clearItemReviewDialog() {
      this.$emit("clearItemReviewDialog");
    },
    // exitSnackbar() {
    //   this.snackBar = false;
    // },
  },
};
