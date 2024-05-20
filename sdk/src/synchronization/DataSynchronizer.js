// src/synchronization/DataSynchronizer.js

class DataSynchronizer {
  constructor(localStorageManager) {
    this.localStorageManager = localStorageManager;
  }

  /**
   * Synchronizes data based on the message received from the WebSocket connection.
   * @param {Object} message - The message received from the server.
   */
  synchronize(message) {
    const { type, modelName, data } = message;

    switch (type) {
      case 'INITIAL':
        this.handleInitialMessage(data);
        break;
      case 'SET':
        this.handleSetMessage(modelName, data);
        break;
      case 'DELETE':
        this.handleDeleteMessage(modelName, data);
        break;
      default:
        console.error(`Unsupported message type: ${type}`);
    }
  }

  /**
   * Handles the INITIAL message type to bulk update local storage with the current state.
   * @param {Object} data - The data payload from the INITIAL message.
   */
  handleInitialMessage(data) {
    const { featureFlags, segments } = data;
    this.localStorageManager.setAllFeatureFlags(featureFlags);
    this.localStorageManager.setAllSegments(segments);
  }

  /**
   * Handles the SET message type to update or add a specific feature flag or segment.
   * @param {String} modelName - The model type being updated (FeatureFlag or Segment).
   * @param {Object} data - The data payload from the SET message.
   */
  handleSetMessage(modelName, data) {
    if (modelName === 'FeatureFlag') {
      this.localStorageManager.upsertFeatureFlag(data);
    } else if (modelName === 'Segment') {
      this.localStorageManager.upsertSegment(data);
    } else {
      console.error(`Unsupported model name: ${modelName}`);
    }
  }

  /**
   * Handles the DELETE message type to remove a specific feature flag or segment.
   * @param {String} modelName - The model type being deleted (FeatureFlag or Segment).
   * @param {Object} data - The data payload from the DELETE message.
   */
  handleDeleteMessage(modelName, data) {
    if (modelName === 'FeatureFlag') {
      this.localStorageManager.deleteFeatureFlag(data.id);
    } else if (modelName === 'Segment') {
      this.localStorageManager.deleteSegment(data.id);
    } else {
      console.error(`Unsupported model name: ${modelName}`);
    }
  }
}

module.exports = DataSynchronizer;
