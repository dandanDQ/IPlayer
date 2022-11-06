<template>
  <div
    ref="IPlayer"
    class="iplayer-container"
    @click="handleSingleClick"
    @dblclick="handleDoubleClick"
  >
    <video ref="video-el"></video>

    <div class="modal-box" v-if="status.seeking">
      <Icon name="loading" size="100" class="rotate" />
    </div>

    <div class="modal-box" v-if="status.errorDetails">
      <Icon name="error" size="150" />
      <span class="hint">{{ status.errorDetails }}</span>
    </div>

    <div v-if="controls" class="control-area">
      <!-- when hover beyond the area, the control bar will show. -->
      <div class="control-bar" @click.stop @dblclick.stop>
        <Slider
          @change="handleRatioChange"
          ref="progress-bar"
          icon="TV"
        ></Slider>

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
                  @click="togglePlay"
                  v-if="status.playing"
                />
                <Icon name="play" @click="togglePlay" v-else size="18" />
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

            <span class="info" ref="progress-info">
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
              <!-- <div>{{ status.muted ? TRANSLATE.sound : TRANSLATE.muted }}</div> -->
              <!-- volume control -->
              <div class="volume-control">
                <Slider
                  width="100px"
                  @change="handleVolumeChange"
                  :value="volume"
                />
              </div>
            </popover>

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
import Slider from './components/Slider.vue';
import Hls from 'hls.js';
import Flv from 'flv.js';

let player = null;
export default {
  name: 'IPlayer',
  components: {
    Icon,
    Popover,
    Slider,
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
    // 视频类型，支持 Hls，Flv，MP4
    type: {
      type: String,
      default: '',
    },
    volume: {
      type: Number,
      default: 0.5,
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
        seeking: true, // 加载中
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

      videoType: '',
    };
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    // 销毁
    if (this.videoType === 'flv') {
      player?.destroy?.();
    }
    if (this.videoType === 'hls') {
      player?.destroy?.();
    }
    player = null;
    clearTimeout(this.timer);
  },
  methods: {
    initMSE() {
      this.video = this.$refs['video-el'];

      // 识别类型并进行初始化，支持 hls flv 和 mp4
      let type = this.type;

      if (!type) {
        // 用户没有填写类型，则自动识别
        if (/m3u8(#|\?|$)/i.exec(this.src)) {
          type = 'hls';
        } else if (/.flv(#|\?|$)/i.exec(this.src)) {
          type = 'flv';
        } else {
          type = 'mp4';
        }
      }

      this.videoType = type;

      switch (type) {
        case 'hls': {
          if (Hls.isSupported()) {
            const hls = new Hls();
            player = hls;

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
          } else {
            console.error('no hls');
          }

          break;
        }
        case 'flv': {
          if (Flv.isSupported()) {
            const flvPlayer = Flv.createPlayer({
              type: 'flv',
              url: this.src,
            });
            flvPlayer.attachMediaElement(this.video);
            flvPlayer.load();
            player = flvPlayer;
          }
          break;
        }
        default:
          this.video.src = this.src;
          break;
      }
    },
    init() {
      this.initMSE();
      this.handleEvents();

      // set volume
      if (this.$refs.volume) {
        const initialVolume = this.muted ? 0 : this.volume;
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

      // 处理用户配置
      // 需要先处理静音，才能实现自动播放
      this.handleMuted(this.muted);

      if (!this.controls) this.autoplay = true;
      this.status.playing = !this.autoplay;
      this.togglePlay();
    },
    togglePlay() {
      if (this.status.playing) {
        this.video.pause();
      } else {
        this.video.play();
      }
      this.status.playing = !this.status.playing;
    },
    handleTimeChange(seconds) {
      this.video.currentTime += seconds;
    },
    handleMuted(muted) {
      this.video.muted = muted;
      this.status.muted = muted;
    },
    updateStyleProgress() {
      const ratio = this.status.progress / this.status.duration;
      this.$refs['progress-bar'].updateStyleProgress(ratio);
    },
    updateStyleCurrent() {
      const ratio = this.status.currentTime / this.status.duration;
      this.$refs['progress-bar']?.updateStyleCurrent?.(ratio);
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
          this.status.seeking = false;
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
        } catch (e) {}
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
      if (!this.controls) return;
      if (!this.timer) {
        this.timer = setTimeout(() => {
          this.togglePlay();
          clearTimeout(this.timer);
          this.timer = null;
        }, 300);
      }
    },
    handleDoubleClick() {
      if (!this.controls) return;

      // only if 'fullscreen' is open.
      if (this.controlsList.includes('fullscreen')) {
        clearTimeout(this.timer);
        this.timer = null;
        this.handleFullScreen();
      }
    },
    handleRatioChange(ratio) {
      this.video.currentTime = this.video.duration * ratio;
    },
    handleVolumeChange(ratio) {
      this.status.volume = ratio;
      this.setVolume(ratio);
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
  },
};
</script>
<style lang="scss" scoped>
.iplayer-container {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: black;
  $current: 20%;
  //  min-width: 500px;

  video {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }

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
    bottom: 0px;
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
      .volume-control {
        margin: 0 10px;
      }
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
        flex-wrap: nowrap;

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
          white-space: nowrap;

          &.plain {
            display: none;
          }
        }
      }
    }
  }
}
</style>
