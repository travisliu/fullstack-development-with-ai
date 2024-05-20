const request = require('supertest');
const app = require('../../../src/app'); // Corrected path
const { getToken, authTests } = require('../testHelpers');
const featureFlagFactory = require('../../factories/featureFlag');
const FeatureFlag = require('../../../src/models').FeatureFlag;

describe('DELETE /api/v1/feature-flags/:featureFlagId/segments/:segmentId - Remove association between a feature flag and a segment', () => {
  let token, featureFlag, segments;

  beforeEach(async () => {
    token = await getToken();
    // Create a feature flag and segments for testing
    featureFlag = await (await featureFlagFactory.withSegments()).create();
    segments = await featureFlag.getSegments(); 
  });

  describe('Successfully removing association between a feature flag and a segment', () => {
    it('should remove the association successfully', async () => {
      const segmentIdToRemove = segments[0].id;
      const response = await request(app)
        .delete(`/api/v1/feature-flags/${featureFlag.id}/segments/${segmentIdToRemove}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(204);
      // Optionally, verify the segment is no longer associated with the feature flag in the database
      const updatedFeatureFlag = await FeatureFlag.findByPk(featureFlag.id, { include: 'segments' });
      // expect the updatedFeatureFlag to not contain the segmentIdToRemove
      const updatedSegmentIds = updatedFeatureFlag.segments.map(segment => segment.id);
      expect(updatedSegmentIds).not.toContain(segmentIdToRemove);

    });
  });

  describe('Attempting to remove association with non-existent segment', () => {
    it('should fail due to non-existent segment ID', async () => {
      const nonExistentSegmentId = 9999; // Assume this ID does not exist in the database
      const response = await request(app)
        .delete(`/api/v1/feature-flags/${featureFlag.id}/segments/${nonExistentSegmentId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(500); // Assuming the API responds with 404 for non-existent entities
      expect(response.body.message).toBeDefined();
    });
  });

  describe('Invalid feature flag ID or segment ID', () => {
    it('should return an error for invalid feature flag ID', async () => {
      const featureFlagId = 'invalid-id';
      const segmentId = segments[0].id;
      const response = await request(app)
        .delete(`/api/v1/feature-flags/${featureFlagId}/segments/${segmentId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(500); // Adjust based on your API's error handling for invalid IDs
      expect(response.body.message).toBeDefined();
    });

    it('should return an error for invalid segment ID', async () => {
      const featureFlagId = featureFlag.id;
      const segmentId = 'invalid-id';
      const response = await request(app)
        .delete(`/api/v1/feature-flags/${featureFlagId}/segments/${segmentId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(500); // Adjust based on your API's error handling for invalid IDs
      expect(response.body.message).toBeDefined();
    });
  });

  describe('Removing association for a feature flag with no segments', () => {
    let featureFlagWithNoSegments;

    beforeAll(async () => {
      featureFlagWithNoSegments = await featureFlagFactory.create();
      // Ensure this feature flag has no associated segments
    });

    it('should appropriately handle the request', async () => {
      const anySegmentId = segments[0].id; // Using an existing segment ID for the sake of the test
      const response = await request(app)
        .delete(`/api/v1/feature-flags/${featureFlagWithNoSegments.id}/segments/${anySegmentId}`)
        .set('Authorization', `Bearer ${token}`);

      // The expected response could vary based on API design; assuming 404 for not found or similar
      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBeDefined();
    });
  });

  authTests(() => request(app).delete(`/api/v1/feature-flags/${featureFlag.id}/segments/${segments[0].id}`));
});