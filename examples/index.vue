<template>
  <div class="wrapper">
    <div class="container">
      <IPlayer
        src="https://d2zihajmogu5jn.cloudfront.net/sintel/master.m3u8"
        :muted="true"
        :step="20"
        :controls="true"
        :controlsList="['fastforward', 'shot', 'fullscreen', 'loop', 'rate']"
      />
    </div>

    <div class="container">
      <IPlayer
        src="https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv"
        :muted="true"
        :step="20"
        :controls="true"
        :controlsList="['fastforward', 'shot', 'fullscreen', 'loop', 'rate']"
      />
    </div>
    <div class="container">
      <IPlayer
        src="https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4"
        :muted="true"
        :step="20"
        :controls="true"
        :controlsList="['fastforward', 'shot', 'fullscreen', 'loop', 'rate']"
      />
    </div>
  </div>
</template>
<script>
import { IPlayer } from '../src/index.js';
// import { IPlayer } from '../dist/iplayer.js';

export default {
  components: {
    IPlayer,
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
}
.container {
  // width: 300px;
  height: 300px;
}
</style>
