import eventDispatcher from "./Dispatcher";

class WebsocketConnection {

  constructor() {
    this.connection = null;
    this.url = 'ws://localhost:21878';
    this.connectionId = 0;
  }

  connect() {
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    if (!window.WebSocket) {
      console.log("No WebSocket available");
    }
    this.connection = new WebSocket(this.url);
    console.log(this.connection);

    this.connection.onopen = () => {
      console.log('Connection Opened');
      eventDispatcher.dispatchEvent({type:'socketopen'});
    };

    this.connection.onmessage = (message) => {
      try {
        var jsonMsg = JSON.parse(message.data || message.utf8Data);
        if (jsonMsg.tag == 'connected') {
          this.connectionId = jsonMsg.id;
        }
        jsonMsg.type = 'socket';
        eventDispatcher.dispatchEvent(jsonMsg);
      } catch (e) {
        console.log(e);
        console.log('This doesn\'t look like a valid JSON: ', message.data);
      }
    };
  }

  sendMessage(msg) {
    this.connection.send(JSON.stringify(msg));
  }

}

let instance = new WebsocketConnection();
export default instance;