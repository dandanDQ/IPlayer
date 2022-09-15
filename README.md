#  IPlayer

🤩 IPlayer —— A hls video player base on video.js for vue2.

## Install
```shell
npm install -S vue-iplayer
```

## Quick Start

### use as component
```js
<template>
  <div>
      <IPlayer />
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

### use in global
```js
import Vue from 'vue'
import App from './index.vue'
import IPlayer from 'vue-iplayer'

Vue.config.productionTip = false
Vue.use(IPlayer)

new Vue({
    render: h => h(App)
}).$mount('#app')
```

## Usage
### Attributes
| Attribute      | Description          | Type      | Accepted Values       | Default  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| src     | the src of video, such as 'https://d2zihajmogu5jn.cloudfront.net/sintel/master.m3u8'      | string | — | — |
| height | height of the video. | string | — | 300 |
| width | width of the video. | string | — | 500 |
| autoplay | autoplay when loaded | boolean | — | true |
| controls | show control bar | boolean | — | true |

## Plan

- [ ] 将进度条挪控制栏顶部（解决小屏播放时进度条太窄问题）
- [ ] 支持播放器颜色配置
- [ ] 支持控制栏自定义配置（开发层面）
- [ ] 控制栏新功能
  - [ ] 倍速
  - [ ] 快进，快退，支持时间跨度，默认是 15s
  - [ ] 自动循环 ？
- [ ] 进度条增加节点信息、颜色配置
- [ ] 支持 flv 格式播放
- [ ] 支持配置视频右上角 Logo
- [ ] 支持明水印配置？
- [ ] ...

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2022-present, dqdandan
