const broadcastService = require('../../services/broadcastService');

class BroadcastSubscriber {
  constructor(modelName) {
    this.modelName = modelName;
  }

  /**
   * The update method that will be called by featureFlagObserver.
   * It checks the actionName and standardizes it to either 'SET' or 'DELETE',
   * then constructs a message in the required format and uses broadcastService
   * to broadcast this message to all connected WebSocket clients.
   *
   * @param {string} actionName - The name of the action that triggered the update.
   * @param {Object} context - The context object provided by featureFlagObserver, containing the responseBody.
   */
  update(actionName, context) {
    // Standardize the action name according to the specified rules.
    let messageType;
    switch (actionName) {
      case 'create':
      case 'update':
        messageType = 'SET';
        break;
      case 'delete':
        messageType = 'DELETE';
        break;
      default:
        // Optionally handle other action names or throw an error.
        console.warn(`Unhandled actionName: ${actionName}`);
        return; // Skip broadcasting if the actionName is unhandled.
    }

    // Construct the message in the specified format using the standardized action name.
    const message = JSON.stringify({
      type: messageType,
      modelName: this.modelName,
      data: context.responseBody
    });

    // console.log('=== subscriber message', message)
    // return
    // Use the broadcastService to broadcast the message to all connected clients.
    broadcastService.broadcastMessage(message);
  }
}
module.exports = BroadcastSubscriber;
