import { createApp } from 'vue'
import App from './App.vue'
// import './registerServiceWorker'
import router from './router'
import store from './store'

import './assets/iconfont/iconfont.css'
import './assets/iconfont/iconfont'
import 'normalize.css'
import './style/tools.sass'
import './style/theme.scss'

createApp(App).use(store).use(router).mount('#app')
