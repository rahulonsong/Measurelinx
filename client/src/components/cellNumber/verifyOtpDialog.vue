<template>
  <v-dialog v-model="verifyOtpDialog" persistent scrollable max-width="600px">
    <v-card max-width="600" max-height="600" style="overflow: hidden">
      <v-card-title
        class="font-weight-bold"
        :class="appDark ? 'cyan darken-4' : 'light-blue lighten-3'"
      >
        <v-icon left>mdi-lock-check</v-icon>
        Verify OTP
        <v-btn icon small class="ml-auto" @click="verifyOtpDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="max-height: 600px" class="mx-0 py-0 px-0 mt-10">
        <v-container class="mx-0 py-0 px-0 my-0">
          <v-form
            v-model="verifyOtpIsFormValid"
            :style="appThemeFontColor"
            ref="form"
            class="py-0 my-0 mx-5"
          >
            <v-otp-input
              :rules="validationRules.required"
              v-model="cellNumberOtp"
              length="6"
            ></v-otp-input>
          </v-form>
        </v-container>
      </v-card-text>
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
              @click="verifyOtp"
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
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'verifyOtpDialog',
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
    ]),
    addCellNumberDialog: {
      get() {
        return this.$store.getters.addCellNumberDialog;
      },
      set(value) {
        this.$store.commit('setAddCellNumberDialog', value);
      },
    },
    verifyOtpDialog: {
      get() {
        return this.$store.getters.verifyOtpDialog;
      },
      set(value) {
        this.$store.commit('setVerifyOtpDialog', value);
      },
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
      if (this.$refs.form.validate()) {
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
        }
        // Sending API call
        await this.$store.dispatch('verifyUserPhone', payload);
        if (this.error) {
          // for incorrect otp error
          // console.log('executed code');
          this.addCellNumberDialog = false;
          this.verifyOtpDialog = true;
          this.cellNumberOtp = '';
          return;
        }
        // Emitting the event for continuing with the order
        if (this.orderInProgressPhoneVerificationFlag) {
          console.log('Emitting event for Order processing');
          this.$emit('userPhoneNumberVerified');
          this.$store.commit('setOrderInProgressPhoneVerificationFlag', false);
        }
        // Emitting the event for continuing with the user signin
        if (this.userAuthenticationByPhoneFlag) {
          // console.log('Emitting event for user authentication');
          this.$emit('userPhoneNumberAuthenticated');
          this.$store.commit('setOrderInProgressPhoneVerificationFlag', false);
        }

        this.verifyOtpDialog = false;
        this.cellNumberOtp = '';
      }
    },
    async resendOtp() {
      console.log('This will resend OTP to the cell number');
      try {
        const payload = {
          cellNumberInput: {
            countryCode: this.cellNumberCountryCode,
            number: this.cellNumberNumber,
          },
        };
        await this.$store.dispatch('sendPhoneOtp', payload);
      } catch (error) {
        this.verifyOtpDialog = true;
        this.cellNumberOtp = null;
        // this.otpError = true;
      }
    },
  },
  created() {
    this.cellNumberOtp = '';
  },
  watch: {
    verifyOtpDialog(newVal, oldVal) {
      this.cellNumberOtp = '';
    },
  },
};
</script>
