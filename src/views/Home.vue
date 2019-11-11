<template>
  <div class='home'>
    <svg class='damage' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <g id='sex'>
          <path d="m50 0l43.3 25l0 50l-43.3 25l-43.3 -25l0 -50z" />
        </g>
        <linearGradient id="Gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="white" stop-opacity="1" />
          <stop offset="1" stop-color="white" stop-opacity="0.3" />
        </linearGradient>
        <mask id="Mask">
          <rect x="0" y="-6" width="100" height="112" fill="url(#Gradient)"  />
        </mask>
      </defs>
    </svg>
    <div class="waiting" v-if="combtants.length <= 0" @click="setTestData">等待数据输入</div>
    <template v-else>
      <div class="battle-detail">
        <ul class="config">
          <li>
            <img src="../assets/self.svg" @click="lookMyself">
            <span class="config-detail">个人显示开关</span>
          </li>
          <li>
            <img src="../assets/setting.svg" alt="">
            <span class="config-detail">设置开发中</span>
          </li>
        </ul>
        <div>{{ encounter.CurrentZoneName }}</div>
        <span>时间:{{ encounter.duration }}</span>
        <span>团伤:{{ encounter.ENCDPS }}</span>
      </div>
      <transition-group name="list-complete">
        <div v-for='(item, index) in (combtants)' :key='item.name'
          :class="['combtant', item.name === 'YOU' ? 'self-combtant' :  getJobColor(item.Job)]" >
          <div class='damage-job'>
            <svg class="job-border" xmlns='http://www.w3.org/2000/svg'>
              <defs>
                <clipPath :id="`sex-mask${index}`">
                  <rect x="0" y="-6" width="100" :height="getPercentNumber(item.damageP)"/>
                </clipPath>
              </defs>
              <use xlink:href='#sex' class="border-sex" />
              <use xlink:href='#sex' class="sex-percent" :clip-path="`url(#sex-mask${index})`" mask="url(#Mask)"/>
            </svg>
            <img class='job' :src="`../dist/icons/${item.Job.toLowerCase()}.png`" />
            <span class="damageP">{{ item.damageP }}</span>
          </div>
          <div class='play-detail'>
            <div class='name'>{{ item.name }} · {{item.Job}}</div>
            <div class='encdps'>
              <div style="float: left;">
                {{ item.ENCHPS }}
                <span class="unit">HPS</span>
              </div>
              <div>
                {{ item.ENCDPS }}
                <span class="unit">DPS</span>
              </div>
            </div>
            <div class='maxhit'>
              {{ item.maxhit }}
              <span style="float: right;">
                {{ item.deaths }}
                <img src="../assets/kulou.svg" class="death-icon">
              </span>
            </div>
          </div>
        </div>
      </transition-group>
    </template>
  </div>
</template>

