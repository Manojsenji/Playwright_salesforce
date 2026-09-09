import {test,expect} from "../fixtures/pageFixtures"

test("Practise",async({page})=>{
    await page.goto("https://www.flipkart.com/");
    await page.getByRole("button", { name: "✕" }).click();
    await page.getByRole("link", { name: "Mobiles" }).click();
    await page.pause();
})