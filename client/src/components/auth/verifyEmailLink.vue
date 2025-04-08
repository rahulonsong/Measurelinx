<template>
  <v-container class="pa-4">
    <v-card
      class="rounded-lg mx-auto"
      :class="appDark ? 'dark-theme' : 'light-theme'"
      max-width="500"
    >
      <v-card-title class="d-flex align-center justify-center py-4">
        <v-icon left size="24" color="primary">mdi-shield-check</v-icon>
        <span class="text-h5">{{ appName }} Email Verification</span>
      </v-card-title>

      <v-card-text class="px-4 pt-4 pb-2 text-center">
        <v-progress-circular
          v-if="verifying"
          indeterminate
          color="primary"
          size="50"
          class="mb-5"
        ></v-progress-circular>

        <div v-if="!verifying">
          <div v-if="success">
            <v-icon color="success" size="64" class="mb-4"
              >mdi-check-circle</v-icon
            >
            <h2 class="mb-4">Email Verified Successfully!</h2>
            <p class="mb-5">
              Your email has been verified successfully. You can now access all
              features of your account.
            </p>
            <v-btn
              color="primary"
              @click="goToHomePage"
              rounded
              large
              class="mb-4"
            >
              Continue to Home
            </v-btn>
          </div>

          <div v-else>
            <v-icon color="error" size="64" class="mb-4"
              >mdi-alert-circle</v-icon
            >
            <h2 class="mb-4">Verification Failed</h2>
            <p class="mb-5">
              {{
                errorMessage ||
                'The verification link is invalid or has expired.'
              }}
            </p>
            <v-btn
              color="primary"
              @click="resendVerification"
              rounded
              class="mb-2"
              :loading="resending"
              :disabled="resending"
            >
              <v-icon left>mdi-refresh</v-icon>
              Resend Verification Email
            </v-btn>
            <p class="mt-3">
              <v-btn text color="primary" @click="goToOtpPage">
                Verify with OTP instead
              </v-btn>
            </p>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'verifyEmailLink',
  data() {
    return {
      verifying: true,
      success: false,
      resending: false,
      errorMessage: '',
    };
  },
  computed: {
    ...mapGetters(['appName', 'appDark', 'userId', 'user']),
  },
  methods: {
    async verifyEmailWithToken() {
      try {
        this.verifying = true;
        const { userId, token } = this.$route.params;

        const result = await this.$store.dispatch('verifyEmailWithToken', {
          userId,
          token,
        });

        this.success = true;
        // Get updated user info
        if (!this.user) {
          await this.$store.dispatch('getCurrentUser');
        }
      } catch (error) {
        this.success = false;
        this.errorMessage =
          error.message || 'Verification failed. Please try again.';
      } finally {
        this.verifying = false;
      }
    },
    async resendVerification() {
      try {
        this.resending = true;
        await this.$store.dispatch('sendOtp', {
          userId: this.$route.params.userId,
          context: 'emailVerification',
        });
        this.errorMessage = 'A new verification email has been sent.';
      } catch (error) {
        this.errorMessage =
          'Failed to resend verification email. Please try again.';
      } finally {
        this.resending = false;
      }
    },
    goToHomePage() {
      this.$router.push({ name: 'home' });
    },
    goToOtpPage() {
      this.$store.commit('setUserVerificationContext', 'emailVerification');
      this.$store.commit('setUserId', this.$route.params.userId);
      this.$router.push({ name: 'userVerification' });
    },
  },
  created() {
    this.verifyEmailWithToken();
  },
};
</script>

<style scoped>
.dark-theme {
  background-color: #1e1e1e !important;
  color: #ffffff;
}

.light-theme {
  background-color: #ffffff !important;
}
</style>
