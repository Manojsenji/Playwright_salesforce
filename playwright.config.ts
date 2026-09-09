import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  //reporter: "html",
  reporter: [["allure-playwright"]],
  use: {
    //trace: "on-first-retry",
    trace: "off",
    // trace: {
    //   mode: "on",
    //   screenshots: false,
    //   snapshots: false,
    // },
    headless: false,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    //headless: !!process.env.CI,
  },

  projects: [
    // Runs authentication first
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    // Runs actual tests after authentication
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/salesforce.json",
      },
    },
  ],
});
