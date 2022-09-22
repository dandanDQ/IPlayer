import IPlayer from './player.vue';

const install = (app) => {
  app.component('IPlayer', IPlayer);
};

const VueIplayer = { IPlayer, install };
export default VueIplayer;
export { IPlayer, install };
