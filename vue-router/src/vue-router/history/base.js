export function createRoute(record, location) { // return { path matched }
  let res = []
  if (record) { // record => { path: '/about/a', component: xxx, parent  }
    while (record) {
      res.unshift(record)
      record = record.parent // 从最底层往上循环插入
    }
  }
  return {
    ...location,
    matched: res
  }
}

export default class History {
  constructor(router) { // router = new Router()
    this.router = router
      // 默认路由中应该保存一个当前的路径，后续会更改这个路径
    this.current = createRoute(null, { // 比如path: '/about/a' => matched: ['about', aboutA]
        path: '/',
      }) // 产生一个新的对象
  }
  transitionTo(location, onComplete) { // 跳转的核心逻辑 location代表跳转的目的地 onComplete 当前跳转成功后执行的回调方法（可选）
    // {/:record, /about:record}
    // /about/a => { path: '/about/a', matched: [about, aboutA] }
    let route = this.router.match(location) // 匹配，调用路由实例的match函数，来调用它的matcher的match
      // route就是当前路径没，要匹配哪些路由
      //  /about/a [根组件，父组件，自己]
      // 将新的router属性，覆盖掉current
    if (this.current.route === location && route.matched.length === this.current.matched.length) {
      return // 如果是相同路径，且matched的length也是一致，则不进行跳转
    }
    this.updateRoute(route) // 否则，更新current
    onComplete && onComplete() // 有回调方法就调用回调方法
  }
  updateRoute(route) {
    this.current = route
    this.cb && this.cb(route) // 更新路径时，有回调函数就执行回调函数
  }
  listen(cb) {
    this.cb = cb // 监听，存储回调函数
  }
}