<template>
  <v-dialog v-model="showDialog" persistent max-width="500px">
    <v-card>
      <v-card-title class="headline">
        <v-icon class="mr-2">mdi-cookie</v-icon> Your Privacy
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <p>
                By clicking "Accept all cookies", you agree to store cookies on
                your device to enhance site navigation, analyze site usage, and
                assist in our marketing efforts. Customize your settings if you
                wish to manage your preferences.
              </p>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn @click="toggleSettings">
                {{ showSettings ? 'Hide Settings' : 'Customize Settings' }}
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-if="showSettings">
            <v-col>
              <v-checkbox
                v-model="preferences.necessary"
                label="Necessary Cookies"
                disabled
                readonly
              ></v-checkbox>
              <v-checkbox
                v-model="preferences.functional"
                label="Functional Cookies"
              ></v-checkbox>
              <v-checkbox
                v-model="preferences.marketing"
                label="Marketing Cookies"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="acceptAll">Accept all cookies</v-btn>
        <v-btn v-if="showSettings" color="secondary" @click="savePreferences"
          >Save preferences</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      showDialog: !Cookies.get('cookieConsent'),
      showSettings: false,
      preferences: {
        necessary: true,
        functional: false,
        marketing: false,
      },
    };
  },
  methods: {
    toggleSettings() {
      this.showSettings = !this.showSettings;
    },
    acceptAll() {
      this.preferences.functional = true;
      this.preferences.marketing = true;
      this.savePreferences();
    },
    savePreferences() {
      Cookies.set('cookieConsent', 'true', {
        expires: 30,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production',
      });
      Cookies.set('cookiePreferences', JSON.stringify(this.preferences), {
        expires: 30,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production',
      });
      this.showDialog = false;
    },
  },
  mounted() {
    if (!Cookies.get('cookieConsent')) {
      this.showDialog = true;
    } else {
      this.showDialog = false;
    }
  },
};
</script>

<style scoped>
.cookie-dialog {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #000;
  color: #fff;
  padding: 10px;
  text-align: center;
}
</style>
