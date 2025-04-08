<template>
  <v-row class="my-0 py-0" style="width: 100%">
    <v-col class="my-0 py-0">
      <v-card
        max-width="600"
        max-height="600"
        style="overflow: hidden"
        class="mx-auto"
      >
        <v-card-title
          class="font-weight-bold"
          :class="appDark ? 'cyan darken-4' : 'light-blue lighten-3'"
        >
          <v-icon left>mdi-cellphone</v-icon>
          Add Cell Number
        </v-card-title>
        <v-card-text style="max-height: 600px" class="mx-0 py-0 px-0 mt-10">
          <v-container class="mx-0 py-0 px-0 my-0">
            <!-- Strategic Marketing Message -->
            <v-alert
              v-if="orderInProgressPhoneVerificationFlag"
              type="info"
              border="left"
              prominent
              icon="mdi-information"
              class="mb-4 darken-4"
            >
              <span class="font-weight-bold">
                Just one more step to place your order!
              </span>
              <br />
              Adding your phone number helps us send you order updates and other
              important notifications quickly.
            </v-alert>
            <v-form
              :style="appThemeFontColor"
              ref="form"
              class="py-0 my-0 mx-5"
            >
              <!-- Country -->
              <v-row class="my-0 py-0" justify="start">
                <v-col class="mt-5 py-0 text-left" cols="12" md="6" sm="12">
                  <v-select
                    outlined
                    dense
                    v-model="country"
                    :items="countries"
                    label="Country"
                    :rules="validationRules.required"
                    placeholder="Select Country"
                  >
                  </v-select>
                </v-col>
              </v-row>
              <!-- Phone number -->
              <v-row class="my-0 py-0 d-flex" justify="start">
                <v-col class="my-0 py-0 text-left" cols="4" sm="4" xs="4">
                  <v-select
                    style="min-width: 90px"
                    disabled
                    outlined
                    v-model="cellNumberCountryCode"
                    dense
                    :items="isdCodes"
                    label="Code"
                    prepend-icon="mdi-phone"
                  >
                  </v-select>
                </v-col>
                <v-col class="my-0 py-0 text-left" cols="8" sm="8" xs="8">
                  <v-text-field
                    outlined
                    dense
                    v-model="cellNumberNumber"
                    label="Phone Number"
                    :rules="validationRules.phoneNumber"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <!-- Close/cancel buttons -->
        <v-card-actions>
          <v-row justify="center" class="my-2">
            <!-- Send OTP -->
            <v-col md="4" sm="6" class="text-center">
              <v-btn
                small
                class="primary darken-4 font-weight-bold"
                raised
                color="blue"
                @click="sendOtp"
                :disabled="!isNumberChanged"
              >
                <v-icon left>mdi-send</v-icon> Send OTP
              </v-btn>
            </v-col>
            <!-- Cancel -->
            <v-col md="4" sm="6" class="text-center">
              <v-btn
                small
                class="error darken-4 font-weight-bold"
                raised
                @click="goBack()"
              >
                <v-icon left>mdi-cancel</v-icon> Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'addCellNumber',
  data() {
    return {
      country: null,
    };
  },
  computed: {
    ...mapGetters([
      'user',
      'error',
      'errorStatus',
      'loading',
      'appDark',
      'appLightBackground',
      'appThemeFontColor',
      'validationRules',
      'countryCodes',
      'countryPhoneCodes',
      'orderInProgressPhoneVerificationFlag',
    ]),
    countries() {
      return this.countryPhoneCodes.pairedStringList.map((el) => el.key);
    },
    isdCodes() {
      return this.countryPhoneCodes.pairedStringList.map(
        (el) => el.stringValue
      );
    },
    isNumberChanged() {
      return this.cellNumberNumber !== this.user.cellNumber.number;
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
  },
  watch: {
    country(newVal) {
      const currentCountryPair = this.countryPhoneCodes.pairedStringList.find(
        (el) => el.key === newVal
      );
      if (currentCountryPair) {
        this.cellNumberCountryCode = currentCountryPair.stringValue;
      }
    },
  },
  methods: {
    async sendOtp() {
      // Validate form
      if (this.$refs.form.validate()) {
        // console.log('This will send OTP to the cell number');
        // return;
        // Call API to send OTP
        this.$store.commit('setPhoneVerificationFlag', true);
        try {
          const payload = {
            cellNumberInput: {
              countryCode: this.cellNumberCountryCode,
              number: this.cellNumberNumber,
              context: 'phoneVerification',
            },
          };
          // console.log('payload for phone OTP', payload);
          await this.$store.dispatch('sendPhoneOtp', payload);
          // ROuting to verify OTP page
          if (this.$route.name !== 'verifyOtp') {
            this.$router.push({ name: 'verifyOtp' });
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    setCellNumber() {
      // Setting cell number
      if (this.user && this.user.cellNumber && this.user.cellNumber.number) {
        this.cellNumberNumber = this.user.cellNumber.number;
      }
      // Setting country code
      if (
        this.user &&
        this.user.cellNumber &&
        this.user.cellNumber.countryCode
      ) {
        this.cellNumberCountryCode = this.user.cellNumber.countryCode;
      }
    },
    goBack() {
      // clearing flags
      this.$store.commit('setUserAccountPhoneVerificationFlag', false);
      this.$store.commit('setOrderInProgressPhoneVerificationFlag', false);
      this.$store.commit('setOrderInProgressPhoneVerificationFlag', false);

      this.$router.go(-1);
    },
  },
  created() {
    this.setCellNumber();

    if (process.env.VUE_APP_CURRENCY_TEXT === 'inr') {
      this.country = 'India';
    } else {
      this.country = 'Canada';
    }
  },
};
</script>
