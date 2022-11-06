<template>
  <div>
    <button @click="show = !show">{{ show ? '销毁' : '重建' }}</button>
    <IPlayer
      v-if="show"
      src="https://d2zihajmogu5jn.cloudfront.net/sintel/master.m3u8"
      :muted="true"
      :step="20"
      :controls="true"
      :controlsList="['fastforward', 'shot', 'fullscreen', 'loop', 'rate']"
    />
  </div>
</template>
<script>
import { IPlayer } from '../src/index.js';
// import { IPlayer } from '../dist/iplayer.js';

function TestClass() {
  const size = 1000000;
  this.arr = new Array(3 * size).fill(100);
  this.name = 'TestClass';
  this.obj = {
    arr: new Array(7 * size).fill(200),
  };
}

export default {
  components: {
    IPlayer,
  },
  data() {
    return {
      show: true,
      // test: new TestClass(),
    };
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}
</style>
