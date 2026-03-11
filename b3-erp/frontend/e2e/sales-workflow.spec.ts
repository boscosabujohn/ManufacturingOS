import { test, expect } from '@playwright/test';
import { testUsers, login, generateTestData, waitForPageLoad } from './utils/test-helpers';

test.describe('Sales Workflow E2E', () => {
    const customerName = generateTestData('Customer');
    const productName = 'Industrial Component';

    test.beforeEach(async ({ page }) => {
        await login(page, testUsers.admin);
    });

    test('full sales cycle: customer -> quotation -> sales order', async ({ page }) => {
        // 1. Create a new customer
        await page.goto('/crm/customers/add');
        await page.fill('input[placeholder*="Premier Kitchen Solutions Inc."]', customerName);
        await page.selectOption('select:has-text("Select Group")', 'wholesale');
        await page.selectOption('select:has-text("Select Industry")', 'Modular Kitchen Systems');

        // Click Save Customer in the footer
        await page.click('button:has-text("Save Customer")');
        await expect(page).toHaveURL(/.*crm\/customers/);

        // 2. Create a quotation for this customer
        await page.goto('/sales/quotations/create');

        // Search and select the customer
        await page.fill('input[placeholder="Search customer..."]', customerName);
        await page.click(`div:has-text("${customerName}")`);

        // Add an item
        await page.fill('input[placeholder="Product name"]', productName);
        await page.fill('input[min="1"]', '5'); // Quantity
        await page.fill('div:has(span:has-text("₹")) >> input[type="number"]', '1500'); // Unit Price

        // Save as Sent
        await page.click('button:has-text("Send Quotation")');
        await expect(page).toHaveURL(/.*sales\/quotations/);

        // 3. Convert Quotation to Sales Order
        // Find the quotation in the list and click View
        await page.fill('input[placeholder*="Search by quote number"]', customerName);
        await page.click('button[title="View Details"]');

        // Verify details and convert
        await expect(page.locator('h1')).toContainText(/QTN-/);
        await expect(page.locator('body')).toContainText(customerName);

        await page.click('button:has-text("Convert to Order")');

        // Should redirect to sales orders or show success
        // Based on common patterns, it likely redirects to the new order or back to orders list
        await expect(page.locator('body')).toContainText(/Sales Order|Order Created/i);
    });
});
