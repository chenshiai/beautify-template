<template>
  <div class='home'>
    <svg class='damage' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <g id='sex'>
          <path d="m25 7.5l15.155 8.75l0 17.5l-15.155 8.75l-15.155 -8.75l0 -17.5z" />
        </g>
        <linearGradient id="Gradient" x1="1" y1="1" x2="0" y2="0">
          <stop offset="0.1" stop-color="white" stop-opacity="0" />
          <stop offset="0.4" stop-color="white" stop-opacity="1"></stop>
          <stop offset="0.9" stop-color="white" stop-opacity="0" />
        </linearGradient>
        <mask id="Mask">
          <rect x="0" y="-3" width="50" height="56" fill="url(#Gradient)"  />
        </mask>
      </defs>
    </svg>
    <template v-if="!isClose && combtants.length > 0">
      <BattleDetail :encounter="encounter"></BattleDetail>
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
            <img class='job' :src="getJobIconUrl(item.Job)" /> 
          </div>
          <div class='play-detail'>
            <div class='name'>
              <span v-show="showConfigs.playname.status">{{ item.name }}</span>
              <span v-show="showConfigs.abbreviation.status"> · {{item.Job}}</span>
            </div>
            <div class='encdps'>
              <div class="dc-pct">
                <span class="direct" v-show="showConfigs.direct.status">{{ item.DirectHitPct }}</span>
                <span class="crit" v-show="showConfigs.crit.status">{{ item.crithitP }}</span>
                <span class="directCrit" v-show="showConfigs.dirctAcrit.status">{{ item.CritDirectHitPct }}</span>
              </div>
              <Damage :ENCDPS="item.ENCDPS" :player="item.name"></Damage><span class="unit" v-show="showConfigs.suffix.status">DPS</span>
            </div>
            <div class='bottom'>
              <span v-show="showConfigs.maxhit.status" style="float: right">{{ item.maxhit }}</span>
              <span v-show="showConfigs.deaths.status">
                <img :src="`../dist/img/kulou.svg`" alt="">
                {{ item.deaths }}
              </span>
            </div>
          </div>
        </div>
      </transition-group>
    </template>
    <ul class="config">
      <li @click="toConfig">
        <span>设置</span>
      </li>
      <li @click="closeList">
        <span v-if="!isClose">收起</span>
        <span v-else>展开</span>
      </li>
      <li @click="lookMyself">
        <span v-if="!Myself">个人</span>
        <span v-else>全体</span>
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
import BattleDetail from '../components/BattleDetail.vue';
import mockdata from '../assets/data';
import Bus from '../util/eventBus';
import { Detail, ActDetail, People, Combatants, Message } from '../interface/index';
const ModuleShowConfigs = namespace('showConfigs');

