<template>
  <v-overlay :value="true" v-if="!errorStatus">
    <v-progress-circular
      color="blue darken-4"
      indeterminate
      size="64"
    ></v-progress-circular>
  </v-overlay>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  props: [],

  computed: {
    ...mapGetters(['error', 'errorStatus']),
  },
};
</script>
