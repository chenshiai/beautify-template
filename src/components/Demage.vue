<template>
  <svg viewBox='15 15 70 70' xmlns='http://www.w3.org/2000/svg'>
    <use xlink:href='#percent' :style='style' />
  </svg>
</template>

<script lang='ts'>
import { Vue, Prop, Component } from 'vue-property-decorator';

@Component
export default class Demage extends Vue {
  @Prop({ default: 100 }) private percent!: string;

  get style(): string {
    const count = (100 - parseInt(this.percent, 10)) * 1.52;
    return `stroke-dashoffset: ${count};`;
  }
}
</script>

<style lang='less'>
@hp: #23b123;
@dmg: #e94646;
@dmgtext: #ffe17d;
.damage {
  background-color: transparent;
  width: 100px;
  height: 100px;
  transform-origin: top left;
  opacity: 0.7;
  #damageP {
    stroke: @dmg;
    fill: none;
    stroke-width: 15;
    stroke-dasharray: 152;
  }
  #text {
    font-size: 15px;
    font-weight: bold;
    fill: @dmgtext;
    text-shadow: -1px 0 3px #664710, 0 1px 3px #664710, 1px 0 3px #664710,
      0 -1px 3px #664710;
  }
  #healP {
    stroke: @hp;
    fill: none;
    stroke-width: 10;
  }
}
</style>
