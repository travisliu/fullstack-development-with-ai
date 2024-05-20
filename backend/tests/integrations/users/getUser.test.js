const request = require('supertest');
const app = require('../../../src/app'); // Replace with actual path to your Express app
const UserFactory = require('../../factories/user');
const { User } = require('../../../src/models');

describe('Get a Specific User API Endpoint', () => {
  let adminToken, adminUser, nonAdminUser, testUser, pass;

  beforeEach(async () => {
    password = 'password';

    // Initialize UserFactory for admin and non-admin users
    adminUser = await UserFactory.admin().create({ password});
    nonAdminUser = await UserFactory.user().create({ password });
    testUser = await UserFactory.create();

    // Authenticate and get token for admin user
    const adminResponse = await request(app)
      .post('/api/v1/auth/token')
      .send({ username: adminUser.username, password: password });
    adminToken = adminResponse.body.token;
  });

  describe('Successful Retrieval of a Specific User', () => {
    it('should return a 200 OK with the user data', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${testUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.userId).toBe(testUser.id);
      expect(response.body.email).toBe(testUser.email);
      expect(response.body.role).toBe(testUser.role);
    });
  });

  describe('Unauthorized and Forbidden Access', () => {
    it('should return a 401 Unauthorized for unauthenticated user', async () => {
      const response = await request(app)
        .get(`/api/v1/users/${testUser.id}`);
      
      expect(response.status).toBe(401);
    });

    it('should return a 403 Forbidden for non-admin user', async () => {
      const nonAdminResponse = await request(app)
        .post('/api/v1/auth/token')
        .send({ username: nonAdminUser.username, password: password });
      const nonAdminToken = nonAdminResponse.body.token;

      const response = await request(app)
        .get(`/api/v1/users/${testUser.id}`)
        .set('Authorization', `Bearer ${nonAdminToken}`);
      
      expect(response.status).toBe(403);
    });
  });

  describe('Invalid or Expired JWT Token', () => {
    it('should return a 401 Unauthorized for an invalid or expired JWT token', async () => {
      const invalidToken = 'invalid_token';

      const response = await request(app)
        .get(`/api/v1/users/${testUser.id}`)
        .set('Authorization', `Bearer ${invalidToken}`);

      expect(response.status).toBe(401);
    });
  });

  describe('User Not Found', () => {
    it('should return 404 Not Found for a non-existing userId', async () => {
      const response = await request(app)
        .get(`/api/v1/users/nonExistingUserId`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(404);
    });

    it('should return 404 Not Found for a user that has recently been deleted', async () => {
      await User.destroy({where: { id: testUser.id }});
      const response = await request(app)
        .get(`/api/v1/users/${testUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(404);
    });
  });
});
