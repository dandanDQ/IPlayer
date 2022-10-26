# IPlayer 中文文档

🤩 IPlayer —— 一个适用于 vue2 的 HLS 格式视频播放器

## 安装

```shell
npm install -S vue-iplayer
```

## 快速开始

### 作为组件引入

```js
<template>
  <div>
      <IPlayer src="https://d2zihajmogu5jn.cloudfront.net/sintel/master.m3u8"/>
  </div>
</template>
<script>
import { IPlayer } from 'vue-iplayer'
export default {
    components: {
        IPlayer
    }
}
</script>
```

### 全局注册引入

```js
import Vue from 'vue';
import App from './index.vue';
import IPlayer from 'vue-iplayer';

Vue.config.productionTip = false;
Vue.use(IPlayer);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
```

## 用法

### 属性

| 属性         | 描述                                                                                                                                                                        | 类型    | 值枚举                                                  | 默认值                                                  |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------- | ------------------------------------------------------- |
| src          | 视频播放链接，比如： 'https://d2zihajmogu5jn.cloudfront.net/sintel/master.m3u8'                                                                                             | String  | —                                                       | —                                                       |
| height       | 视频的高度                                                                                                                                                                  | String  | —                                                       | 300                                                     |
| width        | 视频的宽度                                                                                                                                                                  | String  | —                                                       | 500                                                     |
| autoplay     | 是否自动播放                                                                                                                                                                | Boolean | —                                                       | true                                                    |
| controls     | 是否展示控制栏                                                                                                                                                              | Boolean | —                                                       | true                                                    |
| muted        | 是否静音                                                                                                                                                                    | Boolean | —                                                       | true                                                    |
| options      | 将配置透传至 video.js 初始化配置中，options 内部属性，比与 options 同级的同名属性，优先级更高。可在 1.0 版本中使用， 不推荐在 2.0 版本中使用。 options                      | Object  | —                                                       | true                                                    |
| controlsList | 2.0 版本新增属性。配置对应关系如下：rewind：快退按钮，fastforward：快进按钮，shot：截图按钮，fullscreen：全屏按钮，loop：循环按钮。当配置中存在按钮名称时，将展示对应按钮。 | Array   | ['rewind', 'fastforward', 'shot', 'fullscreen', 'loop'] | ['rewind', 'fastforward', 'fullscreen', 'loop', 'rate'] |
| step         | 配置快进、快退的秒数。                                                                                                                                                      | Number  | —                                                       | 10                                                      |
| rates        | 配置视频的倍速选项                                                                                                                                                          | Array   | —                                                       | [1,1.5,2,2.5]                                           |
| volume       | 初始音量值。取值范围为 [0,1] 之间的的任意小数。                                                                                                                             | Number  | —                                                       | 0.5                                                     |
| type         | 视频连接的类型，目前支持 hls, flv 和 mp4 格式。如果 type 是空的，程序将根据 src 自动计算类型（m3u8 -> hls, flv -> flv, 其他 -> mp4 ）。                                     | String  | hls/flv/mp4                                             | ''                                                      |

### 事件

| 事件名称 | 描述                                 | 参数       |
| -------- | ------------------------------------ | ---------- |
| shot     | 点击截图按钮时（完成 canvas 截图后） | {blob: ''} |

透传 [MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/canplay_event)里提到的事件，包括：

- abort
- canplay
- canplaythrough
- durationchange
- emptied
- ended
- error
- loadeddata
- loadedmetadata
- loadstart
- pause
- play
- playing
- progress
- ratechange
- seeked
- seeking
- stalled
- suspend
- timeupdate
- volumechange
- waiting

## Plan

- [x] 将进度条挪控制栏顶部（解决小屏播放时进度条太窄问题）
- [ ] 支持播放器颜色配置
- [x] 支持控制栏自定义配置（开发层面）
- [x] 控制栏新功能
  - [x] 倍速
  - [x] 快进，快退，支持时间跨度，默认是 15s
  - [x] 自动循环
- [ ] 进度条增加节点信息、颜色配置
- [x] 支持 flv 格式播放
- [ ] 支持配置视频右上角 Logo
- [ ] 支持明水印配置？
- [ ] 性能优化：打包 code split，加载按需引入
- [ ] 增加单元测试
- [ ] ...

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2022-present, dqdandan
