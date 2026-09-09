import {test, expect} from "../fixtures/pageFixtures";
import { firstName, lastName,phoneNo } from "../test-data/accountData";

test("Add contact details", async({page,dashboardPage,contactsPage})=>{
    await dashboardPage.openApplication();
    await expect(page).toHaveURL(/lightning\.force\.com/);
    await dashboardPage.goToContacts();
    await contactsPage.clickNewBtnToAddContact();
    await expect(page.getByRole("heading", { name: "New Contact" })).toBeVisible();
    await contactsPage.clickSalutationDropdown();
    await contactsPage.selectSalutationDropdownOptions();
    await contactsPage.enterFirstName(firstName);
    await contactsPage.enterLastName(lastName);
    await contactsPage.enterAccountNameToSearch("ABC Institute 1");
    await contactsPage.enterPhoneNo(phoneNo);
    await contactsPage.clickSaveBtn();
    await page.pause();
    
})