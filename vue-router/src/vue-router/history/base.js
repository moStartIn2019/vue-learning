export default class History {
  constructor(router) { // router = new Router()
    this.router = router
  }
  transitionTo(location, onComplete) { // 跳转的核心逻辑 location代表跳转的目的地 onComplete 当前跳转成功后执行的回调方法（可选）
    this.router.match(location) // 调用路由实例的match函数，来调用它的matcher的match

    onComplete && onComplete()
  }
}