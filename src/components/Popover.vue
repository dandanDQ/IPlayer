<template>
  <div class="popover">
    <slot name="reference">
      <div>测试</div>
    </slot>
    <div class="popover-content">
      <slot>
        <div>测试pop出的</div>
      </slot>
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
};
</script>
<style lang="scss" scoped>
.popover {
  position: relative;
  .popover-content {
    position: absolute;
    background-color: rgb(239, 239, 239);
    color: #555;
    font-weight: 600;
    border-radius: 4px;
    white-space: nowrap;
    z-index: 1;
    padding: 6px;
    transition: all 3s ease;
    bottom: 150%;
    font-size: 12px;
    border-radius: 3px;
    text-align: center;
    opacity: 0;
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
    .popover-content {
      opacity: 1;
    }
  }
}
</style>
