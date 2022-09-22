# IPlayer

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

| Attribute    | Description                                                                          | Type    | Accepted Values | Default |
| ------------ | ------------------------------------------------------------------------------------ | ------- | --------------- | ------- |
| src          | the src of video, such as 'https://d2zihajmogu5jn.cloudfront.net/sintel/master.m3u8' | String  | —               | —       |
| height       | height of the video.                                                                 | String  | —               | 300     |
| width        | width of the video.                                                                  | String  | —               | 500     |
| autoplay     | autoplay when loaded                                                                 | Boolean | —               | true    |
| controls     | show control bar                                                                     | Boolean | —               | true    |
| muted        | muted when starting playing                                                          | Boolean | —               | true    |
| options      | the same width video.js's options.                                                   | Object  | —               | true    |
| controlsList | If the length of controlsList is not empty, it'll show the new ontrol bar.           | Array   | —               | []      |

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2022-present, dqdandan
