<template>
  <svg :width="size" :height="size">
    <use :xlink:href="`#${name}`"></use>
  </svg>
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
  name: 'Icon'
}
</script>
<style lang="scss">
  svg {
    border: 1px solid red;
  }
</style>
