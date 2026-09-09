import {Locator, Page,expect} from "@playwright/test";

export class AccountPage {
  readonly page: Page;
  readonly newBtn: Locator;
  readonly newAccountDialog: Locator;
  readonly newAccountName: Locator;
  readonly newAccountSaveBtn: Locator;
  readonly accountsTxt: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newBtn = page
      .locator(".branding-actions")
      .getByRole("button", { name: "New" });
    this.newAccountDialog = page.getByRole("heading", {
      name: "New Account",
    });
    this.newAccountName = page.getByRole("textbox", {
      name: "Account Name",
    });
    this.newAccountSaveBtn = page.locator('[name="SaveEdit"]');
    this.accountsTxt = page.locator("//span[@title='Accounts']");
  }

  async clickNewAccount() {
    await this.newBtn.click();
  }

  newAccountPopup() {
    this.newAccountDialog;
  }

  async enterAccountName(name: string) {
    await this.newAccountName.fill(name);
  }

  async saveAccount() {
    await this.newAccountSaveBtn.click();
  }

  async openAccount(accountName: string) {
    const account = this.page
      .getByRole("grid")
      .getByText(accountName, { exact: true });
    await expect(account).toBeVisible();
    await account.click();
  }

  async deleteAccount(updatedAccount: string) {
    const account = this.page
      .getByRole("grid")
      .getByText(updatedAccount, { exact: true });
    await expect(account).toBeVisible();
    await account.click();
    await this.page.getByRole("button", { name: "Show more actions" }).click();
    await this.page.getByRole("menuitem", { name: "Delete" }).click();
    const deleteDialog = this.page.getByRole("dialog");
    await expect(deleteDialog).toBeVisible();
    await deleteDialog.getByRole("button", { name: "Delete" }).click();
  }
}