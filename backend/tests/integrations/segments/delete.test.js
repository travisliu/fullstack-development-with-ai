const request = require('supertest');
const app = require('../../../src/app'); // Adjust the path to your Express app
const { getToken } = require('../testHelpers');
const segmentFactory = require('../../factories/segment');
const { Segment } = require('../../../src/models');


describe('DELETE /api/v1/segments/:id - Delete a segment', () => {
  let token, testSegment;

  beforeEach(async () => {
    token = await getToken();

    // Create a segment to be deleted
    testSegment = await segmentFactory.create();
  });

  it('should successfully delete a segment', async () => {
    const response = await request(app)
      .delete(`/api/v1/segments/${testSegment.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(204);

    await expect(testSegment.reload()).rejects.toThrowError('Instance could not be reloaded because it does not exist anymore (find call returned null)');
  });

  it('should return a 404 Not Found when trying to delete a non-existent segment', async () => {
    const nonExistentSegmentId = testSegment.id + 999; // Example of a non-existent ID

    const response = await request(app)
      .delete(`/api/v1/segments/${nonExistentSegmentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
  });

  it('should return a 403 Forbidden when a user with insufficient permissions attempts to delete a segment', async () => {
    const response = await request(app)
      .delete(`/api/v1/segments/${testSegment._id}`)
      .set('Authorization', `Bearer invalidtoken123`);

    expect(response.statusCode).toBe(401);
  });
});
