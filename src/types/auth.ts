/**
 * Authentication-related type definitions
 */

/**
 * User profile information
 */
export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

/**
 * Authentication credentials for login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Authentication response from API
 */
export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
  expiresIn: number;
}

/**
 * Stored authentication state
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
