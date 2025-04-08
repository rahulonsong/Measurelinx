import Vue from "vue";
import Vuex from "vuex";

// Importing store variables
import getDefaultState from "./store/state";
import getters from "./store/getters";
import mutations from "./store/mutations";
import actions from "./store/actions";

Vue.use(Vuex);

export default new Vuex.Store({
  state: getDefaultState(),
  mutations: mutations,
  actions: actions,
  getters: getters,
});
