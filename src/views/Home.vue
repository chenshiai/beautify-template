<template>
  <div class='home'>
    <svg class='damage' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <g id='sex'>
          <path d="m25 7.5l15.155 8.75l0 17.5l-15.155 8.75l-15.155 -8.75l0 -17.5z" />
        </g>
        <linearGradient id="Gradient" x1="1" y1="1" x2="0" y2="0">
          <stop offset="0" stop-color="white" stop-opacity="0" />
          <stop offset="0.4" stop-color="white" stop-opacity="1"></stop>
          <stop offset="1" stop-color="white" stop-opacity="0" />
        </linearGradient>
        <mask id="Mask">
          <rect x="0" y="-3" width="50" height="56" fill="url(#Gradient)"  />
        </mask>
      </defs>
    </svg>
    <div class="waiting" v-if="combtants.length <= 0">等待数据输入...</div>
    <template v-else>
      <div class="battle-detail">
        <div>{{ encounter.CurrentZoneName }}</div>
        <span>时间:{{ encounter.duration }}</span>
        <span>团伤:{{ encounter.ENCDPS }}</span>
      </div>
      <transition-group name="list-complete">
        <div v-for='(item, index) in combtants' :key='item.name'
          :class="['combtant', item.name === 'YOU' ? 'self-combtant' :  getJobColor(item.Job)]" >
          <div class='damage-job' v-show="showConfigs.joblogo.status">
            <svg class="job-border" xmlns='http://www.w3.org/2000/svg'>
              <defs>
                <clipPath :id="`sex-mask${index}`">
                  <rect x="0" y="-3" width="50" :height="getPercentNumber(item.damageP)"/>
                </clipPath>
              </defs>
              <use xlink:href='#sex' class="border-sex" />
              <use xlink:href='#sex' class="sex-percent" :clip-path="`url(#sex-mask${index})`" mask="url(#Mask)"/>
            </svg>
            <img class='job' :src="`../dist/icons/${item.Job.toLowerCase()}.png`" />
          </div>
          <div class='play-detail'>
            <div class='name'>{{ item.name }}<span v-show="showConfigs.abbreviation.status"> · {{item.Job}}</span></div>
            <div class='encdps'>
              <div style="float: left;">
                {{ item.ENCHPS }}<span class="unit" v-show="showConfigs.suffix.status">HPS</span>
              </div>
              <Damage :ENCDPS="item.ENCDPS" :player="item.name"></Damage><span class="unit" v-show="showConfigs.suffix.status">DPS</span>
            </div>
            <div class='maxhit' v-show="showConfigs.maxhit.status">
              {{ item.maxhit }}
            </div>
          </div>
        </div>
      </transition-group>
    </template>
    <ul class="config">
      <li @click="lookMyself">
        <img :src="`../dist/img/${'self'}.svg`">
        <span class="config-detail">个人显示开关</span>
      </li>
      <li @click="toConfig">
        <img :src="`../dist/img/${'setting'}.svg`" alt="">
        <span class="config-detail">设置</span>
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
// @ is an alias to /src
import { Component, Vue, Prop } from 'vue-property-decorator';
import { isDps, isHeal, isTank, setCookie, getCookie } from '../util/index';
import { State, Action, namespace } from 'vuex-class';
import Damage from '../components/Damage.vue';
import mockdata from '../assets/data';
const someModule = namespace('showConfigs');

interface Detail {
  Encounter: object;
  Combatant: object;
  isActive: boolean;
}
interface ActDetail {
  detail: Detail;
}
interface People {
  name?: string;
  ENCDPS?: string;
  maxhit?: string;
  deaths?: string;
  damageP?: string;
  'damage%': string;
}
interface Combatants {
  [key: string]: People;
}
@Component({
  components: {
    Damage,
  },
})
export default class Home extends Vue {
  private data: Detail = {
    Encounter: {},
    Combatant: {},
    isActive: false,
  };
  private Myself: boolean = false;
  private TopDamage: string | undefined = '';
  @someModule.State((state) => state.showConfigs) private showConfigs: any;
  @someModule.Action('setShowConfigs') private setShowConfigs!: (params: object) => void;
  get encounter(): any {
    return this.data.Encounter;
  }
  get combtants(): People[] {
    const list: People[] = [];
    const { Combatant } = this.data;
    Object.keys(Combatant).some((item: string) => {
      if (this.Myself) {
        const you = 'YOU'; // tslint不允许通过字符串文本访问对象
        list.push((Combatant as Combatants)[you]);
        return true;
      }
      (Combatant as Combatants)[item].damageP = (Combatant as Combatants)[item]['damage%'];
      list.push((Combatant as Combatants)[item]);
    });
    if (list.length > 0 ) {
      this.TopDamage = list[0].damageP;
    }
    return list;
  }
  private updateTemplate(act: any): void {
    this.data = act.detail;
  }
  private lookMyself(): void {
    this.Myself = !this.Myself;
  }
  private getJobColor(job: string): string {
    if (isDps(job)) {
      return 'dps-color';
    } else if (isTank(job)) {
      return 'tank-color';
    } else if (isHeal(job)) {
      return 'heal-color';
    } else {
      return 'other-color';
    }
  }
  private getPercentNumber(percent: string): number {
    const height = 56 * parseInt(percent, 10) / parseInt((this.TopDamage as string), 10);
    return height;
  }
  private toConfig(): void {
    this.$router.push('config');
  }
  private initConfigs(): void {
    const configs = getCookie('configs');
    if (configs) {
      this.setShowConfigs(JSON.parse(configs));
    } else {
      setCookie('configs', JSON.stringify(this.showConfigs));
    }
  }
  private mounted(): void {
    // this.data = mockdata; // 测试用数据
    document.addEventListener('onOverlayDataUpdate', (act) => {
      this.updateTemplate(act);
    });
    this.initConfigs();
  }
  private destroyed() {
    document.removeEventListener('onOverlayDataUpdate', (act) => {
      this.updateTemplate(act);
    });
  }
}
</script>

