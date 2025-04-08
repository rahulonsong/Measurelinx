import Vue from 'vue';
import store from '../store';
import Vuetify from 'vuetify/lib';
// import 'vuetify/src/stylus/app.styl'
import 'vuetify/src/styles/main.sass';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

Vue.component('font-awesome-icon', FontAwesomeIcon); // Register component globally
library.add(fas); // Include needed icons.

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: store.state.appDark
    ? { dark: store.state.appDark }
    : { light: store.state.appLight },
});
