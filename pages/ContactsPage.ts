import { Locator, Page,expect } from "@playwright/test";

export class ContactsPage {
  readonly page: Page;
  readonly newBtn: Locator;
  readonly salutationDropdown: Locator;
  readonly salutationDropdownOptions: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly accountNameSearch: Locator;
  readonly phoneNo: Locator;
  readonly saveBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newBtn = page.getByRole("button", {name:"New" ,exact: true });
    this.salutationDropdown = page.getByRole("combobox", {
      name: "Salutation",
    });
    this.salutationDropdownOptions = page.getByRole("option", {
      name: "Mr.",
    });
    this.firstName = page.getByRole("textbox", { name: "First Name" });
    this.lastName = page.getByRole("textbox", { name: "Last Name" });
    this.accountNameSearch = page.getByRole("combobox", {
      name: "Account Name",
    });
    this.phoneNo = page.getByRole("textbox", { name: "Phone" });
    this.saveBtn = page.locator('[name="SaveEdit"]');
  }

  async clickNewBtnToAddContact() {
    await this.newBtn.click();
      await expect(
        this.page.getByRole("heading", { name: "New Contact" }),
      ).toBeVisible();
  }

  async clickSalutationDropdown() {
    await this.salutationDropdown.click();
  }
  async selectSalutationDropdownOptions() {
    await this.salutationDropdownOptions.click();
  }

  async enterFirstName(firstName: string) {
    await this.firstName.click();
    await this.firstName.fill(firstName);
  }

  async enterLastName(lastName: string) {
    await this.lastName.click();
    await this.lastName.fill(lastName);
  }

  async enterAccountNameToSearch(accountName: string) {
    await this.accountNameSearch.fill(accountName);
    await this.accountNameSearch.click();
    await this.page
      .locator("span.slds-listbox__option-text")
      .filter({ hasText: accountName })
      .filter({ hasNotText: "Show more results" })
      .click();
  }

  async enterPhoneNo(phoneNo: string){
    await this.phoneNo.fill(phoneNo);
  }

  async clickSaveBtn(){
    await this.saveBtn.click();
  }
}