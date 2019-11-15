<template>
  <div class="battle-detail">
    <span>Time:{{ encounter.duration }}</span>
    <span>Dps:{{ encounter.ENCDPS }}</span>
    <p><span>{{ encounter.CurrentZoneName }}</span></p>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
interface Encounter {
  CurrentZoneName: string;
  duration: string;
  ENCDPS: string;
}

@Component
export default class BattleDetail extends Vue {
  @Prop() private encounter!: Encounter;
}
</script>

<style lang="less">
.battle-detail {
  width: 100%;
  font-size: 14px;
  font-weight: bold;
  color: #fffdbd;
  letter-spacing: 1px;
  text-shadow: -1px 0 3px #664710, 0 1px 3px #664710, 1px 0 3px #664710,
    0 -1px 3px #664710;
  padding: 0 5px;
  border-bottom: solid #333333 3px;
  white-space:nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
  p {
    margin: 0;
    padding: 0;
  }
  span {
    margin-right: 5px;
    font-size: 12px;
  }
}
</style>