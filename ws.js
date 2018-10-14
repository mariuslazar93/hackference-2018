
const STATES = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];

module.exports = class WebSocketClient {
  constructor(app) {
    app.ws('/websocket', (ws) => {
      this.state = ws.readyState;

      console.log('websocket working', ws.readyState);
      // OPEN
      if (this.state === 1) {
        this.ws = ws;
        this.bindEvents();
      }
    });
  }

  bindEvents() {
    this.ws.on('message', (msg) => {
      console.log('websocket on message');

      this.sendMessage(msg);
    });

    this.ws.on('error', (e) => {
      console.log('websocket on error:', e);
    });
  }

  sendMessage(msg) {
    console.log('send message:', msg);

    if (this.state !== 1) return;

    const msgObj = {
      data: msg,
    };

    this.ws.send(JSON.stringify(msgObj));
  }
}
