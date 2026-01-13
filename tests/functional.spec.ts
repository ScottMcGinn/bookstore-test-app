import { test, expect } from '@playwright/test';
import { LoginPage } from './pom/LoginPage';
import { BookListPage } from './pom/BookListPage';
import { CartPage } from './pom/CartPage';
import { CheckoutPage } from './pom/CheckoutPage';

test.describe('Bookstore Functional Tests', () => {
  test('Login with valid credentials', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('customer', 'customer123');
    await expect(page).toHaveURL(/books/);
  });

  test('Search and add book to cart', async ({ page }) => {
    const login = new LoginPage(page);
    const books = new BookListPage(page);
    const cart = new CartPage(page);
    await login.goto();
    await login.login('customer', 'customer123');
    await books.goto();
    await books.searchBook('Gatsby');
    await books.addFirstBookToCart();
    await cart.openCart();
    await expect(page.locator(cart.cartPanel)).toBeVisible();
  });

  test('Checkout process', async ({ page }) => {
    const login = new LoginPage(page);
    const books = new BookListPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    await login.goto();
    await login.login('customer', 'customer123');
    await books.goto();
    await books.addFirstBookToCart();
    await cart.openCart();
    await cart.proceedToCheckout();
    await checkout.fillShippingInfo('Test User', 'test@example.com');
    await checkout.fillPaymentInfo('4111 1111 1111 1111');
    await checkout.placeOrder();
    await expect(page).toHaveURL(/confirmation/);
  });
});
