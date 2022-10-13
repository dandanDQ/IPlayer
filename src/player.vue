<template>
  <div
    ref="IPlayer"
    class="iplayer-container"
    @click="handleSingleClick"
    @dblclick="handleDoubleClick"
    @pointerup="onPointerup"
    @pointermove="onPointermove"
    @pointerleave="onPointerup"
  >
    <video ref="video-el"></video>

    <div class="modal-box" v-if="status.seeking">
      <Icon name="loading" size="150" class="rotate" />
    </div>

    <div class="modal-box" v-if="status.errorDetails">
      <Icon name="error" size="150" />
      <span class="hint">{{ status.errorDetails }}</span>
    </div>

    <div v-if="controls" class="control-area">
      <!-- when hover beyond the area, the control bar will show. -->
      <div class="control-bar" @click.stop @dblclick.stop>
        <div class="progress-bar" ref="progress" @click="handleCurrentProgress">
          <div class="buffered" ref="buffered"></div>
          <div class="current" ref="current">
            <Icon name="TV" @pointerdown.native="onPointerdown" />
          </div>
        </div>
        <div class="tool-bar">
          <div class="left">
            <!-- rewind button -->
            <popover v-if="controlsList.includes('rewind')">
              <template #reference>
                <Icon name="rewind" @click="handleTimeChange(-step)" />
              </template>
              <div>{{ TRANSLATE.rewind }}</div>
            </popover>

            <!-- play and pause button -->
            <popover>
              <template #reference>
                <Icon
                  name="pause"
                  size="18"
                  @click="handlePlay"
                  v-if="status.playing"
                />
                <Icon name="play" @click="handlePlay" v-else size="18" />
              </template>
              <div>{{ status.playing ? TRANSLATE.pause : TRANSLATE.play }}</div>
            </popover>

            <!-- fastforward button -->
            <popover>
              <template #reference>
                <Icon name="fastforward" @click="handleTimeChange(step)" />
              </template>
              <div>{{ TRANSLATE.fastforward }}</div>
            </popover>

            <span class="info">
              {{ status.currentTimeText }} / {{ status.durationText }}
            </span>
          </div>
          <div class="right">
            <!-- muted and sound button -->
            <popover>
              <template #reference>
                <Icon
                  name="mute"
                  hint="muted"
                  @click="handleMuted(false)"
                  v-if="status.muted"
                />
                <Icon name="sound" @click="handleMuted(true)" v-else />
              </template>
              <div>{{ status.muted ? TRANSLATE.sound : TRANSLATE.muted }}</div>
            </popover>

            <!-- volume control -->
            <input
              type="range"
              @change="handleVolumeChange"
              min="0"
              max="1"
              step="0.05"
              ref="volume"
              :value="status.volume"
            />

            <!-- shot button -->
            <popover v-if="controlsList.includes('shot')">
              <template #reference>
                <Icon name="shot" @click="handleShot"></Icon>
              </template>
              <img v-if="shotImg" :src="shotImg" alt="" class="shot-img" />
              <div v-else>{{ TRANSLATE.shot }}</div>
            </popover>

            <!-- rate button -->
            <popover v-if="controlsList.includes('rate')">
              <template #reference>
                <Icon name="rate"></Icon>
              </template>
              <div class="radio-group">
                <radio
                  v-model="rate"
                  name="倍速"
                  @change="handleRateChange"
                  v-for="r in playbackRates"
                  :key="r"
                  :label="`x ${r}`"
                  :value="r"
                />
              </div>
            </popover>

            <!-- fullscreen button -->
            <popover v-if="controlsList.includes('fullscreen')">
              <template #reference>
                <Icon
                  name="cancelfullscreen"
                  @click="handleFullScreen"
                  v-if="status.fullscreen"
                />
                <Icon name="fullscreen" @click="handleFullScreen" v-else />
              </template>
              <div>
                {{
                  status.fullscreen
                    ? TRANSLATE.fullscreen
                    : TRANSLATE.fullscreen
                }}
              </div>
            </popover>

            <!-- loop button -->
            <popover v-if="controlsList.includes('loop')">
              <template #reference>
                <Icon name="noloop" @click="handleLoop" v-if="status.loop" />
                <Icon name="loop" @click="handleLoop" v-else />
              </template>
              <div>{{ status.loop ? TRANSLATE.loop : TRANSLATE.noloop }}</div>
            </popover>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from './components/Icon.vue';
import { parseTime } from './utils/index.js';
import throttle from 'lodash/throttle';
import Popover from './components/Popover.vue';
import Radio from './components/Radio.vue';
import Hls from 'hls.js';

