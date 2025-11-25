/**
 * Mock authentication service for development
 * Simulates backend authentication without API calls
 */

import type { LoginCredentials, AuthResponse, User } from '../types/auth';

/**
 * Demo user accounts for testing
 */
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'demo@amcoastal.com': {
    password: 'demo123',
    user: {
      id: '1',
      email: 'demo@amcoastal.com',
      name: 'Demo User',
      roles: ['user', 'viewer'],
    },
  },
  'admin@amcoastal.com': {
    password: 'admin123',
    user: {
      id: '2',
      email: 'admin@amcoastal.com',
      name: 'Admin User',
      roles: ['user', 'admin'],
    },
  },
};

/**
 * Generates a mock JWT token (not a real JWT, just for demo)
 */
function generateMockToken(userId: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      iat: Date.now(),
      exp: Date.now() + 3600000, // 1 hour
    })
  );
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
}

/**
 * Mock login function
 * Simulates API authentication with client-side validation
 */
export async function mockLogin(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const mockUser = MOCK_USERS[credentials.email];

  if (!mockUser || mockUser.password !== credentials.password) {
    throw new Error('Invalid email or password');
  }

  return {
    token: generateMockToken(mockUser.user.id),
    user: mockUser.user,
    expiresIn: 3600,
  };
}

/**
 * Mock logout function
 */
export async function mockLogout(): Promise<void> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  // No-op for mock
}
