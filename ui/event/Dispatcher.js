
class EventDispatcher {

  constructor() {
    this.subscriptions = {};
  }

  subscribeTo(evtType, handler) {
    if (!this.subscriptions[evtType]) {
      this.subscriptions[evtType] = new Set();
    }
    this.subscriptions[evtType].add(handler);
  }

  unsubscribeFrom(evtType, handler) {
    this.subscriptions[evtType].delete(handler);
  }

  dispatchEvent(evt) {
    let {type} = evt;
    if (!this.subscriptions[type]) {
      return;
    }
    this.subscriptions[type].forEach(handler => handler(evt));
  }

}

let eventDispatcher = new EventDispatcher();
export default eventDispatcher;