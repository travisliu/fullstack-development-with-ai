// Adjusted require paths based on the provided example
const request = require('supertest');
const app = require('../../../src/app'); // Adjusted path to the app
const { getToken, authTests } = require('../testHelpers'); // Adjusted path to testHelpers
const userFactory = require('../../factories/user'); // Adjusted path to user factory

describe('Create a New User API Endpoint Integration Tests', () => {
  let token;

  beforeEach(async () => {
    // Assume admin token is required to create a new user
    token = await getToken('admin');
  });

	describe('Scenario 1: Successful User Creation', () => {
		it.each([
			{ role: 'admin' },
			{ role: 'user' }
		])('should create a user with valid data for role %s', async ({ role }) => {
			const newUser = userFactory.build({ role });
			const response = await request(app)
				.post('/api/v1/users')
				.set('Authorization', `Bearer ${token}`)
				.send(newUser);

			expect(response.statusCode).toBe(201);
			expect(response.body).toHaveProperty('userId');
			expect(response.body).toHaveProperty('username', newUser.username);
			expect(response.body).toHaveProperty('email', newUser.email);
			expect(response.body).toHaveProperty('role', newUser.role);
		});
	});

	// Scenario 2: Handling of Missing Required Fields
	describe('Scenario 2: Handling of Missing Required Fields', () => {
		it.each([
			['username', 'Username is required'],
			['email', 'Email is required'],
			['password', 'Password is required'],
			['role', 'Role is required'],
		])('should return a 400 error when %s is missing', async (field, expectedMessage) => {
			const userData = userFactory.build();
			const { [field]: omitted, ...partialData } = userData; // Omit one required field at a time
			const response = await request(app)
				.post('/api/v1/users')
				.set('Authorization', `Bearer ${token}`)
				.send(partialData);

			expect(response.statusCode).toBe(400);
			expect(response.body.success).toBe(false);
			expect(response.body.errors).toContainEqual(
				expect.objectContaining({
					type: 'field',
					msg: expectedMessage,
					path: field,
					location: 'body'
				})
			);
		});
	});

	// Scenario 3: Handling of Invalid Data Formats and Length
	describe('Scenario 3: Handling of Invalid Data Formats and Length', () => {
		it.each([
			{ field: 'username', value: 'us', errors: [{ msg: 'Username must be at least 3 characters long', path: 'username' }] },
			{ field: 'email', value: 'notanemail', errors: [{ msg: 'Must be a valid email address', path: 'email' }] },
			{ field: 'password', value: 'pass5', errors: [{ msg: 'Password must be at least 6 characters long', path: 'password' }] },
			{ field: 'role', value: 'unknown', errors: [{ msg: 'Role must be either "admin" or "user"', path: 'role' }] },
		])('should return a 400 error when $field is invalid', async ({ field, value, errors }) => {
			const userData = userFactory.build({ [field]: value });
			const response = await request(app)
				.post('/api/v1/users')
				.set('Authorization', `Bearer ${token}`)
				.send(userData);

			expect(response.statusCode).toBe(400);
			expect(response.body.success).toBe(false);
			
			errors.forEach(error => {
				expect(response.body.errors).toContainEqual(
					expect.objectContaining({
						msg: error.msg,
						path: error.path,
						location: 'body'
					})
				);
			});
		});
	});

  authTests(() => request(app).post('/api/v1/users').send({}));
});

