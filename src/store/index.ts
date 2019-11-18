import Vue from 'vue';
import Vuex from 'vuex';
import showConfigs from './modules/showConfig';
import geniusSister from './modules/geniusSister';
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    showConfigs,
    geniusSister,
  },
});
