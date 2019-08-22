//导入Vue
import Vue from 'vue'

//导入路由
import VueRouter from 'vue-router'
Vue.use(VueRouter)

//导入组件
import login from '../veiw/login.vue'
import index from '../veiw/index.vue'
import users from '../veiw/userlist.vue'
import roles from '../veiw/rolelist.vue'
import rights from '../veiw/rights.vue'
import categories from '../veiw/categories.vue'

//创建路由规则
const routes = [
  { path: '/login', component: login },
  { path: '', redirect: '/login' },
  {
    path: '/index',
    component: index,
    meta: { requiresAuth: true },
    children: [
      { path: '/users', component: users, meta: { requiresAuth: true } },
      { path: '/roles', component: roles, meta: { requiresAuth: true } },
      { path: '/rights', component: rights, meta: { requiresAuth: true } },
      { path: '/categories', component: categories, meta: { requiresAuth: true } },
    ]
  }
]

//创建路由对象
const router = new VueRouter({
  routes
})

//导航卫士
router.beforeEach((to, from, next) => {

  if (to.meta.requiresAuth) {
    if (window.localStorage.getItem('token')) {
      next()

    } else {
      Vue.prototype.$message.error('请先登录！')
      router.push('/login')
    }

  } else {
    next()
  }
})

export default router