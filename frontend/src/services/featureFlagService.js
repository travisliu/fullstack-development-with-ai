// src/api/featureFlags.js
import { formatValidationErrors } from "./commons";

// Assuming you have a way to access the AuthContext outside of a React component,
// for example, by passing the token directly to the API utility functions.
// This is a simplified demonstration. In a real application, you might need to
// adjust this approach based on your state management solution.

const BASE_URL = '/api/v1/feature-flags';

const headers = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

// Fetch all feature flags with pagination
export const listFeatureFlags = async ({ page = 1, limit = 10, query = '' }, token) => {
  // throw new Error if token is not provided
  if (!token) throw new Error('Token is required');

  try {
    let url = `${BASE_URL}?page=${page}&limit=${limit}`;
    if (query !== '') {
      url += `&query=${query}`;
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: headers(token),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Failed to list feature flags', error);
    throw error;
  }
};

/**
 * 
 * Creates a new feature flag by making a POST request to the BASE_URL.
 * 
 * @module '@/services/featureFlagService'
 * @function createFeatureFlag
 * @param {Object} flagData - The data for the new feature flag.
 * @param {string} token - The authentication token.
 * 
 * @returns {Promise<Object>} The response from the server, parsed as JSON.
 * 
 * @throws {Error} If the network response was not ok or if there was an error making the request.
 */
export const createFeatureFlag = async (flagData, token) => {
  console.log('== createFeatureFlag ==', flagData, token)
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify(flagData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = 'Error creating feature flag:\n'
      errorMessage += formatValidationErrors(errorData);
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to create feature flag', error);
    throw error;
  }
};

/**
 * Fetches a specific feature flag by its ID.
 *
 * @module '@/services/featureFlagService'
 * @param {string} id - The ID of the feature flag to retrieve.
 * @param {string} token - The bearer token for authentication.
 * @returns {Promise<Object>} A promise that resolves to an object containing the feature flag details.
 * The object structure is:
 * {
 *   id: string, // The ID of the feature flag
 *   name: string, // The name of the feature flag
 *   isEnabled: boolean, // The status of the feature flag
 *   type: string // The type of the feature flag
 * }
 *
 * @throws {Error} Will throw an error if the network response is not ok or if any other error occurs.
 */
export const getFeatureFlagById = async (id, token) => {
  // throw new Error if token is not provided
  if (!token) throw new Error('Token is required');

  try {
    const url = `${BASE_URL}/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: headers(token),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error(`Failed to get feature flag with id ${id}`, error);
    throw error;
  }
};

/**
 * Updates a feature flag by sending a PUT request to the server.
 *
 * @param {string} id - The ID of the feature flag to update.
 * @param {Object} flagData - The updated data for the feature flag.
 * @param {string} token - The authentication token for the request.
 * @returns {Promise<Object>} - A promise that resolves to the updated feature flag data.
 * @throws {Error} - If the network response is not ok or an error occurs during the update.
 */
export const updateFeatureFlag = async (id, flagData, token) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: headers(token),
      body: JSON.stringify(flagData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = 'Error updating segment:\n'
      errorMessage += formatValidationErrors(errorData);
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to update feature flag', error);
    throw error;
  }
};

// Delete a feature flag
export const deleteFeatureFlag = async (id, token) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: headers(token),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    // No content expected, just confirm success
    return true;
  } catch (error) {
    console.error('Failed to delete feature flag', error);
    throw error;
  }
};

// Add more functions as necessary for associating segments, removing association, and searching feature flags

