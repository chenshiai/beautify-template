<template>
  <div class="config-page">
    <div class="waiting">
      <router-link to="/">返回</router-link>
    </div>
    <div class="config-list">
      <span class="list-title">显示设定</span>
      <div v-for="(item, index) in showConfigs"
        :key="index"
        class="item">
        <span>{{ item.label }}</span>
        <input class="check-input" :id="item.label" :name="item.label" type="checkbox" :checked="item.status" @change="changed"/>
        <label :class="['label', item.status ? 'label-checked' : '']" :for="item.label">
          <div class="tick_mark"></div>
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { setCookie } from '../util/index';
import { State, Action, namespace } from 'vuex-class';
const someModule = namespace('showConfigs');

@Component
export default class Config extends Vue {
  @someModule.State((state) => state.showConfigs) private showConfigs: any;
  @someModule.Action('changeShowConfigs') private changeShowConfigs!: (params: object) => void;
  private changed(e: any) {
    const params = {
      status: e.target.checked,
      label: e.target.name,
    };
    this.changeShowConfigs(params);
    setCookie('configs', JSON.stringify(this.showConfigs));
  }
}
</script>

<style lang="less">
@dmgtext: #fffdbd;
.waiting {
  a {
    color: @dmgtext;
    text-decoration: none;
  }
  text-shadow: -1px 0 3px #664710, 0 1px 3px #664710, 1px 0 3px #664710,
    0 -1px 3px #664710;
}
.config-list {
  // border: solid #333333 1px;
  // border-left: solid #333333 3px;
  // border-right: solid #333333 3px;
  // background-color: rgba(51, 51, 51, 0.8);
  padding: 0 3px;
  .list-title {
    color: #fff700;
    font-weight: bold;
  }
  .item {
    color: #eee;
    height: 20px;
    margin-bottom: 5px;
    font-size: 14px;
    display: flex;
    span {
      flex: 4;
    }
  }
}
.check-input {
  display: none;
}
.label {
  position: relative;
  width: 20px;
  height: 20px;
  background-color: #f72414;
  border-radius: 50%;
  transition: 0.2s ease transform, 0.2s ease background-color, 0.2s ease box-shadow;
  overflow: hidden;
  z-index: 1;
}

.label:before {
  content: "";
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  width: 12px;
  height: 12px;
  margin: 0 auto;
  background-color: #fff;
  transform: translateY(-50%);
  border-radius: 50%;
  box-shadow: inset 0 0px 10px #ffbeb8;
  transition: 0.2s ease width, 0.2s ease height;
}

.label:active {
  transform: scale(0.9);
}

.tick_mark {
  position: relative;
  width: 11px;
  height: 10px;
  margin: 0 auto;
  transform: translate(-1px, 2px) rotateZ(-40deg);
}

.tick_mark:before,
.tick_mark:after {
  content: "";
  position: absolute;
  background-color: #fff;
  border-radius: 2px;
  opacity: 0;
  transition: 0.2s ease transform, 0.2s ease opacity;
}

.tick_mark:before {
  left: 0;
  bottom: 0;
  width: 3px;
  height: 7px;
  box-shadow: -2px 0 5px rgba(0,0,0,0.5);
  transform: translateY(-34px)
}

.tick_mark:after {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3px;
  box-shadow: 0 3px 5px rgba(0,0,0,0.5);
  transform: translateX(38px)
}

.label-checked {
  background-color: #07d410;
  box-shadow: 0 0px 10px #92ff97;
}

.label-checked:before {
  width: 0;
  height: 0;
}

.label-checked.label .tick_mark:before, .label-checked.label .tick_mark:after {
  transform: translate(0);
  opacity: 1;
}
</style>