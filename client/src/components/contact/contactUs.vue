<template>
  <v-container>
    <v-row justify="center">
      <!-- Contact Form -->
      <!-- before submission -->
      <v-col
        v-if="!isRequestSubmitted"
        cols="12"
        class="mx-auto px-0"
        sm="12"
        md="8"
        style="max-width: 600px"
      >
        <v-card
          elevation="5"
          :class="appDark ? 'black lighten-2' : 'grey lighten-5'"
          class="pa-0 ma-0"
        >
          <v-card-title
            class="primary--text my-5"
            :class="appDark ? 'text--lighten-3' : 'text--darken-3'"
          >
            Send us a Message
          </v-card-title>
          <v-card-text class="ma-0 px-2">
            <v-form
              v-model="isContactFormValid"
              class="text-center"
              ref="contactForm"
              @submit.prevent="submitForm"
            >
              <!-- Name -->
              <div class="d-flex">
                <v-text-field
                  outlined
                  dense
                  v-model="firstName"
                  label="First Name"
                  :rules="validationRules.required"
                  class="mr-2"
                ></v-text-field>
                <v-text-field
                  class="ml-2"
                  outlined
                  dense
                  v-model="lastName"
                  label="Last Name"
                  :rules="validationRules.required"
                ></v-text-field>
              </div>
              <!-- Email -->
              <v-text-field
                dense
                outlined
                v-model="email"
                label="Email"
                required
                :rules="validationRules.email"
              ></v-text-field>
              <!-- Country -->
              <v-select
                v-model="selectedCountry"
                :items="countries"
                label="Country"
                :rules="validationRules.required"
                outlined
                dense
                attach
                offset-y
                :menu-props="{ bottom: true, offsetY: true }"
              ></v-select>
              <!-- Phone number -->
              <v-row class="d-flex">
                <v-col cols="4" md="4" sm="4">
                  <v-select
                    style="min-width: 90px"
                    disabled
                    outlined
                    v-model="isdCode"
                    dense
                    :items="isdCodes"
                    label="Code"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="8" md="" sm="8">
                  <v-text-field
                    outlined
                    dense
                    v-model="phoneNumber"
                    label="Phone Number"
                    required
                    :rules="phoneNumberRules"
                  ></v-text-field>
                </v-col>
              </v-row>
              <!-- category -->
              <v-select
                dense
                outlined
                v-model="selectedSubject"
                :items="subjects"
                label="What can we help you with"
                :rules="validationRules.required"
              ></v-select>
              <!-- message -->
              <v-textarea
                dense
                outlined
                v-model="message"
                label="Message"
                :rules="validationRules.required"
              ></v-textarea>
              <!-- Captcha -->
              <div
                class="recaptcha-wrapper"
                style="max-width: 305px; overflow: hidden"
              >
                <vue-recaptcha
                  ref="recaptcha"
                  @verify="onRecaptchaVerify"
                  :sitekey="siteKey"
                ></vue-recaptcha>
              </div>
              <v-btn
                style="width: 100%"
                class="font-weight-bold app__button mr-0 text-center mt-5"
                :class="appDark ? 'blue darken-4' : 'blue lighten-4'"
                type="submit"
                :disabled="!isContactFormValid || !recaptchaResponse"
                >Submit</v-btn
              >
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- After submission -->
      <v-col
        v-else
        cols="12"
        class="mx-auto"
        sm="12"
        md="8"
        style="max-width: 600px"
      >
        <v-card
          elevation="5"
          :class="appDark ? 'black lighten-2' : 'grey lighten-5'"
          class="pa-5 mb-10"
        >
          <v-card-title
            class="primary--text my-5"
            :class="appDark ? 'text--lighten-3' : 'text--darken-3'"
          >
            <v-icon color="success">mdi-check-circle-outline</v-icon>
            <span class="ml-2">Request Submitted</span>
          </v-card-title>
          <v-card-text>
            <v-icon class="mr-2" color="primary"
              >mdi-information-outline</v-icon
            >
            <span
              >Thank you for writing to us. Your request has been submitted. One
              of our representatives will get in touch with you soon.</span
            >
          </v-card-text>
          <v-card-actions>
            <v-btn
              style="width: 100%"
              class="font-weight-bold app__button mr-0 text-center mt-5"
              :class="appDark ? 'blue darken-4' : 'blue lighten-4'"
              @click="submitNewRequest()"
              >Submit New Request</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
      <!-- Contact info -->
      <v-col cols="12" sm="12" md="4" class="mx-auto" style="max-width: 600px">
        <!-- <div
          class="contact-info"
          style="max-width: 500px;"
        > -->
        <h2
          class="primary--text my-5"
          :class="appDark ? 'text--lighten-3' : 'text--darken-3'"
        >
          Get in touch with Us
        </h2>
        <router-link
          :to="{ name: 'home' }"
          class="my-auto text-decoration-none"
        >
          <v-row class="ma-0 pa-0" justify="start">
            <v-col
              class="ma-0 pa-0 text-right"
              md="2"
              sm="2"
              style="max-width: 100px"
            >
              <span class="mx-1">
                <img :src="logoUrl" height="30" alt="app" />
              </span>
            </v-col>
            <v-col class="ma-0 pa-0 text-left" md="8" sm="8">
              <span
                dark
                class="ml-2 font-weight-black text-capitalize text-h6"
                flat
              >
                <span class="deep-orange--text text--accent-3">{{
                  brandName
                }}</span></span
              >
            </v-col>
          </v-row>

          <!-- <span
              dark
              class="font-weight-light text-lowercase title"
            > solutions</span> -->
        </router-link>
        <div class="address-container mt-5 mx-5">
          <p class="address-title">
            <i class="fas fa-building"></i>{{ addressLine1 }}
          </p>
          <p class="address-detail">
            <i class="fas fa-map-marker-alt"></i>{{ addressLine2 }}
          </p>
          <p class="address-detail">
            <i class="fas fa-map-marker-alt"></i>{{ addressLine3 }}
          </p>
          <p class="address-detail">
            <i class="fas fa-map-marker-alt"></i>{{ addressLine4 }}
          </p>
          <p class="address-contact">
            <i class="fas fa-envelope"></i>Email: {{ brandEmail }}
          </p>
          <p class="address-contact">
            <i class="fas fa-phone"></i>Phone: {{ phone }}
          </p>
        </div>

        <!-- </div> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
