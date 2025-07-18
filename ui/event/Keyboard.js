import eventDispatcher from "./Dispatcher.js";

class Keyboard {

  constructor() {
    console.log('start keyboard')
    let computerEventTypes = ['keyup', 'keydown', 'keypress'];
    computerEventTypes.forEach(eventType => {
      document.addEventListener(eventType, e => {
        eventDispatcher.dispatchEvent(e);
      });
    })
  }

}

let instance = new Keyboard();
export default instance;