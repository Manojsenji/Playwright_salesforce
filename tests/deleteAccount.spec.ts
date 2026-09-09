import {test,expect} from "../fixtures/pageFixtures"
import { updatedAccount } from "../test-data/accountData";

test("deleting the account",async({page,dashboardPage,accountPage})=>{
    await dashboardPage.openApplication();
    await expect(page).toHaveURL(/lightning\.force\.com/);
    await dashboardPage.goToAccounts();
    await accountPage.deleteAccount(updatedAccount);
    await page.pause();
})