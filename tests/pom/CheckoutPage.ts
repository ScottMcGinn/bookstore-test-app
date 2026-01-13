import { Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  shippingNameInput = 'input[name="name"]';
  shippingEmailInput = 'input[name="email"]';
  paymentCardInput = 'input[name="card"]';
  placeOrderButton = '.place-order-btn';

  async fillShippingInfo(name: string, email: string) {
    await this.page.fill(this.shippingNameInput, name);
    await this.page.fill(this.shippingEmailInput, email);
  }

  async fillPaymentInfo(card: string) {
    await this.page.fill(this.paymentCardInput, card);
  }

  async placeOrder() {
    await this.page.click(this.placeOrderButton);
  }
}
