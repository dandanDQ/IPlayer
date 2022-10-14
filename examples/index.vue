<template>
  <div class="container">
    <IPlayer
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

export default {
  components: {
    IPlayer,
  },
};
</script>
<style lang="scss" scoped>
.container {
  width: 300px;
}
</style>
