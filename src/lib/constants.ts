/**
 * Application-wide constants
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7246',
  TIMEOUT: 30000,
} as const;

export const DEFAULT_VALUES = {
  RENEWAL_DAYS: 60,
  MAX_RENEWAL_DAYS: 365,
  MIN_RENEWAL_DAYS: 1,
} as const;

export const API_ENDPOINTS = {
  RENEWALS: '/api/renewals',
} as const;

/**
 * Development configuration
 * Set MOCK_AUTH to true to use client-side mock authentication
 * This allows frontend development without a backend
 */
export const DEV_CONFIG = {
  MOCK_AUTH: true, // Set to false when backend is ready
} as const;
