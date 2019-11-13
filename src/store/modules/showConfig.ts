import { Commit, Mutation } from 'vuex';
const state: any = {
  showConfigs: {
    joblogo: {
      status: true,
      label: '职业图标',
    },
    abbreviation: {
      status: true,
      label: '职业缩写',
    },
    suffix: {
      status: true,
      label: '数值后缀',
    },
    maxhit: {
      status: true,
      label: '最强伤害',
    },
    deaths: {
      status: false,
      label: '死亡次数',
    },
    direct: {
      status: false,
      label: '直击概率',
    },
    crit: {
      status: false,
      label: '暴击概率',
    },
    dirctAcrit: {
      status: false,
      label: '直暴概率',
    },
  },
};
const mutations = {
  changeShowConfigs(states: any, params: any) {
    for (const item in states.showConfigs) {
      if (states.showConfigs[item].label === params.label) {
        states.showConfigs[item].status = params.status;
        break;
      }
    }
  },
  setShowConfigs(states: any, params: any) {
    states.showConfigs = params;
  },
};
const actions: any = {
  changeShowConfigs(context: { commit: Commit }, params: object) {
    context.commit('changeShowConfigs', params);
  },
  setShowConfigs(context: { commit: Commit }, params: object) {
    context.commit('setShowConfigs', params);
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
