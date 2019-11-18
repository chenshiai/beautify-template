<template>
  <div id="landlord" v-show="showConfigs.geniussister.status">
    <div class="message">
      <span v-if="message.currentArea === ''">请先开始战斗喔~~</span>
      <span v-else>{{message.currentArea}}-{{message.time}} / Total:{{message.totalDps}} / You: {{message.youDps}}</span>
    </div>
    <canvas id="live2d" width="280" height="240" class="live2d"></canvas>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';
const ModuleShowConfigs = namespace('showConfigs');
const ModuleGeniusSister = namespace('geniusSister');

@Component
export default class GeniusSister extends Vue {
  @ModuleShowConfigs.State((state) => state.showConfigs) private showConfigs: any;
  @ModuleGeniusSister.State((state) => state.message) private message: any;
  private mounted() {
   (window as any).loadlive2d('live2d', '/dist/live2d/model/tia/model.json');
  }
}
</script>

<style lang='less'>
#landlord {
  position: fixed;
  bottom: 0;
  z-index: -1;
  font-size: 0;
  transition: all 0.3s ease-in-out;
}
.message {
  padding: 7px 12px;
  top: -50px;
  left: 40px;
  text-align: center;
  color: #505050;
  border: 1px solid rgba(255,137,255,.4);
  border-radius: 12px;
  background-color: rgba(255,137,255,.2);
  box-shadow: 0 3px 15px 2px rgba(255,137,255,.4);
  font-size: 13px;
  font-weight: 400;
  text-overflow: ellipsis;
  // text-transform: uppercase;
  overflow: hidden;
  position: absolute;
  animation-delay: 5s;
  animation-duration: 50s;
  animation-iteration-count: infinite;
  animation-name: shake;
  animation-timing-function: ease-in-out;
}
@keyframes shake {
    2% {
        transform: translate(0.5px, -1.5px) rotate(-0.5deg);
    }

    4% {
        transform: translate(0.5px, 1.5px) rotate(1.5deg);
    }

    6% {
        transform: translate(1.5px, 1.5px) rotate(1.5deg);
    }

    8% {
        transform: translate(2.5px, 1.5px) rotate(0.5deg);
    }

    10% {
        transform: translate(0.5px, 2.5px) rotate(0.5deg);
    }

    12% {
        transform: translate(1.5px, 1.5px) rotate(0.5deg);
    }

    14% {
        transform: translate(0.5px, 0.5px) rotate(0.5deg);
    }

    16% {
        transform: translate(-1.5px, -0.5px) rotate(1.5deg);
    }

    18% {
        transform: translate(0.5px, 0.5px) rotate(1.5deg);
    }

    20% {
        transform: translate(2.5px, 2.5px) rotate(1.5deg);
    }

    22% {
        transform: translate(0.5px, -1.5px) rotate(1.5deg);
    }

    24% {
        transform: translate(-1.5px, 1.5px) rotate(-0.5deg);
    }

    26% {
        transform: translate(1.5px, 0.5px) rotate(1.5deg);
    }

    28% {
        transform: translate(-0.5px, -0.5px) rotate(-0.5deg);
    }

    30% {
        transform: translate(1.5px, -0.5px) rotate(-0.5deg);
    }

    32% {
        transform: translate(2.5px, -1.5px) rotate(1.5deg);
    }

    34% {
        transform: translate(2.5px, 2.5px) rotate(-0.5deg);
    }

    36% {
        transform: translate(0.5px, -1.5px) rotate(0.5deg);
    }

    38% {
        transform: translate(2.5px, -0.5px) rotate(-0.5deg);
    }

    40% {
        transform: translate(-0.5px, 2.5px) rotate(0.5deg);
    }

    42% {
        transform: translate(-1.5px, 2.5px) rotate(0.5deg);
    }

    44% {
        transform: translate(-1.5px, 1.5px) rotate(0.5deg);
    }

    46% {
        transform: translate(1.5px, -0.5px) rotate(-0.5deg);
    }

    48% {
        transform: translate(2.5px, -0.5px) rotate(0.5deg);
    }

    50% {
        transform: translate(-1.5px, 1.5px) rotate(0.5deg);
    }

    52% {
        transform: translate(-0.5px, 1.5px) rotate(0.5deg);
    }

    54% {
        transform: translate(-1.5px, 1.5px) rotate(0.5deg);
    }

    56% {
        transform: translate(0.5px, 2.5px) rotate(1.5deg);
    }

    58% {
        transform: translate(2.5px, 2.5px) rotate(0.5deg);
    }

    60% {
        transform: translate(2.5px, -1.5px) rotate(1.5deg);
    }

    62% {
        transform: translate(-1.5px, 0.5px) rotate(1.5deg);
    }

    64% {
        transform: translate(-1.5px, 1.5px) rotate(1.5deg);
    }

    66% {
        transform: translate(0.5px, 2.5px) rotate(1.5deg);
    }

    68% {
        transform: translate(2.5px, -1.5px) rotate(1.5deg);
    }

    70% {
        transform: translate(2.5px, 2.5px) rotate(0.5deg);
    }

    72% {
        transform: translate(-0.5px, -1.5px) rotate(1.5deg);
    }

    74% {
        transform: translate(-1.5px, 2.5px) rotate(1.5deg);
    }

    76% {
        transform: translate(-1.5px, 2.5px) rotate(1.5deg);
    }

    78% {
        transform: translate(-1.5px, 2.5px) rotate(0.5deg);
    }

    80% {
        transform: translate(-1.5px, 0.5px) rotate(-0.5deg);
    }

    82% {
        transform: translate(-1.5px, 0.5px) rotate(-0.5deg);
    }

    84% {
        transform: translate(-0.5px, 0.5px) rotate(1.5deg);
    }

    86% {
        transform: translate(2.5px, 1.5px) rotate(0.5deg);
    }

    88% {
        transform: translate(-1.5px, 0.5px) rotate(1.5deg);
    }

    90% {
        transform: translate(-1.5px, -0.5px) rotate(-0.5deg);
    }

    92% {
        transform: translate(-1.5px, -1.5px) rotate(1.5deg);
    }

    94% {
        transform: translate(0.5px, 0.5px) rotate(-0.5deg);
    }

    96% {
        transform: translate(2.5px, -0.5px) rotate(-0.5deg);
    }

    98% {
        transform: translate(-1.5px, -1.5px) rotate(-0.5deg);
    }

    0%, 100% {
        transform: translate(0, 0) rotate(0);
    }
}
</style>