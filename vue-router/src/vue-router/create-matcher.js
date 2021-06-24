export default function createMatcher(routes) {
  // 本方法返回match和addroutes
  // routes 为用户当前传入的配置
  // 扁平话用户传入的数据， 创建路由映射表
  let { pathList, pathMap } = createRouteMap(routes) // 初始化配置
    // 动态添加的方法
  function addRoutes(routes) { // 添加新的配置，合并原有的
    createRouteMap(routes, pathList, pathMap)
  }

  // 用来匹配的方法
  function match() {

  }

  return {
    match,
    addRoutes
  }
}