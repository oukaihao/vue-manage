import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

//导入全局样式包
import './assets/css/basic.css'

//导入路由包
import VueRouter from 'vue-router'
Vue.use(VueRouter)

//导入elementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//导入组件
import login from './components/login.vue'

//创建路由规则
const routes = [
  { path:'/login',component:login},
  { path:'',redirect:'/login'}
]

//创建路由对象
const router = new VueRouter({
  routes
})
new Vue({
  //挂载
  router,
  render: h => h(App),
}).$mount('#app')
