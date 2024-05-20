const broadcastService = require('../services/broadcastService');

const featureFlagUpdateBroadcaster = {
  /**
   * Notifies the observer about an action, providing context about the request and response.
   *
   * @param {string} action - The name or type of the action that triggered the notification. This could be
   *                          a descriptive string indicating what was being attempted when the error occurred.
   * @param {Object} context - An object containing details about the request and response that led to the notification.
   * @param {Object} context.query - The query parameters of the request, as an object of key-value pairs.
   * @param {Object} context.params - The route parameters of the request, as an object of key-value pairs.
   * @param {Object} context.body - The body of the request, which could be any data type that the request was sending.
   * @param {Object} context.responseBody - The body of the response, intended to provide additional context about
   *                                        the response received before the notification was triggered. Its structure
   *                                        can vary depending on the response content type and data.
   * @returns {void} Does not return a value.
   */
  notify(actionName, context) {
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
      data: context.responseBody
    });

    console.log('featureFlagUpdateBroadcaster', message)
    // Use the broadcastService to broadcast the message to all connected clients.
    broadcastService.broadcastMessage(message);
  }
};

module.exports = featureFlagUpdateBroadcaster;