<template>
  <!-- Home Screeen Data -->
  <div>
    <!-- <v-btn @click="test">Test</v-btn> -->
    <!-- Subscription -->
    <div>
      <v-container fluid class="ma-0 pa-0">
        <v-row class="ma-0 pa-0" justify="center">
          <!-- Subscription -->
          <v-col cols="12" align="center" class="text-center">
            <v-card class="mx-auto pr-3 my-0 py-0" max-width="650">
              <v-card-title
                class="my-0 py-0 light-blue--text text--darken-3 text-h6"
                style="white-space: nowrap"
              >
                Stay Tuned with&nbsp;<span :style="appThemeFontColor"></span>
                <span
                  style="white-space: nowrap"
                  class="orange--text text--darken-2"
                  >&nbsp;{{ brandName }}</span
                >
              </v-card-title>
              <div>
                <v-divider></v-divider>
                <v-form
                  @submit.prevent="handleSubscribeUser()"
                  v-model="subscriberFormValid"
                  ref="subscriberForm"
                  lazy-validation
                >
                  <v-card-text>
                    <div class="html-text__justify">
                      Subscribe to {{ brandName }} for updates and more news
                      about products of Chempoo.
                    </div>
                    <!-- Name -->
                    <v-row class="mt-5" v-if="false">
                      <!-- First Name -->
                      <v-col>
                        <v-text-field
                          v-model="subscriberFirstName"
                          clearable
                          :readonly="false"
                          :filled="false"
                          dense
                          :disabled="false"
                          hide-spin-buttons
                          hide-details
                          hint=" "
                          :outlined="false"
                          placeholder="First Name"
                          label="First Name"
                          prepend-icon="badge"
                        >
                        </v-text-field>
                      </v-col>
                      <!-- Last Name -->
                      <v-col>
                        <v-text-field
                          v-model="subscriberLastName"
                          clearable
                          :readonly="false"
                          :filled="false"
                          dense
                          :disabled="false"
                          hide-spin-buttons
                          hide-details
                          hint=" "
                          :outlined="false"
                          placeholder="Last Name"
                          label="Last Name"
                          prepend-icon="badge"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <!-- Email -->
                    <v-row class="mt-5">
                      <v-col>
                        <v-text-field
                          v-model="subscriberEmail"
                          clearable
                          :readonly="false"
                          dense
                          autogrow
                          rows="3"
                          :disabled="false"
                          hide-details
                          :outlined="false"
                          :rules="validationRules.email"
                          placeholder="Enter Email"
                          label="Email"
                          prepend-icon="email"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      small
                      type="submit"
                      :disabled="loading || !subscriberFormValid"
                      class="primary darken-4 bold px-4 mx-auto"
                    >
                      <v-icon class="mr-2">notifications</v-icon>
                      Subscribe
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'home',
  data() {
    return {
      show: false,
      subscriberFormValid: false,
    };
  },

  methods: {
    test() {
      // testing GraphQL projects
      // this.$store.dispatch("getProjects");
      // console.log('homeScreendata:', this.homeScreenData);
    },
    // Handling Dialogs
    handleDialog(content, context) {
      this.$store.dispatch('handleDialog', {
        content: content,
        context: context,
      });
    },
    clearSubscriberForm() {
      this.subscriberFirstName = '';
      this.subscriberLastName = '';
      this.subscriberEmail = '';
      this.$nextTick(() => {
        this.$refs.subscriberForm.resetValidation();
      });
    },
    async handleSubscribeUser() {
      if (this.$refs.subscriberForm.validate()) {
        // alert("This will subscribe the user!");
        const payload = {
          subscriberInput: {
            firstName: this.subscriberFirstName,
            lastName: this.subscriberLastName,
            email: this.subscriberEmail,
          },
        };
        await this.$store.dispatch('subscribeUser', payload);
        // Clear the form
        this.clearSubscriberForm();
      } else {
        this.handleDialog('formNotValid');
      }
    },
    async downloadCalendar() {
      // alert("This will download 2023 calendar!");
      // Downloading he calendar from the  server
      await this.$store.dispatch('downloadCalendar');
    },
  },
  computed: {
    ...mapGetters([
      'user',
      'appThemeFontColor',
      'appDark',
      'validationRules',
      'loading',
    ]),
    subscriberFirstName: {
      get() {
        return this.$store.getters.subscriberFirstName;
      },
      set(value) {
        this.$store.commit('setSubscriberFirstName', value);
      },
    },
    subscriberLastName: {
      get() {
        return this.$store.getters.subscriberLastName;
      },
      set(value) {
        this.$store.commit('setSubscriberLastName', value);
      },
    },
    subscriberEmail: {
      get() {
        return this.$store.getters.subscriberEmail;
      },
      set(value) {
        this.$store.commit('setSubscriberEmail', value);
      },
    },
    brandName() {
      return process.env.VUE_APP_NAME;
    },
  },

  mounted() {
    this.$store.commit('setProgressing', false);
  },
  created() {
    this.clearSubscriberForm();
  },
};
</script>

<style lang="scss"></style>
