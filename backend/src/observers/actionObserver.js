class ActionObserver {
  constructor() {
    this.subscribers = [];
  }

  subscribe(subscriber) {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber) {
    this.subscribers = this.subscribers.filter(sub => sub !== subscriber);
  }

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
    this.subscribers.forEach(subscriber => {
      subscriber.update(actionName, context);
    });
  }
}

module.exports = ActionObserver;