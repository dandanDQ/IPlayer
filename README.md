#  IPlayer

🤩 IPlayer —— a video player base on video.js for vue2.

IPlayer supports:
- Streaming formats:
  - HLS
  - FLV ?
  - MPEG DASH
- Media formats:
  - MP4 H.264
  - WebM
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
| title     | title         | string | — | — |
| type | Component type | string | success/warning/info/error | info |
| description | Descriptive text. Can also be passed with the default slot | string | — | — |
| closable | If closable or not | boolean | — | true |
| center | Whether to center the text | boolean | — | false |
| close-text | Customized close button text | string | — | — |
| show-icon | If a type icon is displayed | boolean | — | false |
| effect | Choose theme  | string | light/dark | light |

### Slot

| Name | Description |
|------|--------|
| — | description |
| title | content of the Alert title |

### Events
| Event Name | Description | Parameters |
|---------- |-------- |---------- |
| close | fires when alert is closed | — |

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2022-present, dqdandan
