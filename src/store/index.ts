import Vue from 'vue';
import Vuex from 'vuex';
import showConfigs from './modules/showConfig';
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    showConfigs,
  },
});