// import { VueRecaptcha } from "vue-recaptcha";
export default {
  name: 'ContactPage',
  // components: {
  //   VueRecaptcha,
  // },
  // components: { VueRecaptcha },
  data() {
    return {
      isRequestSubmitted: false,
      isContactFormValid: false,
      firstName: '',
      lastName: '',
      email: '',
      category: '',
      message: '',
      categories: ['Sales', 'Feedback', 'Support', 'Other'],
      emailRules: [
        (v) => !!v || 'Email is required',
        (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
      ],
      recaptchaResponse: null,
      country: '',
      isdCode: '',
      phoneNumber: '',
      selectedCountry: '',
      selectedSubject: '',
      subjects: ['Sales', 'Feedback', 'Support', 'Other'],
      // countryCodes: {
      //   USA: ['+1'],
      //   Canada: ['+1'],
      //   Mexico: ['+52'],
      //   Australia: ['+61'],
      //   India: ['+91'],
      //   Japan: ['+81'],
      // },
      phoneNumberRules: [
        (v) => !!v || 'Phone number is required',
        (v) => /^\d{10}$/.test(v) || 'Phone number must be 10 digits',
      ],
    };
  },
  computed: {
    ...mapGetters([
      'user',
      'error',
      'errorStatus',
      'loading',
      'appCurrency',
      'appCurrencyText',
      'appDark',
      'appLightBackground',
      'appThemeFontColor',
      'validationRules',
      'initializeAppComplete',
      'randomColor',
      'countryPhoneCodes',
    ]),
    siteKey() {
      return process.env.VUE_APP_CAPTCHA_SITE_KEY;
    },
    progressing: {
      get() {
        return this.$store.getters.progressing;
      },
      set(value) {
        this.$store.commit('setProgressing', value);
      },
    },
    countries() {
      return this.countryPhoneCodes.pairedStringList.map((el) => el.key);
    },
    isdCodes() {
      return this.countryPhoneCodes.pairedStringList.map(
        (el) => el.stringValue
      );
    },
    logoUrl() {
      return process.env.VUE_APP_BRAND_LOGO_URL;
    },
    brandName() {
      return process.env.VUE_APP_COPY_RIGHT_BRAND_NAME;
    },
    addressLine1() {
      return process.env.VUE_APP_ADDRESS_LINE1;
    },
    addressLine2() {
      return process.env.VUE_APP_ADDRESS_LINE2;
    },
    addressLine3() {
      return process.env.VUE_APP_ADDRESS_LINE3;
    },
    addressLine4() {
      return process.env.VUE_APP_ADDRESS_LINE4;
    },
    brandEmail() {
      return process.env.VUE_APP_EMAIL;
    },
    phone() {
      return process.env.VUE_APP_PHONE;
    },
  },
  watch: {
    selectedCountry(newVal) {
      const currentCountryPair = this.countryPhoneCodes.pairedStringList.find(
        (el) => el.key === newVal
      );
      if (currentCountryPair) {
        this.isdCode = currentCountryPair.stringValue;
      }
    },
  },
  methods: {
    onRecaptchaVerify(response) {
      this.recaptchaResponse = response;
    },

    async submitForm() {
      if (!this.recaptchaResponse) {
        alert('Please complete the reCAPTCHA.');
        return;
      }
      // Handle form submission here

      // Submitting to the server
      const payload = {
        contactFormInput: {
          firstName: this.firstName,
          lastName: this.lastName,
          country: this.selectedCountry,
          isdCode: this.isdCode,
          phoneNumber: this.phoneNumber,
          category: this.selectedSubject,
          email: this.email,
          message: this.message,
          contactType: 'Request',
          user: this.user ? this.user._id : null,
        },
      };
      // console.log('payload:', payload);
      // dispatching
      const result = await this.$store.dispatch(
        'submitContactRequest',
        payload
      );
      if (result && result.refNumber) {
        this.isRequestSubmitted = true;
      }
    },
    submitNewRequest() {
      this.resetContactForm();
      this.$nextTick(() => {
        this.$refs.contactForm.resetValidation();
        this.isContactFormValid = false;
      });
    },
    resetContactForm() {
      this.isRequestSubmitted = false;
      this.isContactFormValid = false;
      this.firstName = '';
      this.lastName = '';
      this.email = '';
      this.category = '';
      this.message = '';
      this.phoneNumber = '';
      this.selectedSubject = this.subjects[0];
      this.recaptchaResponse = null;
      this.setCountry();
    },
    setCountry() {
      const browserLocale = navigator.language || navigator.userLanguage;
      let defaultCountry = '';

      // Map browser locales to countries
      const supportedLocales = {
        en_US: 'USA',
        'en-US': 'USA',
        'en-CA': 'Canada',
        en_CA: 'Canada',
        'fr-CA': 'Canada',
        fr_CA: 'Canada',
        es_MX: 'Mexico',
        'es-MX': 'Mexico',
        en_AU: 'Australia',
        'en-AU': 'Australia',
        en_IN: 'India',
        'en-IN': 'India',
        ja_JP: 'Japan',
        'ja-JP': 'Japan',
      };
      // console.log('locale:', browserLocale);
      // If the browser locale is supported, set the default country
      if (supportedLocales[browserLocale]) {
        defaultCountry = supportedLocales[browserLocale];
        this.selectedCountry = defaultCountry;
      }
    },
  },
  created() {
    this.setCountry();
    // Initialize selectedSubject with a default value
    this.selectedSubject = this.subjects[0];
  },
};
</script>

<style scoped>
.address-container {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: 'Arial', sans-serif;
  max-width: 350px;
}

.address-title,
.address-detail,
.address-contact {
  margin: 10px 0;
  line-height: 1.5;
}

.address-title i,
.address-detail i,
.address-contact i {
  color: #4a90e2;
  margin-right: 8px;
}

.address-contact {
  font-weight: bold;
}

.contact-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #3498db, #8e44ad);
}

.contact-info {
  margin-bottom: 20px;
}

.contact-form {
  max-width: 600px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

@media (max-width: 767px) {
  .contact-form {
    max-width: 100%;
    padding: 10px;
  }

  .recaptcha-wrapper iframe {
    transform: scale(0.77);
    transform-origin: 0 0;
  }
}
</style>
