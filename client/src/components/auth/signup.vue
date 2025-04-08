<template>
  <v-container class="text-center">
    <!-- <v-btn @click="test">Test</v-btn> -->
    <!-- Main Content -->
    <!-- form -->
    <!-- Error -->
    <v-row v-if="errorStatus">
      <v-col cols="12" sm="12">
        <!-- <app-alert @dismissed='onDismissed' :text="error.message"></app-alert> -->
      </v-col>
    </v-row>
    <!-- Main Content -->
    <v-row wrap justify="center" class="my-0 py-0">
      <v-col cols="12" class="text-center my-0 py-0">
        <v-card elevation="3" max-width="550" class="mx-auto my-0 px-0 mx-0">
          <div v-if="initializeAppComplete">
            <!-- Sign up Title -->
            <v-row justify="center">
              <v-col class="text-center py-2">
                <v-card-text
                  class="text-center text--darken-2 mx-auto font-weight-black my-0 py-0"
                  style="overflow: hidden"
                >
                  <h2 class="text-h4 my-2 font-weight-medium">
                    <span class="primary--text">Create Your Account</span>
                  </h2>
                  <p class="subtitle-1 grey--text text--darken-1 mb-0">
                    Join {{ brandName }} and get started today
                  </p>
                </v-card-text>
              </v-col>
            </v-row>
            <v-card-text class="mx-0 px-0 py-0">
              <v-container class="mx-auto py-0">
                <!-- ✅ Social Login Section -->
                <v-row justify="center">
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
                <v-divider class="my-2"> </v-divider>
                <v-row>
                  <v-col class="py-1">
                    <p
                      class="text-center text-subtitle-1 font-weight-medium my-2"
                    >
                      Or Sign up with Email
                    </p>
                  </v-col>
                </v-row>

                <!-- Signup form -->
                <v-form
                  dense
                  :style="appThemeFontColor"
                  @submit.prevent="onSignup"
                  id="signUp--form"
                  v-model="signUpIsFormValid"
                  lazy-validation
                  ref="signUpForm"
                  class="mx-0 px-0"
                >
                  <!-- First Name -->
                  <v-row class="my-0 py-0">
                    <v-col cols="12" class="my-0 py-0">
                      <v-text-field
                        name="firstName"
                        id="firstName"
                        :rules="validationRules.required"
                        label="First Name"
                        v-model="firstName"
                        type="text"
                        placeholder="First Name"
                        required
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <!-- Last Name -->
                  <v-row class="my-0 py-0">
                    <v-col cols="12" class="my-0 py-0">
                      <v-text-field
                        name="lastName"
                        id="lastName"
                        :rules="validationRules.required"
                        label="Last Name"
                        v-model="lastName"
                        type="text"
                        placeholder="Last Name"
                        required
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <!-- User email -->
                  <v-row class="my-0 py-0">
                    <v-col cols="12" class="my-0 py-0">
                      <v-text-field
                        name="email"
                        id="email"
                        :rules="validationRules.email"
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
                  <!-- Password -->
                  <v-row class="my-0 py-0">
                    <v-col cols="12" class="my-0 py-0">
                      <v-text-field
                        :append-icon="show_pw ? 'visibility' : 'visibility_off'"
                        :rules="validationRules.password"
                        :type="show_pw ? 'text' : 'password'"
                        name="password ? '': Password "
                        label="Password"
                        hint="At least 8 characters"
                        v-model="password"
                        class="input-group--focused"
                        @click:append="show_pw = !show_pw"
                        placeholder="password"
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <!-- Confirm Password -->
                  <v-row class="my-0 py-0">
                    <v-col cols="12" class="my-0 py-0">
                      <v-text-field
                        :rules="validationRules.required"
                        :type="'password'"
                        name="password"
                        label="Confirm Password"
                        v-model="confirmPassword"
                        :error-messages="setConfirmPasswordError()"
                        class="input-group--focused"
                        placeholder="confirm password"
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <!-- Newsletter subscription checkbox -->
                  <v-row class="my-0 py-0">
                    <v-col cols="12" class="my-0 py-0">
                      <v-checkbox
                        v-model="subscribedToNewsletter"
                        label="Subscribe to newsletter and updates"
                        color="primary"
                        hide-details
                        class="mt-0 pt-0"
                      ></v-checkbox>
                    </v-col>
                  </v-row>

                  <!-- Privacy policy acceptance checkbox -->
                  <v-row class="my-0 py-0">
                    <v-col cols="12" class="my-0 py-0">
                      <v-checkbox
                        v-model="acceptedPrivacyPolicy"
                        :rules="validationRules.required"
                        color="primary"
                        hide-details
                        required
                        class="mt-2 pt-0"
                      >
                        <template v-slot:label>
                          <div>
                            I accept the
                            <a
                              :href="privacyPolicyUrl"
                              target="_blank"
                              class="primary--text"
                              @click.stop
                              >Privacy Policy</a
                            >
                          </div>
                        </template>
                      </v-checkbox>
                    </v-col>
                  </v-row>

                  <!-- Recaptcha - moved to bottom -->
                  <v-row class="mt-2 mb-3 py-0">
                    <v-col cols="12" class="my-0 py-0">
                      <!-- Captcha -->
                      <vue-recaptcha
                        ref="recaptcha"
                        @verify="onRecaptchaVerify"
                        :sitekey="siteKey"
                      ></vue-recaptcha>
                    </v-col>
                  </v-row>

                  <!-- Sign up button -->
                  <v-row row class="mt-0">
                    <v-col cols="12" sm="12" class="d-flex justify-center py-1">
                      <v-btn
                        type="submit"
                        style="width: 100%; max-width: 600px"
                        text
                        class="app__button mx-0 px-0"
                        :class="appDark ? 'blue darken-4' : 'blue lighten-4'"
                        :disabled="
                          loading ||
                          !signUpIsFormValid ||
                          !recaptchaResponse ||
                          !acceptedPrivacyPolicy
                        "
                        :loading="loading"
                      >
                        Sign up
                        <span slot="loader" class="custom-loader">
                          <v-icon light>cached</v-icon>
                        </span>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <!-- Link to sign up page for unregistered users -->
                  <v-row justify="center" class="mt-1">
                    <v-col cols="12" class="py-1">
                      <p>
                        Alread have an account?
                        <v-btn text color="primary" small @click="goToSignIn()">
                          Sign in
                        </v-btn>
                        <!-- <router-link :to="{ name: 'signin'}">sign in</router-link> -->
                        here
                      </p>
                    </v-col>
                  </v-row>
                </v-form>
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
  name: 'signup',
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      show_pw: false,
      signUpIsFormValid: true,
      recaptchaResponse: null,
      subscribedToNewsletter: true,
      acceptedPrivacyPolicy: false,
      attrs: {
        class: 'mb-6',
        elevation: 2,
      },
    };
  },
  computed: {
    ...mapGetters([
      'user',
      'error',
      'errorStatus',
      'loading',
      'appThemeFontColor',
      'appLightBackground',
      'appDark',
      'initializeAppComplete',
    ]),
    brandName() {
      return process.env.VUE_APP_NAME;
    },
    progressing: {
      get() {
        return this.$store.getters.progressing;
      },
      set(value) {
        this.$store.commit('setProgressing', value);
      },
    },
    firstName: {
      get() {
        return this.$store.getters.firstName;
      },
      set(value) {
        this.$store.commit('setFirstName', value);
      },
    },
    lastName: {
      get() {
        return this.$store.getters.lastName;
      },
      set(value) {
        this.$store.commit('setLastName', value);
      },
    },
    progressing: {
      get() {
        return this.$store.getters.progressing;
      },
      set(value) {
        this.$store.commit('setProgressing', value);
      },
    },
    validationRules: {
      get() {
        return this.$store.getters.validationRules;
      },
      set(value) {
        this.$store.commit('setValidationRules', value);
      },
    },
    siteKey() {
      return process.env.VUE_APP_CAPTCHA_SITE_KEY;
    },
    privacyPolicyUrl() {
      return process.env.VUE_APP_PRIVACY_POLICY_URL;
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.progressing = false;
    });
  },
  created() {
    // this.$router.go();
    this.email = '';
    this.password = '';
    this.firstName = '';
    this.lastName = '';
    this.$nextTick(() => {
      this.$refs.signUpForm.resetValidation();
    });
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        if (this.$route.name !== 'home') {
          this.$router.push({ name: 'home' });
        }
      }
    },
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 3000);

      this.loader = null;
    },
  },
  methods: {
    onRecaptchaVerify(response) {
      this.recaptchaResponse = response;
    },
    // Navigate to Sign in
    goToSignIn() {
      if (this.$route.name !== 'signin') {
        this.$router.push({ name: 'signin' });
      }
    },
    // async action
    async onSignup() {
      if (!this.recaptchaResponse) {
        alert('Please complete the reCAPTCHA.');
        return;
      }
      if (!this.acceptedPrivacyPolicy) {
        alert('You must accept the Privacy Policy to sign up.');
        return;
      }
      if (this.$refs.signUpForm.validate()) {
        // console.log('send to Database!');
        let payload = {
          email: this.email,
          password: this.password,
          firstName: this.firstName,
          lastName: this.lastName,
          subscribedToNewsletter: this.subscribedToNewsletter,
        };
        // console.log('payload:', payload);
        // Sending Async action to store
        await this.$store.dispatch('signUserUp', payload);
      } else {
        this.handleDialog(null, 'formNotValid');
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
    onDismissed() {
      this.$store.dispatch('clearError');
    },
    setConfirmPasswordError() {
      if (this.password) {
        return this.confirmPassword !== this.password
          ? 'Passwords must match'
          : '';
      }
    },
    // Handling Dialogs
    handleDialog(content, context) {
      this.$store.dispatch('handleDialog', {
        content: content,
        context: context,
      });
    },
    test() {
      // console.log('org:', this.organizationName);
    },
  },
};
</script>
<style scoped>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
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
