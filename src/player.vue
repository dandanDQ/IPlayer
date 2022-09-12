<template>
  <div>
    <video ref="IPlayer" class="video-js"></video>
  </div>
</template>

<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
export default {
  name: 'IPlayer',
  props: {
    options: {
      type: Object,
      default() {
        return {
          autoplay: true,
          controls: true,
          liveui: true,
          restoreEl: true,
          sources: [
            {
              src: 'https://d2zihajmogu5jn.cloudfront.net/sintel/master.m3u8',
              type: 'application/x-mpegURL',
            },
          ],
        };
      },
    },
  },
  data() {
    return {
      player: null,
    };
  },
  mounted() {
    this.player = videojs(this.$refs.IPlayer, this.options, () => {
      this.player.log('onPlayerReady', this);
    });
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  },
};
</script>