export default {
  name: 'IPlayer',
  components: {
    Icon,
    Popover,
    Radio,
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
    controlsList: {
      type: Array,
      default() {
        return ['rewind', 'fastforward', 'fullscreen'];
      },
    },
    step: {
      type: Number,
      default: 10,
    },
    rates: {
      type: Array,
      default() {
        return [1, 1.5, 2, 2.5];
      },
    },
  },
  data() {
    return {
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
        seeking: false, // 加载中
        errorDetails: '', // 错误详情
      },
      timer: null,
      shotImg: '',

      showControls: false,

      TRANSLATE: {
        play: '播放',
        pause: '暂停',
        muted: '静音',
        sound: '打开声音',
        rewind: '快退',
        fastforward: '快进',
        shot: '截图',
        fullscreen: '全屏',
        loop: '开启循环',
        noloop: '关闭循环',
      },
      playbackRates: [],
      rate: '1.0',

      pressing: false, // 是否拖动中
    };
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    // 销毁
  },
  methods: {
    init() {
      // 兼容只配置 options 的情况
      // const videojsOptions = {
      //   autoplay: this.autoplay,
      //   controls: false,
      //   // height: this.height,
      //   // width: this.width,
      //   muted: this.muted,
      //   sources: [
      //     {
      //       src: this.src,
      //     },
      //   ],
      // };

      // 做一个简单的合并，兼容之前的逻辑
      // const options = Object.assign({}, videojsOptions, this.options);

      // 初始化播放状态
      // this.status.playing = options.autoplay;
      this.video = this.$refs['video-el'];

      if (Hls.isSupported()) {
        const hls = new Hls();

        // 错误监听
        hls.on(Hls.Events.ERROR, (e, data) => {
          const { type, details, fatal } = data;
          // fatal 的才展示出来
          if (fatal && type === 'NETWORK_ERROR') {
            this.status.errorDetails = `${type} ${details}`;
          }
        });
        hls.loadSource(this.src);
        hls.attachMedia(this.video);
      }
      // 修改样式成自适应
      this.video.style.height = '100%';
      this.video.style.width = '100%';
      this.video.style.height = '100%';
      this.video.style.width = '100%';

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

      // initialize playback rates
      for (const rate of this.rates) {
        this.playbackRates.push(Number(rate).toFixed(1));
      }
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
    updateStyleProgress() {
      const el = this.$refs['buffered'];
      if (el) {
        el.style.width = `${
          (this.status.progress / this.status.duration) * 100
        }%`;
      }
    },
    updateStyleCurrent(ratio = this.status.currentTime / this.status.duration) {
      const el = this.$refs['current'];
      if (el) {
        el.style.width = `${ratio * 100}%`;
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

          this.updateStyleCurrent();
        }, 1000),
      );

      this.video.addEventListener('progress', (e) => {
        try {
          const len = this.video.buffered.length;
          if (len) {
            this.status.progress = this.video.buffered.end(len - 1);
            this.updateStyleProgress();
          }
        } catch (e) {
          console.error(e);
        }
      });

      this.video.addEventListener('seeking', (e) => {
        this.status.seeking = true;
      });

      this.video.addEventListener('seeked', (e) => {
        this.status.seeking = false;
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
      // only if 'fullscreen' is open.
      if (this.controlsList.includes('fullscreen')) {
        clearTimeout(this.timer);
        this.timer = null;
        this.handleFullScreen();
      }
    },
    updateStyleCurrentByEvent: throttle(function (e) {
      const { clientX } = e;
      const rect = this.$refs['progress'].getBoundingClientRect();
      const { left, width } = rect;
      const ratio = (clientX - left) / width;
      this.updateStyleCurrent(ratio);
    }, 200),
    handleCurrentProgress: throttle(function (e) {
      const { clientX } = e;
      const rect = this.$refs['progress'].getBoundingClientRect();
      const { left, width } = rect;
      const ratio = (clientX - left) / width;
      this.updateStyleCurrent(ratio);
      this.video.currentTime = this.video.duration * ratio;
    }, 300),
    handleVolumeChange(e) {
      const { srcElement } = e;
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

      if (this.shotImg) {
        // revoke first
        URL.revokeObjectURL(this.shotImg);
      }

      this.shotImg = URL.createObjectURL(blob);

      this.$emit('shot', { blob });
    },
    handleRateChange(rate) {
      this.video.playbackRate = Number(rate);
    },
    // 处理拖拽进度条操作
    onPointerdown(e) {
      this.pressing = true;
      console.log(e.type, e);
    },
    onPointermove(e) {
      if (this.pressing) {
        console.log(e.type, e);
        this.updateStyleCurrentByEvent(e);
      }
    },
    onPointerup(e) {
      if (this.pressing) {
        this.handleCurrentProgress(e);
      }
      this.pressing = false;
      console.log(e.type, e);
    },
    onPointerLeave() {
      this.pressing = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.iplayer-container {
  position: relative;
  $current: 20%;

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .modal-box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    opacity: 0.5;
    font-size: 800;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .hint {
      font-size: 30px;
      color: grey;
    }
    .rotate {
      animation: rotate 2s infinite linear;
    }
  }
  .control-area {
    // border: 1px solid white;
    position: absolute;
    bottom: 4px;
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
    .shot-img {
      max-width: 100px;
      max-height: 100px;
      object-fit: contain;
    }
    .radio-group {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .control-bar {
      .progress-bar {
        position: relative;
        box-sizing: border-box;
        height: 4px;
        width: 100%;
        cursor: pointer;
        background-color: #ffffff4d;
        .current,
        .buffered {
          position: absolute;
          height: 4px;
          width: 100%;
        }

        .current {
          background: #00aeec;
          width: 0%;
          position: relative;

          .icon {
            position: absolute;
            right: -12px;
            top: -14px;
          }
        }

        .buffered {
          background: grey;
          width: 0%;
        }
      }

      .tool-bar {
        display: none;
        color: white;
        background: rgb(6, 32, 63);
        // display: flex;
        padding: 4px;
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
