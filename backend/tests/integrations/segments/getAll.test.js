const request = require('supertest');
const app = require('../../../src/app'); // Adjust the path to your Express app
const { getToken } = require('../testHelpers');
const segmentFactory = require('../../factories/segment');

describe('GET /api/v1/segments - List all segments', () => {
  let token;

  beforeEach(async () => {
    // Get token for authorized user
    token = await getToken(); // Adjust role as needed
  });

  describe('Retrieve First Page of Segments', () => {
    beforeEach(async () => {
      // Create multiple segments for pagination and filtering tests
      await segmentFactory.createList(20); // Adjust number as needed for pagination tests
    });

    it('should return all segments with default pagination', async () => {
      const response = await request(app)
        .get('/api/v1/segments')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.segments).toHaveLength(10); // Assuming default limit is 10
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page', 1);
      expect(response.body).toHaveProperty('limit', 10);
    });

    describe('Pagination and limit', () => {
      it.each([
        { page: 1, limit: 5 },
        { page: 2, limit: 5 },
        { page: 2, limit: 10 },
      ])('should handle custom pagination with page %p and limit %p', async ({ page, limit }) => {
        const response = await request(app)
          .get(`/api/v1/segments?page=${page}&limit=${limit}`)
          .set('Authorization', `Bearer ${token}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.segments).toHaveLength(limit);
        expect(response.body.page).toBe(page);
      });
    });
  });

  // add a describe block for searching segments by name
  describe('Searching segments by name', () => {
    beforeEach(async () => {
      // Create segments for searching tests
      await segmentFactory.create({ name: 'Another name' });
      await segmentFactory.create({ name: 'Segment 1' });
      await segmentFactory.create({ name: 'Segment 2' });
      await segmentFactory.create({ name: 'Segment 3' });
      await segmentFactory.create({ name: 'Another name 2' });
    });

    it('should return segments matching the search query', async () => {
      const response = await request(app)
        .get('/api/v1/segments?query=Segment')
        .set('Authorization', `Bearer ${token}`);
      
      // log the response body to see the segments returned
      expect(response.statusCode).toBe(200);
      expect(response.body.segments).toHaveLength(3);
    });

    it('should return a 400 Bad Request for invalid pagination parameters', async () => {
      const response = await request(app)
        .get('/api/v1/segments?query=Segment&page=-1&limit=abc') // Invalid page and limit
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.statusCode).toBe(400);
    });

    it('should return an empty array if no segments are found', async () => {
      const response = await request(app)
        .get('/api/v1/segments?query=InvalidSegment')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.segments).toEqual([]);
    });

    // add a test for query length validation isLength({ min: 2, max: 50 })
    it.each([
      { query: 'a' },
      { query: 'a'.repeat(51) },
    ])('should return a 400 Bad Request for query with invalid length', async ({ query }) => {
      const response = await request(app)
        .get(`/api/v1/segments?query=${query}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.statusCode).toBe(400);
    });
  });

  it('should return an empty array if no segments are found', async () => {
    const response = await request(app)
      .get('/api/v1/segments')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.segments).toEqual([]);
  });

  it('should return 401 Unauthorized for requests with an invalid token', async () => {
    const response = await request(app)
      .get('/api/v1/segments')
      .set('Authorization', 'Bearer invalidtoken123');
    
    expect(response.statusCode).toBe(401);
  });

  it('should return a 400 Bad Request for invalid pagination parameters', async () => {
    const response = await request(app)
      .get('/api/v1/segments?page=-1&limit=abc') // Invalid page and limit
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(400);
  });
});
