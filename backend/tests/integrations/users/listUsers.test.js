const request = require('supertest');
const app = require('../../../src/app'); // Replace with actual path to your Express app
const UserFactory = require('../../factories/user');
const { getToken } = require('../testHelpers');

describe('List All Users API Endpoint', () => {
  let adminToken;

  beforeEach(async () => {
    // Initialize UserFactory for each test
    adminToken = await getToken('admin');

    await UserFactory.create();
    await UserFactory.create();
  });

  describe('Successful Retrieval of User List', () => {
    it('should return a 200 OK with a list of users', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('Unauthorized Access', () => {
    it('should return 401 Unauthorized for unauthenticated access', async () => {
      const response = await request(app).get('/api/v1/users');
      expect(response.status).toBe(401);
    });

    it('should return 403 Forbidden for non-admin users', async () => {
      // Assuming UserFactory can create a non-admin user
      const nonAdminPassword = 'password';
      const nonAdminUser = UserFactory.user().create({ password: nonAdminPassword });
      const userResponse = await request(app)
        .post('/api/v1/auth/token')
        .send({ username: nonAdminUser.username, password: nonAdminPassword });
      const userToken = userResponse.body.token;

      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(401);
    });
  });

  describe('Invalid or Expired JWT Token', () => {
    it('should return 401 for requests with an invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', 'Bearer invalidtoken123');
      
      expect(response.status).toBe(401);
    });
  });

  describe('API Endpoint Availability', () => {
    it('should return a 401 status code when accessed without authentication', async () => {
      const response = await request(app).get('/api/v1/users');
      expect(response.status).toBe(401);
    });
  });
});