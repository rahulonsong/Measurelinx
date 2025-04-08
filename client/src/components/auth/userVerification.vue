<template>
  <v-container class="text-center">
    <!-- Main Content -->
    <v-row wrap justify="center">
      <v-col cols="12" class="text-center">
        <v-card
          :style="appLightBackground"
          elevation="5"
          max-width="600"
          min-width="600"
          class="mx-auto my-10"
        >
          <!-- User Verification-->
          <v-row justify="center">
            <v-col class="text-center">
              <v-card-text
                class="text-center indigo--text text--darken-2 mx-auto font-weight-black my-2 py-2"
                style="overflow: hidden"
              >
                <h2 :style="appThemeFontColor">
                  {{ appName }} User Verification
                </h2>
              </v-card-text>
            </v-col>
          </v-row>

          <!-- New instruction section -->
          <v-card-text class="pb-0">
            <v-sheet
              class="pa-4 mb-4"
              :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'"
              rounded
            >
              <div class="d-flex align-center mb-2">
                <v-icon color="info" class="mr-2"
                  >mdi-information-outline</v-icon
                >
                <span
                  class="subtitle-1 font-weight-medium"
                  :style="appThemeFontColor"
                  >Verification Instructions</span
                >
              </div>
              <p class="text-body-2 text-left" :style="appThemeFontColor">
                We've sent a verification code to your email address. Please
                check your inbox and enter the 6-digit code below to verify your
                account.
              </p>
              <p class="text-body-2 text-left mt-2" :style="appThemeFontColor">
                If you don't see the email in your inbox, please check your spam
                folder.
              </p>
            </v-sheet>
          </v-card-text>

          <v-card-text>
            <v-container class="mx-auto">
              <v-form
                v-model="isValidOTP"
                @submit.prevent="
                  userVerificationContext !== 'resetPassword'
                    ? onUserVerify()
                    : verifyUserForPasswordReset()
                "
              >
                <!-- OTP Field -->
                <v-row justify="center">
                  <v-col cols="12">
                    <div>
                      <v-alert
                        :style="appLightBackground"
                        color="light-blue darken-2"
                        border="left"
                        elevation="1"
                        colored-border
                        icon="info"
                      >
                        Enter the <strong>OTP</strong> received via your
                        registered email.
                      </v-alert>
                    </div>
                    <div>
                      <v-otp-input
                        class="mx-auto"
                        style="max-width: 300px"
                        :rules="validationRules.otp || validationRules.required"
                        v-model="userVerifyOtp"
                        length="6"
                      ></v-otp-input>
                    </div>
                    <!-- <v-text-field id="otp"></v-text-field> -->
                  </v-col>
                </v-row>
                <!-- User Verify button -->
                <v-row justify="center">
                  <v-col cols="12" sm="6">
                    <v-btn
                      rounded
                      small
                      color="primary darken-4"
                      class="user__verify"
                      type="submit"
                      :disabled="loading || !isValidOTP"
                      :loading="loading"
                    >
                      Verify
                      <span slot="loader" class="custom-loader">
                        <v-icon>cached</v-icon>
                      </span>
                    </v-btn>
                  </v-col>
                </v-row>
                <!-- Link to sign up page for unregistered users -->
                <v-row justify="center" mt-4>
                  <v-col cols="12" sm="6">
                    <p>
                      Not received the OTP ?
                      <v-btn text color="primary" small @click="sendOtp()">
                        Resend OTP
                      </v-btn>
                    </p>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'userVerification',
  data() {
    return {
      userVerifyOtp: null,
      loader: null,
      isValidOTP: false,
    };
  },
  computed: {
    ...mapGetters([
      'validationRules',
      'user',
      'userEmail',
      'email',
      'error',
      'errorStatus',
      'loading',
      'appName',
      'userId',
      'appThemeFontColor',
      'appLightBackground',
      'userVerificationContext',
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
    // Handling Dialogs
    handleDialog(content, context) {
      this.$store.dispatch('handleDialog', {
        content: content,
        context: context,
      });
    },
    async onUserVerify() {
      if (!this.userVerifyOtp) {
        this.handleDialog(null, 'formNotValid');
        return;
      }
      // this.$store.dispatch('setLoading',true)
      await this.$store.dispatch('verifyUser', {
        userId: this.userId,
        otp: this.userVerifyOtp.toString(),
      });
    },
    async verifyUserForPasswordReset() {
      if (!this.isValidOTP) {
        this.handleDialog(null, 'formNotValid');
        return;
      }
      const payload = {
        email: this.userEmail,
        otp: this.userVerifyOtp.toString(),
      };
      // console.log('payload:', payload);
      await this.$store.dispatch('verifyUserForPasswordReset', payload);
    },
    onDismissed() {
      this.$store.dispatch('clearError');
    },
    async sendOtp() {
      // this.$store.dispatch('setLoading',true)
      await this.$store.dispatch('sendOtp', {
        userId: this.userId,
        email: this.user ? this.user.userEmail : this.userEmail,
        context: this.userVerificationContext,
      });
    },
  },
  created() {
    if (this.userVerificationContext !== 'resetPassword' && !this.userId) {
      if (this.$route.name !== 'signin') {
        this.$router.push({ name: 'signin' });
      }
    }
  },
};
</script>
<style scoped>
.user__verify--card {
  border: 1px solid rgb(179, 230, 230) !important;
}
.user__verify {
  margin: auto 30%;
}
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
