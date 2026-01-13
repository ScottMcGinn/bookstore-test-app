import { test, expect } from '@playwright/test';
import { LoginPage } from './pom/LoginPage';

test.describe('Tests to check that logins work', () => {

    test('Check Customer Login', async ({ page }) => {
        const login = new LoginPage(page);

        await page.goto('/');
        await login.login('customer', 'customer123');

        await expect(page.locator('.user-role')).toHaveText('CUSTOMER'); 
    })

    test('Check Admin Login', async ({page}) => {
        const login = new LoginPage(page);

        await page.goto('/');
        await login.login('admin', 'admin123');

        await expect(page.locator('.user-role')).toHaveText('ADMIN');       
    })

    test('Check Staff Login', async ({page}) => {
        const login = new LoginPage(page);

        await page.goto('/');
        await login.login('staff', 'staff123');

        await expect(page.locator('.user-role')).toHaveText('STAFF');       
    })

})