const request = require('supertest');
const app = require('../../../src/app');
const { getToken, authTests } = require('../testHelpers');
const featureFlagFactory = require('../../factories/featureFlag');

describe('PUT /api/v1/feature-flags/:id - Update an existing feature flag', () => {
  let token;
  let existingFeatureFlag;

  beforeEach(async () => {
    token = await getToken('admin');
    // Assuming creation of a feature flag for update tests
    existingFeatureFlag = (await featureFlagFactory.create()).toJSON();
  });

  describe('Successfully updating a feature flag', () => {
    const updateData = {
      name: 'updatedFeature',
      enabled: false,
      type: 'experimental',
      segments: [3]
    };

    it('should update the feature flag and return its details', async () => {
      const response = await request(app)
        .put(`/api/v1/feature-flags/${existingFeatureFlag.id}`)
        .send(updateData)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id', existingFeatureFlag.id);
      expect(response.body).toHaveProperty('name', updateData.name);
      expect(response.body).toHaveProperty('enabled', updateData.enabled);
      expect(response.body).toHaveProperty('type', updateData.type);
    });
  });

  describe('Updating a feature flag with missing or invalid fields', () => {
    it.each([
      { field: 'name', value: '', message: 'Name must not be empty.' },
      { field: 'enabled', value: null, message: 'Enabled must be a boolean value.' },
      { field: 'type', value: 'invalid', message: 'Type must be one of the following values: release, experimental, operational.' },
      { field: 'segments', value: ['a', 'b'], message: 'Each segment ID must be an integer.' }
    ])('should return a 400 Bad Request for invalid $field', async ({ field, value, message }) => {
      existingFeatureFlag[field] = value;

      const response = await request(app)
        .put(`/api/v1/feature-flags/${existingFeatureFlag.id}`)
        .send(existingFeatureFlag)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.errors.map(error => error.msg)).toContain(message);
    });
  });

  describe('Attempting to update a non-existent feature flag', () => {
    it('should return a 500 error', async () => {
      const nonExistentId = existingFeatureFlag.id + 999;
      const response = await request(app)
        .put(`/api/v1/feature-flags/${nonExistentId}`)
        .send(existingFeatureFlag)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBeDefined();
    });
  });

  authTests(() => request(app).put('/api/v1/feature-flags/featureFlagId'));
});
