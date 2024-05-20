function decorateActions(controller, observer, actions) {
  actions.forEach(action => {
    const originalAction = controller[action];

    controller[action] = async (req, res, next) => {
      let responseBody = '{}'; // Initialize an empty object to capture response JSON

      // Capture the original send method
      const originalJSON = res.json.bind(res);
      res.json = (body) => {
        responseBody = body;
        return originalJSON(body);
      };

      res.on('finish', () => {
        if (res.statusCode < 200 &&  res.statusCode >= 300) { return }

        const { query, params, body } = req
        const context = {
          query, params, body, responseBody
        }
        observer.notify(action, context)
      });
      
      await originalAction(req, res, next);
    }
  });
}

module.exports = decorateActions;
