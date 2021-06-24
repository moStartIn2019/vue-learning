export default function createRouteMap(routes, oldPathList, oldPathMap) {
  // 将用户传入的数据进行格式化
  let pathList = oldPathList || [] // 数组
  let pathMap = oldPathMap || Object.create(null) // 对象
  routes.forEach(route => {
    addRouteRecord(route, pathList, pathMap)
  })
}

function addRouteRecord(route, pathList, pathMap, parent) {
  let path = parent ? `${parent.path}/${route.path}` : route.path
  let record = { // 记录
    path,
    component: route.component
  }
  if (!pathMap[path]) { // 第一次没有就初始化
    pathList.push(path) // 将路径添加到pathList
    pathMap[path] = record
  }
  if (route.children) {
    route.children.forEach(child => {
      addRouteRecord(child, pathList, pathMap, record) // 每次循环儿子时，都将父路径传入
    })
  }
}