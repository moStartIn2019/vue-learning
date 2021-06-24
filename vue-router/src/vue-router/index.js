import install from './install'
import createMatcher from './create-matcher'
import HashHistory from './history/hash'
export default class VueRouter {
  constructor(options) {
    //  1.什么叫路由，核心是根据不同的路径跳转对应的组件
    // 把用户传入的routes转化成好维护的结构，扁平的
    // createMatcher返回的addRoutes 动态添加路由配置
    // createMatcher返回的match 负责匹配路径
    this.matcher = createMatcher(options.routes || []) // 默认传入空数组

    // 2.创建路由系统，根据不同的mode来创建不同的路由对象
    this.mode = options.mode || 'hash' // 默认hash模式, 一种是h5History ，最后一中是abstractHistory（node用的）
    switch (this.mode) {
      case 'hash':
        this.history = new HashHistory(this) // this: VueRouter实例
        break
      case 'history':
        this.history = new H5history(this)
        break
    }

  }
  init(app) { // new vue app 指根实例
    // 如何初始化 先根据当前路径 显示到指定的组件,核心方法是history的transitionTo
    const history = this.history
    const setupHashListener = () => { // 回调,执行history的setupHashHistory函数
      history.setupHashListener()
    }
    history.transitionTo(history.getCurrentLocation(), setupHashListener) // 后续要监听路径变化,一旦有变化，执行回调
  }
  match(location) { // 中间函数，用来调用matcher的match
    return this.matcher.match(location)
  }
}

// 默认会调用install方法
VueRouter.install = install