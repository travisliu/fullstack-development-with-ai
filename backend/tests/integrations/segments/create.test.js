const request = require('supertest');
const app = require('../../../src/app'); // Adjust the path to your Express app
const { getToken } = require('../testHelpers');
const segmentFactory = require('../../factories/segment');
const { body } = require('express-validator');

describe('POST /api/v1/segments - Create a new segment', () => {
  let token, newSegment; // Assume different roles have different access levels

  beforeEach(async () => {
    // Get tokens for different roles
    token = await getToken();
    newSegment = segmentFactory.build();
  });

  it('should create a new segment with valid data', async () => {
    const response = await request(app)
      .post('/api/v1/segments')
      .set('Authorization', `Bearer ${token}`)
      .send(newSegment);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toEqual(expect.any(Number))
    expect(response.body.name).toEqual(newSegment.name);
    expect(response.body.description).toEqual(newSegment.description);
    expect(response.body.criteria).toEqual(newSegment.criteria);
  });

  describe('With invalid data', () => {
    it.each`
      name          | description          | criteria
      ${''}         | ${'Valid Description'} | ${[{ attribute: 'age', operator: 'equals', value: 18 }]}
      ${'Segment'}  | ${''}                 | ${[{ attribute: 'age', operator: 'equals', value: 18 }]}
      ${'Segment'}  | ${'Valid Description'} | ${[]}
      ${'Segment'}  | ${'Valid Description'} | ${[{ attribute: '', operator: 'equals', value: 18 }]}
      ${'Segment'}  | ${'Valid Description'} | ${[{ attribute: 'age', operator: 'invalid_operator', value: 18 }]}
      ${'Segment'}  | ${'Valid Description'} | ${[{ attribute: 'age', operator: 'equals' }]}
      ${'Segment'}  | ${'Valid Description'} | ${[{ attribute: 'age', operator: 'equals', value: 18 }, { attribute: 'name' }]}
    `('should return validation errors for invalid segment data', async ({ name, description, criteria }) => {
      const response = await request(app)
        .post('/api/v1/segments')
        .set('Authorization', `Bearer ${token}`)
        .send({ name, description, criteria });

      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('Unauthorized Access', () => {
    // empty token
    it('should return 401 Unauthorized for unauthenticated access', async () => {
      const response = await request(app)
        .post('/api/v1/segments')
        .send(newSegment);
      
      expect(response.statusCode).toBe(401);
    });

    it('should return 401 Unauthorized for requests with an invalid token', async () => {
      const response = await request(app)
        .post('/api/v1/segments')
        .set('Authorization', 'Bearer invalidtoken123')
        .send(newSegment);
      
      expect(response.statusCode).toBe(401);
    });
  });
});
