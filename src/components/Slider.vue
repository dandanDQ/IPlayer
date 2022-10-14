<template>
  <div
    class="progress-bar"
    ref="progress"
    @click="handleCurrentProgress"
    :style="`width: ${width}`"
  >
    <div class="buffered" ref="buffered"></div>
    <div class="current" ref="current">
      <Icon :name="icon" @pointerdown.native="onPointerdown" />
    </div>
  </div>
</template>
<script>
import throttle from 'lodash/throttle';
import Icon from './Icon.vue';

export default {
  name: 'Slider',
  components: {
    Icon,
  },
  props: {
    width: {
      type: String,
      default: '100%',
    },
    icon: {
      tyoe: String,
      default: 'circle',
    },
  },
  // 发生的事件： change 也就是 ratio 改变
  data() {
    return {};
  },
  mounted() {
    document.body.addEventListener('pointermove', this.onPointermove);
    document.body.addEventListener('pointerup', this.onPointerup);
    document.body.addEventListener('pointerleave', this.onPointerup);
  },
  beforeDestroy() {
    document.body.removeEventListener('pointermove', this.onPointermove);
    document.body.removeEventListener('pointerup', this.onPointerup);
    document.body.removeEventListener('pointerleave', this.onPointerup);
  },
  methods: {
    // 提供更新值的接口

    updateStyleProgress(ratio) {
      if (ratio < 0 || ratio > 1) return;

      const el = this.$refs['buffered'];
      if (el) {
        el.style.width = `${ratio * 100}%`;
      }
    },
    updateStyleCurrent(ratio) {
      if (ratio < 0 || ratio > 1) return;
      const el = this.$refs['current'];
      if (el) {
        el.style.width = `${ratio * 100}%`;
      }
    },
    updateStyleCurrentByEvent(e) {
      const { clientX } = e;
      const rect = this.$refs['progress'].getBoundingClientRect();
      const { left, width } = rect;
      const ratio = (clientX - left) / width;
      if (ratio < 0 || ratio > 1) return;

      this.updateStyleCurrent(ratio);
    },
    // 处理拖拽进度条操作
    onPointerdown(e) {
      this.pressing = true;
      console.log(e.type, e);
    },
    onPointermove: throttle(function (e) {
      if (this.pressing) {
        console.log(e.type, e);
        this.updateStyleCurrentByEvent(e);
      }
    }, 100),
    handleCurrentProgress: throttle(function (e) {
      const { clientX } = e;
      const rect = this.$refs['progress'].getBoundingClientRect();
      const { left, width } = rect;
      const ratio = (clientX - left) / width;

      if (ratio < 0 || ratio > 1) return;

      this.updateStyleCurrent(ratio);
      this.$emit('change', ratio);
    }, 300),
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
<style scoped lang="scss">
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
      right: -14px;
      top: -13px;
    }
  }

  .buffered {
    background: grey;
    width: 0%;
  }
}
</style>
