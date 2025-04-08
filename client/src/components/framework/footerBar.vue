<template>
  <v-footer height="auto" class="ma-auto pa-0" style="width: 100%">
    <v-container class="ma-0 pa-0" fluid justify-center>
      <v-card tile fluid :style="footerStyle">
        <v-card-text
          class="pa-0 d-flex justify-center"
          :style="appThemeFontColor"
        >
          <v-btn v-for="icon in icons" :key="icon.name" class="mx-3" icon>
            <v-icon v-if="icon.type === 'mdi'" size="24px">{{
              icon.path
            }}</v-icon>
            <font-awesome-icon
              v-else
              :icon="['fab', 'x-twitter']"
              class="darken-icon"
            />
          </v-btn>
        </v-card-text>
        <v-card-text class="my-0 pa-0 d-flex justify-center mx-5">
          <p class="mx-5 my-0 py-0">
            We hope you found this page useful. Connect with us on the social
            media pages
          </p>
        </v-card-text>
        <v-card-text class="mt-1 pb-2 pt-0 d-flex justify-center">
          &copy;{{ new Date().getFullYear() }} —
          <strong>{{ copyRightBrandName }}</strong>
        </v-card-text>
      </v-card>
    </v-container>
  </v-footer>
</template>

<script>
import { mdiFacebook, mdiLinkedin, mdiInstagram } from '@mdi/js';
import { mapGetters } from 'vuex';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  name: 'footerBar',
  components: {
    FontAwesomeIcon,
  },
  data: () => ({
    icons: [
      { name: 'mdi-facebook', path: mdiFacebook, type: 'mdi' },
      { name: 'fab fa-twitter', path: 'twitter', type: 'fa' },
      { name: 'mdi-linkedin', path: mdiLinkedin, type: 'mdi' },
      { name: 'mdi-instagram', path: mdiInstagram, type: 'mdi' },
    ],
    sideNavWidth: 300,
  }),
  computed: {
    ...mapGetters(['appThemeFontColor', 'sideNav']),
    copyRightBrandName() {
      return process.env.VUE_APP_COPY_RIGHT_BRAND_NAME;
    },
    footerStyle() {
      return {
        marginLeft: this.sideNav ? `${this.sideNavWidth}px` : '0',
      };
    },
  },
};
</script>

<style scoped>
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
