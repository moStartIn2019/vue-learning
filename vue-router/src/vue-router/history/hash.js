import History from "./base";

function getHash() {
  return window.location.hash.slice(1)
}

function ensureSlash() {
  if (window.location.hash) {
    return
  }
  window.location.hash = '/'
}
export default class HashHistory extends History {
  constructor(router) {
    super(router)
      //  确保 有/
    ensureSlash()
  }
  getCurrentLocation() {
    return getHash()
  }
  setupHashHistory() { // 监听页面的hash值变化
    window.addEventListener('hashchange', () => {
      // hash值改变，重新跳转页面，调用父类的原型（实例）的transitionTo方法
      this.transitionTo(getHash())
    })
  }
}