const request = require('supertest');
const app = require('../../../src/app'); // Corrected path
const { getToken, authTests } = require('../testHelpers');
const featureFlagFactory = require('../../factories/featureFlag');

describe('GET /api/v1/feature-flags - List all feature flags with pagination', () => {
  let token;
  
  beforeEach(async () => {
    token = await getToken();
  });
  
  describe('Successfully listing feature flags with pagination', () => {
    beforeEach(async () => {
      await featureFlagFactory.createList(3);
    });
    
    it('should return the first page of feature flags', async () => {
      const response = await request(app)
      .get('/api/v1/feature-flags?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.items).toHaveLength(2);

      const firstItem = response.body.items[0];
      expect(firstItem).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        enabled: expect.any(Boolean),
        segments: [],
        type: expect.any(String),
      });
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(2);
    });
  });

  // add a describe block for searching feature flags by name
  describe('Searching feature flags by name', () => {
    beforeEach(async () => {
      // Create feature flags for searching tests
      await featureFlagFactory.create({ name: 'Another name' });
      await featureFlagFactory.create({ name: 'FeatureFlag 1' });
      await featureFlagFactory.create({ name: 'FeatureFlag 2' });
      await featureFlagFactory.create({ name: 'FeatureFlag 3' });
      await featureFlagFactory.create({ name: 'Another name 2' });
    });

    it('should return feature flags matching the search query', async () => {
      const response = await request(app)
        .get('/api/v1/feature-flags?query=FeatureFlag')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.items).toHaveLength(3);
      expect(response.body.total).toBe(1);
    });

    it('should return an empty list for non-matching search query', async () => {
      const response = await request(app)
        .get('/api/v1/feature-flags?query=NonMatching')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.items).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });

    it('should return a 400 Bad Request for invalid pagination parameters', async () => {
      const response = await request(app)
        .get('/api/v1/feature-flags?query=FeatureFlag&page=-1&limit=abc') // Invalid page and limit
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toHaveLength(1);
    });

    // add a test for validator of query length between 2 and 50
    it.each([
      { query: 'a' },
      { query: 'a'.repeat(51) },
    ])('should return a 400 Bad Request for query with invalid length', async ({ query }) => {
      const response = await request(app)
        .get(`/api/v1/feature-flags?query=${query}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toHaveLength(1);
    });
  });
  
  describe('Pagination edge cases', () => {
    beforeEach(async () => {
      await featureFlagFactory.createList(5);
    });
    
    it.each`
    page | limit | expectedItems | expectedTotal
    ${1} | ${5}  | ${5}          | ${1}
    ${2} | ${5}  | ${0}          | ${1}
    `('should return the correct page, limit, items, and total (page: $page, limit: $limit)', async ({ page, limit, expectedItems, expectedTotal }) => {
      const response = await request(app)
      .get(`/api/v1/feature-flags?page=${page}&limit=${limit}`)
      .set('Authorization', `Bearer ${token}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.page).toBe(page);
      expect(response.body.limit).toBe(limit);
      expect(response.body.items).toHaveLength(expectedItems);
      expect(response.body.total).toBe(expectedTotal);
    });
    
    it.each`
    page | limit
    ${-1} | ${5}
    ${1} | ${-5}
    ${1} | ${100}
    ${'abc'} | ${5}
    ${1} | ${'xyz'}
    `('should return 400 for invalid page or limit (page: $page, limit: $limit)', async ({ page, limit }) => {
      const response = await request(app)
      .get(`/api/v1/feature-flags?page=${page}&limit=${limit}`)
      .set('Authorization', `Bearer ${token}`);
      
      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toHaveLength(1);
    });
    
  });
  
  describe('Handling empty feature flag list', () => {
    it('should return an empty list when no feature flags exist', async () => {
      const response = await request(app)
      .get('/api/v1/feature-flags')
      .set('Authorization', `Bearer ${token}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.items).toEqual([]);
      expect(response.body.total).toBe(0);
    });
  });

  authTests(() => request(app).get('/api/v1/feature-flags'));
});
