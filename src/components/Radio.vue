<template>
  <label :class="{ checked: current === value }">
    <input
      type="radio"
      :value="value"
      :name="name"
      @change="$emit('change', $event.target.value)"
    />
    {{ label }}
  </label>
</template>
<script>
export default {
  name: 'Radio',
  model: {
    prop: 'current',
    event: 'change',
  },
  props: {
    label: {
      type: String,
      default: '选项1',
    },
    name: {
      type: String,
      default: '',
    },
    value: {
      type: String | Number,
      default: '',
    },
    current: {
      type: String | Number,
      default: '',
    },
  },
};
</script>
<style lang="scss" scoped>
label {
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  background-color: white;
  &.checked {
    background-color: rgb(226, 237, 248);
  }
  &:hover {
    background-color: aliceblue;
  }

  input[type='radio'] {
    display: none;
  }
}
</style>
