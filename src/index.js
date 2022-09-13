import Iplayer from './player.vue'

const install = (app) => {
    app.component('IPlayer', Iplayer)
}

const VueIplayer = { Iplayer, install }
export default VueIplayer
export  {
    Iplayer,
    install
}
