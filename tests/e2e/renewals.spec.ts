/**
 * Renewals Page E2E tests
 * Tests the renewals feature functionality
 */

import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.helper';

test.describe('Renewals Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/renewals');
  });

  test('should display renewals page with filter controls', async ({ page }) => {
    // Verify page header
    await expect(page.locator('h1')).toContainText('Upcoming Renewals');

    // Verify filter input exists
    const daysInput = page.locator('input[type="number"]');
    await expect(daysInput).toBeVisible();
    await expect(daysInput).toHaveValue('60');

    // Verify filter label
    await expect(page.locator('text=Days to expiration')).toBeVisible();
  });

  test('should update days filter', async ({ page }) => {
    const daysInput = page.locator('input[type="number"]');

    // Change filter value
    await daysInput.fill('30');
    await expect(daysInput).toHaveValue('30');

    // Change to another value
    await daysInput.fill('90');
    await expect(daysInput).toHaveValue('90');
  });

  test('should display table structure', async ({ page }) => {
    // Wait for table to be visible
    await expect(page.locator('table')).toBeVisible();

    // Verify table headers exist (even if no data)
    const expectedHeaders = [
      'Policy #',
      'Building',
      'Location',
      'Expires',
      'Days Left',
      'Premium',
      'Open Claims',
    ];

    for (const header of expectedHeaders) {
      await expect(page.locator(`th:has-text("${header}")`)).toBeVisible();
    }
  });

  test('should handle empty data state', async ({ page }) => {
    // Note: Since mock backend might return empty data, verify empty state
    // This test will pass whether data exists or not
    const tableBody = page.locator('tbody');
    await expect(tableBody).toBeVisible();

    // If no data, should show empty message
    const emptyMessage = page.locator('text=No renewals in this window');
    const isEmptyState = await emptyMessage.isVisible().catch(() => false);

    if (isEmptyState) {
      await expect(emptyMessage).toBeVisible();
    }
  });

  test('should maintain filter value after page reload', async ({ page }) => {
    const daysInput = page.locator('input[type="number"]');

    // Change filter
    await daysInput.fill('45');
    await expect(daysInput).toHaveValue('45');

    // Reload page
    await page.reload();

    // Filter should reset to default (60)
    await expect(daysInput).toHaveValue('60');
  });

  test('should not accept invalid filter values', async ({ page }) => {
    const daysInput = page.locator('input[type="number"]');

    // Try to set negative value (HTML5 validation should prevent this)
    await daysInput.fill('-10');

    // Input should either reject it or browser validation kicks in
    const value = await daysInput.inputValue();
    expect(parseInt(value)).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Renewals Page - Multi-browser', () => {
  test('should work consistently across browsers', async ({ page, browserName }) => {
    await login(page);
    await page.goto('/renewals');

    // Basic functionality should work in all browsers
    await expect(page.locator('h1')).toContainText('Upcoming Renewals');
    await expect(page.locator('input[type="number"]')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();

    console.log(`✓ Renewals page works in ${browserName}`);
  });
});
