<template>
  <v-alert
    type="error"
    dismissible
    @input="onClose"
    :value="true"
    class="font-weight-bold body-1 mt-5 mx-auto"
    transition="scale-transition"
    color="red darken-3"
    style="width:80%; max-width:600px;"
    light
  >
    {{text}}
  </v-alert>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["text"],
  methods: {
    onClose() {
      this.$emit("dismissed");
    },
  },
  computed: {
    ...mapGetters(["error"]),
  },
};
</script>

<style>
.error__alert .v-alert__wrapper .v-icon {
  margin-top: 5px;
}
</style>

