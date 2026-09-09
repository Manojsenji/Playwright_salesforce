import { test as base, expect } from "@playwright/test";
import { DashboardPage } from "../pages/DashboardPage";
import { AccountPage } from "../pages/AccountsPage";
import { AccountDetailsPage } from "../pages/AccountDetailsPage";
import { ContactsPage } from "../pages/ContactsPage";

type PageFixtures = {
  dashboardPage: DashboardPage;
  accountPage: AccountPage;
  accountDetailsPage: AccountDetailsPage;
  contactsPage: ContactsPage;
};

export const test = base.extend<PageFixtures>({
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
  accountDetailsPage: async ({ page }, use) => {
    await use(new AccountDetailsPage(page));
  },
  contactsPage: async ({ page }, use) => {
    await use(new ContactsPage(page));
  },
});

export {expect};