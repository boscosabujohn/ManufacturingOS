import { test, expect } from '@playwright/test';
import {
  testUsers,
  login,
  waitForPageLoad,
  navigateToModule,
  expectPageTitle,
} from './utils/test-helpers';

test.describe('Production Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, testUsers.admin);
  });

  test.describe('Work Orders', () => {
    test('should display work orders list', async ({ page }) => {
      await navigateToModule(page, '/production/work-orders');
      await waitForPageLoad(page);

      const heading = page.locator('h1, h2');
      await expect(heading.first()).toBeVisible();
    });

    test('should navigate to add work order page', async ({ page }) => {
      await navigateToModule(page, '/production/work-orders');

      const addButton = page.locator('button:has-text("Add"), a:has-text("Add"), button:has-text("New"), button:has-text("Create")');
      if (await addButton.isVisible()) {
        await addButton.click();
        await waitForPageLoad(page);
        await expect(page).toHaveURL(/.*add|new|create.*/i);
      }
    });

    test('should display pending work orders', async ({ page }) => {
      await navigateToModule(page, '/production/work-orders/pending');
      await waitForPageLoad(page);

      const heading = page.locator('h1, h2');
      await expect(heading.first()).toBeVisible();
    });

    test('should display completed work orders', async ({ page }) => {
      await navigateToModule(page, '/production/work-orders/completed');
      await waitForPageLoad(page);

      const heading = page.locator('h1, h2');
      await expect(heading.first()).toBeVisible();
    });
  });

  test.describe('BOM (Bill of Materials)', () => {
    test('should display BOM list', async ({ page }) => {
      await navigateToModule(page, '/production/bom');
      await waitForPageLoad(page);

      const heading = page.locator('h1, h2');
      await expect(heading.first()).toBeVisible();
    });

    test('should navigate to add BOM page', async ({ page }) => {
      await navigateToModule(page, '/production/bom');

      const addButton = page.locator('button:has-text("Add"), a:has-text("Add"), button:has-text("New")');
      if (await addButton.isVisible()) {
        await addButton.click();
        await waitForPageLoad(page);
      }
    });
  });

  test.describe('Scheduling', () => {
    test('should display scheduling page', async ({ page }) => {
      await navigateToModule(page, '/production/scheduling');
      await waitForPageLoad(page);

      const heading = page.locator('h1, h2');
      await expect(heading.first()).toBeVisible();
    });

    test('should display gantt view', async ({ page }) => {
      await navigateToModule(page, '/production/scheduling/gantt');
      await waitForPageLoad(page);

      // Page should load without errors
      const content = page.locator('main, [role="main"], .content');
      await expect(content).toBeVisible();
    });
  });

  test.describe('MRP', () => {
    test('should display MRP page', async ({ page }) => {
      await navigateToModule(page, '/production/mrp');
      await waitForPageLoad(page);

      const heading = page.locator('h1, h2');
      await expect(heading.first()).toBeVisible();
    });

    test('should display planned orders', async ({ page }) => {
      await navigateToModule(page, '/production/mrp/planned-orders');
      await waitForPageLoad(page);

      const heading = page.locator('h1, h2');
      await expect(heading.first()).toBeVisible();
    });
  });

  test.describe('Quality', () => {
    test('should display quality inspection page', async ({ page }) => {
      await navigateToModule(page, '/production/quality');
      await waitForPageLoad(page);

      const heading = page.locator('h1, h2');
      await expect(heading.first()).toBeVisible();
    });
  });

  test.describe('Analytics', () => {
    test('should display OEE dashboard', async ({ page }) => {
      await navigateToModule(page, '/production/analytics/oee');
      await waitForPageLoad(page);

      const heading = page.locator('h1, h2');
      await expect(heading.first()).toBeVisible();
    });

    test('should display efficiency reports', async ({ page }) => {
      await navigateToModule(page, '/production/analytics/efficiency');
      await waitForPageLoad(page);

      const heading = page.locator('h1, h2');
      await expect(heading.first()).toBeVisible();
    });
  });
});
