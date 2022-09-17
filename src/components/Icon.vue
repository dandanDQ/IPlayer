<template>
  <div class="icon" @click="$emit('click')">
    <svg :width="size" :height="size">
      <use :xlink:href="`#${name}`"></use>
    </svg>
    <div class="hint" v-if="hint">{{ hint }}</div>
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
  },
  name: 'Icon',
  data() {
    return {
      showHint: false,
    };
  },
  methods: {
    handleMouseEnter() {
      this.showHint = true;
    },
    handleMouseLeave() {
      this.showHint = false;
    },
  },
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

  .hint {
    position: absolute;
    background-color: rgb(239, 239, 239);
    color: #555;
    font-weight: 600;
    border-radius: 4px;
    z-index: 1;
    padding: 6px;
    opacity: 0;
    transition: all 3s ease;
    top: -40px;
    font-size: 12px;
    border-radius: 3px;
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

  &:hover {
    background: #00b2ff;
    .hint {
      opacity: 1;
    }
  }
}
</style>
