<template>
  <div class='home'>
    <svg class='damage' viewBox='15 15 70 70' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <g id='percent'>
          <circle cx='50' cy='50' r='24' id='damageP' />
        </g>
      </defs>
    </svg>
    <div class="waiting" v-if="combtants.length <= 0">等待数据输入</div>
    <template v-else>
      <div class="battle-detail">
        <div>{{ encounter.CurrentZoneName }}</div>
        <span>时间:{{ encounter.duration }}</span>
        <span>团伤:{{ encounter.ENCDPS }}</span>
      </div>
      <div :class="['combtant', getJobColor(item.Job), item.name === 'YOU' ? 'self-combtant' : '']" v-for='item in combtants' :key='item.name'>
        <div class='damage-job'>
          <svg class="combtant-damage" viewBox='15 15 70 70' xmlns='http://www.w3.org/2000/svg'>
            <use xlink:href='#percent' :style='style(item.damageP)' />
          </svg>
          <img class='job' :src="`../../icons/${item.Job.toLowerCase()}.png`" />
          <span class="damageP">{{ item.damageP }}</span>
        </div>
        <div class='play-detail'>
          <div class='name'>{{ item.name }} · {{item.Job}}</div>
          <div class='maxhit'>{{ item.maxhit }}</div>
          <div class='encdps'>
            <span style="float: left;">{{ item.ENCHPS }}</span>
            <span>{{ item.ENCDPS }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang='ts'>
// @ is an alias to /src
import { Component, Vue, Prop } from 'vue-property-decorator';
import mockdata from '../assets/data.js';

interface Detail {
  Encounter: object;
  Combatant: object;
  isActive: boolean;
}

interface ActDetail {
  detail: Detail;
}

interface Combatants {
  name?: string;
  ENCDPS?: string;
  maxhit?: string;
  damageP?: string;
}

enum Dps {
  acn = 1,
  arc,
  blm,
  brd,
  drg,
  lnc,
  mch,
  mnk,
  min,
  pgl,
  pug,
  rdm,
  rog,
  sam,
  smn,
  nin,
  dnc,
  bum,
}
enum Tank {
  drk = 1,
  gla,
  gld,
  mrd,
  pld,
  war,
  gnb,
}
enum Heal {
  ast = 1,
  cnj,
  sch,
  whm,
}
enum Prd {
  alc = 1,
  arm,
  bot,
  bsm,
  crp,
  cul,
  fsh,
  gsm,
  ltw,
  min,
  wvr,
}
@Component
export default class Home extends Vue {
  private data: Detail = {
    Encounter: {},
    Combatant: {},
    isActive: false,
  };

  private updateTemplate(act: any): void {
    this.data = act.detail;
  }

  private inputData(): void {
    this.data = mockdata;
  }

  get encounter(): any {
    return this.data.Encounter;
  }

  get combtants(): any[] {
    const list: any[] = [];
    const { Combatant } = this.data;
    Object.keys(Combatant).forEach((item: string) => {
      Combatant[item].damageP = Combatant[item]['damage%'];
      list.push(Combatant[item]);
    });
    return list;
  }

  private isDps(job: string): boolean {
    return Dps[job.toLowerCase()] > 0
  }
  private isTank(job: string): boolean {
    return Tank[job.toLowerCase()] > 0
  }
  private isHeal(job: string): boolean {
    return Heal[job.toLowerCase()] > 0
  }

  private getJobColor(job: string): string {
    const { isDps, isHeal, isTank } = this;
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
  private mounted(): void {
    // this.data = mockdata;
    document.addEventListener('onOverlayDataUpdate', (act) => {
      this.updateTemplate(act);
    });
  }
  private style(percent: string): string {
    const count = (100 - parseInt(percent, 10)) * 1.52;
    return `stroke-dashoffset: ${count};`;
  }
}
</script>

<style lang='less'>
@hp: #23b123;
@dmg: rgba(255, 0, 0, 0.774);
@dmgtext: #ffe590;
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
  min-width: 170px;
}
.battle-detail {
  width: 100%;
  text-align: center;
  font-size: 14px;
  font-weight: 300;
  color: @dmgtext;
  text-shadow: -1px 0 3px #664710, 0 1px 3px #664710, 1px 0 3px #664710,
    0 -1px 3px #664710;
  span {
    margin-right: 5px;
  }
}
.combtant {
  display: flex;
  padding: 3px 5px 0 0;
  // width: 100%;
  overflow: hidden;

  border-bottom: solid 1px rgba(146, 146, 146, 0.774);
  .damage-job {
    width: 50px;
    height: 50px;
    position: relative;
    .combtant-damage {
      transform: rotate(-90deg);
    }
    .damageP {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 12px;
      font-weight: 300;
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
    // text-align: center;
    flex-grow: 1;
    margin-left: 5px;
    color: #fff;
    font-size: 14px;
    text-shadow: -1px 0 3px #664710, 0 1px 3px #664710, 1px 0 3px #664710,
      0 -1px 3px #664710;
    .name {
      white-space:nowrap;
      text-overflow:ellipsis;
      overflow:hidden;
    }
    .encdps {
      font-weight: bold;
      font-size: 14px;
      text-align: right;
    }
    .maxhit {
      transform-origin: left;
      transform: scale(0.8);
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
  .play-detail {
    color: @black;
    text-shadow: -1px 0 3px #b8b8b8, 0 1px 3px #b8b8b8, 1px 0 3px #b8b8b8,
        0 -1px 3px #b8b8b8;
  }
}
.damage {
  background-color: transparent;
  width: 100px;
  height: 100px;
  // transform-origin: top left;
  opacity: 0.7;
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
</style>
