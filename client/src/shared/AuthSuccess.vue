<template>
  <v-container class="text-center">
    <v-row justify="center">
      <v-col cols="12">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Cookies from 'js-cookie';
import { mapActions } from 'vuex';

export default {
  name: 'AuthSuccess',
  async mounted() {
    try {
      // ✅ Extract the authentication token from the cookie
      const token =
        Cookies.get('papiloomToken') ||
        (await this.$store.dispatch('getCookieValue', 'papiloomToken'));

      if (!token) {
        throw new Error('Authentication failed. No token found.');
      }

      // ✅ Set the token in Vuex
      this.$store.commit('setToken', token);

      // ✅ Fetch the authenticated user data
      await this.$store.dispatch('getCurrentUser');

      // ✅ Redirect to dashboard or home
      if (this.$router.currentRoute.name !== 'home') {
        this.$router.push({ name: 'home' });
      }
    } catch (error) {
      console.error('OAuth Login Failed:', error);
    }
  },
  methods: {
    ...mapActions(['getCurrentUser']),
  },
};
</script>
