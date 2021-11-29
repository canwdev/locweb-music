import Vue from 'vue'
import App from './App.vue'
// "@vue/cli-plugin-pwa": "~4.5.0",
// import './registerServiceWorker'
import router from './router'
import store from './store'
import i18n from './lang/i18n'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'normalize.css'
import './style/base.scss'
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
Vue.use(VueVirtualScroller)
Vue.config.productionTip = false
const isProd = process.env.NODE_ENV === 'production' // 'development'

import tankUI from '@canwdev/tank-ui'

if (isProd) {
  require('@canwdev/tank-ui/dist/tank-ui.css')
}
Vue.use(tankUI)

export default new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
