import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCompositionAPI from '@vue/composition-api'
// import './store/test'

import { Table } from 'ant-design-vue';
import ElementUI from 'element-ui';
import VueUi from '@vue/ui'

// 加载dayjs 中文
import 'dayjs/locale/zh-cn'

import '@vue/ui/dist/vue-ui.css'
import 'element-ui/lib/theme-chalk/index.css';
import 'ant-design-vue/dist/antd.css';
import '@/style/pie.less';
import '@/style/global.styl'
import '@/style/index.less'

import '@/data/interceptors'

Vue.use(VueCompositionAPI)

Vue.use(VueUi)
Vue.use(ElementUI);
Vue.use(Table)

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
