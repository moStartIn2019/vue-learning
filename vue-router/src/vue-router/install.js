// 安装插件，这个插件应该依赖于vue，而Vue.use会把Vue的实例传入，不需要单独引入
let _Vue
export default function install(Vue) {
  _Vue = Vue
    // 核心是mixin,混入到生命周期的beforeCreate，data还没被初始化，dom还没挂载
    // 在所有的组件上都增加了_routerRoute
    // 把用户注入的router属性
  Vue.mixin({
    beforeCreate() { // 深度优先，先渲染父，再从父找子孙渲染 [beforeCreate, beforeCreate]
      if (this.$options.router) { //有router即根实例(只有根实例有)
        this._routerRoot = this // 根实例(上一级)
        this._router = this.$options.router // 路由实例

        // init()，让路由实例调用初始化方法
        this._router.init(this)
      } else {
        this._routerRoot = this.$parent &&
          this.$parent._routerRoot
      }
    }
  })



  // 1.注册全局属性 $route $router
  // 2.注册全局的组件 router-link router-view
}