/**
 * Authentication utility functions for safe token storage and retrieval
 */

const TOKEN_KEY = 'auth_token';

/**
 * Save authentication token to localStorage
 * @param token - The authentication token to save
 */
export function saveToken(token: string): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  } catch (error) {
    // Handle error gracefully
  }
}

/**
 * Get authentication token from localStorage
 * @returns The authentication token or null if not found
 */
export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    return null;
  }
}

/**
 * Remove authentication token from localStorage
 */
export function removeToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    // Handle error gracefully
  }
}

/**
 * Check if a token exists in localStorage
 * @returns true if token exists, false otherwise
 */
export function hasToken(): boolean {
  return getToken() !== null;
}

