import {test,expect} from '../fixtures/pageFixtures';
//const accountName = "ABC Institute";
import { accountName, updatedAccount } from "../test-data/accountData";


test.describe.serial("end to end test",()=>{

  test("Salesforce account creation", async ({
    page,
    dashboardPage,
    accountPage,
    accountDetailsPage,
  }) => {
    await dashboardPage.openApplication();
    await expect(page).toHaveURL(/lightning\.force\.com/);

    await dashboardPage.goToAccounts();
    await expect(accountPage.accountsTxt).toBeVisible();
    await accountPage.clickNewAccount();
    await expect(accountPage.newAccountDialog).toBeVisible();
    await accountPage.enterAccountName(accountName);
    await accountPage.saveAccount();
    await accountDetailsPage.verifyAccountName(accountName);
  });

  test("Update account details", async ({
    page,
    dashboardPage,
    accountPage,
    accountDetailsPage,
  }) => {
    //const existingAccount = "ABC Technologies";
    //const updatedAccount = "ABC Technologies Updated";

    await dashboardPage.openApplication();
    await expect(page).toHaveURL(/lightning\.force\.com/);
    await dashboardPage.goToAccounts();
    await page.screenshot({
      path: "salesforce-debug.png",
    });
    await accountPage.openAccount(accountName);
    

    await accountDetailsPage.clickEdit();
    await accountDetailsPage.updateAccountName(updatedAccount);
    await accountDetailsPage.saveChanges();
  });
});
