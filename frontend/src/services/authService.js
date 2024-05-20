// src/utils/authService.js

/**
 * @module @/services/authService
 * @desc Provides functions for authentication.
 * @file This file contains the implementation of the authentication service.
 */

/**
 * Logs in a user with the provided username and password.
 *
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Object>} A Promise that resolves to an object containing the user's token, expiration time, user ID, username, and role.
 * @throws {Error} If there is an authentication error.
 */
async function login(username, password) {
  try {
    const response = await fetch('/api/v1/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json(); // Parse JSON response

    if (!response.ok) {
      // Handle specific error messages based on the API spec
      const error = (data && data.message) || response.status;
      throw new Error(error);
    }

    // Assuming successful response includes token and user details
    return {
      token: data.token,
      expiresIn: data.expiresIn,
      userId: data.userId,
      username: data.username,
      role: data.role,
    };
  } catch (error) {
    console.error("Authentication error:", error.message);
    throw error; // Rethrow the error so it can be caught and handled by the AuthContext
  }
}

export const authService = {
  login,
};
