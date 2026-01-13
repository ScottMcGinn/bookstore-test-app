import { Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  cartIcon = '.cart-icon';
  cartPanel = '.cart-panel';
  checkoutButton = '.checkout-btn';

  async openCart() {
    await this.page.click(this.cartIcon);
  }

  async proceedToCheckout() {
    await this.page.click(this.checkoutButton);
  }
}
