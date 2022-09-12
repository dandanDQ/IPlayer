import Iplayer from './player.vue'

const install = (app) => {
    app.component('IPlayer', Iplayer)
}
export default Iplayer
export  {
    Iplayer,
    install
}