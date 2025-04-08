<template>
  <v-toolbar-title class="headline text-uppercase mx-0 px-0">
    <router-link
      :to="{ name: 'home' }"
      custom
      v-slot="{ navigate }"
      class="router-link"
    >
      <span
        style="cursor: pointer"
        @click="navigate"
        class="d-flex align-center"
      >
        <img :src="logoUrl" height="30" :alt="brandName" class="brand-logo" />
        <span
          v-if="$vuetify.breakpoint.width > 350"
          class="brand-name ml-2 font-weight-black text-capitalize deep-orange--text text--accent-3 body-1"
        >
          {{ brandName }}
        </span>
      </span>
    </router-link>
  </v-toolbar-title>
</template>

<script>
export default {
  name: 'brandNameRouter',
  computed: {
    logoUrl() {
      return process.env.VUE_APP_BRAND_LOGO_URL;
    },
    brandName() {
      return process.env.VUE_APP_NAME;
    },
  },
};
</script>

<style scoped>
.router-link {
  text-decoration: none;
  display: block;
  height: 100%;
}

.brand-logo {
  display: inline-block;
  vertical-align: middle;
}

.brand-name {
  display: inline-block;
  vertical-align: middle;
  line-height: 30px; /* Match the logo height */
}
</style>
