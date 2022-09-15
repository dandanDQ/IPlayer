<template>
  <div ref="wrapper">
    <video ref="IPlayer" class="video-js"></video>
  </div>
</template>

<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
export default {
  name: 'IPlayer',
  props: {
    src: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    height: {
      type: String,
      default: '300'
    },
    width: {
      type: String,
      default: '500'
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    controls: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      player: null,
    };
  },
  mounted() {
    const videojsOptions =  {
      autoplay: this.autoplay,
      controls: this.controls,
      height: this.height,
      width: this.width,
      sources: [
        {
          src: this.src,
        },
      ],
    }

    // 做一个简单的合并，兼容之前的逻辑
    const options = Object.assign({}, videojsOptions, this.options)

    this.player = videojs(this.$refs.IPlayer, options, () => {
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
<style>

</style>
