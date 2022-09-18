<template>
  <div ref="IPlayer" class="iplayer-container">
    <video
      ref="video-el"
      @dblclick="handleDoubleClick"
      @click="handleSingleClick"
    ></video>
    <div class="control-area">
      <!-- when hover beyond the area, the control bar will show. -->
      <div class="control-bar">
        <div class="progress-bar" ref="progress-bar">
          <div
            class="progress"
            :style="`width: ${(status.progress / status.duration) * 100}%`"
          ></div>
          <!-- <div
            class="current"
            :style="`width: ${(status.currentTime / status.duration) * 100}%`"
          ></div> -->
          <input
            ref="current"
            class="current-input"
            type="range"
            min="0"
            :max="max"
            @input="handleProgressInput"
          />
        </div>
        <div class="tool-bar">
          <div class="left">
            <Icon name="rewind" @click="handleTimeChange(-10)" />
            <Icon
              name="pause"
              size="18"
              @click="handlePlay"
              v-if="status.playing"
              hint="暂停"
            />
            <Icon
              name="play"
              @click="handlePlay"
              v-else
              size="18"
              hint="播放"
            />
            <Icon name="fastforward" @click="handleTimeChange(10)" />
            <span class="info">
              {{ status.currentTimeText }} / {{ status.durationText }}
            </span>
          </div>
          <div class="right">
            <Icon
              name="mute"
              hint="muted"
              @click="handleMuted(false)"
              v-if="status.muted"
            />
            <Icon name="sound" @click="handleMuted(true)" v-else />
            <Icon
              name="cancelfullscreen"
              @click="handleFullScreen"
              v-if="status.fullscreen"
            />
            <Icon name="fullscreen" @click="handleFullScreen" v-else />

            <Icon name="loop" />
            <Icon name="noloop" />
            <Icon name="shot" hint="截图" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import Icon from './components/Icon.vue';
import { parseTime } from './utils/index.js';
import throttle from 'lodash/throttle';
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
        fullscreen: false,
        currentTime: 0,
        currentTimeText: '--:--:--',
        duration: 1,
        durationText: '--:--:--',
        progress: 0,
        currentTimeWidth: '0%',
      },
      timer: null,
      max: 1000,
    };
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  },
  methods: {
    init() {
      const videojsOptions = {
        autoplay: this.autoplay,
        controls: false,
        // height: this.height,
        // width: this.width,
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
      // 修改样式成自适应
      const el = this.player.el_;
      el.style.height = '100%';
      el.style.width = '100%';
      const video = this.player.el_?.childNodes?.[0];
      video.style.height = '100%';
      video.style.width = '100%';
      this.video = video;
      this.handleEvents();
    },
    handlePlay() {
      if (this.status.playing) {
        this.video.pause();
      } else {
        this.video.play();
      }
      this.status.playing = !this.status.playing;
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

      this.$refs.IPlayer.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement !== null) {
          // 全屏模式
          this.status.fullscreen = true;
        } else {
          this.status.fullscreen = false;
        }
      });

      this.video.addEventListener('durationchange', (e) => {
        this.status.duration = this.video.duration;
        this.status.durationText = parseTime(this.video.duration);
      });

      this.video.addEventListener(
        'timeupdate',
        throttle(() => {
          this.status.currentTime = this.video.currentTime;
          this.$refs.current.value =
            this.max * (this.video.currentTime / this.video.duration);
          this.status.currentTimeText = parseTime(this.video.currentTime);
        }, 1000),
      );

      this.video.addEventListener('progress', (e) => {
        try {
          const len = this.video.buffered.length;
          if (len) {
            this.status.progress = this.video.buffered.end(len - 1);
          }
        } catch (e) {
          console.error(e);
        }
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
    handleFullScreen() {
      if (this.status.fullscreen) {
        document.exitFullscreen();
      } else {
        this.$refs.IPlayer.requestFullscreen();
      }
      this.status.fullscreen = !this.status.fullscreen;
    },
    handleSingleClick() {
      if (!this.timer) {
        this.timer = setTimeout(() => {
          this.handlePlay();
          clearTimeout(this.timer);
          this.timer = null;
        }, 300);
      }
    },
    handleDoubleClick() {
      clearTimeout(this.timer);
      this.timer = null;
      this.handleFullScreen();
    },
    handleProgressInput: throttle(function (e) {
      const { srcElement } = e;
      this.video.currentTime =
        this.video.duration * (srcElement.value / this.max);
    }, 200),
  },
};
</script>
<style lang="scss" scoped>
.iplayer-container {
  position: relative;

  .control-area {
    // border: 1px solid white;
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    height: 100px;
    display: flex;
    align-items: stretch;
    flex-direction: column;
    justify-content: flex-end;

    &:hover {
      .control-bar {
        .tool-bar {
          display: flex;
        }
      }
    }

    .control-bar {
      .progress-bar {
        position: relative;
        height: 6px;
        background-color: rgb(45, 45, 45);

        cursor: pointer;
        .current {
          position: absolute;
          top: 1px;
          left: 0;
          height: 4px;
          background: #00b2ff;
          border-radius: 2px;
          width: 100%;
          z-index: 2;
          transition: all 0.4s ease;
        }
        .current-input {
          position: absolute;
          top: 1px;
          left: 0;
          cursor: pointer;
          // -webkit-appearance: none;
          // appearance: none;
          background: 0 0;
          border: 0;
          border-radius: 26px;
          color: #00b2ff;
          display: block;
          height: 6px;

          margin: 0;
          min-width: 0;
          padding: 0;
          transition: box-shadow 0.3s ease;
          width: 100%;
          z-index: 5;
        }
        .progress {
          position: absolute;
          top: 1px;
          left: 0;
          height: 4px;
          background: grey;
          width: 100%;
          z-index: 1;
          transition: all 0.4s ease;
        }
      }
      .tool-bar {
        display: none;
        color: white;
        background: rgb(6, 32, 63);
        // display: flex;
        padding: 6px;
        justify-content: space-between;
        align-items: center;

        .left,
        .right {
          display: flex;
          align-items: center;
        }
        .info {
          font-size: 12px;
          line-height: 20px;
          vertical-align: middle;
          color: rgb(198, 198, 198);
          user-select: none;
          margin: 0 6px;
        }
      }
    }
  }
}
</style>
