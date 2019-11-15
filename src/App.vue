<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>
    <div class="buttom-ann"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { getCookie, setCookie } from './util/index';
import { State, Action, namespace } from 'vuex-class';
const someModule = namespace('showConfigs');

@Component
export default class App extends Vue {
  @someModule.State((state) => state.showConfigs) private showConfigs: any;
  @someModule.Action('setShowConfigs') private setShowConfigs!: (params: object) => void;
  private initConfigs(): void {
    const configs = getCookie('configs');
    if (configs) {
      this.setShowConfigs(JSON.parse(configs));
    } else {
      setCookie('configs', JSON.stringify(this.showConfigs));
    }
  }
  private mounted(): void {
    this.initConfigs();
  }
}
</script>

<style lang="less">
@font-face {
  font-family: 'sao-font';
  src: url('../public/font/sao.woff2');
}
body,
html {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
body {
  background-color: rgba(51, 51, 51, 0.8);
}
#app {
  font-family: 'sao-font', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: transparent;
}
.buttom-ann{
  position: fixed;
  bottom: 0;
  right: 0;
  width: 0;
  height: 0;
  border: solid 10px;
  border-color: transparent #919191 #919191 transparent;
}
</style>
