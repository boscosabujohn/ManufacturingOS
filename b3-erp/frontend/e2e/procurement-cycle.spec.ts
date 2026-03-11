import { test, expect } from '@playwright/test';
import { testUsers, login, generateTestData, waitForPageLoad } from './utils/test-helpers';

test.describe('Procurement Cycle E2E', () => {
    const poReference = generateTestData('PO-REF');

    test.beforeEach(async ({ page }) => {
        await login(page, testUsers.admin);
    });

    test('full procurement cycle: create PO -> submit for approval', async ({ page }) => {
        // 1. Create a new Purchase Order
        await page.goto('/procurement/purchase-orders/create');

        // Select Vendor (it uses a button to open search/modal)
        await page.click('button:has-text("search and select vendor")');
        // Clicking a vendor from the mock list shown in the modal/search
        await page.click('div:has-text("Tech Supplies Co.")');

        // Fill Order Details
        await page.fill('input[placeholder="REQ-2024-XXX"]', poReference);
        await page.selectOption('select:has-text("Select Department")', 'operations');
        await page.selectOption('select:has-text("Select Cost Center")', 'cc002');

        // 2. Add Items
        await page.click('button:has-text("Items (0)")');
        await page.click('button:has-text("Add Item")');
        // Select an item from catalog (mock items)
        await page.click('div:has-text("Laptop Dell XPS 15")');

        // 3. Submit for Approval
        await page.click('button:has-text("Submit PO")');

        // Verify redirect to PO list
        await expect(page).toHaveURL(/.*procurement\/purchase-orders($|#|\?)/);

        // 4. Verify Approval Workflow UI
        // Navigate to approval page
        await page.goto('/procurement/purchase-orders/approval');
        await expect(page.locator('h1')).toContainText(/PO Approval Workflow/i);

        // Check for "Approve" button in the workflow component
        // If we are logged in as admin (U004 is VP Operations, and admin might have it or we mock it)
        await expect(page.locator('button:has-text("Approve")')).toBeVisible();

        await page.click('button:has-text("Approve")');

        // Verify success toast or UI update
        // In this mock UI, it just logs, but we can check if it's clickable
        await expect(page.locator('body')).toContainText(/Approved|Success/i);
    });
});
