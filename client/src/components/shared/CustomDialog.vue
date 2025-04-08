<template>
  <v-dialog v-model="dialog.show" max-width="500px" persistent>
    <v-card>
      <v-card-title class="headline">{{ dialog.title }}</v-card-title>
      <v-card-text>
        <p v-if="dialog.text">{{ dialog.text }}</p>
        <div v-if="dialog.html" v-html="dialog.html"></div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="handleClose">
          {{ dialog.btnText || 'OK' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'CustomDialog',
  computed: {
    ...mapState({
      dialog: (state) => state.dialog,
    }),
  },
  methods: {
    handleClose() {
      // Close the dialog
      this.$store.commit('setDialog', {
        ...this.dialog,
        show: false,
      });

      // Execute callback if provided
      if (typeof this.dialog.btnCallback === 'function') {
        this.dialog.btnCallback();
      }
    },
  },
};
</script>
