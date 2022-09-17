<template>
  <div ref="wrapper">
    <video ref="IPlayer" class="video-js"></video>
    <div class="control-car">
      <Icon name="play" @click.native="handlePlay" />
      <Icon name="pause" size="18" @click.native="handlePause" />
    </div>
  </div>
</template>

<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import Icon from './components/Icon.vue';

export default {
  name: 'IPlayer',
  components: {
    Icon,
  },
  props: {
    src: {
      type: String,
      default: '',
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    height: {
      type: String,
      default: '300',
    },
    width: {
      type: String,
      default: '500',
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    controls: {
      type: Boolean,
      default: true,
    },
    muted: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      player: null,
      video: null,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const videojsOptions = {
        autoplay: this.autoplay,
        controls: this.controls,
        height: this.height,
        width: this.width,
        muted: this.muted,
        sources: [
          {
            src: this.src,
          },
        ],
      };

      // 做一个简单的合并，兼容之前的逻辑
      const options = Object.assign({}, videojsOptions, this.options);

      this.player = videojs(this.$refs.IPlayer, options, () => {
        this.player.log('onPlayerReady', this);
      });

      this.video = this.player.el_?.childNodes?.[0];
    },
    handlePlay() {
      this.video.play();
    },
    handlePause() {
      this.video.pause();
    },
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  },
};
</script>
<style scoped>
.control-car {
  background: rgb(25, 62, 79);
  display: flex;
  padding: 6px;
}
</style>
