import { createRouter, createWebHistory } from 'vue-router'
import { ChatLayout } from '@/views/chat/layout'

let isAuthenticated = true

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: () => import('../views/HomeView.vue')
    // },
    {
      path: '/',
      name: 'Root',
      component: ChatLayout,
      redirect: '/chat',
      children: [
        {
          path: '/chat/:uuid?',
          name: 'Chat',
          component: () => import('@/views/chat/index.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   // 在进入路由前执行的操作，例如验证用户身份
//   if (to.name !== 'Login' && !isAuthenticated) {
//     next({ name: 'Login' });
//   } else {
//     next();
//   }
// });

export default router
