/**
 * Authentication service for login, logout, and token management
 */

import { apiClient } from './api';
import type { LoginCredentials, AuthResponse, User } from '../types/auth';
import { setToken, setRefreshToken, setUser, getToken, getUser, clearAuth } from '../lib/storage';
import { DEV_CONFIG } from '../lib/constants';
import { mockLogin, mockLogout } from './auth.mock';

const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
  ME: '/api/auth/me',
} as const;

/**
 * Authenticates user with credentials
 * Uses mock authentication if DEV_CONFIG.MOCK_AUTH is enabled
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  let response: AuthResponse;

  // Use mock authentication in development mode
  if (DEV_CONFIG.MOCK_AUTH) {
    console.warn('[DEV MODE] Using mock authentication - set DEV_CONFIG.MOCK_AUTH=false to use real API');
    response = await mockLogin(credentials);
  } else {
    response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
  }

  // Store auth data in local storage
  setToken(response.token);
  setUser(response.user);

  if (response.refreshToken) {
    setRefreshToken(response.refreshToken);
  }

  return response;
}

/**
 * Logs out current user
 */
export async function logout(): Promise<void> {
  try {
    // Call logout endpoint if token exists
    const token = getToken();
    if (token) {
      if (DEV_CONFIG.MOCK_AUTH) {
        await mockLogout();
      } else {
        await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
      }
    }
  } catch (error) {
    // Continue with logout even if API call fails
    console.error('Logout API call failed:', error);
  } finally {
    // Always clear local storage
    clearAuth();
  }
}

/**
 * Gets current user from storage
 */
export function getCurrentUser(): User | null {
  return getUser<User>();
}

/**
 * Checks if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/**
 * Refreshes authentication token
 */
export async function refreshToken(): Promise<string> {
  const response = await apiClient.post<{ token: string }>(AUTH_ENDPOINTS.REFRESH);
  setToken(response.token);
  return response.token;
}

/**
 * Fetches current user profile from API
 */
export async function fetchCurrentUser(): Promise<User> {
  const user = await apiClient.get<User>(AUTH_ENDPOINTS.ME);
  setUser(user);
  return user;
}
