import { formatValidationErrors } from "./commons";

/**
* @module '@/services/userService'
* Service object for interacting with user API endpoints.
*/
const UserService = {
  apiBase: '/api/v1/users', // Base URL for the user API

  /**
  * Fetches a specific user by ID.
  * @param {string} id - The ID of the user to fetch.
  * @param {string} token - Authorization token for the request.
  * @returns {Promise<Object>} A promise that resolves to the user data.
  */
  async getUser(id, token) {
    const url = new URL(`${this.apiBase}/${id}`, window.location.origin);
    
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
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  },
  /**
  * Creates a new user.
  * @param {Object} user - The user data to create.
  * {
  *   role: string,
  *   username: string,
  *   email: string
  * }
  * @param {string} token - Authorization token for the request.
  * @returns {Promise<Object>} A promise that resolves to the created user data.
  */
  async createUser(user, token) {
    const url = new URL(this.apiBase, window.location.origin);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = 'Error creating user:\n'
        errorMessage += formatValidationErrors(errorData);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error creating user:`, error);
      throw error;
    }
  },
  /**
  * Fetches all users with optional pagination.
  * @param {Object} options - Pagination options.
  * @param {string} token - Authorization token for the request.
  * @returns {Promise<Object>} A promise that resolves to the list of users.
  */
  async getAllUsers(token) {
    const url = new URL(this.apiBase, window.location.origin);
    console.log('=== get all users url', url)
    
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
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
  * Updates a specific user by ID.
  * @param {string} id - The ID of the user to update.
  * @param {Object} data - The data to update the user with.
  * @param {string} token - Authorization token for the request.
  * @returns {Promise<Object>} A promise that resolves to the updated user data.
  */
  async updateUser(id, data, token) {
    const url = new URL(`${this.apiBase}/${id}`, window.location.origin);
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = 'Error updating user:\n';
        errorMessage += formatValidationErrors(errorData);
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  },

  /**
  * Deletes a specific user by ID.
  * @param {string} id - The ID of the user to delete.
  * @param {string} token - Authorization token for the request.
  * @returns {Promise<Object>} A promise that resolves to the deletion confirmation.
  */
  async deleteUser(id, token) {
    const url = new URL(`${this.apiBase}/${id}`, window.location.origin);
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  },
}

export default UserService;