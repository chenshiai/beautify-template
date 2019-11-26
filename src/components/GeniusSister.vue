<template>
  <div id="landlord">
    <transition name="fade">
      <div class="message" v-show="showMessage">
        <span>{{ talk }}</span>
        <div v-if="talk === ''">
          <span v-if="message.currentArea === ''">并没有战斗数据呀~</span>
          <div v-else>
            <span>
              在<font style="color: #dd7d00;">『{{ message.currentArea }}』</font>
              战斗了<font style="color: #0072dd;">{{ message.time }}</font></span>
            <div>
              <span>
                团队秒伤是 <font style="color: #dd00d2;">{{ message.totalDps }}</font>
              </span>
              <span style="float: right;">
                你的秒伤是 <font style="color: #dd0000;">{{ message.youDps }}</font>
              </span>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </transition>
    <canvas id="live2d" width="300" height="240" class="live2d" @click="setTouchTalk"></canvas>
    <ul id="tools" class="tools" v-show="showTools">
      <li class="tool-item" id="state" @click="viewState">战斗</li>
      <li class="tool-item" id="chat" @click="setChatTalk">闲话</li>
      <li class="tool-item" id="close" @click="closeSister">离开</li>
      <li class="tool-item" id="abort">关于</li>
    </ul>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';
import { debounce } from '../util/index';
import { Message } from '../interface/index';
import Bus from '../util/eventBus';

const ModuleShowConfigs = namespace('showConfigs');
const quotations = [
  '干嘛呢你，快把手拿开！',
  '你看到过我的小熊吗？',
  '鼠...鼠标放错地方了！',
  '萝莉控是什么呀？',
  'Hentai！',
  '再摸的话我可要报警了！⌇●﹏●⌇',
  '是...是不小心碰到的吧？',
  '警~察~叔~叔~~，这里有个变态一直在摸我(ó﹏ò｡)',
  '啦哩吼~~！',
];
const wellKnownSaying = [
   '蝼蚁之辈，妄想弑神？—— 伊芙利特',
   '在此绽放的月下美人，乃是送我坠入黄泉的彼岸花。—— 月读',
   '我就不能是你的典善吗？—— 某光呆',
   '早安，娜娜莫陛下...今天的萨纳兰，依旧是艳阳高照啊。—— 劳班',
   '咕哎！？—— 阿尔法',
   '生命之色涡旋流转，七重之门现于世间，力量之塔君临九天—— 究~极~！—— LaHee布累亚',
   '你是我的月神吗？—— 某单身龙男',
   '倾听，感受，思考—— 妈水晶',
   '你果然...还是笑起来...最好看了。—— 奥尔什方',
   '名字土土的冒险者哟库啵~~',
   '等我醒来，我会最先打听你的名字。想必你的名字会铭刻在历史上，成为指引我的光芒。--古·拉哈·提亚',
   '只有这点钱？在下已无心应战。—— 某居合高手',
   '武学精髓，强多啦哈！—— 武神',
   '请你来一趟沙之家...',
   '我将回归你的内心，成为你的泪水，你的愤怒，你为世界而战的力量。—— 弗雷',
   '典善，我不会再失去你了。—— 朱雀',
   '你为什么要跑啊！！—— 塔塔露',
   '人意凡情已不再，神思邪性显月霞。—— 月读',
   '嗯哼～欢迎来到森之乐园百啼灵！一起来玩吧！呼啾～—— 一个奇怪的青年',
   '哦~我可爱的小树苗啊~—— 菲奥·乌尔',
   '愿在不久的将来，年轻的女孩不必在雪原中流浪。',
   '999，接受，LB，需求，辛苦了~~',
   '女儿啊，接受我的睿智吧。—— 索菲亚',
   '我会用这慈爱的火焰守护你。—— 朱雀',
   '你们将被彻底抹杀！—— 青龙',
   '大鲶鱼包邮~！',
   '你知道吗：冲刺的时候，你的表情会变（咬紧牙关的样子）',
   '晚安，哈迪斯。',
   '早上好，古·拉哈·提亚。',
 ];

@Component
export default class GeniusSister extends Vue {
  @ModuleShowConfigs.State((state) => state.showConfigs) private showConfigs: any;
  @ModuleShowConfigs.Action('changeShowConfigs') private changeShowConfigs!: (params: object) => void;

  private message: Message = {
    currentArea: '',
    time: '',
    totalDps: '',
    youDps: '',
  };
  private talk: string = '';
  private showTools: boolean = false;
  private showMessage: boolean = false;
  private messageTimeer: any = null;

