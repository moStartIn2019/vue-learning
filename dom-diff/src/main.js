// 1.先实现虚拟dom 主要就是一个对象，来描述dom节点 jsx
// 最终转为createElement，即h方法

/**
 * <div id="wrapper">
 *  <span style="color:red">hello</span>
 *   mo
 * </div>
 */
import { h, render, patch } from './vdom'
// h方法就是将根据dom的类型 属性 孩子 产生一个虚拟dom

// 对常见的dom操作做优化
// 1.前后追加
// 2.正序和倒序
const vnode = h('div', {},
  h('li', { style: { background: 'red' }, key: 'A' }, 'A'),
  h('li', { style: { background: 'green' }, key: 'B' }, 'B'),
  h('li', { style: { background: 'blue' }, key: 'C' }, 'C'),
  h('li', { style: { background: 'yellow' }, key: 'D' }, 'D')
)

// render
// 将虚拟节点转化成真实的dom节点，最后插入到app元素中
render(vnode, window.app)
  // {
  //   type: 'div',
  //   props: { id: 'wrapper' },
  //   children: [
  //     { type: 'span', props: { style: { color: 'red' } }, children: [{ 'hello' }] },
  //     { type: '', props: '', children: [] }
  //   ]
  // }
const newVnode = h('div', {},
  h('li', { style: { background: 'red' }, key: 'A' }, 'A'),
  h('li', { style: { background: 'green' }, key: 'B' }, 'B'),
  h('li', { style: { background: 'blue' }, key: 'C' }, 'C'),
  h('li', { style: { background: 'yellow' }, key: 'D' }, 'D'),
  h('li', { style: { background: 'blue' }, key: 'E' }, 'E'),
)
setTimeout(() => { // 虚拟dom之后，不需要手动操作dom
  patch(vnode, newVnode)
}, 2000)