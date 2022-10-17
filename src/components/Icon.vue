<template>
  <div class="icon" @click="$emit('click')">
    <svg :width="size" :height="size">
      <use :xlink:href="`#${name}`"></use>
    </svg>
  </div>
</template>
<script>
const importAll = (requireContext) =>
  requireContext.keys().forEach((key) => {
    requireContext(key);
  });
try {
  importAll(require.context('../assets/icons', true, /\.svg$/));
} catch (err) {
  console.log(err);
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
  },

  name: 'Icon',
};
</script>
<style lang="scss" scoped>
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
}
</style>
