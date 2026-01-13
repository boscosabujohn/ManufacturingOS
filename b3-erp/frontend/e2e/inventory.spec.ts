import { test, expect } from '@playwright/test';
import {
  testUsers,
  login,
  waitForPageLoad,
  navigateToModule,
  searchInTable,
  getTableRowCount,
  expectPageTitle,
  generateTestData,
} from './utils/test-helpers';

test.describe('Inventory Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, testUsers.admin);
  });

  test.describe('Items List', () => {
    test('should display items list page', async ({ page }) => {
      await navigateToModule(page, '/inventory/items');
      await expectPageTitle(page, 'Items');

      // Should have a table or list
      const table = page.locator('table, [role="grid"]');
      await expect(table).toBeVisible();
    });

    test('should search items', async ({ page }) => {
      await navigateToModule(page, '/inventory/items');

      const searchInput = page.locator('input[placeholder*="Search"], input[name="search"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('test');
        await page.waitForTimeout(500);

        // Results should update
        await waitForPageLoad(page);
      }
    });

    test('should navigate to add item page', async ({ page }) => {
      await navigateToModule(page, '/inventory/items');

      const addButton = page.locator('button:has-text("Add"), a:has-text("Add"), button:has-text("New")');
      if (await addButton.isVisible()) {
        await addButton.click();
        await expect(page).toHaveURL(/.*add|new|create.*/i);
      }
    });
  });

  test.describe('Stock Management', () => {
    test('should display stock levels page', async ({ page }) => {
      await navigateToModule(page, '/inventory/stock/levels');

      // Page should load without errors
      await waitForPageLoad(page);
      const heading = page.locator('h1, h2');
      await expect(heading.first()).toBeVisible();
    });

    test('should display stock movements page', async ({ page }) => {
      await navigateToModule(page, '/inventory/movements');
      await waitForPageLoad(page);

      const heading = page.locator('h1, h2');
      await expect(heading.first()).toBeVisible();
    });
  });

  test.describe('Warehouse Management', () => {
    test('should display warehouse list', async ({ page }) => {
      await navigateToModule(page, '/inventory/warehouse');
      await waitForPageLoad(page);

      const heading = page.locator('h1, h2');
      await expect(heading.first()).toBeVisible();
    });

    test('should display warehouse locations', async ({ page }) => {
      await navigateToModule(page, '/inventory/warehouse/locations');
      await waitForPageLoad(page);

      const heading = page.locator('h1, h2');
      await expect(heading.first()).toBeVisible();
    });
  });

  test.describe('Transfers', () => {
    test('should display transfers page', async ({ page }) => {
      await navigateToModule(page, '/inventory/transfers');
      await waitForPageLoad(page);

      const heading = page.locator('h1, h2');
      await expect(heading.first()).toBeVisible();
    });
  });

  test.describe('Adjustments', () => {
    test('should display adjustments page', async ({ page }) => {
      await navigateToModule(page, '/inventory/adjustments');
      await waitForPageLoad(page);

      const heading = page.locator('h1, h2');
      await expect(heading.first()).toBeVisible();
    });
  });
});
