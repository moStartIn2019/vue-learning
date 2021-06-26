// 函数式组件，没有this 不需要实例化 没有状态
export default {
  functional: true,
  render(h, { parent, data }) {
    // path:/about/a, matched = [about, aboutA]
    let route = parent.$route // $route => current => { path: 'xxx', matched: [] }
    let matched = route.matched
    data.routerView = true // 当前组件是一个routerView
    console.log(parent)
    console.log(data)
    let depth = 0
    while (parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++ // 当有parent且routerView为true时深度加1，要渲染子组件
      }
      parent = parent.$parent
    }
    let record = matched[depth]
    if (!record) {
      return h()
    }
    let component = record.component
    return h(component, data)
  }
}