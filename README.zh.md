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

| 属性         | 描述                                                                                                                                                                        | 类型    | 值枚举                                                  | 默认值                                          |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------- | ----------------------------------------------- |
| src          | 视频播放链接，比如： 'https://d2zihajmogu5jn.cloudfront.net/sintel/master.m3u8'                                                                                             | String  | —                                                       | —                                               |
| height       | 视频的高度                                                                                                                                                                  | String  | —                                                       | 300                                             |
| width        | 视频的宽度                                                                                                                                                                  | String  | —                                                       | 500                                             |
| autoplay     | 是否自动播放                                                                                                                                                                | Boolean | —                                                       | true                                            |
| controls     | 是否展示控制栏                                                                                                                                                              | Boolean | —                                                       | true                                            |
| muted        | 是否静音                                                                                                                                                                    | Boolean | —                                                       | true                                            |
| options      | 将配置透传至 video.js 初始化配置中，可在 1.0 版本中使用， 不推荐在 2.0 版本中使用。 options                                                                                 | Object  | —                                                       | true                                            |
| controlsList | 2.0 版本新增属性。配置对应关系如下：rewind：快退按钮，fastforward：快进按钮，shot：截图按钮，fullscreen：全屏按钮，loop：循环按钮。当配置中存在按钮名称时，将展示对应按钮。 | Array   | ['rewind', 'fastforward', 'shot', 'fullscreen', 'loop'] | ['rewind', 'fastforward', 'fullscreen', 'loop'] |
| step         | 配置快进、快退的秒数。                                                                                                                                                      | Number  | —                                                       | 10                                              |

## Plan

- [x] 将进度条挪控制栏顶部（解决小屏播放时进度条太窄问题）
- [ ] 支持播放器颜色配置
- [ ] 支持控制栏自定义配置（开发层面）
- [x] 控制栏新功能
  - [x] 倍速
  - [x] 快进，快退，支持时间跨度，默认是 15s
  - [x] 自动循环
- [ ] 进度条增加节点信息、颜色配置
- [ ] 支持 flv 格式播放
- [ ] 支持配置视频右上角 Logo
- [ ] 支持明水印配置？
- [ ] ...

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2022-present, dqdandan
