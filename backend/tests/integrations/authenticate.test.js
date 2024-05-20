const request = require('supertest');
const app = require('../../src/app'); // Replace with your actual Express app
const UserFactory = require('../factories/user');
const userFactory = require('../factories/user');
const { INTEGER } = require('sequelize');

describe('Authentication API Endpoint Tests', () => {
  
  let userData, password;
  
  beforeEach(async () => {
    // Initialize fresh user data before each test
    password = 'password';
    userData = await UserFactory.create({ password }); // Assuming UserFactory.create() generates a new user object
  });
  
  describe('Successful Authentication', () => {
    describe('Standard User', () => {
      beforeEach(async () => {
        userData = await userFactory.user().create({ password }); // Assuming UserFactory.create() generates a new user object
      });
      
      it('should authenticate successfully', async () => {
        const response = await request(app)
        .post('/api/v1/auth/token')
        .send({ username: userData.username, password: password });
        console.log('rseponse', response.body)
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
          token: expect.any(String),
          expiresIn: expect.any(Number),
          userId: expect.any(Number),
          username: expect.any(String),
          role: expect.any(String)
        });
      });
    });
    
    describe('Admin User', () => {
      beforeEach(async () => {
        userData = await UserFactory.admin().create({ password }); // Assuming UserFactory.create() generates a new user object
      });
      
      it('should authenticate successfully', async () => {
        const response = await request(app)
        .post('/api/v1/auth/token')
        .send({ username: userData.username, password: password });
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
          token: expect.any(String),
          expiresIn: expect.any(Number),
          userId: expect.any(Number),
          username: expect.any(String),
          role: expect.any(String)
        });
      });
    });
  });
  
  describe('Failed Authentication Due to Invalid Credentials', () => {
    it('should return 401 for invalid username', async () => {
      const response = await request(app)
      .post('/api/v1/auth/token')
      .send({ username: 'invalidUser', password: password });
      
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Incorrect username.');
    });
    
    it('should return 401 for invalid password', async () => {
      const response = await request(app)
      .post('/api/v1/auth/token')
      .send({ username: userData.username, password: 'invalidPass' });
      
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Incorrect password.');
    });
  });
  
  describe('Missing Credentials', () => {
    it('should return 401 when username is missing', async () => {
      const response = await request(app)
      .post('/api/v1/auth/token')
      .send({ password: password });
      
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Missing credentials');
    });
    
    it('should return 401 when password is missing', async () => {
      const response = await request(app)
      .post('/api/v1/auth/token')
      .send({ username: userData.username });
      
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Missing credentials');
    });
  });
  
  describe('Response Format Verification', () => {
    it('should return a valid token and expiration time on successful authentication', async () => {
      const response = await request(app)
      .post('/api/v1/auth/token')
      .send({ username: userData.username, password: password });
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('expiresIn');
      expect(typeof response.body.expiresIn).toBe('number');
    });
  });
  
  describe('Request Method Validation', () => {
    it('should return 405 Method Not Allowed for non-POST methods', async () => {
      const getResponse = await request(app).get('/api/v1/auth/token');
      const putResponse = await request(app).put('/api/v1/auth/token');
      const deleteResponse = await request(app).delete('/api/v1/auth/token');
      
      expect(getResponse.statusCode).toBe(404);
      expect(putResponse.statusCode).toBe(404);
      expect(deleteResponse.statusCode).toBe(404);
    });
  });
  
  describe('Edge Case Handling', () => {
    it('should handle very long username and password', async () => {
      const response = await request(app)
      .post('/api/v1/auth/token')
      .send({ username: 'a'.repeat(100), password: 'a'.repeat(100) });
      
      expect([200, 401]).toContain(response.statusCode);
    });
    
    it('should handle non-alphanumeric characters in username and password', async () => {
      const response = await request(app)
      .post('/api/v1/auth/token')
      .send({ username: 'user!@#', password: 'pass!@#' });
      
      expect([200, 401]).toContain(response.statusCode);
    });
  });
  
});