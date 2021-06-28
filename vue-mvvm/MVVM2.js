class Compiler {
  constructor(el, vm) {
    this.el = this.isElementNode(el) ? el : document.querySelector(el)
    let fragment = this.node2Fragment(this.el)
    console.log(fragment)
  }
  isElementNode(node) {
    return node.nodeType === 1
  }
  node2Fragment(node) {
    let firstChild
    let fragment = document.createDocumentFragment()
    while (firstChild = node.firstChild) {
      fragment.appendChild(firstChild)
    }
    return fragment
  }
}

class Vue {
  constructor(options) {
    this.$el = options.el
    this.$data = options.data
    if (this.$el) {
      new Compiler(this.$el, this)
    }
  }
}