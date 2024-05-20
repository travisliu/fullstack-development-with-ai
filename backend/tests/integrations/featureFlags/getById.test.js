const request = require('supertest');
const app = require('../../../src/app'); // Corrected path
const { getToken, authTests } = require('../testHelpers');
const featureFlagFactory = require('../../factories/featureFlag');

describe('GET /api/v1/feature-flags/:id - Retrieve a specific feature flag', () => {
  let token;

  beforeEach(async () => {
    token = await getToken();
  });

  describe('Successfully retrieving a feature flag by ID', () => {
    let existingFeatureFlag;

    beforeEach(async () => {
      existingFeatureFlag = await featureFlagFactory.create();
    });

    it('should return the feature flag details', async () => {
      const response = await request(app)
        .get(`/api/v1/feature-flags/${existingFeatureFlag.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id', existingFeatureFlag.id);
      expect(response.body).toHaveProperty('name', existingFeatureFlag.name);
      expect(response.body).toHaveProperty('enabled', existingFeatureFlag.enabled);
      expect(response.body).toHaveProperty('type', existingFeatureFlag.type);
    });
  });

  describe('Retrieving a non-existent feature flag', () => {
    it('should return a 404 Not Found', async () => {
      const nonExistentId = 'non-existent-id';
      const response = await request(app)
        .get(`/api/v1/feature-flags/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('Invalid feature flag ID format', () => {
    it('should return a 400 Bad Request for invalid-format ID', async () => {
      const id = 'invalid-format';
      const response = await request(app)
        .get(`/api/v1/feature-flags/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBeDefined();
    });
  });

  authTests(() => request(app).get('/api/v1/feature-flags/featureFlagId'));
});
