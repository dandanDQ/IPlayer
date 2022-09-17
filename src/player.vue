<template>
  <div ref="IPlayer" class="iplayer-container">
    <video ref="video-el"></video>
    <div class="control-bar">
      <Icon name="rewind" @click="handleTimeChange(-10)" />
      <Icon
        name="pause"
        size="18"
        @click="handlePause"
        v-if="status.playing"
        hint="pause"
      />
      <Icon name="play" @click="handlePlay" v-else size="18" hint="play" />
      <Icon name="fastforward" @click="handleTimeChange(10)" />
      <Icon
        name="mute"
        hint="muted"
        @click="handleMuted(false)"
        v-if="status.muted"
      />
      <Icon name="sound" @click="handleMuted(true)" v-else />
      <Icon name="fullscreen" />
      <Icon name="loop" />
      <Icon name="noloop" />
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
      status: {
        playing: true,
        muted: true,
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const videojsOptions = {
        autoplay: this.autoplay,
        controls: false,
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

      // 初始化播放状态
      this.status.playing = options.autoplay;

      this.player = videojs(this.$refs['video-el'], options, () => {
        this.player.log('onPlayerReady', this);
      });

      this.video = this.player.el_?.childNodes?.[0];
      this.handleEvents();
    },
    handlePlay() {
      this.video.play();
      this.status.playing = true;
    },
    handlePause() {
      this.video.pause();
      this.status.playing = false;
    },
    handleTimeChange(seconds) {
      this.video.currentTime += seconds;
    },
    handleMuted(muted) {
      this.video.muted = muted;
      this.status.muted = muted;
    },
    handleEvents() {
      this.video.addEventListener('play', () => {
        this.status.playing = true;
      });

      this.video.addEventListener('playing', () => {
        this.status.playing = true;
      });

      this.video.addEventListener('pause', () => {
        this.status.playing = false;
      });

      this.video.addEventListener('ended', () => {
        this.status.playing = false;
      });

      // 监听并透传所有事件
      const events = [
        'abort',
        'canplay',
        'canplaythrough',
        'durationchange',
        'emptied',
        'ended',
        'error',
        'loadeddata',
        'loadedmetadata',
        'loadstart',
        'pause',
        'play',
        'playing',
        'progress',
        'ratechange',
        'seeked',
        'seeking',
        'stalled',
        'suspend',
        'timeupdate',
        'volumechange',
        'waiting',
      ];

      for (const event of events) {
        this.video.addEventListener(event, (e) => {
          this.$emit(event, e);
        });
      }
    },
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  },
};
</script>
<style lang="scss" scoped>
.iplayer-container {
  border: 3px solid green;
  .control-bar {
    background: rgb(6, 32, 63);
    display: flex;
    padding: 6px;
  }
}
</style>
