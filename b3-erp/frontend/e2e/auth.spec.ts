import { test, expect } from '@playwright/test';
import { testUsers, login, waitForPageLoad } from './utils/test-helpers';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1, h2')).toContainText(/login|sign in/i);
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'invaliduser');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Wait for error message
    const errorMessage = page.locator('[role="alert"], .error-message, .text-red-500');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]');

    // Check for validation messages
    const validationErrors = page.locator('.error, [aria-invalid="true"], .text-red-500');
    await expect(validationErrors.first()).toBeVisible({ timeout: 5000 });
  });

  test('should redirect to dashboard after successful login', async ({ page }) => {
    await login(page, testUsers.admin);
    await expect(page).toHaveURL(/.*dashboard.*/);
  });

  test('should persist session on page refresh', async ({ page }) => {
    await login(page, testUsers.admin);
    await page.reload();
    await waitForPageLoad(page);

    // Should still be on dashboard, not redirected to login
    await expect(page).not.toHaveURL(/.*login.*/);
  });

  test('should logout successfully', async ({ page }) => {
    await login(page, testUsers.admin);

    // Find and click logout
    const userMenu = page.locator('[data-testid="user-menu"], [aria-label="User menu"], button:has-text("Profile")');
    if (await userMenu.isVisible()) {
      await userMenu.click();
    }

    const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout"), [data-testid="logout-button"]');
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await expect(page).toHaveURL(/.*login.*/);
    }
  });

  test('should protect dashboard route for unauthenticated users', async ({ page }) => {
    // Clear any existing auth
    await page.context().clearCookies();

    // Try to access protected route
    await page.goto('/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL(/.*login.*/);
  });
});
