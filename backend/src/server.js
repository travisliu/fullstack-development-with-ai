// src/server.js
const app = require('./app');
const broadcastService = require('./services/broadcastService');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

broadcastService.init(server);
