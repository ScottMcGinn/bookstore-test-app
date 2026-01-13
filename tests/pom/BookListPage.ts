import { Page } from '@playwright/test';

export class BookListPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  bookGrid = '.book-list-grid';
  searchInput = 'input[name="search"]';
  bookTitle = '.book-title';
  addToCartButton = '.add-to-cart-btn';

  async goto() {
    await this.page.goto('http://localhost:5173/books');
  }

  async searchBook(title: string) {
    await this.page.fill(this.searchInput, title);
  }

  async addFirstBookToCart() {
    await this.page.click(this.addToCartButton);
  }
}
