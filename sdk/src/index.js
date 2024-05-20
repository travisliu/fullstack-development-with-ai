// src/index.js

const WebSocketClient = require('./websocket/WebSocketClient');
const LocalStorageManager = require('./storage/LocalStorageManager');
const DataSynchronizer = require('./synchronization/DataSynchronizer');
const FeatureEvaluator = require('./evaluation/FeatureEvaluator');

class FeatureFlagSDK {
  constructor({ serverUrl }) {
    this.serverUrl = serverUrl;
    this.webSocketClient = new WebSocketClient(serverUrl);
    this.localStorageManager = new LocalStorageManager();
    this.dataSynchronizer = new DataSynchronizer(this.localStorageManager);
    this.featureEvaluator = new FeatureEvaluator();

    this.init();
  }

  /**
   * Initializes the SDK by establishing a WebSocket connection
   * and setting up listeners for data synchronization.
   */
  init() {
    this.webSocketClient.onMessage((message) => {
      this.dataSynchronizer.synchronize(message);
    });

    this.webSocketClient.connect();
  }

  /**
   * Evaluates whether a feature flag is enabled for a given user.
   * @param {String} featureFlagName - The name of the feature flag to evaluate.
   * @param {Object} userAttributes - Attributes of the user for feature flag evaluation.
   * @returns {Boolean} - True if the feature flag is enabled for the user, else false.
   */
  isFeatureEnabled(featureFlagName, userAttributes) {
    const featureFlag = this.localStorageManager.getFeatureFlag(featureFlagName);
    const segmentsMap = this.localStorageManager.getSegmentsMap();
    if (!featureFlag) {
      console.warn(`Feature flag ${featureFlagName} not found.`);
      return false;
    }

    return this.featureEvaluator.evaluate(featureFlag, userAttributes, segmentsMap);
  }
}

module.exports = FeatureFlagSDK;
