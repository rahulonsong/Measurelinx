<template>
  <v-container class="text-center">
    <!-- Main Content -->
    <v-row wrap justify="center">
      <v-col cols="12" class="text-center">
        <v-card
          max-width="600"
          max-height="600"
          style="overflow: hidden"
          class="mx-auto"
        >
          <v-card-title
            class="font-weight-bold justify-center"
            :class="appDark ? 'cyan darken-4' : 'light-blue lighten-3'"
          >
            Verify OTP
          </v-card-title>
          <v-card-text style="max-height: 600px" class="mx-0 py-0 px-0 mt-10">
            <v-container class="mx-0 py-0 px-0 my-0">
              <p>
                Enter the 6-digit OTP received on your phone number
                <strong>
                  {{ maskedPhoneNumber }}
                </strong>
              </p>
              <v-form
                @submit.prevent="verifyOtp"
                lazy-validation
                v-model="verifyOtpIsFormValid"
                :style="appThemeFontColor"
                ref="verifyOtpForm"
                class="py-0 my-0 mx-5"
              >
                <v-otp-input
                  :rules="validationRules.required"
                  v-model="cellNumberOtp"
                  length="6"
                ></v-otp-input>
                <v-card-actions>
                  <!-- Send OTP -->
                  <v-row justify="center" class="my-2">
                    <!-- Verify OTP -->
                    <v-col md="4" sm="6" class="text-center" cols="12">
                      <v-btn
                        type="submit"
                        :class="appDark ? 'blue darken-4' : 'blue lighten-4'"
                        :disabled="loading || !verifyOtpIsFormValid"
                        :loading="loading"
                      >
                        <v-icon left>mdi-check</v-icon> Verify OTP
                      </v-btn>
                    </v-col>
                  </v-row>
                  <!-- Resend OTP and Cancel -->
                  <v-row justify="center" class="my-2" cols="12">
                    <v-col class="text-center">
                      <p>Didn't receive the OTP?</p>
                      <v-btn
                        rounded
                        x-small
                        class="info darken-4 font-weight-bold"
                        raised
                        @click="resendOtp"
                      >
                        <v-icon left>mdi-refresh</v-icon> Resend OTP
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
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
import { eventBus } from '../../shared/eventBus';
export default {
  name: 'verifyOtp',
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
      'orderInProgressPhoneVerificationFlag',
      'userAuthenticationByPhoneFlag',
      'userAccountPhoneVerificationFlag',
      'phoneVerificationFlag',
    ]),

    maskedPhoneNumber() {
      const lastFourDigits = this.cellNumberNumber.slice(-4);
      return `${this.cellNumberCountryCode} *****${lastFourDigits}`;
    },
    cellNumberOtp: {
      get() {
        return this.$store.getters.cellNumberOtp;
      },
      set(value) {
        this.$store.commit('setCellNumberOtp', value);
      },
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
  data() {
    return {
      otpError: false,
      verifyOtpIsFormValid: true,
    };
  },
  methods: {
    async verifyOtp() {
      if (this.$refs.verifyOtpForm.validate()) {
        // console.log('This will verify OTP sent to the cell number');
        const payload = {
          userOtpInput: {
            userId: this.user ? this.user._id : '',
            otp: this.cellNumberOtp,
          },
        };

        // Adding context
        // if (this.orderInProgressPhoneVerificationFlag) {
        payload.userOtpInput['context'] = 'phoneVerification';
        // }

        // user authentication by phone
        if (this.userAuthenticationByPhoneFlag) {
          payload.userOtpInput['context'] = 'authenticationByPhone';
          payload.userOtpInput['cellNumber'] =
            this.cellNumberCountryCode + this.cellNumberNumber;

          console.log('Authentication payload:', payload);
        }

        // Sending API call
        const response = await this.$store.dispatch('verifyUserPhone', payload);

        if (this.error) {
          // for incorrect otp error
          // console.log('executed code');
          this.cellNumberOtp = '';
          return;
        }

        // Emitting event for account page to show verification of phone number
        if (this.userAccountPhoneVerificationFlag) {
          this.$store.commit('setUserAccountPhoneVerificationFlag', false);

          if (this.$route.name !== 'account') {
            this.$router.push({ name: 'account' });
          }
        }

        // Emitting the event for continuing with the order
        if (this.orderInProgressPhoneVerificationFlag) {
          console.log('Emitting event for Order processing');
          this.$emit('userPhoneNumberVerified');
          this.$store.commit('setCheckoutModel', 4);
          this.$store.commit('setOrderInProgressPhoneVerificationFlag', false);
          this.$router.push({ name: 'checkout' });
          this.$nextTick(() => {
            eventBus.$emit('userPhoneNumberVerified');
          });
        }

        // Handling phone authentication login success
        if (this.userAuthenticationByPhoneFlag) {
          console.log('Phone authentication successful');
          this.$store.commit('setUserAuthenticationByPhoneFlag', false);

          // Redirect to home page after successful authentication
          if (this.$route.name !== 'home') {
            this.$router.push({ name: 'home' });
          }
        }

        this.cellNumberOtp = '';
      }
    },
    async resendOtp() {
      // return;
      // Clearing the OTP field
      this.cellNumberOtp = '';
      try {
        const payload = {
          cellNumberInput: {
            countryCode: this.cellNumberCountryCode,
            number: this.cellNumberNumber,
            context: 'authenticationByPhone',
          },
        };
        if (this.phoneVerificationFlag) {
          payload.cellNumberInput['context'] = 'phoneVerification';
        }
        // console.log('payload for phone OTP', payload);
        await this.$store.dispatch('sendPhoneOtp', payload);
      } catch (error) {
        console.log(error);
      }

      console.log('This will resend OTP to the cell number');
      this.cellNumberOtp = null;
      this.$nextTick(() => {
        this.$refs.verifyOtpForm.resetValidation();
      });
    },
  },
  created() {
    this.cellNumberOtp = '';
    if (!this.cellNumberCountryCode || !this.cellNumberNumber) {
      if (this.$route.name !== 'home') {
        this.$router.push({ name: 'home' });
      }
    }
  },
  watch: {},
};
</script>
