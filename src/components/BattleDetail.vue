<template>
  <div class="battle-detail">
    <span>{{ encounter.duration }}</span>
    <p><span>{{ encounter.ENCDPS }}·团队DPS</span></p>
    <p><span>{{ encounter.CurrentZoneName }}</span></p>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import { Encounter } from '../interface/index';

@Component
export default class BattleDetail extends Vue {
  @Prop() private encounter!: Encounter;
}
</script>

<style lang="less">
.battle-detail {
  text-align: right;
  width: 100%;
  font-size: 14px;
  font-weight: bold;
  color: #fffdbd;
  letter-spacing: 1px;
  text-shadow: -1px 0 3px #664710, 0 1px 3px #664710, 1px 0 3px #664710,
    0 -1px 3px #664710;
  border-bottom: solid #333333 3px;
  background-color: rgba(51, 51, 51, 0.8);
  white-space:nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
  p {
    margin: 0;
    padding: 0;
  }
  span {
    margin-right: 5px;
  }
}
</style>