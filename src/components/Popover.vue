<template>
  <div
    class="popover"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <slot name="reference" />
    <div class="popper" v-show="show">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: 'Popover',
  props: {
    icon: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      show: true,
    };
  },
  methods: {
    handleMouseEnter() {
      // this.show = true;
    },
    handleMouseLeave() {
      // this.show = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.popover {
  position: relative;
  .popper {
    position: absolute;
    background-color: white;
    color: #555;
    font-weight: 600;
    border-radius: 4px;
    white-space: nowrap;
    z-index: 1;
    padding: 6px;
    bottom: 150%;
    left: 50%;
    font-size: 12px;
    border-radius: 3px;
    text-align: center;
    // display: none;
    visibility: hidden;
    transform: translateX(-50%);
    transition: all 0.5s ease;

    &::before {
      content: '';
      border-top: 4px solid white;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 4px solid transparent;
      position: absolute;
      top: 100%;
      left: calc(50% - 4px);
    }

    &:hover {
      visibility: visible;
    }
  }
  &:hover {
    .popper {
      visibility: visible;
    }
  }
}
</style>
