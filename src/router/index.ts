import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue' // Tạo file này ở bước sau
import AboutView from '../views/AboutView.vue' // Tạo file này ở bước sau

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
    // Ví dụ lazy loading:
    // component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(), // Sử dụng hash history phù hợp với Electron
  routes
})

export default router 