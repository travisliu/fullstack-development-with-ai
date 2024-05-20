// testHelpers.js
const request = require('supertest');
const UserFactory = require('../factories/user');
const app = require('../../src/app'); // path to your Express app

/**
 * Get token for a user with a specific role.
 * @file testHelpers.js
 * @memberof testHelpers
 * @name getToken
 * @param {string} role - The role of the user.
 * @param {string} [password='defaultPassword'] - The password of the user.
 * @returns {Promise<string>} The token for the user.
 */
async function getToken(role, password = 'defaultPassword') {
  let userParams = { password };
  if (role) userParams = { ...userParams, role }; 

  const user = await UserFactory.create(userParams);
  const response = await request(app)
    .post('/api/v1/auth/token')
    .send({ username: user.username, password: password });

  return response.body.token;
}

/**
 * @memberof module:my-node-app/tests/integrations/testHelpers
 * @name authTests
 * @function
 * @description Helper function for testing unauthorized access.
 * @param {Function} makeRequest - The function to make the request.
 */
const authTests = (makeRequest) => {
  describe('Unauthorized Access', () => {
    it('should return 401 Unauthorized for unauthenticated access', async () => {
      const response = await makeRequest();
      expect(response.statusCode).toBe(401);
    });

    it('should return 401 Unauthorized for requests with an invalid token', async () => {
      const response = await makeRequest().set('Authorization', 'Bearer invalidtoken123');
      expect(response.statusCode).toBe(401);
    });
  });
}

module.exports = {
  getToken,
  authTests,
};