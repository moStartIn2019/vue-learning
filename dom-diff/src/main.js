// 1.先实现虚拟dom 主要就是一个对象，来描述dom节点 jsx
// 最终转为createElement，即h方法

/**
 * <div id="wrapper">
 *  <span style="color:red">hello</span>
 *   mo
 * </div>
 */
import { h, render } from './vdom'
// h方法就是将根据dom的类型 属性 孩子 产生一个虚拟dom
const vnode = h('div', { id: 'wrapper', style: { background: 'red', width: '100px', height: '100px' } }, h('span', { style: { color: '#fff' }, key: 'xxx' }, 'hello'), 'mo')

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