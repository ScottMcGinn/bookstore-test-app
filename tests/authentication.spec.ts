import { test, expect } from '@playwright/test';

test('Customer login to application', async ({ page }) => {

  // Go to the login page
  await page.goto('http://localhost:5173/');

  // Enter customer user name
  await page.fill('[aria-label="Username input"]', 'customer');

  // Enter customer password
  await page.fill('[aria-label="Password input"]', 'customer123');

  // Click Login button
  await page.click('[aria-label="Click to login"]');

  // Validate that we are on the right page
  await expect(page).toHaveTitle(/Bookstore/);

});


