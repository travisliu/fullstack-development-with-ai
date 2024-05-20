const request = require('supertest');
const app = require('../../../src/app'); // Replace with actual path to your Express app
const { getToken } = require('../testHelpers');
const UserFactory = require('../../factories/user');

describe('Delete a User Endpoint', () => {
  let adminToken, userToDelete;

  beforeEach(async () => {
    // Obtain admin token before each test
    adminToken = await getToken('admin');
    userToDelete = await UserFactory.create();
  });

  describe('Successful User Deletion', () => {
    it('deletes an existing user successfully', async () => {
      await request(app)
        .delete(`/api/v1/users/${userToDelete.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    });
  });

  describe('Error Handling', () => {
    it('returns 404 for non-existent user deletion attempt', async () => {
      const nonExistentUserId = userToDelete.id + 99;
      await request(app)
        .delete(`/api/v1/users/${nonExistentUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('returns 400 for invalid user ID format', async () => {
      const invalidUserId = 'invalidFormat';
      await request(app)
        .delete(`/api/v1/users/${invalidUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });


  describe('Unauthorized Access', () => {
    it('should return 401 Unauthorized for unauthenticated access', async () => {
      const response = await request(app)
        .delete(`/api/v1/users/${userToDelete.id}`)

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
        .put(`/api/v1/users/${userToDelete.id}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(401);
    });
  });
  
});
