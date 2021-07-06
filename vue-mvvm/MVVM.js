// 工具类
CompileUtil = {
  getVal(vm, expr) { // 利用reduce的收敛性
    return expr.split('.').reduce((prev, cur) => {
      return prev[cur]
    }, vm.$data)
  },
  model(node, expr, vm) {
    let fn = this.updater['modelUpdater']
      // 编译时给输入框加一个观察者，如果稍后数据更新了会触发此回调
      // 回调就是给输入框赋新值
    new Watcher(vm, expr, (newVal) => {
      fn(node, newVal)
    })
    let value = this.getVal(vm, expr);
    fn(node, value)
  },
  getContentValue(vm, expr) {
    // 遍历表达式，将内容重新替换成一个完整的内容，返还回去
    return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
      return this.getVal(vm, args[1])
    })
  },
  textContent(node, expr, vm) {
    let fn = this.updater['textContent']
    let textContent = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
      // 给表达式每个{{}}都加上观察者
      new Watcher(vm, args[1], () => { // 返回一个全的字符串
        fn(node, this.getContentValue(vm, expr))
      })
      return this.getVal(vm, args[1])
    })
    fn(node, textContent)
  },
  html() {

  },
  bind() {

  },
  on() {

  },
  updater: {
    modelUpdater(node, value) {
      node.value = value;
    },
    textContent(node, value) {
      node.textContent = value;
    }
  }
}
class Dep {
  constructor() {
    this.subs = []
  }
  addSub(watcher) { // 添加（订阅）watcher实例
    this.subs.push(watcher)
  }
  notify() { // 发布（通知）
    this.subs.forEach(watcher => {
      watcher.update()
    })
  }
}
// 观察者模式
class Watcher {
  constructor(vm, expr, cb) {
      this.vm = vm;
      this.expr = expr;
      this.cb = cb;
      // 默认先存放一个老值。因为dep会通知所有的watcher实例update时，
      // 没有改变的值不可能触发cb回调，所以需要对比，前后的值不同才执行watcher的回调
      this.oldValue = this.get()
    }
    // 通过比对表达式从$data取值就会触发之前的数据劫持的get()，所以依赖从defineReactive
  get() { // school.name => vm.$data.school vm.$data.school.name
    Dep.target = this // new watcher时创建的实例(全局)
    let value = CompileUtil.getVal(this.vm, this.expr)
    Dep.target = null
    return value
  }
  update() { // 更新操作，数据变化后，会调用观察者的update方法
    let newVal = this.get()
    if (newVal !== this.oldValue) {
      this.cb(newVal)
    }
  }
}
// 劫持类
class Observer {
  constructor(vm) {
    this.observer(vm.$data)
  }
  observer(data) {
    // 如果是对象才观察
    if (data && typeof data === 'object') {
      for (let key in data) {
        this.defineReactive(data, key, data[key])
      }
    }
  }
  defineReactive(obj, key, value) {
    this.observer(value) // 如果data的子项值仍是对象，需要递归
    let dep = new Dep() // 给每一个被劫持的属性都加上具有发布订阅的功能，即watcher
    Object.defineProperty(obj, key, {
      get() {
        // 创建watcher时，会取到对应的内容，并且把watcher放到了全局上
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set: (newVal) => {
        if (value != newVal) {
          this.observer(newVal); // 如果赋值为对象也需要劫持
          value = newVal
            // 赋值时通知dep告知每个watcher实例去update（当然watcher自身的前后数据对比不同才会调用cb，即回调函数）
          dep.notify()
        }
      }
    })
  }
}
// 编译类
class Compiler {
  constructor(el, vm) {
    // 不是元素节点，则通过名字获取该元素节点
    this.el = this.isElementNode(el) ? el : document.querySelector(el);
    this.vm = vm;
    // 把当前的节点元素，获取并放到内存中
    let fragment = this.node2Fragment(this.el);

    // 把节点中的内容进行替换 {{ xxx }} => {{ }} data: xxx，需要compile方法来编译内存中的dom节点, => 1. v-xxx(查看元素节点是否有v-的指令开头的), 2. {{ xxx }}(查看文本节点是否有花括号)
    // 编译模板，用数据编译
    this.compile(fragment);
    // 把内容再塞到页面中
    this.el.appendChild(fragment)
  }
  isElementNode(node) { // 判断节点的类型，通过节点的nodeType判断，1:元素节点，3:文本节点
    return node.nodeType === 1;
  }
  node2Fragment(node) {
    let fragment = document.createDocumentFragment();
    let firstChild;
    while (firstChild = node.firstChild) {
      fragment.appendChild(firstChild); // 利用appendChild的移动性将模板中的节点一个个追加到Fragment中
    }
    return fragment;
  }
  compile(node) { // 编译模板，分元素节点和文本节点
    let childNodes = node.childNodes;
    [...childNodes].forEach(child => { // 编译前对每个子节点进行分类
      if (this.isElementNode(child)) { // 1.元素节点
        this.compileElement(child) // 编译模板的元素节点
        this.compile(child) // 如果子节点仍然存在孙子节点，需要递归该子节点
      } else { // 2.非元素节点（一般为文本节点）)
        this.compileText(child) // 编译模板的文本节点
      }
    })
  }
  compileElement(node) { // 判断当前的元素节点中是否包含v-开头的指令
    let attributes = node.attributes; // 类数组
    [...attributes].forEach(attr => {
      let { name, value: expr } = attr; // 属性结构，得到name，value：表达式
      if (this.isDirective(name)) { // 判断是指令，则执行
        let [, directive] = name.split('-')
        CompileUtil[directive](node, expr, this.vm)
      }
    })
  }
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  compileText(node) { // 判断当前的文本节点中是否包含{{}}
    let textContent = node.textContent // 文本节点专用textContent
    if (/\{\{(.+?)\}\}/g.test(textContent)) {
      // 找到所有{{}}里面的表达式
      CompileUtil['textContent'](node, textContent, this.vm)
    }
  }
}
// 基类
class Vue {
  constructor(options) {
    // 初始化，保留el和data
    this.$el = options.el
    this.$data = options.data
    if (this.$el) {
      // 编译前，需要劫持data，调用Observer类
      new Observer(this)
        // 如果有根元素，则需要compile，调用Compiler类
      new Compiler(this.$el, this)
    }
  }
}