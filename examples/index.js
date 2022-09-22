import Vue from 'vue';
import App from './index.vue';
// import IPlayer from '../src/index.js'

Vue.config.productionTip = false;
// Vue.use(IPlayer)
new Vue({
  render: (h) => h(App),
}).$mount('#app');
