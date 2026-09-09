import { test as setup, expect } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { getSalesforceVerificationCode } from "../utils/gmail";

dotenv.config({
  path: path.resolve(process.cwd(), "config", ".env"),
});

const username = process.env.SF_USERNAME;
const password = process.env.SF_PASSWORD;

if (!username || !password) {
  throw new Error("SF_USERNAME and SF_PASSWORD must be defined in config/.env");
}

setup("Salesforce authentication", async ({ page }) => {
  await page.goto("https://developer.salesforce.com/");

  await page.locator(".desktop-login").click();

  await page
    .getByRole("link", {
      name: "Salesforce Login",
    })
    .click();

  await page.getByLabel("Username").fill(username);

  await page.locator("#Login").click();

  await page.getByLabel("Password").fill(password);

  await page.locator("#Login").click();

  // Salesforce should send the verification email
  console.log("Waiting for Salesforce verification email...");

  const verificationCode = await getSalesforceVerificationCode();

  console.log("Salesforce verification code received.");

  // Enter verification code
  const verificationCodeInput = page.getByRole("textbox", {
    name: "Verification Code",
  });

  await verificationCodeInput.waitFor({
    state: "visible",
    timeout: 30000,
  });

  await verificationCodeInput.fill(verificationCode);

  // Click the verification button
  const buttons = page.getByRole("button",{name:"Verify"});

  console.log(`Found ${await buttons.count()} buttons on verification page.`);

  await buttons.last().click();

  await page.waitForURL(/lightning\/page\/home|lightning\.force\.com/, {
    timeout: 30000,
  });

  await page.context().storageState({
    path: "playwright/.auth/salesforce.json",
  });
});
