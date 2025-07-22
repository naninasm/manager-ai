import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import AdminLogin from '../views/AdminLogin.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import UserManagement from '../views/UserManagement.vue'
import TestAPI from '../views/TestAPI.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/admin/login',
      name: 'AdminLogin',
      component: AdminLogin,
    },
    {
      path: '/admin/dashboard',
      name: 'AdminDashboard',
      component: AdminDashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/users',
      name: 'UserManagement',
      component: UserManagement,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/data-stats',
      name: 'DataStats',
      component: () => import('../views/DataStats.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/test-api',
      name: 'TestAPI',
      component: TestAPI
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/',
      name: 'MainHome',
      component: HomeView,
    },
    {
      path: '/admin',
      redirect: '/admin/login'
    }
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const adminInfo = localStorage.getItem('adminInfo')
  
  console.log('🔍 路由守卫检查:', {
    to: to.path,
    from: from.path,
    requiresAuth: to.meta.requiresAuth,
    adminInfo: adminInfo ? JSON.parse(adminInfo) : null
  })
  
  if (to.meta.requiresAuth) {
    if (!adminInfo) {
      console.log('❌ 未找到管理员信息，跳转到登录页')
      next('/admin/login')
    } else {
      console.log('✅ 验证通过，允许访问')
      next()
    }
  } else {
    console.log('➡️ 无需验证，直接放行')
    next()
  }
})

export default router
