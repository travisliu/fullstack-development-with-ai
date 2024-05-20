const request = require('supertest');
const app = require('../../../src/app'); // Replace with actual path to your Express app
const { getToken } = require('../testHelpers');
const segmentFactory = require('../../factories/segment');

describe('PUT /api/v1/segments/:id - Update an existing segment', () => {
  let token, testSegment;

  beforeEach(async () => {
    token = await getToken();

    // Create a segment to update
    testSegment = await segmentFactory.create();
  });

  it('should update a segment successfully with valid data', async () => {
    const updateData = {
      name: 'Updated Segment Name',
      description: 'Updated description',
      criteria: [{ attribute: "location", operator: "equals", value: "updated location" }]
    };

    const response = await request(app)
      .put(`/api/v1/segments/${testSegment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual(updateData.name);
    expect(response.body.description).toEqual(updateData.description);
    // Further assertions to verify the criteria was updated correctly
  });

  it('should return a 404 Not Found when trying to update a non-existent segment', async () => {
    const nonExistentSegmentId = '5f8d0d55b54764421b715b8d'; // Example of a non-existent ID

    const response = await request(app)
      .put(`/api/v1/segments/${nonExistentSegmentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Non-existent Segment' });

    expect(response.statusCode).toBe(400);
  });

  it.each([
    {
      description: 'invalid update data with invalid operator',
      updateData: {
        criteria: [{ attribute: "age", operator: "not_valid", value: 30 }]
      },
      expectedStatusCode: 400
    },
    {
      description: 'empty name',
      updateData: {
        name: '',
        description: 'Valid description',
        criteria: [{ attribute: "location", operator: "equals", value: "valid location" }]
      },
      expectedStatusCode: 400,
      expectedErrorMessage: 'Name must not be empty.'
    },
    {
      description: 'invalid name',
      updateData: {
        name: 'Invalid Name!',
        description: 'Valid description',
        criteria: [{ attribute: "location", operator: "equals", value: "valid location" }]
      },
      expectedStatusCode: 400,
      expectedErrorMessage: 'Name must only contain letters, numbers, spaces, hyphens, or underscores.'
    },
    {
      description: 'empty description',
      updateData: {
        name: 'Valid Name',
        description: '',
        criteria: [{ attribute: "location", operator: "equals", value: "valid location" }]
      },
      expectedStatusCode: 400,
      expectedErrorMessage: 'Description, if provided, must not be empty.'
    },
    {
      description: 'missing criteria',
      updateData: {
        name: 'Valid Name',
        description: 'Valid description',
        criteria: []
      },
      expectedStatusCode: 400,
      expectedErrorMessage: 'Criteria must be a non-empty array.'
    },
    {
      description: 'invalid criteria attribute',
      updateData: {
        name: 'Valid Name',
        description: 'Valid description',
        criteria: [{ attribute: "", operator: "equals", value: "valid location" }]
      },
      expectedStatusCode: 400,
      expectedErrorMessage: 'Each criteria must have a valid "attribute" field.'
    },
    {
      description: 'invalid criteria operator',
      updateData: {
        name: 'Valid Name',
        description: 'Valid description',
        criteria: [{ attribute: "location", operator: "invalid_operator", value: "valid location" }]
      },
      expectedStatusCode: 400,
      expectedErrorMessage: 'Each criteria must have a valid "operator".'
    },
    {
      description: 'missing criteria value',
      updateData: {
        name: 'Valid Name',
        description: 'Valid description',
        criteria: [{ attribute: "location", operator: "equals" }]
      },
      expectedStatusCode: 400,
      expectedErrorMessage: 'Each criteria must include a "value".'
    }
  ])('should return a 400 Bad Request for %s', async ({ updateData, expectedStatusCode, expectedErrorMessage }) => {
    const response = await request(app)
      .put(`/api/v1/segments/${testSegment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);

    expect(response.statusCode).toBe(expectedStatusCode);
    if (expectedErrorMessage) {
      expect(response.body.errors[0].msg).toEqual(expectedErrorMessage);
    }
  });

  describe('createUpdateSegmentValidator', () => {
    it('should return a 400 Bad Request for empty name', async () => {
      const updateData = {
        name: '',
        description: 'Valid description',
        criteria: [{ attribute: "location", operator: "equals", value: "valid location" }]
      };

      const response = await request(app)
        .put(`/api/v1/segments/${testSegment.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.statusCode).toBe(400);
      expect(response.body.errors[0].msg).toEqual('Name must not be empty.');
    });

    it('should return a 400 Bad Request for invalid name', async () => {
      const updateData = {
        name: 'Invalid Name!',
        description: 'Valid description',
        criteria: [{ attribute: "location", operator: "equals", value: "valid location" }]
      };

      const response = await request(app)
        .put(`/api/v1/segments/${testSegment.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.statusCode).toBe(400);
      expect(response.body.errors[0].msg).toEqual('Name must only contain letters, numbers, spaces, hyphens, or underscores.');
    });

    it('should return a 400 Bad Request for empty description', async () => {
      const updateData = {
        name: 'Valid Name',
        description: '',
        criteria: [{ attribute: "location", operator: "equals", value: "valid location" }]
      };

      const response = await request(app)
        .put(`/api/v1/segments/${testSegment.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.statusCode).toBe(400);
      expect(response.body.errors[0].msg).toEqual('Description, if provided, must not be empty.');
    });

    it('should return a 400 Bad Request for invalid criteria attribute', async () => {
      const updateData = {
        name: 'Valid Name',
        description: 'Valid description',
        criteria: [{ attribute: "", operator: "equals", value: "valid location" }]
      };

      const response = await request(app)
        .put(`/api/v1/segments/${testSegment.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.statusCode).toBe(400);
      expect(response.body.errors[0].msg).toEqual('Each criteria must have a valid "attribute" field.');
    });

    it('should return a 400 Bad Request for invalid criteria operator', async () => {
      const updateData = {
        name: 'Valid Name',
        description: 'Valid description',
        criteria: [{ attribute: "location", operator: "invalid_operator", value: "valid location" }]
      };

      const response = await request(app)
        .put(`/api/v1/segments/${testSegment.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.statusCode).toBe(400);
      expect(response.body.errors[0].msg).toEqual('Each criteria must have a valid "operator".');
    });

    it('should return a 400 Bad Request for missing criteria value', async () => {
      const updateData = {
        name: 'Valid Name',
        description: 'Valid description',
        criteria: [{ attribute: "location", operator: "equals" }]
      };

      const response = await request(app)
        .put(`/api/v1/segments/${testSegment.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.statusCode).toBe(400);
      expect(response.body.errors[0].msg).toEqual('Each criteria must include a "value".');
    });
  });


  it('should return a 400 Bad Request for invalid update data', async () => {
    const invalidUpdateData = {
      criteria: [{ attribute: "age", operator: "not_valid", value: 30 }] // Invalid operator
    };

    const response = await request(app)
      .put(`/api/v1/segments/${testSegment._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(invalidUpdateData);

    expect(response.statusCode).toBe(400);
    // Check for specific error message if your API provides one
  });

  // test for invalid token
  it('should return a 401 Unauthorized for requests with an invalid token', async () => {
    const response = await request(app)
      .put(`/api/v1/segments/${testSegment._id}`)
      .set('Authorization', 'Bearer invalidtoken123')
      .send({ name: 'Invalid Token Update' });

    expect(response.statusCode).toBe(401);
  });
});
