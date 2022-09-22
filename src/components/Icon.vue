<template>
  <div class="icon" @click="$emit('click')">
    <svg :width="size" :height="size">
      <use :xlink:href="`#${name}`"></use>
    </svg>
    <div class="hint basic" v-if="hint">
      {{ hint }}
    </div>
    <!-- 一些额外展示的内容，展示时长暂定3s -->
    <div class="extra basic" v-if="showExtra"><slot /></div>
  </div>
</template>
<script>
const importAll = (requireContext) =>
  requireContext.keys().forEach(requireContext);
try {
  importAll(require.context('../assets/icons', true, /\.svg$/));
} catch (err) {
  consoel.log(err);
}
export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '18',
    },
    hint: {
      type: String,
      default: '',
    },
    extraController: {
      type: String,
      default: '',
    },
  },
  watch: {
    extraController: {
      handler() {
        // 发生变化时触发
        this.showExtra = true;
        setTimeout(() => {
          this.showExtra = false;
        }, 3000);
      },
    },
  },
  data() {
    return {
      showExtra: false,
    };
  },
  name: 'Icon',
};
</script>
<style lang="scss">
.icon {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 5px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  // background: #5abae4;
  margin: 1px;

  .basic {
    position: absolute;
    background-color: rgb(239, 239, 239);
    color: #555;
    font-weight: 600;
    border-radius: 4px;
    white-space: nowrap;
    z-index: 1;
    padding: 6px;
    transition: all 3s ease;
    top: -50px;
    font-size: 12px;
    border-radius: 3px;
    text-align: center;
    &::before {
      content: '';
      border-top: 4px solid white;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 4px solid transparent;
      position: absolute;
      top: 100%;
      left: calc(50% - 2px);
    }
  }

  .hint {
    opacity: 0;
  }

  .extra {
    top: -80px;
  }

  &:hover {
    background: #00b2ff;
    .hint {
      opacity: 1;
    }
  }
}
</style>