<style lang='less'>
@dmgtext: #fff700;
@Dps: rgba(144, 47, 41, 0.8);
@Tank: rgba(38, 87, 134, 0.8);
@Heal: rgba(90, 111, 51, 0.8);
@black: #272727;
.waiting {
  margin-left: 3px;
  color: @dmgtext;
  white-space:nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
  text-shadow: -1px 0 3px #664710, 0 1px 3px #664710, 1px 0 3px #664710,
    0 -1px 3px #664710;
}
.home {
  min-height: 50px;
  position: relative;
}
.battle-detail {
  width: 100%;
  font-size: 14px;
  font-weight: 300;
  color: @dmgtext;
  text-shadow: -1px 0 3px #664710, 0 1px 3px #664710, 1px 0 3px #664710,
    0 -1px 3px #664710;
  white-space:nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
  padding: 0 5px;
  border-bottom: solid #333333 3px;
  span {
    margin-right: 5px;
    font-size: 12px;
  }
}
.config {
  list-style: none;
  margin: 3px 0 0 0;
  padding: 0;
  position: absolute;
  top: 0;right: 0;
  font-size: 10px;
  z-index: 10;
  li {
    cursor: pointer;
    display: inline-block;
    margin-right: 5px;
    min-width: 10px;
    .config-detail {
      position: absolute;
      display: none;
      text-align: center;
      background-color: #fff;
      box-shadow: #555555 0 0 5px;
      right: 0px;
      top: 16px;
      min-width: 80px;
    }
    &:hover {
      .config-detail {
        display: block;
      }
    }
  }
}
.combtant {
  display: flex;
  overflow: hidden;
  min-height: 34px;
  border: solid #333333 1px;
  border-left: solid #333333 3px;
  border-right: solid #333333 3px;
  box-shadow: inset 0px 0px 15px 2px #333;
  transition: all 0.4s;
  .damage-job {
    width: 50px;
    height: 50px;
    position: relative;
    .job-border {
      width: 50px;
      height: 50px;
    }
    .border-sex {
      fill: none;
      stroke: #ddd;
      stroke-width: 5px;
    }
    .sex-percent {
      fill: none;
      stroke-width: 3.5px;
      // animation: rotate 2s ease-in-out infinite alternate; // 不怎么显眼的动画效果
    }
    .damageP {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 10px;
      font-weight: bold;
      color: rgb(253, 234, 169);
      text-shadow: -1px 0 3px #664710, 0 1px 3px #664710, 1px 0 3px #664710,
        0 -1px 3px #664710;
    }
    .job {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .play-detail {
    flex-grow: 1;
    color: #fff;
    font-size: 14px;
    padding:0 2px 0 2px;
    line-height: 1;
    text-shadow: -1px 0 3px #664710, 0 1px 3px #664710, 1px 0 3px #664710,
      0 -1px 3px #664710;
    .name {
      line-height: 18px;
      white-space:nowrap;
      text-overflow:ellipsis;
      overflow:hidden;
    }
    
    .encdps {
      text-align: right;
    }
    .maxhit {
      line-height: 16px;
      font-size: 11px;
    }
    .death-icon {
      opacity: 0.6;
      width: 10px;
      vertical-align:middle;
    }
    .unit {
      display: inline-block;
      transform: scale(0.7);
    }
  }
}
.dps-color {
  background-color: @Dps;
  .sex-percent {
    stroke: #75005c;
  }
  
}
.tank-color {
  background-color: @Tank;
  .sex-percent {
    stroke: #020075;
  }
}
.heal-color {
  background-color: @Heal;
  .sex-percent {
    stroke: #00756f;
  }
}
.other-color {
  background-color: rgba(92, 91, 58, 0.8);
}
.self-combtant {
  background-color: rgba(255, 255, 255, 0.8);
  .damage-job {
    .border-sex {
      stroke: #333333;
      fill: #dbdbdb;
    }
    .sex-percent {
      stroke: #ffffff;
    }
  }
  .play-detail {
    color: @black;
    text-shadow: -1px 0 3px #eeeeee, 0 1px 3px #eeeeee, 1px 0 3px #eeeeee,
        0 -1px 3px #eeeeee;
  }
}
@keyframes rotate {
  0% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}
.damage {
  background-color: transparent;
  width: 50px;
  height: 50px;
  position: absolute;
  left: -9999px;
}

.list-complete-enter, .list-complete-leave-to {
  opacity: 0;
  transform: scale(0.7);
  width: 100%;
}
.list-complete-leave-active {
  position: absolute;
  width: 100%;
}
</style>
