import install from './install.js'
import createMatcher from './create-matcher'
export default class VueRouter {
  constructor(options) {
    //  1.什么叫路由，核心是根据不同的路径跳转对应的组件
    // 把用户传入的routes转化成好维护的结构，扁平的
    // createMatcher返回addRoutes 动态添加路由配置
    // createMatchermatch 负责匹配路径
    this.matcher = createMatcher(options.routes || []) // 默认传入空数组


  }
  init(app) { // new vue app 指代根实例

  }
}

// 默认会调用install方法
VueRouter.install = install