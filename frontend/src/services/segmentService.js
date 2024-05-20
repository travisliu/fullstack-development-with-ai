import { formatValidationErrors } from "./commons";

/**
* @module '@/services/segmentService'
* Service object for interacting with segment API endpoints.
*/
const SegmentService = {
  apiBase: '/api/v1/segments', // Base URL for the segment API

  /**
  * Fetches all segments with optional pagination and search query.
  * @param {Object} options - Pagination, filtering, and search options.
  * @param {number} [options.page=1] - Page number for pagination.
  * @param {number} [options.limit=10] - Number of items per page.
  * @param {string} [options.query] - Search query for segment names.
  * @param {string} token - Authorization token for the request.
  * @returns {Promise<Object>} A promise that resolves to the list of segments. The structure of the response is as follows:
  * {
  *   segments: [{
  *     id: {string}, // The segment's ID, represented as a string
  *     name: {string}, // The segment's name
  *     description: {string}, // The segment's description, or an empty string if null
  *     criteria: {Array<{attribute: string, operator: string, value: string}>} // The segment's criteria
  *   }],
  *   total: {number}, // The total number of segments
  *   page: {number}, // The current page number
  *   limit: {number}, // The number of items per page
  * }
  */
  async getAllSegments({ page = 1, limit = 10, query = '' } = {}, token) {
    const url = new URL(this.apiBase, window.location.origin);
    url.searchParams.append('page', page);
    url.searchParams.append('limit', limit);
    if (query) {
      url.searchParams.append('query', query);
    }
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching segments:', error);
      throw error;
    }
  },
  
  /**
  * Creates a new segment.
  * @param {Object} segmentData - Data for the new segment.
  * @param {string} token - Authorization token for the request.
  * @returns {Promise<Object>} A promise that resolves to the created segment.
  */
  async createSegment(segmentData, token) {
    const url = `${this.apiBase}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(segmentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = 'Error creating segment:\n'
        errorMessage += formatValidationErrors(errorData);
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating segment:', error);
      throw error;
    }
  },
  /**
  * Fetches a segment by its ID.
  * @param {string} id - The ID of the segment to fetch.
  * @param {string} token - Authorization token for the request.
  * @returns {Promise<Object>} A promise that resolves to the segment data. The structure of the segment is as follows:
  * {
  *   id: {string}, // Ensuring 'id' is represented as a string
  *   name: {string}, // The segment's name
  *   description: {string}, // The segment's description, or an empty string if null
  *   criteria: {Array<{attribute: string, operator: string, value: string}>} // The segment's criteria
  * }
  */
  async getSegmentById(id, token) {
    const url = `${this.apiBase}/${id}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching segment by ID:', error);
      throw error;
    }
  },
  /**
  * Updates a segment by its ID.
  * @param {string} id - The ID of the segment to update.
  * @param {Object} updateData - Data for updating the segment.
  * @param {string} token - Authorization token for the request.
  * @returns {Promise<Object>} A promise that resolves to the updated segment data.
  */
  async updateSegment(id, updateData, token) {
    const url = `${this.apiBase}/${id}`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = 'Error updating segment:\n';
        errorMessage += formatValidationErrors(errorData);
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating segment:', error);
      throw error;
    }
  },
  /**
  * Deletes a segment by its ID.
  * @param {string} id - The ID of the segment to delete.
  * @param {string} token - Authorization token for the request.
  * @returns {Promise<void>} A promise that resolves when the segment is deleted.
  */
  async deleteSegment(id, token) {
    const url = `${this.apiBase}/${id}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting segment:', error);
      throw error;
    }
  },  

};

export default SegmentService;
