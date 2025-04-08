<template>
  <v-container class="text-center">
    <!-- Main Content -->
    <v-row wrap justify="center">
      <v-col cols="12" class="text-center">
        <!-- Unsubscribe Form -->
        <v-card dense class="mx-auto" max-width="600" style="overflow: hidden">
          <v-row justify="center" :style="appTheme1">
            <v-col class="text-center">
              <v-card-text
                class="text-center text--darken-2 mx-auto font-weight-black my-2 py-2"
                style="overflow: hidden"
              >
                <h2>We are sorry to see you go!</h2>
              </v-card-text>
            </v-col>
          </v-row>
          <v-card-text>
            <v-form
              dense
              id="update-password--form"
              lazy-validation
              ref="updatePasswordForm"
              class="my-0 py-0"
            >
              <!-- Reason- explanation -->
              <v-row class="mt-5 mb-0">
                <v-col class="text-left">
                  <p>
                    Please help us improve the user experience by letting us
                    know what prompted you to unsubscribe
                  </p>
                </v-col>
              </v-row>
              <!-- Reason-->
              <v-row class="mt-5 mb-0">
                <v-col>
                  <v-select
                    outlined
                    class="appFont3 customDecoration my-0 py-0"
                    v-model="reasonForUnsubscribing"
                    :items="reasonsForUnsubscribing"
                    dense
                  ></v-select>
                </v-col>
              </v-row>
              <v-row
                class="mt-5 mb-0"
                v-if="reasonForUnsubscribing === 'Other'"
              >
                <v-col>
                  <v-textarea
                    class="myfont1 inputValue lighten-3 mb-0 pb-0"
                    name="Other Reason For Unsubscribing"
                    placeholder="Please let us know the reason for unsubscribing"
                    id="otherReasonForUnsubscribing"
                    elevation="12"
                    outlined
                    loading
                    v-model="otherReasonForUnsubscribing"
                    style="max-width: 300px"
                  >
                  </v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-row justify="space-around" class="my-2">
              <!-- Unsubscribe button -->
              <v-col cols="12" md="6" sm="6" class="text-center">
                <v-btn
                  :light="!loading"
                  small
                  @click="handleUnsubscribeUser()"
                  class="bold px-3 darken-3 white--text custom-transform-class text-none cyan"
                >
                  Unsubscribe
                </v-btn>
              </v-col>
              <!-- Cancel button -->
              <v-col cols="12" md="6" sm="6" class="text-center">
                <v-btn
                  :light="!loading"
                  small
                  @click="cancelUnsubscribe()"
                  class="bold px-3 darken-3 white--text custom-transform-class text-none primary"
                >
                  Cancel
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'unsubscribeUser',
  data() {
    return {
      reasonForUnsubscribing: '',
      otherReasonForUnsubscribing: '',
      loader: null,
      reasonsForUnsubscribing: [],
    };
  },
  computed: {
    ...mapGetters([
      'validationRules',
      'user',
      'userId',
      'email',
      'error',
      'errorStatus',
      'loading',
      'appName',
      'userId',
      'appThemeFontColor',
      'appThemeFontColor1',
      'appTheme1',
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
    appName() {
      return process.env.VUE_APP_NAME;
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.progressing = false;
    });
  },
  watch: {},
  methods: {
    onDismissed() {
      this.$store.dispatch('clearError');
    },
    // Handling Dialogs
    handleDialog(content, context) {
      this.$store.dispatch('handleDialog', {
        content: content,
        context: context,
      });
    },
    async handleUnsubscribeUser() {
      const payload = {
        subscriberEmail: this.$route.params.email,
        reasonForUnsubscribing:
          this.reasonForUnsubscribing === 'Other'
            ? this.otherReasonForUnsubscribing
            : this.reasonForUnsubscribing,
      };
      // console.log('payload:', payload);
      // this.$store.dispatch('setLoading',true)
      await this.$store.dispatch('unsubscribeUser', payload);
      // Diring to home page
      if (this.$route.name !== 'home') {
        this.$router.push({ name: 'home' });
      }
    },
    cancelUnsubscribe() {
      // Closing the window
      window.close();
    },
  },
  async created() {
    this.reasonForUnsubscribing = '';
    this.otherReasonForUnsubscribing = '';
    // get resons for unsubscribiong
    const payload = {
      categoryName: 'Reasons For Unsubscribing',
    };
    const reasons = await this.$store.dispatch(
      'getReasonsForUnsubscribing',
      payload
    );
    this.reasonsForUnsubscribing = [...reasons];
    this.reasonForUnsubscribing = this.reasonsForUnsubscribing[0];
  },
};
</script>
<style scoped>
/* .user__verify--card {
  border: 1px solid rgb(179, 230, 230) !important;
}
.user__verify {
  margin: auto 30%;
} */
</style>
