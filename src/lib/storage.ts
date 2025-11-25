/**
 * Local storage utilities for persisting auth state
 */

const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
} as const;

/**
 * Stores authentication token in local storage
 */
export function setToken(token: string): void {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
}

/**
 * Retrieves authentication token from local storage
 */
export function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

/**
 * Stores refresh token in local storage
 */
export function setRefreshToken(token: string): void {
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
}

/**
 * Retrieves refresh token from local storage
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * Stores user data in local storage
 */
export function setUser(user: object): void {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

/**
 * Retrieves user data from local storage
 */
export function getUser<T>(): T | null {
  const userJson = localStorage.getItem(STORAGE_KEYS.USER);
  if (!userJson) return null;

  try {
    return JSON.parse(userJson) as T;
  } catch {
    return null;
  }
}

/**
 * Clears all authentication data from local storage
 */
export function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}
