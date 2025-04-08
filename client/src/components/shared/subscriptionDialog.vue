<template>
  <v-dialog v-model="subscriptionDialog" persistent max-width="600px">
    <v-card>
      <v-card-text class="my-2 py-0">
        <v-row justify="center" class="my-0 py-0">
          <v-col class="text-center mb-0 pb-0">
            <!-- Logo -->
            <img :src="logoUrl" height="30" :alt="brandName" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-title class="text-h6 my-0 py-0"
        >Stay Tuned with
        <span class="orange--text text--darken-2"
          >&nbsp;{{ brandName }}</span
        ></v-card-title
      >
      <v-card-text class="mt-2 pt-2 mb-0 pb-0">
        <p>
          Subscribe to {{ brandName }} for updates and more news about our
          products!
        </p>
        <v-form
          @submit.prevent="handleSubscribeUser()"
          v-model="subscriberFormValid"
          ref="subscriberForm"
          lazy-validation
          class="my-0 py-0"
        >
          <v-card-text class="my-0 py-0">
            <!-- Name -->
            <v-row class="mt-5">
              <!-- First Name -->
              <v-col v-if="false">
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
              <v-col v-if="false">
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
            <v-row>
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
          <v-card-actions class="my-2 py-2">
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
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text small @click="clearSubscriberForm"
          >I am not Interested</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import Cookies from 'js-cookie';
export default {
  data() {
    return {
      show: false,
      subscriberFormValid: false,
      // ... other data properties
    };
  },
  mounted() {
    // Delaying subscription dialog logic by 5 seconds
    setTimeout(() => {
      this.initializeDialog();
    }, 300000);
  },
  created() {},
  methods: {
    // Handling Dialogs
    handleDialog(content, context) {
      this.$store.dispatch('handleDialog', {
        content: content,
        context: context,
      });
    },
    initializeDialog() {
      // Check if the dialog should be shown
      if (this.user && this.user.subscription) {
        if (
          !this.user.subscription.subscribed &&
          !this.user.subscription.userUnsubscribed
        ) {
          this.$store.commit('setSubscriptionDialog', true);
        }
      } else if (
        !Cookies.get(`${this.brandName.replace(/\s/g, '')}Subscribed`)
      ) {
        this.$store.commit('setSubscriptionDialog', true);
      }
    },
    clearSubscriberForm() {
      this.$store.commit('setSubscriptionDialog', false);
      this.subscriberFirstName = '';
      this.subscriberLastName = '';
      this.subscriberEmail = '';
      this.$nextTick(() => {
        this.$refs.subscriberForm.resetValidation();
      });
      // setting local storage
      localStorage.setItem(
        `${this.brandName.replace(/\s/g, '')}Subscribed`,
        true
      );
    },
    async handleSubscribeUser() {
      if (this.$refs.subscriberForm.validate()) {
        const payload = {
          subscriberInput: {
            email: this.subscriberEmail,
          },
        };

        // Clear the form
        this.clearSubscriberForm();
        await this.$store.dispatch('subscribeUser', payload);

        let modifiedUser = this.user;
        modifiedUser.subscription = {
          subscribed: true,
          userUnsubscribed: false,
        };

        // ✅ Fix: Set cookie with expiration and security options
        Cookies.set(`${this.brandName.replace(/\s/g, '')}Subscribed`, true, {
          expires: 365, // Cookie will expire in 1 year
          secure: process.env.NODE_ENV === 'production', // Set secure flag only in production
          sameSite: 'Strict', // Helps prevent CSRF attacks
        });

        this.$store.commit('setUser', modifiedUser);
      } else {
        this.handleDialog('formNotValid');
      }
    },
  },
  computed: {
    ...mapGetters([
      'user',
      'appThemeFontColor',
      'appLightBackground',
      'appDark',
      'validationRules',
      'loading',
      'subscriptionDialog',
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
    logoUrl() {
      return process.env.VUE_APP_BRAND_LOGO_URL;
    },
  },
};
</script>
