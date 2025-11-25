/**
 * Base API client with error handling and interceptor support
 * Provides centralized configuration for all API calls
 */

import { API_CONFIG } from '../lib/constants';
import { getToken } from '../lib/storage';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number;
  statusText: string;

  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
  }
}

/**
 * Request configuration options
 */
interface RequestConfig extends RequestInit {
  timeout?: number;
}

/**
 * Creates a fetch request with timeout support
 */
function fetchWithTimeout(
  url: string,
  config: RequestConfig = {}
): Promise<Response> {
  const { timeout = API_CONFIG.TIMEOUT, ...fetchConfig } = config;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  return fetch(url, {
    ...fetchConfig,
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId));
}

/**
 * Gets authorization headers with JWT token if available
 */
function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Makes an API request with error handling
 */
async function request<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  try {
    const response = await fetchWithTimeout(url, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...config.headers,
      },
      ...config,
    });

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'Request Timeout');
      }
      throw new ApiError(error.message, 0, 'Network Error');
    }

    throw new ApiError('An unexpected error occurred', 0, 'Unknown Error');
  }
}

/**
 * API client with common HTTP methods
 */
export const apiClient = {
  get: <T>(endpoint: string, config?: RequestConfig): Promise<T> =>
    request<T>(endpoint, { ...config, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> =>
    request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> =>
    request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, config?: RequestConfig): Promise<T> =>
    request<T>(endpoint, { ...config, method: 'DELETE' }),
};
