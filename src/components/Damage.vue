<template>
  <span class="dps-number" :id="`dps${player}`"></span>
</template>

<script lang='ts'>
// dps数据动态效果组件
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import { CountUp } from '../util/countUp.min.js';
import { CountObject, CountUpType } from '../interface/index';

@Component
export default class Demage extends Vue {
  @Prop({ default: '' }) private ENCDPS!: string;
  @Prop({ default: 0 }) private player!: number;
  private change = {};
  @Watch('ENCDPS')
  private w_ENCDPS(newVal: string) {
    (this.change as CountObject).update(parseInt(newVal, 10));
  }
  private mounted() {
    const options: CountUpType = {
      startVal: 0,
      duration: 1.5,
      useGrouping: false,
    };
    this.$nextTick(() => {
      this.change = new CountUp(`dps${this.player}`, parseInt(this.ENCDPS, 10), options);
      (this.change as CountObject).start();
    });
  }
}
</script>

<style lang="less">
.dps-number {
  font-weight: bold;
}
</style>