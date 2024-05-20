const request = require('supertest');
const app = require('../../../src/app');
const { getToken, authTests } = require('../testHelpers');
const featureFlagFactory = require('../../factories/featureFlag');
const { FeatureFlag } = require('../../../src/models');

describe('DELETE /api/v1/feature-flags/:id - Delete a feature flag', () => {
  let token;
  let featureFlagToDelete;

  beforeEach(async () => {
    token = await getToken('admin');
    // Create a feature flag to delete
    featureFlagToDelete = await featureFlagFactory.create();
  });

  describe('Successfully deleting a feature flag', () => {
    it('should delete the feature flag and return a 204 status code', async () => {
      const response = await request(app)
        .delete(`/api/v1/feature-flags/${featureFlagToDelete.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(204);

      // verify the feature flag is actually deleted from the database
      expect(FeatureFlag.findByPk(featureFlagToDelete.id)).resolves.toBeNull();
    });
  });

  describe('Attempting to delete a non-existent feature flag', () => {
    it('should return a 500 error when the feature flag does not exist', async () => {
      const nonExistentId = featureFlagToDelete.id + 999;
      const response = await request(app)
        .delete(`/api/v1/feature-flags/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('Invalid feature flag ID format', () => {
    it.each([
      { id: 'invalid-format', statusCode: 500, description: 'Invalid format' },
      { id: '', statusCode: 404, description: 'Empty string' }
    ])('should return error messages for $description ID', async ({ id, statusCode }) => {
      const response = await request(app)
        .delete(`/api/v1/feature-flags/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(statusCode);
    });
  });

  authTests(() => request(app).delete(`/api/v1/feature-flags/${featureFlagToDelete.id}`));
});