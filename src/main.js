import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

//导入全局样式包
import './assets/css/basic.css'


//导入elementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//导入路由组件
import router from './router/router'

new Vue({
  //挂载
  router,
  render: h => h(App),
}).$mount('#app')
