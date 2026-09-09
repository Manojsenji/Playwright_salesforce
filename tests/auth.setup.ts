import { test as setup } from '@playwright/test';
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), "config", ".env"),
});

const username = process.env.SF_USERNAME;
const password = process.env.SF_PASSWORD;

if (!username || !password) {
  throw new Error("SF_USERNAME and SF_PASSWORD must be defined in .env");
}

setup('Salesforce authentication', async ({ page }) => {
    await page.goto('https://developer.salesforce.com/');

    await page.locator('.desktop-login').click();
    await page.getByRole('link', { name: 'Salesforce Login' }).click();

    await page.getByLabel("Username").fill(username);
    await page.locator("#Login").click();
    await page.getByLabel("Password").fill(password);

    await page.locator('#Login').click();
    await page.waitForURL(/lightning\/page\/home|lightning\.force\.com/, { timeout: 30000 });

    await page.context().storageState({
        path: 'playwright/.auth/salesforce.json'
    });
});