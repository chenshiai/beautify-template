<template>
  <div class="config-page">
    <div class="waiting">
      <router-link to="/">返回</router-link>
    </div>
    <div class="config-list">
      <span class="list-title">显示设定</span>
      <div v-for="(item, index) in showConfigs"
        :key="index"
        class="item">
        {{ item.label }}
        <input :name="item.label" type="checkbox" :checked="item.status" @change="changed"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { setCookie } from '../util/index';
import { State, Action, namespace } from 'vuex-class';
const someModule = namespace('showConfigs');

@Component
export default class Config extends Vue {
  @someModule.State((state) => state.showConfigs) private showConfigs: any;
  @someModule.Action('changeShowConfigs') private changeShowConfigs!: (params: object) => void;
  private changed(e: any) {
    const params = {
      status: e.target.checked,
      label: e.target.name,
    };
    this.changeShowConfigs(params);
    setCookie('configs', JSON.stringify(this.showConfigs));
  }
}
</script>

<style lang="less">
@dmgtext: #fff700;
.waiting {
  a {
    color: @dmgtext;
    text-decoration: none;
  }
  text-shadow: -1px 0 3px #664710, 0 1px 3px #664710, 1px 0 3px #664710,
    0 -1px 3px #664710;
}
.config-list {
  border: solid #333333 1px;
  border-left: solid #333333 3px;
  border-right: solid #333333 3px;
  background-color: rgba(65, 65, 65, 0.4);
  padding: 0 3px;
  .list-title {
    color: #fff700;
    font-weight: bold;
  }
  .item {
    color: #eee;
  }
}
</style>