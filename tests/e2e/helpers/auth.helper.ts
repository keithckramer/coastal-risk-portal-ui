/**
 * Authentication helper functions for E2E tests
 */

import { Page, expect } from '@playwright/test';

/**
 * Demo user credentials for testing
 */
export const TEST_USERS = {
  demo: {
    email: 'demo@amcoastal.com',
    password: 'demo123',
    name: 'Demo User',
    roles: ['user', 'viewer'],
  },
  admin: {
    email: 'admin@amcoastal.com',
    password: 'admin123',
    name: 'Admin User',
    roles: ['user', 'admin'],
  },
} as const;

/**
 * Logs in a user via the UI
 */
export async function login(
  page: Page,
  email: string = TEST_USERS.demo.email,
  password: string = TEST_USERS.demo.password
) {
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');

  // Wait for navigation to complete
  await page.waitForURL(/^((?!\/login).)*$/); // Any URL except /login
}

/**
 * Logs out the current user
 */
export async function logout(page: Page) {
  await page.click('button:has-text("Logout")');
  await page.waitForURL('/login');
}

/**
 * Checks if user is logged in
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  const currentUrl = page.url();
  return !currentUrl.includes('/login');
}

/**
 * Verifies user is on the login page
 */
export async function expectToBeOnLoginPage(page: Page) {
  await expect(page).toHaveURL(/\/login/);
  await expect(page.locator('h1')).toContainText('Coastal Risk Portal');
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
}

/**
 * Verifies user is logged in (not on login page)
 */
export async function expectToBeLoggedIn(page: Page) {
  await expect(page).not.toHaveURL(/\/login/);
  await expect(page.locator('button:has-text("Logout")')).toBeVisible();
}
