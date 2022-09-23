# IPlayer

🤩 IPlayer —— A hls video player base on video.js for vue2.

👉🏻 [中文文档](https://github.com/dandanDQ/IPlayer/blob/main/README.zh.md)

## Install

```shell
npm install -S vue-iplayer
```

## Quick Start

### use as component

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

### use in global

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

## Usage

### Attributes

| Attribute    | Description                                                                                                                                                                                                                                                                                                                                                 | Type    | Accepted Values                                         | Default                                  |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------- | ---------------------------------------- |
| src          | the src of video, such as 'https://d2zihajmogu5jn.cloudfront.net/sintel/master.m3u8'                                                                                                                                                                                                                                                                        | String  | —                                                       | —                                        |
| height       | height of the video.                                                                                                                                                                                                                                                                                                                                        | String  | —                                                       | 300                                      |
| width        | width of the video.                                                                                                                                                                                                                                                                                                                                         | String  | —                                                       | 500                                      |
| autoplay     | autoplay when loaded                                                                                                                                                                                                                                                                                                                                        | Boolean | —                                                       | true                                     |
| controls     | show control bar                                                                                                                                                                                                                                                                                                                                            | Boolean | —                                                       | true                                     |
| muted        | muted when starting playing                                                                                                                                                                                                                                                                                                                                 | Boolean | —                                                       | true                                     |
| options      | Prossible attributes of options: sources, controls, autoplay, muted. Remember that options has higher priority than other properties, for example, if you config muted: true and {options: {muted: false}}, it'll work as muted is true.                                                                                                                    | Object  | —                                                       | true                                     |
| controlsList | new attribute of version 2.0. The meaning of each configuration item is listed below: rewind: rewind, which gap is defined by attribute "step"; shot: to show shot button, when click it, 'shot' event will be emitted; fastforwrad: fastforward, the same with rewind; fullscreen: vodeo is played in full screen ; loop: to loop when video ends playing; | Array   | ['rewind', 'fastforward', 'shot', 'fullscreen', 'loop'] | ['rewind', 'fastforward', 'fullscreen']; |
| step         | Configure the number of seconds to fast forward and rewind.                                                                                                                                                                                                                                                                                                 | Number  | —                                                       | 10                                       |

### Events

| Event Name | Description                           | Parameters |
| ---------- | ------------------------------------- | ---------- |
| shot       | fires when 'shot' button is clicked。 | {blob: ''} |

Transparent transmission of all events listed in [MDN DOC](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/canplay_event) with the same name. Includes:

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

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2022-present, dqdandan
