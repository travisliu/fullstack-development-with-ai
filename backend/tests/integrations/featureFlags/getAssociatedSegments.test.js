const request = require('supertest');
const app = require('../../../src/app'); // Corrected path
const { getToken, authTests } = require('../testHelpers');
const featureFlagFactory = require('../../factories/featureFlag');

describe('GET /api/v1/feature-flags/:featureFlagId/segments - Retrieve segments associated with a feature flag', () => {
  let token, featureFlag, segments;

  beforeEach(async () => {
    token = await getToken();
    // Create a feature flag and segments for testing
    featureFlag = await (await featureFlagFactory.withSegments()).create();
    segments = await featureFlag.getSegments(); 
  });

  describe('Successfully retrieving segments associated with a feature flag', () => {
    it('should return all associated segments', async () => {
      const response = await request(app)
        .get(`/api/v1/feature-flags/${featureFlag.id}/segments`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(
        response.body.segments.map(segment => segment.id)
      ).toEqual(
        expect.arrayContaining(segments.map(segment => segment.id)
      ));
    });
  });

  describe('Feature flag with no associated segments', () => {
    let featureFlagWithNoSegments;

    beforeEach(async () => {
      featureFlagWithNoSegments = await featureFlagFactory.create();
      // Ensure this feature flag has no associated segments
    });

    it('should indicate no segments are associated', async () => {
      const response = await request(app)
        .get(`/api/v1/feature-flags/${featureFlagWithNoSegments.id}/segments`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.segments).toEqual([]); // Assuming the API returns an empty array for no segments
    });
  });

  describe('Invalid feature flag ID', () => {
    it('should return an error for invalid feature flag ID', async () => {
      const invalidFeatureFlagId = 'invalid-id';
      const response = await request(app)
        .get(`/api/v1/feature-flags/${invalidFeatureFlagId}/segments`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(500); // Adjust based on your API's error handling
      expect(response.body.message).toBeDefined();
    });
  });

  describe('Non-existent feature flag', () => {
    it('should return an error for non-existent feature flag', async () => {
      const nonExistentFeatureFlagId = 'non-existent-id';
      const response = await request(app)
        .get(`/api/v1/feature-flags/${nonExistentFeatureFlagId}/segments`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBeDefined();
    });
  });

  authTests(() => request(app).get(`/api/v1/feature-flags/${featureFlag.id}/segments`));
});
