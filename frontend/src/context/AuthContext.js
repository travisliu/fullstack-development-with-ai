import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService'; // Import the authService
import { useRouter } from 'next/router';

// Create Auth Context
const AuthContext = createContext(null);

/**
 * Hook that allows access to the authentication context.
 * 
 * @returns {Object} The authentication context.
 * @returns {boolean} context.isAuthenticated - Whether the user is authenticated.
 * @returns {Object|null} context.user - The authenticated user object, or null if not authenticated.
 * @returns {string} context.user.token - The authentication token of the user.
 * @returns {number} context.user.expiresIn - The expiration time of the token.
 * @returns {string} context.user.userId - The user's unique identifier.
 * @returns {string} context.user.username - The user's username.
 * @returns {string} context.user.role - The user's role.
 * @returns {Function} context.login - Function to log in a user.
 * @returns {Function} context.logout - Function to log out the user.
 * @returns {boolean} context.isLoading - Whether the authentication status is being loaded.
 * @returns {string|null} context.error - Any error message from the authentication process, or null if no error.
 * @filesource @/context/AuthContext.js
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Provides authentication functionality to the application.
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components.
 * @returns {ReactNode} The component with authentication context.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // To handle any error during login
  const router = useRouter();

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null); // Reset error state before attempting a new login
    try {
      const userData = await authService.login(username, password);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData)); // Store user data in localStorage

      router.push('/featureflags');
    } catch (error) {
      setError(error.message); // Set error message for displaying to the user
      setUser(null); // Ensure user state is cleared on error
    } finally {
      setIsLoading(false); // Ensure loading state is updated regardless of outcome
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Optionally clear any stored authentication tokens or data here
    router.push('/login');
  };

  useEffect(() => {
    // Check for existing authentication status when the app loads
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // if storedUser is null, and location pathname is not /login, redirect to login page
    if (!storedUser && router.pathname !== '/login') {
      router.push('/login');
    }

    setIsLoading(false);
  }, []);

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
