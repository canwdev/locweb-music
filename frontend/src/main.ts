import {createApp} from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Swal from 'sweetalert2'
import VueVirtualScroller from 'vue3-virtual-scroller'

window.$swal = Swal

import 'vue3-virtual-scroller/dist/vue3-virtual-scroller.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'normalize.css'
import './style/tools.sass'
import './style/base.scss'

createApp(App)
  .use(store)
  .use(router)
  .use(VueVirtualScroller)
  .mount('#app')
