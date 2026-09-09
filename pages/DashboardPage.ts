import {Locator, Page} from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly accountTab: Locator;
  readonly contactsTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountTab = page
      .locator(".verticalNavMenuListItem")
      .filter({ hasText: "Accounts" });
    this.contactsTab = page
      .locator(".verticalNavMenuListItem")
      .filter({ hasText: "Contacts" });
  }

  async openApplication() {
    await this.page.goto("https://speed-inspiration-6523.lightning.force.com/");
  }

  async goToAccounts() {
    await this.accountTab.click();
  }

  async goToContacts() {
    await this.contactsTab.click();
  }
}