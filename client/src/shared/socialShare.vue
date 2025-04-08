<template>
  <div class="share-button">
    <v-menu offset-y top nudge-top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" color="primary" icon>
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
      </template>
      <v-list dense class="no-padding">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-list-item v-bind="attrs" class="min-padding" v-on="on">
              <v-btn icon @click="shareOn('facebook')">
                <v-icon color="blue darken-3">mdi-facebook</v-icon>
              </v-btn>
            </v-list-item>
          </template>
          <span>Share on Facebook</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-list-item v-bind="attrs" class="min-padding" v-on="on">
              <v-btn icon @click="shareOn('twitter')">
                <font-awesome-icon
                  :icon="['fab', 'x-twitter']"
                  class="darken-icon"
                />
              </v-btn>
            </v-list-item>
          </template>
          <span>Share on Twitter</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-list-item v-bind="attrs" class="min-padding" v-on="on">
              <v-btn icon @click="shareOn('linkedin')">
                <v-icon color="blue darken-1">mdi-linkedin</v-icon>
              </v-btn>
            </v-list-item>
          </template>
          <span>Share on LinkedIn</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-list-item v-bind="attrs" class="min-padding" v-on="on">
              <v-btn icon @click="shareOn('whatsapp')">
                <v-icon color="green darken-2">mdi-whatsapp</v-icon>
              </v-btn>
            </v-list-item>
          </template>
          <span>Share on WhatsApp</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-list-item v-bind="attrs" class="min-padding" v-on="on">
              <v-btn icon @click="shareOn('email')">
                <v-icon color="red darken-2">mdi-email</v-icon>
              </v-btn>
            </v-list-item>
          </template>
          <span>Share via Email</span>
        </v-tooltip>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faFacebook,
  faLinkedin,
  faWhatsapp,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';

library.add(faFacebook, faLinkedin, faWhatsapp, faXTwitter);

export default {
  name: 'SocialShare',
  components: {
    FontAwesomeIcon,
  },
  methods: {
    shareOn(platform) {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(document.title);
      let shareUrl = '';

      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
          break;
        case 'whatsapp':
          shareUrl = `https://api.whatsapp.com/send?text=${text} ${url}`;
          break;
        case 'email':
          shareUrl = `mailto:?subject=${text}&body=${url}`;
          break;
      }

      window.open(shareUrl, '_blank');
    },
  },
};
</script>

<style scoped>
.share-button {
  position: fixed;
  left: 8px;
  bottom: 8px;
  transform: translateY(-50%);
  z-index: 10;
}
.no-padding {
  padding: 0 !important;
  margin: 0 !important;
}
.min-padding {
  padding: 4px !important;
  margin: 0 !important;
  justify-content: center;
}
.v-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.v-icon,
.fa-icon {
  font-size: 24px;
}
.darken-icon {
  color: inherit; /* Inherit color for theme compatibility */
}
</style>
