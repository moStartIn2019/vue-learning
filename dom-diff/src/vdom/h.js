/**
 * 
 * @param {*} type 类型
 * @param {*} props 节点属性
 * @param  {...any} children 所有子节点
 */
import { vnode } from './vnode'

export default function createElement(type, props = {}, ...children) {
  let key
  if (props.key) { // 如果属性有key，需要把key移出来，并且删掉属性的key
    key = props.key
    delete props.key
  }
  /** vnode具有的东西
   * { 
      type,
      props,
      key,
      children,
      text: undefined
    }
   */

  children = children.map(child => { // 再判断是否为文本节点
    if (typeof child === 'string') {
      return vnode(undefined, undefined, undefined,
        undefined, child)
    } else {
      return child
    }
  })
  return vnode(type, key, props, children)
}