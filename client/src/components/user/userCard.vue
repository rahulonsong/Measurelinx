<template>
  <v-card-text class="mt-5 pa-0 px-3">
    <!-- Account and Orders -->
    <v-row class="mx-0 pa-0 my-2" justify="center">
      <v-col class="ma-0 pa-0">
        <v-btn text @click="manageAccount()" small color="primary">
          <v-icon small> account_box </v-icon>
          Account
        </v-btn>
      </v-col>
      <v-col class="ma-0 pa-0 text-right">
        <v-btn small @click="manageOrders()" color="primary" text>
          <span class="my-3">
            <v-icon small> receipt </v-icon>
            Orders
          </span>
        </v-btn>
      </v-col>
    </v-row>
    <!-- Addresses and  -->
    <v-row class="ma-0 pa-0" justify="center">
      <v-col class="ma-0 pa-0">
        <v-btn small @click="manageAddresses()" color="primary" text>
          <span class="my-3">
            <v-icon small> home </v-icon>
            Addresses
          </span>
        </v-btn>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script>
export default {
  methods: {
    manageAddresses() {
      this.$store.commit('setUserCard', false);
      if (this.$route.name !== 'addressesByUser') {
        this.$router.push({ name: 'addressesByUser' }).catch();
      }
    },
    manageOrders() {
      this.$store.commit('setUserCard', false);
      if (this.$route.name !== 'ordersByUser') {
        this.$router.push({ name: 'ordersByUser' }).catch();
      }
    },
    // Loading Profile
    manageAccount() {
      this.$store.commit('setUserCard', false);
      if (this.$route.name !== 'account') {
        this.$router.push({ name: 'account' });
      }
      this.$store.commit('setProgressing', false);
    },
  },
};
</script>
