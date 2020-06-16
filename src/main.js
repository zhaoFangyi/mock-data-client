import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import './store/test'

import ElementUI from 'element-ui';
import VueUi from '@vue/ui'

import '@vue/ui/dist/vue-ui.css'
import 'element-ui/lib/theme-chalk/index.css';
import '@/style/global.styl'
import '@/style/index.less'

import '@/data/interceptors'

Vue.use(VueUi)
Vue.use(ElementUI);

const ignoreWarnMessage = 'The .native modifier for v-on is only valid on components but it was used on <div>.';
Vue.config.warnHandler = function (msg, vm, trace) {
  // `trace` is the component hierarchy trace
  if (msg === ignoreWarnMessage) {
    msg = null;
    vm = null;
    trace = null;
  }
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
