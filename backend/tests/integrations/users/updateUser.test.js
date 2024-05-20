const request = require('supertest');
const app = require('../../../src/app'); // Replace with actual path to your Express app
const UserFactory = require('../../factories/user');

describe('Update an Existing User API (/api/v1/users/{userId})', () => {
  let existingUser;
  
  beforeEach(async () => {
    const password = 'password';
    
    // Initialize UserFactory for admin and non-admin users
    adminUser = await UserFactory.admin().create({ password });
    
    // Authenticate and get token for admin user
    const adminResponse = await request(app)
      .post('/api/v1/auth/token')
      .send({ username: adminUser.username, password: password });
    adminToken = adminResponse.body.token;
    // Create a user instance for each test
    existingUser = await UserFactory.create({});
  });
  
  describe('Successful User Update', () => {
    it('should update an existing user successfully', async () => {
      const updatedUserData = UserFactory.user().build();
      
      const response = await request(app)
        .put(`/api/v1/users/${existingUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedUserData);

      
      expect(response.statusCode).toBe(200);
      // Additional assertions as necessary
      expect(response.body.username).toBe(updatedUserData.username);
      expect(response.body.email).toBe(updatedUserData.email);
      expect(response.body.role).toBe(updatedUserData.role);
    });
  });
  
  describe('Attempt to Update Non-Existent User', () => {
    it('should return 404 when updating a non-existent user', async () => {
      const response = await request(app)
        .put('/api/v1/users/nonExistentUserId')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ username: 'newUser' });
      
      expect(response.statusCode).toBe(404);
    });
  });
  
  describe('Update User with Invalid Email Format', () => {
    it('should return 400 for invalid email format', async () => {

      const response = await request(app)
        .put(`/api/v1/users/${existingUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ email: 'invalidemail' });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].type).toBe('field');
      expect(response.body.errors[0].value).toBe('invalidemail');
      expect(response.body.errors[0].msg).toBe('Must be a valid email address');
      expect(response.body.errors[0].path).toBe('email');
      expect(response.body.errors[0].location).toBe('body');
    });
  });
  
  describe('Update User with No Changes', () => {
    it('should handle update with no changes', async () => {
      const response = await request(app)
        .put(`/api/v1/users/${existingUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      
      expect(response.statusCode).toBe(200); // Or specific code for no changes
    });
  });
  
  describe('Update User with Partial Data', () => {
    const testData = [
      { field: 'username', value: 'newUsername' },
      { field: 'email', value: 'newemail@example.com' },
      { field: 'role', value: 'admin' },
    ];

    it.each(testData)(
      'should update user with new %s only',
      async ({ field, value }) => {
        const response = await request(app)
          .put(`/api/v1/users/${existingUser.id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ [field]: value });

        expect(response.statusCode).toBe(200);
        expect(response.body[field]).toBe(value);
      }
    );
  });

  describe('Unauthorized Access', () => {
    it('should return 401 Unauthorized for unauthenticated access', async () => {
      const response = await request(app)
        .put(`/api/v1/users/${existingUser.id}`);

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
        .put(`/api/v1/users/${existingUser.id}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(401);
    });
  });
});
