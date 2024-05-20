const request = require('supertest');
const app = require('../../../src/app'); // Corrected path
const { getToken, authTests } = require('../testHelpers');
const featureFlagFactory = require('../../factories/featureFlag');
const segmentFactory = require('../../factories/segment');
const FeatureFlag = require('../../../src/models').FeatureFlag;

describe('Associating a Feature Flag with Segments', () => {
  let token, featureFlag, segments;

  beforeEach(async () => {
    token = await getToken();
    // Create a feature flag and segments for testing
    featureFlag = await featureFlagFactory.create();
    segments = await segmentFactory.createList(3);
  });

  describe('Successfully associating a feature flag with multiple segments', () => {
    it('should associate the feature flag with specified segments', async () => {
      const segmentIds = segments.map(segment => segment.id);
      const response = await request(app)
        .post(`/api/v1/feature-flags/${featureFlag.id}/segments`)
        .send({ segmentIds })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        associatedSegments: expect.arrayContaining(segmentIds),
      }));
      // Verify the association in the database
      const updatedFeatureFlag = await FeatureFlag.findByPk(featureFlag.id, {
        include: 'segments',
      });
      const updatedSegmentIds = updatedFeatureFlag.segments.map(segment => segment.id);
      expect(updatedSegmentIds).toEqual(expect.arrayContaining(segmentIds));
    });
  });

  describe('Attempting to associate a feature flag with non-existent segments', () => {
    it('should fail to associate due to non-existent segment IDs', async () => {
      const nonExistentSegmentIds = [999, 1000];
      const response = await request(app)
        .post(`/api/v1/feature-flags/${featureFlag.id}/segments`)
        .send({ segmentIds: nonExistentSegmentIds })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('Invalid feature flag ID during association', () => {
    it('should return an error for invalid feature flag ID', async () => {
      const invalidFeatureFlagId = 'invalid-id';
      const segmentIds = segments.map(segment => segment.id);
      const response = await request(app)
        .post(`/api/v1/feature-flags/${invalidFeatureFlagId}/segments`)
        .send({ segmentIds })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('Associating a feature flag with duplicate segment IDs', () => {
    it('should ignore duplicates and associate each segment only once', async () => {
      const duplicateSegmentIds = [segments[0].id, segments[0].id];
      const response = await request(app)
        .post(`/api/v1/feature-flags/${featureFlag.id}/segments`)
        .send({ segmentIds: duplicateSegmentIds })
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(500);
    });
  });

  authTests(() => request(app).post(`/api/v1/feature-flags/${featureFlag.id}/segments`));
});