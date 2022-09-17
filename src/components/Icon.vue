<template>
  <div class="icon" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <svg :width="size" :height="size">
      <use :xlink:href="`#${name}`"></use>
    </svg>
    <div class="hint" v-if="showHint">提示文字</div>
  </div>
</template>
<script>
const importAll = (requireContext) => requireContext.keys().forEach(requireContext);
try { 
  importAll(require.context('../assets/icons', true, /\.svg$/))
} catch(err) {
  consoel.log(err)
}
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: '20'
    }
  },
  name: 'Icon',
  data() {
    return {
      showHint: false
    }
  },
  methods: {
    handleMouseEnter() {
      this.showHint = true
    },
    handleMouseLeave() {
      this.showHint = false
    }
  }
}
</script>
<style lang="scss">
  .icon {
    position: relative;
    cursor: pointer;
    .hint {
      position: absolute;
      bottom: -10px;
      background-color: aliceblue;
      border-radius: 4px;
    }
  }
</style>
