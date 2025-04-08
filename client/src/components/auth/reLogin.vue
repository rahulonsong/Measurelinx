<template>
  <v-row>
    <v-col>
      <v-dialog
        v-model="reLogInDialog"
        persistent
        content-class="curvedBorder1"
        max-width="600"
      >
        <!-- <v-btn @click="test">Test</v-btn> -->
        <v-card light max-width="600" max-height="600">
          <v-card-title
            class="dialogTitleBackground title white--text darken-2 font-weight-bold"
          >
            {{ reLogInDialogHeading }}
          </v-card-title>
          <!-- Relogin content -->
          <v-card-text style="max-height: 800px" class="justify__text">
            <!-- Relogin Password field -->
            <v-container>
              <v-form
                id="add--textBlock-form"
                v-model="isReLogInFormValid"
                lazy-validation
                ref="reLogInForm"
                @submit.prevent="handleLoginUser"
                class="pa-0"
              >
                <!-- Re-login text -->
                <v-row
                  v-if="!displayReLogInPassword"
                  justify="start"
                  class="my-0 py-0"
                >
                  <v-col class="my-0 py-0">
                    <p
                      class="grey--text text--darken-3 font-weight-medium subtitle-2 mt-2 mb-0 py-0"
                    >
                      {{ reLogInText }} For logging in, click here
                      <v-btn
                        text
                        small
                        class="custom-transform-class text-none green--text text--darken-3 font-weight-bold mx-0 px-0"
                        @click="updateReLogInDialog"
                        >Re-Login</v-btn
                      >
                    </p>
                  </v-col>
                </v-row>
                <!-- Password field -->
                <v-row
                  v-if="displayReLogInPassword"
                  justify="start"
                  class="my-0 py-0"
                >
                  <v-col class="my-0 py-0">
                    <!-- relogin password -->
                    <v-text-field
                      v-model="reLogInPassword"
                      prepend-icon="extension"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="showPassword = !showPassword"
                      :type="showPassword ? 'text' : 'password'"
                      label="Password"
                      :rules="validationRules.required"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
          <!-- Cancel Login buttons -->
          <v-card-actions>
            <v-row justify="space-around" class="mb-2">
              <!-- Cancel button -->
              <v-col cols="4" md="2" sm="3" class="ma-0 pa-0 text-center">
                <v-btn
                  rounded
                  small
                  :color="
                    displayReLogInPassword
                      ? 'error darken-1'
                      : 'primary darken-1'
                  "
                  @click="clearReLogInDialog"
                  class="bold px-3 darken-3 white--text custom-transform-class text-none"
                >
                  {{ displayReLogInPassword ? 'Cancel' : 'Dismiss' }}
                </v-btn>
              </v-col>
              <!-- Login -->
              <v-col
                v-if="displayReLogInPassword"
                cols="4"
                md="2"
                sm="3"
                class="ma-0 pa-0 text-center"
              >
                <v-btn
                  rounded
                  small
                  :light="!loading"
                  :disabled="
                    loading || (!isReLogInFormValid && displayReLogInPassword)
                  "
                  class="custom-transform-class text-none"
                  @click="handleLoginUser"
                  color="success darken-1"
                  type="submit"
                >
                  Login
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
      </v-dialog>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'relogin',
  data() {
    return {
      showPassword: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    error: {
      get() {
        return this.$store.getters.error;
      },
      set(value) {
        this.$store.commit('setError', value);
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
    loading: {
      get() {
        return this.$store.getters.loading;
      },
      set(value) {
        this.$store.commit('setLoading', value);
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
    // Re-Login GetSet
    reLogInDialog: {
      get() {
        return this.$store.getters.reLogInDialog;
      },
      set(value) {
        this.$store.commit('setReLogInDialog', value);
      },
    },
    reLogInDialogHeading: {
      get() {
        return this.$store.getters.reLogInDialogHeading;
      },
      set(value) {
        this.$store.commit('setReLogInDialogHeading', value);
      },
    },
    reLogInText: {
      get() {
        return this.$store.getters.reLogInText;
      },
      set(value) {
        this.$store.commit('setReLogInText', value);
      },
    },
    isReLogInFormValid: {
      get() {
        return this.$store.getters.isReLogInFormValid;
      },
      set(value) {
        this.$store.commit('setIsReLogInFormValid', value);
      },
    },
    displayReLogInPassword: {
      get() {
        return this.$store.getters.displayReLogInPassword;
      },
      set(value) {
        this.$store.commit('setDisplayReLogInPassword', value);
      },
    },
    reLogInPassword: {
      get() {
        return this.$store.getters.reLogInPassword;
      },
      set(value) {
        this.$store.commit('setReLogInPassword', value);
      },
    },
  },
  methods: {
    async handleLoginUser() {
      if (this.$refs.reLogInForm.validate()) {
        this.$store.commit('setIsReLoggingIn', true);
        await this.$store.dispatch('signUserIn', {
          email: this.user.email,
          password: this.reLogInPassword,
        });
      } else {
        this.handleDialog(null, 'formNotValid');
      }
    },
    clearReLogInDialog() {
      this.$store.dispatch('clearReLogInDialog');
    },
    updateReLogInDialog() {
      this.displayReLogInPassword = true;
      this.reLogInDialogHeading = 'Re-Login';
    },
    test() {
      // console.log("displayReLogInPassword:", this.displayReLogInPassword);
      // console.log("reLogInDialogHeading:", this.reLogInDialogHeading);
    },
  },
};
</script>
<style>
.myfont1 {
  font-size: 14px;
}
.inputValue input::-webkit-outer-spin-button,
.inputValue input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.dialogTitleBackground {
  background: #6f0a06; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #640508,
    #b41914
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #640508,
    #b41914
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.exportBackground {
  background: linear-gradient(90deg, rgb(13, 6, 46) 0%, #a8c0ff 100%);
}
</style>
