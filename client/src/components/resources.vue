<template>

  <div>
    <h2 class="ma-4 white--text ">This is the resources page</h2>
  </div>

</template>

<script>
export default {
  computed: {
    progressing: {
      get() {
        return this.$store.getters.progressing;
      },
      set(value) {
        this.$store.commit("setProgressing", value);
      },
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.progressing = false;
    });
  },
};
</script>