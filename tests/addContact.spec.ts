import {test, expect} from "../fixtures/pageFixtures";
import { firstName, lastName,phoneNo } from "../test-data/accountData";

test("Add contact details", async({page,dashboardPage,contactsPage})=>{
    await dashboardPage.openApplication();
    await expect(page).toHaveURL(/lightning\.force\.com/);
    await dashboardPage.goToContacts();
      console.log(
        "New links:",
        await page.getByRole("button", { name: "New", exact: true }).count(),
      );
      //await page.pause();
    await contactsPage.clickNewBtnToAddContact();  
    await contactsPage.clickSalutationDropdown();
    await contactsPage.selectSalutationDropdownOptions();
    await contactsPage.enterFirstName(firstName);
    await contactsPage.enterLastName(lastName);
    await contactsPage.enterAccountNameToSearch("ABC Institute 1");
    await contactsPage.enterPhoneNo(phoneNo);
    await contactsPage.clickSaveBtn();
    
})