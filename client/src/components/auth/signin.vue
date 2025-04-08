<template>
  <v-container class="text-center">
    <!-- Error -->
    <v-row v-if="errorStatus">
      <v-col cols="12" sm="12">
        <!-- <app-alert @dismissed='onDismissed' :text="error.message"></app-alert> -->
      </v-col>
    </v-row>
    <!-- Main Content -->
    <v-row wrap justify="center">
      <v-col cols="12" class="text-center">
        <v-card elevation="1" max-width="600" class="mx-auto my-10 px-0 mx-0">
          <div v-if="initializeAppComplete">
            <!-- Logo -->
            <v-row class="mt-10 pt-5" justify="center">
              <v-col
                class="ma-0 pa-0 text-center"
                md="2"
                sm="2"
                style="max-width: 100px"
              >
                <span class="mx-1">
                  <img :src="logoUrl" height="30" alt="app" />
                </span>
              </v-col>
            </v-row>
            <!-- Brand name -->
            <v-row justify="center" class="my-0 py-0">
              <v-col class="text-center my-2 py-0">
                <v-card-text
                  class="text-center text--darken-2 mx-auto font-weight-black py-1"
                  style="overflow: hidden"
                >
                  <h2>{{ brandName }}</h2>
                </v-card-text>
              </v-col>
            </v-row>
            <v-card-text class="mx-0 px-0 py-0">
              <v-container class="mx-auto my-0 py-2">
                <!-- ✅ Social Login Section -->
                <v-row justify="center" class="mt-3">
                  <!-- Facebook Button -->
                  <v-col cols="12">
                    <v-btn
                      block
                      class="social-button facebook-btn"
                      @click="loginWithFacebook"
                      elevation="2"
                    >
                      <v-img
                        src="@/assets/facebook-icon.svg"
                        contain
                        max-height="24"
                        max-width="24"
                        class="mr-2"
                      ></v-img>
                      <span>Login with Facebook</span>
                    </v-btn>
                  </v-col>

                  <!-- Google Button -->
                  <v-col cols="12">
                    <v-btn
                      block
                      class="social-button google-btn"
                      @click="loginWithGoogle"
                      elevation="2"
                    >
                      <v-img
                        src="@/assets/google-icon.svg"
                        contain
                        max-height="24"
                        max-width="24"
                        class="mr-2"
                      ></v-img>
                      <span>Login with Google</span>
                    </v-btn>
                  </v-col>
                </v-row>

                <!-- OR Divider -->
                <v-divider class="my-4"> </v-divider>
                <v-row>
                  <v-col>
                    <p class="text-center text-subtitle-1 font-weight-medium">
                      Or Sign in with Email
                    </p>
                  </v-col>
                </v-row>
                <v-form
                  @submit.prevent="onSignin"
                  v-model="signInIsFormValid"
                  lazy-validation
                  ref="signInForm"
                  class="mx-0 px-0"
                >
                  <v-tabs v-model="activeTab" centered>
                    <v-tab>Email</v-tab>
                    <v-tab>Phone</v-tab>
                  </v-tabs>

                  <v-tabs-items v-model="activeTab">
                    <!-- Email Password -->
                    <v-tab-item>
                      <!-- Email Field -->
                      <v-row justify="center">
                        <v-col cols="12" sm="12">
                          <v-text-field
                            name="email"
                            class="mt-2"
                            id="email"
                            :rules="emailRules"
                            label="Email"
                            v-model="email"
                            type="email"
                            placeholder="email"
                            required
                            outlined
                            dense
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <!-- Password Field -->
                      <v-row justify="center">
                        <v-col cols="12" sm="12">
                          <v-text-field
                            :append-icon="
                              show_pw ? 'visibility' : 'visibility_off'
                            "
                            :rules="passwordRules"
                            :type="show_pw ? 'text' : 'password'"
                            name="password"
                            label="Password"
                            hint="At least 8 characters"
                            v-model="password"
                            class="input-group--focused mt-2"
                            @click:append="show_pw = !show_pw"
                            placeholder="password"
                            outlined
                            dense
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-tab-item>
                    <!-- Phone number OTP -->
                    <v-tab-item>
                      <!-- Country Selection -->
                      <v-row justify="center" class="mt-2 pt-2">
                        <v-col cols="12" sm="12">
                          <v-select
                            outlined
                            @input="setCountryCode"
                            :rules="countryRules"
                            dense
                            v-model="country"
                            :items="countries"
                            label="Country"
                            required
                          ></v-select>
                        </v-col>
                      </v-row>
                      <!-- Country Code and Phone Number Fields -->
                      <v-row justify="center" class="d-flex">
                        <v-col cols="4" md="4" sm="4" class="my-0 py-0">
                          <v-select
                            style="min-width: 90px"
                            :rules="codeRules"
                            disabled
                            outlined
                            v-model="cellNumberCountryCode"
                            dense
                            :items="isdCodes"
                            label="Code"
                            required
                          ></v-select>
                        </v-col>
                        <v-col cols="8" md="" sm="8" class="my-0 py-0">
                          <v-text-field
                            outlined
                            dense
                            v-model="cellNumberNumber"
                            label="Phone Number"
                            required
                            :rules="phoneNumberRules"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-tab-item>
                  </v-tabs-items>

                  <!-- Sign In button -->
                  <v-row justify="center">
                    <v-col cols="12" sm="12">
                      <v-btn
                        style="width: 100%; max-width: 600px"
                        text
                        class="app__button mx-0 px-0 signin"
                        :class="appDark ? 'blue darken-4' : 'blue lighten-4'"
                        type="submit"
                        :disabled="loading || !signInIsFormValid"
                        :loading="loading"
                      >
                        {{ activeTab === 0 ? 'Sign in' : 'Send OTP' }}
                        <span slot="loader" class="custom-loader">
                          <v-icon light>cached</v-icon>
                        </span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
                <!-- Links for reset password and sign up -->
                <v-row justify="start" class="mx-0 my-2 px-0 pt-5">
                  <v-col cols="12" sm="12" class="text-left ma-0 pa-0">
                    <p class="ma-0 pa-0">
                      Forgot Password?
                      <v-btn
                        text
                        color="primary"
                        small
                        @click="goToResetPassword()"
                      >
                        Reset Password
                      </v-btn>
                    </p>
                  </v-col>
                </v-row>
                <v-row justify="start" class="ma-0 pa-0">
                  <v-col cols="12" sm="12" class="text-left ma-0 pa-0">
                    <p class="ma-0 pa-0">
                      No account to sign in?
                      <v-btn text color="primary" small @click="goToSignUp()">
                        Create an account
                      </v-btn>
                    </p>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </div>
          <div v-else>
            <v-skeleton-loader
              v-bind="attrs"
              type="card, text, actions"
              min-height="600"
            ></v-skeleton-loader>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'signin',
  data() {
    return {
      email: '',
      password: '',
      show_pw: false,
      country: '',
      loader: null,
      signInIsFormValid: true,
      activeTab: 0,
      attrs: {
        class: 'mb-6',
        elevation: 2,
      },
    };
  },
  computed: {
    ...mapGetters([
      'validationRules',
      'user',
      'token',
      'error',
      'errorStatus',
      'loading',
      'appThemeFontColor',
      'appThemeFontColor1',
      'appDark',
      'countryPhoneCodes',
      'verifyOtpDialog',
      'initializeAppComplete',
    ]),
    brandName() {
      return process.env.VUE_APP_NAME;
    },
    logoUrl() {
      return process.env.VUE_APP_BRAND_LOGO_URL;
    },
    countries() {
      return this.countryPhoneCodes.pairedStringList.map((el) => el.key);
    },
    isdCodes() {
      return this.countryPhoneCodes.pairedStringList.map(
        (el) => el.stringValue
      );
    },
    cellNumberCountryCode: {
      get() {
        return this.$store.getters.cellNumberCountryCode;
      },
      set(value) {
        this.$store.commit('setCellNumberCountryCode', value);
      },
    },
    cellNumberNumber: {
      get() {
        return this.$store.getters.cellNumberNumber;
      },
      set(value) {
        this.$store.commit('setCellNumberNumber', value);
      },
    },
    emailRules() {
      return this.activeTab === 0 ? this.validationRules.email : [];
    },
    passwordRules() {
      return this.activeTab === 0 ? this.validationRules.password : [];
    },
    countryRules() {
      return this.activeTab === 1 ? this.validationRules.required : [];
    },
    codeRules() {
      return this.activeTab === 1 ? this.validationRules.required : [];
    },
    phoneNumberRules() {
      return this.activeTab === 1 ? this.validationRules.phoneNumber : [];
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.progressing = false;
    });
  },
  watch: {
    // user(value) {
    //   if (value !== null && value !== undefined) {
    //     if (this.$route.name !== 'home') {
    //       this.$router.push({ name: 'home' });
    //     }
    //   }
    // },
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 3000);

      this.loader = null;
    },
    country(newVal) {
      if (this.initializeAppComplete) {
        const currentCountryPair = this.countryPhoneCodes.pairedStringList.find(
          (el) => el.key === newVal
        );
        if (currentCountryPair) {
          this.cellNumberCountryCode = currentCountryPair.stringValue;
        }
      }
    },
    initializeAppComplete(newVal, oldVal) {
      if (newVal) {
        this.country = process.env.VUE_APP_COUNTRY;
        const currentCountryPair = this.countryPhoneCodes.pairedStringList.find(
          (el) => el.key === this.country
        );
        if (currentCountryPair) {
          this.cellNumberCountryCode = currentCountryPair.stringValue;
        }
      }
    },
    activeTab() {
      this.$nextTick(() => {
        this.$refs.signInForm.resetValidation();
      });
    },
  },
  methods: {
    async onSignin() {
      if (this.$refs.signInForm.validate()) {
        if (this.activeTab === 0) {
          // Email sign in
          await this.$store.dispatch('signUserIn', {
            email: this.email,
            password: this.password,
          });
        } else {
          // Phone sign in (Send OTP)
          // Call API to send OTP
          try {
            const payload = {
              cellNumberInput: {
                countryCode: this.cellNumberCountryCode,
                number: this.cellNumberNumber,
                context: 'authenticationByPhone',
              },
            };
            // console.log('payload for phone OTP', payload);
            await this.$store.dispatch('sendPhoneOtp', payload);
            if (!this.error) {
              // Setting authentication flag
              this.$store.commit('setUserAuthenticationByPhoneFlag', true);
              // // opening the verify OTP dialog
              // this.$store.commit('setVerifyOtpDialog', true);
              // directing to OTP Page
              this.$router.push({ name: 'verifyOtp' });
            }
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        this.handleDialog(null, 'formNotValid');
      }
    },
    onDismissed() {
      this.$store.dispatch('clearError');
    },
    handleDialog(content, context) {
      this.$store.dispatch('handleDialog', {
        content: content,
        context: context,
      });
    },
    goToSignUp() {
      if (this.$route.name !== 'signup') {
        this.$router.push({ name: 'signup' });
      }
    },
    goToResetPassword() {
      if (this.$route.name !== 'resetPassword') {
        this.$router.push({ name: 'resetPassword' });
      }
    },
    setCountryCode() {
      // Setting country code
      // console.log('countryList:', this.countryPhoneCodes);
      const currentCountryPair = this.countryPhoneCodes.pairedStringList.find(
        (el) => el.key === this.country
      );
      if (currentCountryPair) {
        this.cellNumberCountryCode = currentCountryPair.stringValue;
      }
    },
    // ✅ Determine the correct server domain
    getServerDomain() {
      return process.env.NODE_ENV === 'production'
        ? process.env.VUE_APP_SERVER_DOMAIN
        : process.env.VUE_APP_SERVER_DOMAIN_DEV;
    },

    // ✅ Google Login
    loginWithGoogle() {
      window.location.href = `${this.getServerDomain()}/auth/google`;
    },

    // ✅ Facebook Login
    loginWithFacebook() {
      window.location.href = `${this.getServerDomain()}/auth/facebook`;
    },
  },
  created() {
    if (this.user && this.token) {
      if (this.$route.name !== 'home') {
        this.$router.push({ name: 'home' });
      }
    }
    this.country = process.env.VUE_APP_COUNTRY;
    // eventBus.$on('userPhoneNumberAuthenticated', this.signUserInByPhone);
  },
  beforeDestroy() {
    // eventBus.$off('userPhoneNumberAuthenticated', this.signUserInByPhone);
  },
};
</script>

<style scoped>
.social-button {
  font-size: 16px;
  font-weight: 500;
  text-transform: none;
  padding: 12px;
  border-radius: 5px;
}

.facebook-btn {
  background-color: #1877f2 !important;
  color: white !important;
}

.google-btn {
  background-color: white !important;
  color: #5f6368 !important;
  border: 1px solid #dadce0 !important;
}

.social-button v-img {
  vertical-align: middle;
}

.v-divider {
  margin-top: 16px;
  margin-bottom: 16px;
}
.signin--card {
  border: 1px solid rgb(179, 230, 230) !important;
}
.signin {
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
