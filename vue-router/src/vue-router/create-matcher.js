import createRouteMap from "./create-route-map"
import { createRoute } from "./history/base"
export default function createMatcher(routes) {
  // 本方法返回match和addroutes
  // routes 为用户当前传入的配置
  // 扁平话用户传入的数据， 创建路由映射表
  let { pathList, pathMap } = createRouteMap(routes) // 初始化配置
    // 动态添加的方法
  function addRoutes(routes) { // 添加新的配置，合并原有的pathList和pathMap 
    createRouteMap(routes, pathList, pathMap)
  }

  // 用来匹配路径的方法
  function match(location) {
    // 找到当前的记录

    // 1、需要找到对应的记录，并且根据记录产生一个匹配数组
    // {path: '/about/a', component: xxx}
    if (pathMap[location]) { // 找到了记录
      return createRoute(pathMap[location], {
        path: location
      })
    }
    return createRoute(null, {
      path: location
    })
  }

  return {
    match,
    addRoutes
  }
}