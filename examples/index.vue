<template>
  <div>
    <IPlayer
      src="https://d2zihajmogu5jn.cloudfront.net/sintel/master.m3u8"
      :muted="true"
      :step="20"
      :controlsList="['fastforward', 'shot', 'fullscreen', 'loop']"
    />
  </div>
</template>
<script>
import { IPlayer } from '../src/index.js';
export default {
  components: {
    IPlayer,
  },
};
</script>
