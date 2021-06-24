import Vue from 'vue'
import App from './App.vue'
// import router from './router'
import router from './vue-router'
Vue.use(router) // 安装插件

Vue.config.productionTip = false

new Vue({
  name: 'main',
  router,
  render: h => h(App)
}).$mount('#app')