/**
 * Navigation and Protected Routes E2E tests
 * Tests routing, navigation, and access control
 */

import { test, expect } from '@playwright/test';
import { login, expectToBeOnLoginPage, expectToBeLoggedIn } from './helpers/auth.helper';

test.describe('Protected Routes', () => {
  test('should redirect to login when accessing protected route unauthenticated', async ({ page }) => {
    await page.goto('/');
    await expectToBeOnLoginPage(page);
  });

  test('should redirect to login when accessing renewals unauthenticated', async ({ page }) => {
    await page.goto('/renewals');
    await expectToBeOnLoginPage(page);
  });

  test('should redirect to login when accessing policies unauthenticated', async ({ page }) => {
    await page.goto('/policies');
    await expectToBeOnLoginPage(page);
  });

  test('should redirect to login when accessing claims unauthenticated', async ({ page }) => {
    await page.goto('/claims');
    await expectToBeOnLoginPage(page);
  });

  test('should redirect back to intended page after login', async ({ page }) => {
    // Try to access renewals page while unauthenticated
    await page.goto('/renewals');

    // Should redirect to login
    await expectToBeOnLoginPage(page);

    // Login
    await login(page);

    // Should redirect back to renewals page
    await expect(page).toHaveURL('/renewals');
    await expect(page.locator('h1')).toContainText('Upcoming Renewals');
  });
});

test.describe('Navigation Menu', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate to dashboard', async ({ page }) => {
    await page.click('a:has-text("Dashboard")');
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should navigate to renewals page', async ({ page }) => {
    await page.click('a:has-text("Renewals")');
    await expect(page).toHaveURL('/renewals');
    await expect(page.locator('h1')).toContainText('Upcoming Renewals');
  });

  test('should navigate to policies page', async ({ page }) => {
    await page.click('nav a:has-text("Policies")');
    await expect(page).toHaveURL('/policies');
    await expect(page.locator('h1')).toContainText('Policies');
  });

  test('should navigate to claims page', async ({ page }) => {
    await page.click('nav a:has-text("Claims")');
    await expect(page).toHaveURL('/claims');
    await expect(page.locator('h1')).toContainText('Claims');
  });

  test('should show navigation header on all pages', async ({ page }) => {
    const pages = ['/', '/renewals', '/policies', '/claims'];

    for (const route of pages) {
      await page.goto(route);
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('text=Coastal Risk Portal').first()).toBeVisible();
      await expect(page.locator('button:has-text("Logout")')).toBeVisible();
    }
  });

  test('should show footer on all pages', async ({ page }) => {
    const pages = ['/', '/renewals', '/policies', '/claims'];

    for (const route of pages) {
      await page.goto(route);
      await expect(page.locator('footer')).toBeVisible();
      await expect(page.locator('text=AmCoastal Insurance')).toBeVisible();
    }
  });
});

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display dashboard cards', async ({ page }) => {
    await page.goto('/');

    // Verify dashboard cards exist
    await expect(page.locator('text=Upcoming Renewals')).toBeVisible();
    await expect(page.locator('text=Active Policies')).toBeVisible();
    await expect(page.locator('text=Open Claims')).toBeVisible();
  });

  test('should navigate to renewals from dashboard card', async ({ page }) => {
    await page.goto('/');

    // Click on Upcoming Renewals card
    await page.click('text=Upcoming Renewals');

    // Should navigate to renewals page
    await expect(page).toHaveURL('/renewals');
  });

  test('should navigate to policies from dashboard card', async ({ page }) => {
    await page.goto('/');

    // Click on Active Policies card
    await page.click('text=Active Policies');

    // Should navigate to policies page
    await expect(page).toHaveURL('/policies');
  });

  test('should navigate to claims from dashboard card', async ({ page }) => {
    await page.goto('/');

    // Click on Open Claims card
    await page.click('text=Open Claims');

    // Should navigate to claims page
    await expect(page).toHaveURL('/claims');
  });
});
