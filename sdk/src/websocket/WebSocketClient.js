// src/websocket/WebSocketClient.js

const WebSocket = require('ws');

class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.messageListeners = [];
  }

  /**
   * Connects to the WebSocket server.
   */
  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      // Here you could also automatically subscribe to certain messages or perform initial handshakes.
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onmessage = (event) => {
      this.handleMessage(event.data);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed', event.reason);
      // Here you could implement reconnection logic if necessary.
    };
  }

  /**
   * Sends a message to the server.
   * @param {Object} message - The message to send.
   */
  sendMessage(message) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open. Message not sent.');
    }
  }

  /**
   * Registers a callback to be called when a message is received.
   * @param {Function} callback - The callback to register.
   */
  onMessage(callback) {
    this.messageListeners.push(callback);
  }

  /**
   * Handles incoming messages and calls registered callbacks.
   * @param {string} data - The raw message data received from the server.
   */
  handleMessage(data) {
    const message = JSON.parse(data);
    this.messageListeners.forEach((listener) => listener(message));
  }

  /**
   * Closes the WebSocket connection.
   */
  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

module.exports = WebSocketClient;