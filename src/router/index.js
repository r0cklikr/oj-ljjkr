import { createRouter, createWebHistory } from 'vue-router'
import BasicLayout from '../layout/BasicLayout.vue'
import Login from '../views/Login.vue'
import ProblemList from '../views/problem/ProblemList.vue'
import SubmissionList from '../views/submission/SubmissionList.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: BasicLayout,
    redirect: '/problem',
    children: [
      {
        path: 'problem',
        name: 'ProblemList',
        component: ProblemList
      },
      {
        path: 'submission',
        name: 'SubmissionList',
        component: SubmissionList
      },
      {
        path: 'user/info',
        name: 'UserInfo',
        component: () => import('../views/user/UserInfo.vue')
      },
      {
        path: '/problem/add',
        name: 'AddProblem',
        component: () => import('../views/problem/AddProblem.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: '/problem/:id',
        name: 'ProblemDetail',
        component: () => import('../views/problem/ProblemDetail.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userInfo = localStorage.getItem('userInfo')
  if (to.path !== '/login' && !userInfo) {
    next('/login')
  } else {
    next()
  }
})

export default router