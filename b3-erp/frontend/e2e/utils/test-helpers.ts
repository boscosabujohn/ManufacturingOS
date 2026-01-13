import { Page, expect } from '@playwright/test';

/**
 * Common test utilities for E2E tests
 */

export interface TestUser {
  username: string;
  password: string;
  role: 'admin' | 'user' | 'manager';
}

export const testUsers: Record<string, TestUser> = {
  admin: {
    username: 'admin',
    password: 'Admin@123',
    role: 'admin',
  },
  manager: {
    username: 'manager',
    password: 'Manager@123',
    role: 'manager',
  },
  user: {
    username: 'testuser',
    password: 'User@123',
    role: 'user',
  },
};

/**
 * Login helper function
 */
export async function login(page: Page, user: TestUser): Promise<void> {
  await page.goto('/login');
  await page.fill('input[name="username"]', user.username);
  await page.fill('input[name="password"]', user.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard**', { timeout: 10000 });
}

/**
 * Logout helper function
 */
export async function logout(page: Page): Promise<void> {
  await page.click('[data-testid="user-menu"]');
  await page.click('[data-testid="logout-button"]');
  await page.waitForURL('**/login**');
}

/**
 * Wait for page to be fully loaded
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
}

/**
 * Fill form field by label
 */
export async function fillFormField(
  page: Page,
  label: string,
  value: string,
): Promise<void> {
  const field = page.locator(`label:has-text("${label}") + input, label:has-text("${label}") + textarea`);
  await field.fill(value);
}

/**
 * Select option from dropdown by label
 */
export async function selectOption(
  page: Page,
  label: string,
  value: string,
): Promise<void> {
  const select = page.locator(`label:has-text("${label}") + select`);
  await select.selectOption(value);
}

/**
 * Click button by text
 */
export async function clickButton(page: Page, text: string): Promise<void> {
  await page.click(`button:has-text("${text}")`);
}

/**
 * Check if toast message appears
 */
export async function expectToast(page: Page, message: string): Promise<void> {
  const toast = page.locator(`[role="alert"]:has-text("${message}")`);
  await expect(toast).toBeVisible({ timeout: 5000 });
}

/**
 * Navigate to a module
 */
export async function navigateToModule(
  page: Page,
  modulePath: string,
): Promise<void> {
  await page.goto(modulePath);
  await waitForPageLoad(page);
}

/**
 * Get table row count
 */
export async function getTableRowCount(page: Page): Promise<number> {
  const rows = page.locator('table tbody tr');
  return await rows.count();
}

/**
 * Search in table
 */
export async function searchInTable(page: Page, searchTerm: string): Promise<void> {
  const searchInput = page.locator('input[placeholder*="Search"], input[name="search"]');
  await searchInput.fill(searchTerm);
  await page.waitForTimeout(500); // Wait for debounce
}

/**
 * Check page title
 */
export async function expectPageTitle(page: Page, title: string): Promise<void> {
  await expect(page.locator('h1, h2').first()).toContainText(title);
}

/**
 * Generate unique test data
 */
export function generateTestData(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${prefix}_${timestamp}_${random}`;
}
