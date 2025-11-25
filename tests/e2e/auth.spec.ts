/**
 * Authentication E2E tests
 * Tests login, logout, and protected route access
 */

import { test, expect } from '@playwright/test';
import { login, logout, TEST_USERS, expectToBeOnLoginPage, expectToBeLoggedIn } from './helpers/auth.helper';

test.describe('Authentication Flow', () => {
  test('should display login page with demo credentials', async ({ page }) => {
    await page.goto('/login');

    // Verify login page elements
    await expect(page.locator('h1')).toContainText('Coastal Risk Portal');
    await expect(page.locator('text=Sign in to your account')).toBeVisible();

    // Verify demo credentials are displayed
    await expect(page.locator('text=Demo Credentials')).toBeVisible();
    await expect(page.locator('text=demo@amcoastal.com')).toBeVisible();

    // Verify form fields exist
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill in credentials
    await page.fill('input[type="email"]', TEST_USERS.demo.email);
    await page.fill('input[type="password"]', TEST_USERS.demo.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/');
    await expectToBeLoggedIn(page);

    // Verify dashboard content
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');

    // Submit form
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=Login Error')).toBeVisible();
    await expect(page.locator('text=Invalid email or password')).toBeVisible();

    // Should still be on login page
    await expectToBeOnLoginPage(page);
  });

  test('should show error with empty email', async ({ page }) => {
    await page.goto('/login');

    // Fill in only password
    await page.fill('input[type="password"]', 'somepassword');

    // Submit form
    await page.click('button[type="submit"]');

    // Should show validation error
    await expect(page.locator('text=Please enter both email and password')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await login(page);
    await expectToBeLoggedIn(page);

    // Click logout button
    await logout(page);

    // Should redirect to login page
    await expectToBeOnLoginPage(page);

    // Verify logout button is gone
    await expect(page.locator('button:has-text("Logout")')).not.toBeVisible();
  });

  test('should maintain session after page reload', async ({ page }) => {
    // Login
    await login(page);
    await expectToBeLoggedIn(page);

    // Reload page
    await page.reload();

    // Should still be logged in
    await expectToBeLoggedIn(page);
    await expect(page.locator('button:has-text("Logout")')).toBeVisible();
  });

  test('should login with admin credentials', async ({ page }) => {
    await page.goto('/login');

    // Login as admin
    await page.fill('input[type="email"]', TEST_USERS.admin.email);
    await page.fill('input[type="password"]', TEST_USERS.admin.password);
    await page.click('button[type="submit"]');

    // Should redirect and show admin user name
    await expectToBeLoggedIn(page);
    await expect(page.locator(`text=${TEST_USERS.admin.name}`)).toBeVisible();
  });
});
