const request = require('supertest');
const app = require('../../../src/app');
const { getToken, authTests } = require('../testHelpers');
const featureFlagFactory = require('../../factories/featureFlag');

describe('POST /api/v1/feature-flags - Create a new feature flag', () => {
  let token, newFeatureFlagData;

  beforeEach(async () => {
    token = await getToken('admin');
    const featureFlag = await (await featureFlagFactory.withSegments()).build();
    newFeatureFlagData = {
      ...featureFlag,
      segments: featureFlag.segments.map(segment => segment.id)
    };
  });

  describe('Successfully creating a new feature flag', () => {
    it('should create a feature flag and return its details', async () => {
      const response = await request(app)
        .post('/api/v1/feature-flags')
        .send(newFeatureFlagData)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', newFeatureFlagData.name);
      expect(response.body).toHaveProperty('enabled', newFeatureFlagData.enabled);
      expect(response.body).toHaveProperty('type', newFeatureFlagData.type);
    });
  });

  describe('Creating a feature flag with missing or invalid fields', () => {
    it.each([
      { field: 'name', value: '', message: 'Name must not be empty.' },
      { field: 'enabled', value: null, message: 'Enabled must be a boolean value.' },
      { field: 'type', value: 'invalid', message: 'Type must be one of the following values: release, experimental, operational.' },
      { field: 'segments', value: ['a', 'b'], message: 'Each segment ID must be an integer.' }
    ])('should return a 400 Bad Request when $field is invalid', async ({ field, value, message }) => {
      const featureFlagData = {
        name: 'newFeature',
        enabled: true,
        type: 'release',
        segments: [1, 2]
      };
      featureFlagData[field] = value;

      const response = await request(app)
        .post('/api/v1/feature-flags')
        .send(featureFlagData)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.errors.map(error => error.msg)).toContain(message);
    });
  });

  authTests(() => request(app).post('/api/v1/feature-flags').send(newFeatureFlagData));
});
