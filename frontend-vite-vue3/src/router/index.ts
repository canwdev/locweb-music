import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import pkg from '../../package.json'

let history = createWebHashHistory()
let routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
    meta: {
      title: `Local Web Music v${pkg.version}`,
    },
  },
]
const router = createRouter({history, routes})

router.afterEach((to, _, failure) => {
  document.title = (to?.meta?.title as string) || document.title
})
export default router