  private initEventListener(): void {
    const landlord = document.getElementById('landlord');
    const tools = document.getElementById('tools');
    const live2d = document.getElementById('live2d');
    // 监听右边选项
    if (tools) {
      tools.addEventListener('mouseover', (e: any) => {
        switch (e.target.id) {
          case 'state': {
            this.showTalk('点击可以查看当前战斗状态数据哟~~');
            break;
          }
          case 'chat': {
            this.showTalk('猜猜我要说些什么~');
            break;
          }
          case 'close': {
            this.showTalk('要和我说再见了吗？');
            break;
          }
          case 'abort': {
            this.showTalk('你好啊，我是Tia。素材来源于手游《药水制作师》，由开源项目live2d.js提供的技术支持。特别鸣谢：猫与向日葵。');
            break;
          }
        }
      });
    }
    // 监听画布
    if (landlord) {
      landlord.addEventListener('mouseover', () => {
        this.showTools = true;
      });
      landlord.addEventListener('mouseleave', () => {
        this.showTools = false;
      });
    }
    // 监听妹妹
    if (live2d) {
      // live2d.addEventListener('mouseover', () => {
      //   this.setTouchTalk();
      // });
    }
    // 监听窗口大小
    const resize = debounce(() => {
      if (document.documentElement.clientWidth < 280) {
        this.showTalk('太小啦，能不能拉大一点？');
      }
      if (document.documentElement.clientWidth > 400) {
        this.showTalk('你拉那么大做什么，我很胖吗！？');
      }
    }, 500);
    window.addEventListener('resize', resize);
  }
  private showTalk(words: string): void {
    this.talk = words;
    let time = words.length * 250;
    if (words === '') {
      time = 5000;
    }
    this.showMessage = true;
    if (this.messageTimeer) {
      clearTimeout(this.messageTimeer);
    }
    this.messageTimeer = setTimeout(() => {
      this.showMessage = false;
    }, time);
  }
  private viewState(): void {
    this.showTalk('');
  }
  private setTouchTalk(): void {
    const index = Math.floor(Math.random() * quotations.length);
    this.showTalk(quotations[index]);
  }
  private closeSister(e: any) {
    const params = {
      status: false,
      label: '天才妹妹',
    };
    this.changeShowConfigs(params);
  }
  private setChatTalk(): void {
    // 下面是一个毒鸡汤的接口，访问一次就可以得到一句毒鸡汤
    // fetch('https://api.tryto.cn/djt/text').then((res) => res.json()).then((res) => {
    //   this.showTalk(res.data.content);
    // });
    const index = Math.floor(Math.random() * wellKnownSaying.length);
    this.showTalk(wellKnownSaying[index]);
  }
  private created() {
    Bus.$on('changeMessage', (message: Message) => {
      this.message = message;
    });
    Bus.$on('TellMySister', (talk: string) => {
      this.showTalk(talk);
    });
  }
  private mounted() {
    // 将live2d的素材全部转移到对象存储OSS上。github的下载速度感人。
    (window as any).loadlive2d('live2d', 'https://beauitfytempllate.oss-cn-hangzhou.aliyuncs.com/model2.json');
    this.initEventListener();
    setTimeout(() => {
      this.showTalk('啦哩吼~~！');
    }, 1000);
  }
}
</script>

<style lang='less'>
@s: #dd0000;
#landlord {
  position: fixed;
  bottom: 0;
  font-size: 0;
  z-index: 10;
  transition: all 0.3s ease-in-out;
}
.tools {
  position: absolute;
  right: 10px;
  top: 40px;
  font-size: 12px;
  .tool-item {
    display: block;
    text-align: center;
    line-height: 26px;
    margin-bottom: 2px;
    width: 26px;
    border: 2px solid #333333;
    background-color: #fff;
    animation-delay: 0s;
    animation-duration: 50s;
    animation-iteration-count: infinite;
    animation-name: shake;
    animation-timing-function: ease-in-out;
    &:hover {
      animation: none;
      transform: scale(1.3);
    }
  }
}
.message {
  padding: 4px 12px;
  width: 240px;
  top: -50px;
  left: 10px;
  color: #505050;
  border: 2px solid #333333;
  background-color: rgba(255, 255, 255);
  font-size: 14px;
  font-weight: 400;
  position: absolute;
  animation-delay: 0s;
  animation-duration: 50s;
  animation-iteration-count: infinite;
  animation-name: shake;
  animation-timing-function: ease-in-out;
  &::before {
    content: '';
    position: absolute;
    display: block;
    width: 0px;
    height: 0px;
    bottom: -16px;
    border: solid 8px;
    border-color: #333333 #333333 transparent transparent;
  }
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
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>