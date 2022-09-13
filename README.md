#  IPlayer

🤩 Video player base on video.js for vue2.

## Install
```shell
npm install -S vue-iplayer
```

## Quick Start

### use as component
``` vue
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


## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2022-present, dqdandan
