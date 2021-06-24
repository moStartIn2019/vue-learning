import Histor from "./base";

function getHash() {
  return window.location.hash.slice(1)
}
export default class HashHistory extends History {
  constructor(router) {
    super(router)
  }
  getCurrentLocation() {
    return getHash()
  }
}