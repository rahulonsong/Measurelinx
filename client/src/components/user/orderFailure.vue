<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="headline secondary lighten-4">
            <v-icon color="red" size="32">mdi-alert-circle-outline</v-icon>
            <span class="ml-2">Order Failed</span>
          </v-card-title>
          <v-card-text class="subtitle-1">
            <p>
              Sorry, your order could not be processed. Please try again later
              or contact customer support. If payment has been deducted, it will
              be credited back to the original payment method.
            </p>
            <v-btn color="primary" text @click="goBack">
              <v-icon left>mdi-arrow-left</v-icon>
              Back to Cart
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'orderFailure',
  methods: {
    goBack() {
      // Code to navigate back to the cart page
      if (this.$route.name !== 'userCart') {
        this.$router.push({ name: 'userCart' });
      }
    },
  },
};
</script>

<style scoped>
/* Add custom styles here */
</style>
