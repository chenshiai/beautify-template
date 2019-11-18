import { Commit, Mutation } from 'vuex';
const state: any = {
  message: {
    currentArea: '',
    time: '',
    totalDps: '',
    youDps: '',
  },
};
const mutations: any = {
  changeMessage(states: any, params: any) {
    states.message = Object.assign(states.message, params);
  },
};
const actions: any = {
  changeMessage(context: { commit: Commit }, params: object) {
    context.commit('changeMessage', params);
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
