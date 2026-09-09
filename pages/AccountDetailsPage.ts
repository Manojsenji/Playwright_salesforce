import {Locator, Page, expect} from "@playwright/test";

export class AccountDetailsPage {
  readonly page: Page;
  readonly editAccountName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.editAccountName = page.locator("//button[@title='Edit Account Name']");
  }

  async verifyAccountName(accountName: string) {
    const accountNameLocator = this.page
      .locator("lightning-formatted-text")
      .filter({ hasText: accountName });
    await expect(accountNameLocator).toBeVisible();
  }

  async clickEdit() {
    await this.editAccountName.click();
  }

  async updateAccountName(updateAccountName: string) {
    await this.page
      .getByRole("textbox", { name: "Account Name" })
      .fill(updateAccountName);
  }

  async saveChanges() {
    await this.page.locator('[name="SaveEdit"]').click();
  }
 
}