<template>
  <div ref="IPlayer" class="iplayer-container">
    <video
      ref="video-el"
      @dblclick="handleDoubleClick"
      @click="handleSingleClick"
    ></video>

    <div
      class="control-area"
      :style="{
        '--progress': `${(status.progress / status.duration) * 100}%`,
        '--current': `${(status.currentTime / status.duration) * 100}%`,
      }"
    >
      <!-- when hover beyond the area, the control bar will show. -->
      <div class="control-bar">
        <div class="progress-bar" ref="progress-bar">
          <!-- <div
            class="progress"
            :style="`width: ${(status.progress / status.duration) * 100}%`"
          ></div> -->
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
            <input
              type="range"
              @change="handleVolumeChange"
              min="0"
              max="1"
              step="0.05"
              ref="volume"
              :value="status.volume"
            />
            <Icon
              name="shot"
              hint="截图"
              @click="handleShot"
              :extraController="shotImg"
            >
              <template #default>
                <img
                  :src="shotImg"
                  alt=""
                  style="
                    max-height: 100px;
                    max-width: 100px;
                    object-fit: contain;
                  "
                />
              </template>
            </Icon>
            <Icon
              name="cancelfullscreen"
              @click="handleFullScreen"
              v-if="status.fullscreen"
            />
            <Icon name="fullscreen" @click="handleFullScreen" v-else />

            <Icon
              name="noloop"
              @click="handleLoop"
              v-if="status.loop"
              hint="关闭循环"
            />
            <Icon name="loop" @click="handleLoop" v-else hint="开启循环" />
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
    loop: {
      type: Boolean,
      default: false,
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
        volume: 0,
        loop: false,
      },
      timer: null,
      max: 1000,
      shotImg: '',
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

      // set volume
      if (this.$refs.volume) {
        const initialVolume = this.muted ? 0 : 0.5;
        this.$refs.volume.value = initialVolume;
        this.setVolume(initialVolume);
      }

      // set loop
      this.status.loop = this.loop;
      this.video.loop = this.loop;
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
      if (muted) {
        this.status.volume = 0;
      }
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
          if (this.$refs.current) {
            this.$refs.current.value =
              this.max * (this.video.currentTime / this.video.duration);
          }
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

    handleVolumeChange(e) {
      const { srcElement } = e;
      console.log(srcElement.value);
      this.setVolume(srcElement.value);
    },
    setVolume(volume) {
      this.status.volume = volume;
      this.video.volume = volume;
      if (volume === 0) {
        this.video.muted = true;
        this.status.muted = true;
      } else {
        this.video.muted = false;
        this.status.muted = false;
      }
    },
    handleLoop() {
      const loop = !this.status.loop;
      this.video.loop = loop;
      this.status.loop = loop;
    },
    async handleShot() {
      const video = this.video;
      if (!video) return;
      const canvas = document.createElement('canvas');
      // 获取video标签的尺寸，作为画布的长宽
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('error creating canvas context');
      }
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        });
      });

      this.shotImg = URL.createObjectURL(blob);

      this.$emit('shot', { blob });
    },
  },
};
</script>
<style lang="scss" scoped>
.iplayer-container {
  position: relative;
  $current: 20%;
  .control-area {
    // border: 1px solid white;
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    height: 200px;
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

          &::-webkit-slider-runnable-track {
            background-color: hsla(0, 0%, 100%, 0.25);
            background: 0 0;
            background-image: linear-gradient(
              to right,
              #0066ff 0% var(--current, 0),
              rgb(212, 212, 212) var(--current, 0) var(--progress, 0),
              transparent var(--progress, 0)
            );
            border: 0;
            border-radius: 2.5px;
            height: 4px;

            -webkit-transition: box-shadow 0.3s ease;
            transition: box-shadow 0.3s ease;
            -webkit-user-select: none;
            user-select: none;
          }

          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            background: #fff;
            border-radius: 100%;

            height: 12px;
            margin-top: -5px;

            position: relative;
            -webkit-transition: all 0.2s ease;
            transition: all 0.2s ease;
            width: 12px;
          }
        }

        .progress {
          position: absolute;
          top: 1px;
          left: 0;
          height: 4px;
          background: grey;
          width: 100%;
          z-index: 1;
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
