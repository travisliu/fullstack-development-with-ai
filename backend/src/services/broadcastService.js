const WebSocket = require('ws');
const featureFlagService = require('./featureFlagService');
const segmentService = require('./segmentService');
const { presentFeatureFlag } = require('../presenters/featureFlagPresenter')
const { presentSegment } = require('../presenters/segmentPresenter')

/**
 * An object to manage WebSocket connections and broadcast messages to all connected clients.
 */
const broadcastService = {
  /**
   * The WebSocket.Server instance.
   * @type {WebSocket.Server}
   */
  wss: null,

  /**
   * A set to track all connected WebSocket clients.
   * @type {Set<WebSocket>}
   */
  clients: new Set(),

  /**
   * Initializes the WebSocket server and sets up connection handlers.
   * @param {http.Server} server - The HTTP server to attach the WebSocket server.
   */
  init(server) {
    console.log('=== initing  broadcast server')
    this.wss = new WebSocket.Server({ server });
    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      console.log('Client connected');

      ws.on('close', () => {
        this.clients.delete(ws);
        console.log('Client disconnected');
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });

      // Added function to send 'INIT' message upon connection
      this.sendInitMessage(ws);
    });
  },

  /**
   * Broadcasts a message to all connected clients.
   * @param {string} message - The message to broadcast.
   */
  broadcastMessage(message) {
    for (let client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  },

  /**
   * Sends 'INIT' message to the specified client.
   * @param {WebSocket} client - The WebSocket client to send the 'INIT' message to.
   */
  async sendInitMessage(client) {
    if (client.readyState !== WebSocket.OPEN) { return }

    const { featureFlags } = await featureFlagService.getAllFeatureFlags();
    const { segments } = await segmentService.getAllSegments();

    const data = {
      featureFlags: featureFlags.map(presentFeatureFlag),
      segments: segments.map(presentSegment)
    }
    const message = JSON.stringify({
      type: 'INITIAL',
      data
    });
    
    client.send(message);
  },
};

module.exports = broadcastService;
