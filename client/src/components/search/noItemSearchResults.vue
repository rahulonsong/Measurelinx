<template>
  <v-container fluid>
    <v-row class="my-0 py-0">
      <v-col cols="12" class="my-0 py-0">
        <v-card class="py-0 my-0" elevation="0">
          <v-row justify="center" class="my-0 py-0">
            <v-col cols="12" class="text-center my-0 py-0">
              <img
                src="@/assets/images/noResultsFound.png"
                alt="No Results Found"
                height="400px"
              />
            </v-col>
            <v-col cols="12" class="text-center">
              <p class="subheading-1 grey--text">
                Sorry, we couldn't find any results that match your search.
              </p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'noItemSearchResults',
};
</script>

<style scoped>
/* Custom styles can be added here */
</style>
