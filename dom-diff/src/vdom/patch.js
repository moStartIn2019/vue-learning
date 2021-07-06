/**
 * 
 * @param {*} vnode 用户写的虚拟节点
 * @param {*} container 要渲染到哪个容器
 * @returns 
 */
export function render(vnode, container) { // 1.虚拟节点 => 真实节点 2.容器追加真实节点
  let ele = createDomElementFrom(vnode) // 通过这个方法可以将虚拟节点转化成真实的节点
  container.appendChild(ele)
}

function createDomElementFrom(vnode) { // 通过虚拟的对象，创建一个真实的dom元素
  let { type, key, props, children, text } = vnode
  console.log(type, key, props, children, text)
    // 创建的真实节点并且给vnode对象再增加个属性domElement，且其值为刚创建的真实dom
    // 建立vnode和真实dom的对应关系，后面可以用来更新真实dom
  if (type) { // 传递了类型，说明是一个标签，
    // 并且元素类型上最重要的就是属性！
    vnode.domElement = document.createElement(type)
    updateProperties(vnode) // 根据当前的虚拟节点的属性，去更新真实的dom元素
      // 儿子节点，递归渲染的操作
    children.forEach(childVnode => render(childVnode, vnode.domElement))
  } else { // 因为文本 => { type: undefined, key: undefined, props: undefined, children: undefined, text: xxx}
    vnode.domElement = document.createTextNode(text)
  }
  return vnode.domElement
}

// 在虚拟节点中比对，最后比对完再一起转成真实dom的属性
// 后续比对的时候，会根据老的属性和新的属性，重新更新节点
// oldProps需要dom-diff的时候传，oldProps默认首次渲染时是空对象
function updateProperties(newVnode, oldProps = {}) {
  let domElement = newVnode.domElement // 真实的dom元素
  let newProps = newVnode.props // 当前虚拟节点中的属性

  // 如果老的里面有这个属性，新的里面没有，需要移除
  for (let propName in oldProps) { // 比对有没有老的属性key（属性名）
    if (!newProps[propName]) { // 当前的虚拟节点的属性（即最新的）
      // 如果没有，则移除老的属性
      delete domElement[propName]
    }
  }

  // 如果新的里面有style，老的里面也有style，但是style有可能不一样，比如老的有background，新的没有background
  // for (let oldPropName in oldProps) { // i worte
  //   if (oldPropName === 'style') {
  //     let oldStyleObj = oldProps.style
  //     for (let s in oldStyleObj) {
  //       if (newProps.style[s]) { // 新的属性和老的属性的style都有,直接用新的覆盖（不管相不相等）
  //         domElement.style[s] = newProps.style[s]
  //       } else { // 新的属性的style没有，老的属性的style有，移除
  //         delete domElement.style[s]
  //       }
  //     }
  //   }
  // }
  let newStyleObj = newProps.style || {}
  let oldStyleObj = oldProps.style || {}
  for (let propName in oldStyleObj) {
    if (!newStyleObj[propName]) { // 就是说老的style有这个属性，新的style没有这个属性
      domElement.style[propName] = '' // 老dom元素上更新之后，新的dom的style没有某个样式需要删除，直接赋空字符串
    }
  }


  // 由于经过上面的步骤清除了新的没有的属性
  // 如果老的里面没有style而新的有，或者老的有style，新的也有style，且是同个属性。
  // 用新节点的属性直接覆盖老节点的属性即可，包括style
  for (let propName in newProps) {
    // 如果像style:{ xxx }这样的对象，需要遍历，以及还有诸如@click等等这些也需要判断（用addEventListener）
    if (propName === 'style') {
      let styleObj = newProps.style
      for (let s in styleObj) {
        domElement.style[s] = styleObj[s]
      }
    } else { // 除style属性，其余直接覆盖
      domElement[propName] = newProps[propName]
    }
  }
}