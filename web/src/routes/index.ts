import Login from '@/views/login/index.vue'
import Home from '@/views/home/index.vue'
import Design from '@/views/design/index.vue'
import Preview from '@/views/preview/index.vue'
import Exception from '@/views/exception/404.vue'
import { createMemoryHistory, createWebHistory, createRouter } from 'vue-router'
import {authToken} from "../../utils";


const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/home', component: Home, meta: { requiresAuth: true } },
  { path: '/design', component: Design, meta: { requiresAuth: true } },
  { path: '/preview', component: Preview },
  { path: '/:path(.*)*', component: Exception}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


// 全局前置守卫
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!authToken.value;

  if (to.meta.requiresAuth) {
    if (isLoggedIn) {
      next(); // 已登录，放行
    } else {
      // 未登录，跳转登录页并记录目标路径
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    }
  }
  else if (to.meta.requiresGuest && isLoggedIn) {
    // 如果是登录页但已登录，重定向到首页或来源页
    next(from.query.redirect || '/');
  }
  else {
    next(); // 其他情况正常放行
  }
});

export default router