<script lang='ts'>
// @ is an alias to /src
import { Component, Vue, Prop } from 'vue-property-decorator';
import { isDps, isHeal, isTank } from '../util/index';
import mockdata from '../assets/data.js';
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
@Component
export default class Home extends Vue {
  private data: Detail = {
    Encounter: {},
    Combatant: {},
    isActive: false,
  };
  private Myself: boolean = false;
  private TopDamage: string | undefined = '';
  get encounter(): any {
    return this.data.Encounter;
  }
  get combtants(): People[] {
    const list: People[] = [];
    const { Combatant } = this.data;
    Object.keys(Combatant).forEach((item: string) => {
      (Combatant as Combatants)[item].damageP = (Combatant as Combatants)[item]['damage%'];
      list.push((Combatant as Combatants)[item]);
    });
    if (list.length > 0 ) {
      this.TopDamage = list[0].damageP;
    }
    if (this.Myself) {
      const you = 'YOU'; // tslint不允许通过字符串文本访问对象
      return [(Combatant as Combatants)[you]];
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
    const height = 112 * parseInt(percent, 10) / parseInt((this.TopDamage as string), 10);
    return height;
  }
  private setTestData(): void {
    this.data = mockdata;
  }
  private mounted(): void {
    document.addEventListener('onOverlayDataUpdate', (act) => {
      this.updateTemplate(act);
    });
  }
}
</script>

<style lang='less'>
@hp: #ffc917;
@dmg: rgba(255, 0, 0, 0.774);
@dmgtext: #fff700;
@Dps: rgba(144, 47, 41, 0.8);
@Tank: rgba(38, 87, 134, 0.8);
@Heal: rgba(90, 111, 51, 0.8);
@black: #272727;
.waiting {
  color: @dmgtext;
  text-shadow: -1px 0 3px #664710, 0 1px 3px #664710, 1px 0 3px #664710,
    0 -1px 3px #664710;
}
.home {
  min-width: 200px;
}
.battle-detail {
  width: 100%;
  font-size: 14px;
  font-weight: 300;
  color: @black;
  text-shadow: -1px 0 3px #dbdbdb, 0 1px 3px #dbdbdb, 1px 0 3px #dbdbdb,
    0 -1px 3px #dbdbdb;
  span {
    margin-right: 5px;
    font-size: 12px;
  }
  .config {
    display: block;
    list-style: none;
    float: right;
    margin: 0;
    position: relative;
    li {
      cursor: pointer;
      display: inline-block;
      margin-right: 5px;
      .config-detail {
        position: absolute;
        display: none;
        background-color: #fff;
        box-shadow: #555555 0 0 5px;
        right: 0px;
        top: 16px;
      }
      &:hover {
        .config-detail {
          display: block;
        }
      }
    }
  }
}
.combtant {
  display: flex;
  // width: 100%;
  overflow: hidden;
  border: solid #ddd 1px;
  box-shadow: inset 0px 0px 20px #2e2e2e;
  transition: all 0.5s;
  .damage-job {
    width: 50px;
    height: 50px;
    position: relative;
    .job-border {
      transform-origin: top left;
      width: 100px;
      height: 100px;
      transform: scale(0.5);
    }
    .border-sex {
      transform-origin: center center;
      fill: none;
      stroke: #eeeeee;
      stroke-width: 14px;
      transform: scale(0.7);
    }
    .sex-percent {
      transform-origin: center center;
      stroke: #e75d00;
      fill: none;
      stroke-width: 10px;
      transform: scale(0.7) rotate(180deg);
    }
    .damageP {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 12px;
      font-weight: bold;
      color: @dmgtext;
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
    margin-left: 5px;
    padding-right: 5px;
    color: #fff;
    font-size: 14px;
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
      font-weight: bold;
      text-align: right;
    }
    .maxhit {
      font-size: 10px;
    }
    .death-icon {
      opacity: 0.6;
      width: 10px;
      vertical-align:middle;
    }
    .unit {
      font-size: 12px;
    }
  }
}
.dps-color {
  background-color: @Dps;
}
.tank-color {
  background-color: @Tank;
}
.heal-color {
  background-color: @Heal;
}
.other-color {
  background-color: rgba(92, 91, 58, 0.8);
}
.self-combtant {
  background-color: rgba(255, 255, 255, 0.8);
  .damage-job {
    .border-sex {
      stroke: #555555;
      fill: #dbdbdb;
    }
    .sex-percent {
      stroke: #e7e7e7;
    }
  }
  .play-detail {
    color: @black;
    text-shadow: -1px 0 3px #eeeeee, 0 1px 3px #eeeeee, 1px 0 3px #eeeeee,
        0 -1px 3px #eeeeee;
  }
}
.damage {
  background-color: transparent;
  width: 100px;
  height: 100px;
  position: absolute;
  left: -9999px;
  #damageP {
    stroke: @dmg;
    fill: none;
    stroke-width: 18;
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
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
  width: 100%;
}
.list-complete-leave-active {
  position: absolute;
  width: 100%;
}
</style>
