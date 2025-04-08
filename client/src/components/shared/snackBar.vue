<template>
  <!-- Snackbar -->
  <!-- :dark="!appDark"
    :light="appDark" -->
  <v-snackbar
    dark
    left
    title
    v-model="snackBar"
    :timeout="snackBarTimeOut"
    min-width="300"
    max-width="320"
  >
    <v-icon color="success" class="mr-2">check_circle</v-icon>
    {{ snackBarText }}
    <v-btn
      v-if="targetRequired"
      text
      color="primary"
      small
      :to="targetLink"
      @click="exitSnackbar"
      class="ml-2"
    >
      {{ targetText }}
    </v-btn>
    <template v-slot:action="{ attrs }">
      <v-btn color="error" icon fab x-small>
        <v-icon v-bind="attrs" @click="exitSnackbar" medium>close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  // props: {
  //   snackBarText: String,
  //   timeout: String,
  //   target: Boolean,
  //   targetText: String,
  //   targetLink: String,
  // },
  // props: ["text", "timeout", "target", "targetName", "targetLink"],
  watch: {
    snackbar(newValue) {
      if (!newValue) {
        this.$store.commit('setTargetRequired', false);
        this.$store.commit('setTargetText', '');
        this.$store.commit('setTargetLink', '');
        this.$store.commit('setSnackBarText', '');
      }
    },
  },
  computed: {
    ...mapGetters([
      'error',
      'errorStatus',
      'snackBarTimeOut',
      'appDark',
      'snackBarText',
      'timeout',
      'targetRequired',
      'targetText',
      'targetLink',
    ]),
    snackBar: {
      get() {
        return this.$store.getters.snackBar;
      },
      set(value) {
        this.$store.commit('setSnackBar', value);
      },
    },
  },
  created() {
    this.$nextTick(() => {
      const snackbars = document.querySelectorAll('.v-snack__wrapper');
      snackbars.forEach((snackbar) => {
        snackbar.style.maxWidth = '200px';
      });
    });
  },
  methods: {
    exitSnackbar() {
      this.snackBar = false;
    },
  },
  beforeUnmount() {
    this.$store.commit('setTargetRequired', false);
  },
};
</script>