@Component({
  components: {
    Damage,
    BattleDetail,
  },
})
export default class Home extends Vue {
  private data: Detail = {
    Encounter: {
      CurrentZoneName: '',
      duration: '',
      ENCDPS: '',
    },
    Combatant: {},
    isActive: false,
  };
  private isClose: boolean = false;
  private Myself: boolean = false;
  private TopDamage: string | undefined = '';
  @ModuleShowConfigs.State((state) => state.showConfigs) private showConfigs: any;
  get encounter(): any {
    return this.data.Encounter;
  }
  get combtants(): People[] {
    const list: People[] = [];
    const { Combatant } = this.data;
    Object.keys(Combatant).forEach((item: string) => {
      (Combatant as Combatants)[item].crithitP = (Combatant as Combatants)[item]['crithit%'];
      (Combatant as Combatants)[item].damageP = (Combatant as Combatants)[item]['damage%'];
      list.push((Combatant as Combatants)[item]);
    });
    if (list.length > 0 ) {
      this.TopDamage = list[0].damageP;
    }
    // 查看个人 返回个人数据
    if (this.Myself) {
      const you = 'YOU'; // tslint不允许通过字符串文本访问对象
      return [(Combatant as Combatants)[you]];
    }
    return list;
  }
  private updateTemplate(act: any): void {
    this.data = act.detail;
    this.$nextTick(() => {
      this.TellMySister();
    });
  }
  private TellMySister(): void {
    const battleMessage = this.data;
    const you = 'YOU';
    const youDps = battleMessage.Combatant[you].ENCDPS || '0';
    const message: Message = {
      currentArea: battleMessage.Encounter.CurrentZoneName,
      time: battleMessage.Encounter.duration,
      totalDps: battleMessage.Encounter.ENCDPS,
      youDps,
    };
    Bus.$emit('changeMessage', message);
  }
  private lookMyself(): void {
    if (!this.Myself) {
      Bus.$emit('TellMySister', '现在你就是主角！');
    } else {
      Bus.$emit('TellMySister', '想看看大家的的数据吗？');
    }
    this.Myself = !this.Myself;
  }
  private closeList(): void {
    if (!this.isClose) {
      Bus.$emit('TellMySister', '数据列表已经收起来咯~');
    }
    this.isClose = !this.isClose;
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
  private getJobIconUrl(job: string): string {
    return `../dist/icons/${job.toLowerCase()}-large.png`;
  }
  private getPercentNumber(percent: string): number {
    const height = 56 * parseInt(percent, 10) / parseInt((this.TopDamage as string), 10);
    return height || 100;
  }
  private toConfig(): void {
    Bus.$emit('TellMySister', '这里可以自定设置呢。');
    this.$router.push('config');
  }
  private mounted(): void {
    // this.data = mockdata; // 测试用数据
    // this.$nextTick(() => {
    //   this.TellMySister();
    // });
    document.addEventListener('onOverlayDataUpdate', (act) => {
      this.updateTemplate(act);
    });
  }
  private destroyed() {
    document.removeEventListener('onOverlayDataUpdate', (act) => {
      this.updateTemplate(act);
    });
  }
}
</script>

<style lang='less'>
@dmgtext: #fffdbd;
@Dps: rgba(144, 47, 41, 0.8);
@Tank: rgba(38, 87, 134, 0.8);
@Heal: rgba(90, 111, 51, 0.8);
@Direct: rgb(103, 211, 253);
@Crit: rgb(255, 208, 137);
@DC: rgb(225, 255, 144);
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
  max-width: 200px;
  min-height: 50px;
  position: relative;
  white-space:nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
}
.config {
  list-style: none;
  margin: 3px 0 0 0;
  padding: 0;
  position: absolute;
  top: 0;
  left: 3px;
  font-size: 12px;
  z-index: 10;
  li {
    display: inline-block;
    margin-right: 5px;
    min-width: 10px;
    background-color: @dmgtext;
    color: #505050;
    box-shadow: -1px 0 3px #c09447, 0 1px 3px #c09447, 1px 0 3px #c09447,
        0 -1px 3px #c09447;
  }
}
.combtant {
  display: flex;
  overflow: hidden;
  border: solid #333333 1px;
  border-left: solid #333333 3px;
  border-right: solid #333333 3px;
  box-shadow: inset 0px 0px 15px 2px #333;
  transition: all 0.4s;
  letter-spacing: 1px;
  .damage-job {
    width: 50px;
    height: 50px;
    position: relative;
    .job-border {
      width: 50px;
      height: 50px;
    }
    .border-sex {
      fill: rgba(61, 61, 61, 0.4);
      stroke: rgb(255, 247, 210);
      stroke-width: 5px;
    }
    .sex-percent {
      fill: none;
      stroke-width: 3.5px;
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
      width: 20px;
    }
  }
  .play-detail {
    position: relative;
    flex-grow: 1;
    color: #fff;
    padding: 2px;
    line-height: 1;
    text-shadow: -1px 0 1px #664710, 0 1px 1px #664710, 1px 0 1px #664710,
      0 -1px 1px #664710;
    .name {
      font-size: 12px;
    }
    
    .encdps {
      font-size: 16px;
      text-align: right;
    }
    .dc-pct {
      float: left;
      font-size: 12px;
      line-height: 16px;
      text-align: left;
      .direct {
        color: @Direct;
      }
      .crit {
        color: @Crit;
      }
      .directCrit {
        color: @DC;
      }
      span {
        display: inline-block;
        width: 25px;
      }
    }
    .bottom {
      line-height: 16px;
      font-size: 11px;
      letter-spacing: 0;
      opacity: 0.8;
      img {
        width: 10px;
      }
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
    }
    .sex-percent {
      stroke: #ffffff;
    }
  }
  .play-detail {
    color: @black;
    text-shadow: -1px 0 3px #eeeeee, 0 1px 3px #eeeeee, 1px 0 3px #eeeeee,
        0 -1px 3px #eeeeee;
    .dc-pct {
      .direct {
        color: #333333;
      }
      .crit {
        color: #333333;
      }
      .directCrit {
        color: #333333;
      }
    }
  }
}
.damage {
  width: 50px;
  height: 50px;
  position: absolute;
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
