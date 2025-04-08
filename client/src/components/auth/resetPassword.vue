<template>
  <v-container class="text-center mx-auto">
    <!-- Main Content -->
    <v-row wrap justify="center">
      <v-col cols="12" class="text-center">
        <!-- Reset Password Form -->
        <v-card
          elevation="1"
          dense
          class="mx-auto"
          max-width="600"
          style="overflow: hidden"
          :style="appLightBackground"
        >
          <v-row justify="center" :style="appTheme1">
            <v-col class="text-center">
              <v-card-text
                class="text-center text--darken-2 mx-auto font-weight-black my-2 py-2"
                style="overflow: hidden"
              >
                <h2>Reset Password</h2>
              </v-card-text>
            </v-col>
          </v-row>
          <v-card-text>
            <v-form
              dense
              id="update-password--form"
              v-model="updatePasswordIsFormValid"
              lazy-validation
              ref="updatePasswordForm"
              class="my-0 py-0"
            >
              <!-- Email-->
              <v-row v-if="!resetPasswordActive" class="mt-5 mb-0">
                <v-col>
                  <v-text-field
                    v-model="userEmail"
                    :rules="validationRules.email"
                    dense
                    prepend-icon="email"
                    label="Email"
                    type="text"
                  ></v-text-field>
                </v-col>
              </v-row>
              <div v-if="resetPasswordActive">
                <!-- Email-->
                <v-row class="mt-5 mb-0">
                  <v-col>
                    <v-text-field
                      v-model="user.userEmail"
                      dense
                      readonly
                      prepend-icon="email"
                      label="Email"
                      type="text"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <!-- New Password -->
                <v-row class="my-0">
                  <v-col class="my-0">
                    <v-text-field
                      dense
                      v-model="newPassword"
                      prepend-icon="extension"
                      :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="showNewPassword = !showNewPassword"
                      :type="showNewPassword ? 'text' : 'password'"
                      label="New Password"
                      :rules="validationRules.password"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
                <!-- Confirm new Password -->
                <v-row class="my-0">
                  <v-col class="my-0">
                    <v-text-field
                      dense
                      v-model="confirmNewPassword"
                      prepend-icon="gavel"
                      :append-icon="
                        showConfirmNewPassword ? 'mdi-eye' : 'mdi-eye-off'
                      "
                      @click:append="
                        showConfirmNewPassword = !showConfirmNewPassword
                      "
                      :type="showConfirmNewPassword ? 'text' : 'password'"
                      label="Confirm New Password"
                      :rules="confirmPassword"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-row justify="center" class="my-2">
              <!-- Update Password button -->
              <v-col cols="12" md="12" sm="12" class="text-center">
                <v-btn
                  style="width: 100%; max-width: 500px"
                  text
                  class="app__button mx-0 px-0"
                  :class="appDark ? 'blue darken-4' : 'blue lighten-4'"
                  :light="!loading"
                  small
                  :disabled="loading || !updatePasswordIsFormValid"
                  @click="
                    resetPasswordActive ? handleUpdatePassword() : sendOtp()
                  "
                >
                  <div class="text-center" style="width: 100%">
                    {{ resetPasswordActive ? 'Update password' : 'Continue' }}
                  </div>
                  <v-spacer></v-spacer>
                  <v-progress-circular
                    class="pl-2 pr-2 ml-2"
                    v-if="loading"
                    indeterminate
                    :size="16"
                  ></v-progress-circular>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'resetPassword',
  data() {
    return {
      userVerifyOtp: null,
      loader: null,
      isValidOTP: false,
      showConfirmNewPassword: false,
      confirmPassword: [
        (confirmation) =>
          confirmation === this.newPassword || 'Passwords must match',
      ],
      showNewPassword: false,
      newPassword: '',
      confirmNewPassword: '',
      updatePasswordDialog: false,
      updatePasswordIsFormValid: false,
    };
  },
  computed: {
    ...mapGetters([
      'validationRules',
      'user',
      'userId',
      'email',
      'resetPasswordActive',
      'error',
      'errorStatus',
      'appDark',
      'loading',
      'appName',
      'userId',
      'appThemeFontColor',
      'appLightBackground',
      'appThemeFontColor1',
      'appTheme1',
      // "progressing",
    ]),
    progressing: {
      get() {
        return this.$store.getters.progressing;
      },
      set(value) {
        this.$store.commit('setProgressing', value);
      },
    },
    userVerificationContext: {
      get() {
        return this.$store.getters.userVerificationContext;
      },
      set(value) {
        this.$store.commit('setUserVerificationContext', value);
      },
    },
    userEmail: {
      get() {
        return this.$store.getters.userEmail;
      },
      set(value) {
        this.$store.commit('setUserEmail', value);
      },
    },
    appName() {
      return process.env.VUE_APP_NAME;
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.progressing = false;
    });
  },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];
      setTimeout(() => (this[l] = false), 3000);
      this.loader = null;
    },
  },
  methods: {
    onDismissed() {
      this.$store.dispatch('clearError');
    },
    // Handling Dialogs
    handleDialog(content, context) {
      this.$store.dispatch('handleDialog', {
        content: content,
        context: context,
      });
    },
    async sendOtp() {
      if (this.userEmail === '') {
        this.handleDialog(null, 'formNotValid');
        return;
      }
      const context = 'resetPassword';
      // setting user email.
      if (this.user) {
        this.user.userEmail = this.userEmail;
        this.$store.commit('setUser', this.user);
      } else {
        this.$store.commit('setUser', { userEmail: this.userEmail });
      }
      const payload = {
        userId: this.userId ? this.userId : null,
        email: this.userEmail !== '' ? this.userEmail : null,
        context,
      };
      // console.log('payload:', payload);
      // this.$store.dispatch('setLoading',true)
      this.$store.commit('setUserVerificationContext', context);
      await this.$store.dispatch('sendOtp', payload);
    },
    async handleUpdatePassword() {
      if (!this.$refs.updatePasswordForm.validate()) {
        this.handleDialog(null, 'formNotValid');
        return;
      }
      if (this.newPassword !== this.confirmNewPassword) {
        this.handleDialog(null, 'passwordsNotMatching');
        return;
      }
      // this.$store.dispatch('setLoading',true)
      await this.$store.dispatch('resetPassword', {
        userId: this.userId,
        newPassword: this.newPassword,
      });
    },
  },
  created() {
    this.$store.commit('setUserEmail', '');
  },
};
</script>
<style scoped>
/* .user__verify--card {
  border: 1px solid rgb(179, 230, 230) !important;
}
.user__verify {
  margin: auto 30%;
} */
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
