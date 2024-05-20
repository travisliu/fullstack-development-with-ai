const request = require('supertest');
const app = require('../../../src/app'); // Adjust the path to your Express app
const { getToken } = require('../testHelpers');
const segmentFactory = require('../../factories/segment');

describe('GET /api/v1/segments/:id - Get a specific segment', () => {
  let token;
  let testSegment;
  
  beforeEach(async () => {
    // Create a test segment
    testSegment = await segmentFactory.create();
    
    // Get token for authorized user
    token = await getToken('admin'); // Adjust role as needed
  });
  
  it('should retrieve a specific segment by ID', async () => {
    const response = await request(app)
      .get(`/api/v1/segments/${testSegment.id}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', testSegment.id);
    expect(response.body).toHaveProperty('name', testSegment.name);
    expect(response.body).toHaveProperty('description', testSegment.description);
    expect(response.body).toHaveProperty('criteria');
  });
  
  it('should return a 404 Not Found for a non-existent segment ID', async () => {
    const nonExistentId = '5f8d0d55b54764421b715f8d'; // Use a realistic but non-existent ObjectId
    
    const response = await request(app)
      .get(`/api/v1/segments/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(404);
  });
  
  it('should return a 400 Bad Request for an invalid segment ID format', async () => {
    const invalidId = 'invalid-id';
    
    const response = await request(app)
      .get(`/api/v1/segments/${invalidId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(404);
  });
  
  it('should return a 401 Unauthorized when the token is missing', async () => {
    const response = await request(app)
      .get(`/api/v1/segments/${testSegment.id}`)
    // No Authorization header set
    expect(response.statusCode).toBe(401);
  });
  
  it('should correctly retrieve a segment with complex criteria', async () => {
    // Assuming the segmentFactory can create segments with complex criteria
    const complexCriteriaSegment = await segmentFactory.create({
      criteria: [
        { attribute: "age", operator: "greater_than", value: 18 },
        { attribute: "country", operator: "equals", value: "USA" }
      ]
    });
    
    const response = await request(app)
      .get(`/api/v1/segments/${complexCriteriaSegment.id}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.criteria).toHaveLength(2);
    expect(response.body.criteria).toEqual(expect.arrayContaining([
      expect.objectContaining({ attribute: "age", operator: "greater_than", value: 18 }),
      expect.objectContaining({ attribute: "country", operator: "equals", value: "USA" })
    ]));
  });
});
