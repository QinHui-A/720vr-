import Exception from '@/views/exception/404.vue'
import Release from '@/views/release/index.vue'
import { createWebHistory, createRouter, createWebHashHistory } from 'vue-router'


const routes = [
  { path: '/', component: Release },
  { path: '/:path(.*)*', component: Exception}
]

const router = createRouter({
  history: createWebHistory(),
  // history: createWebHashHistory(),
  routes,
})
export default router