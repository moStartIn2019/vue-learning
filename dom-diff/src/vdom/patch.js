/**
 * render // 1.虚拟节点 => 真实节点 2.容器追加真实节点
 * @param {*} vnode 用户写的虚拟节点
 * @param {*} container 要渲染到哪个容器
 * @returns 
 */
export function render(vnode, container) {
  let ele = createDomElementFrom(vnode) // 通过这个方法可以将虚拟节点转化成真实的节点
  container.appendChild(ele)
}

/**
 * createDomElementFrom // 通过虚拟的对象，创建一个真实的dom元素
 * @param {*} vnode 
 * @returns 
 */
function createDomElementFrom(vnode) {
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
/**
 * updateProperties patch和render均用到，给元素节点更新属性用的
 * @param {*} newVnode 新节点（第一次渲染的时候为原始节点）
 * @param {*} oldProps 旧节点的属性
 */
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

/**
 * patch 新旧节点比对更新，同层级比对（父与父，子与子）
 * @param {*} oldVnode 旧节点
 * @param {*} newVnode 新节点
 * @returns 
 */
export function patch(oldVnode, newVnode) { // dom操作
  // 类型不同
  if (oldVnode.type !== newVnode.type) { // 新的vnode需要创建真实dom的映射
    return oldVnode.domElement.parentNode.replaceChild(createDomElementFrom(newVnode), oldVnode.domElement)
  }
  // 类型相同，且是文本节点，直接覆盖
  if (oldVnode.text) {
    return oldVnode.domElement.textContent = newVnode.text
  }

  // 类型一样，并且是标签，需要根据新节点的属性，更新老节点的属性
  let domElement = newVnode.domElement = oldVnode.domElement
    // 更新
  updateProperties(newVnode, oldVnode.props) // 根据最新的虚拟节点来更新属性，排除文本节点

  // 对比新旧节点的子节点（同层级比对）
  let oldChildren = oldVnode.children // 旧儿子节点
  let newChildren = newVnode.children // 新儿子节点

  // 1.旧的有儿子，新的没有
  // 2.旧的有儿子，新的也有
  // 3.旧的没有儿子，新的有(新增了儿子)

  // 新旧都有儿子
  if (oldChildren.length && newChildren.length) {
    // 对比两个子节点，复杂
    updateChildren(domElement, oldChildren, newChildren)
  } else if (oldChildren.length) { // 旧的有，新的没有
    domElement.innerHTML = '' // 直接清空
  } else if (newChildren.length) { // 新的有，旧的没有
    for (let i = 0; i < newChildren.length; i++) { // 将子节点的每个真实dom插入到父级的真实dom里
      domElement.appendChild(createDomElementFrom(newChildren[i]))
    }
  }
}

function updateChildren(parent, oldChildren, newChildren) {
  console.log(parent, oldChildren, newChildren)
}