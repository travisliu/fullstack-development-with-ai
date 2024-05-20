const db = require('./src/models');
// const { afterEach } = require('jest');

// jest.setup.js
afterEach(async () => {
  await db.sequelize.truncate({ logging: false });
});