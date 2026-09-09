# Playwright Salesforce

End-to-end tests for Salesforce Lightning, using Playwright. Authentication is handled once via a dedicated login step, and the resulting session is reused by the actual test suite (no repeated logins per run).

## Folder structure

```
Playwright_salesforce/
├── .env                        # SF_USERNAME / SF_PASSWORD (gitignored, not committed)
├── .gitignore
├── playwright.config.ts        # Project config: "setup" + "chromium" projects
├── package.json
├── playwright/
│   └── .auth/
│       └── salesforce.json     # Saved session (cookies + localStorage), gitignored
├── playwright-report/          # HTML report output (generated, gitignored)
├── test-results/               # Raw run artifacts/traces (generated, gitignored)
└── tests/
    ├── auth.setup.ts           # One-time login flow, saves storageState
    └── loginTest.spec.ts       # Actual test(s), reuse saved storageState
```

## Prerequisites

- Node.js installed
- Dependencies installed:
  ```bash
  npm install
  ```
- A `.env` file in the project root with valid Salesforce credentials:
  ```
  SF_USERNAME=your_username
  SF_PASSWORD=your_password
  ```

## Workflow

Tests are split into two Playwright **projects**:

| Project    | File               | Purpose                                              |
|------------|--------------------|-------------------------------------------------------|
| `setup`    | `tests/auth.setup.ts`   | Logs into Salesforce, saves session to `playwright/.auth/salesforce.json` |
| `chromium` | `tests/*.spec.ts`  | Runs actual tests, reusing the saved session (no login) |

These are **independent** — running tests does not automatically re-run the login step. You control that explicitly.

### 1. Log in and save a session

Run this once, or whenever the saved session expires/is deleted:

```bash
npm run test:login
```

- Runs headed (browser visible) so you can complete Salesforce's identity verification step if it appears (an emailed verification code), then the script resumes automatically.
- Writes/overwrites `playwright/.auth/salesforce.json`.

### 2. Run the actual tests

```bash
npm test
```

- Runs only the `chromium` project.
- Reuses `playwright/.auth/salesforce.json` — no login required.
- If this file is missing or the session has expired, tests will fail as if logged out — re-run `npm run test:login` first.

### Notes

- Both commands run **headed locally** (`headless: !!process.env.CI` in `playwright.config.ts` — headed when run locally, headless automatically in CI).
- Avoid running bare `npx playwright test` without a `--project` flag — with no filter, Playwright will run *all* projects, including `setup`. Use the npm scripts above instead.
- `playwright/.auth/salesforce.json` contains a live Salesforce session cookie — treat it like a credential. It's already gitignored; never commit it.
- View the last HTML report with:
  ```bash
  npx playwright show-report
  ```

## Running in CI (GitHub Actions)

The workflow lives at `.github/workflows/playwright.yml` and runs on every push/PR to `main`/`master`.

### 1. Add repository secrets

In GitHub: **Settings → Secrets and variables → Actions → New repository secret**, add:

- `SF_USERNAME`
- `SF_PASSWORD`

These are injected as env vars in the workflow, so `dotenv.config()` in `auth.setup.ts` picks them up without needing a `.env` file in CI.

### 2. Resolve the MFA / "Verify Your Identity" challenge for CI logins

This is the main blocker for unattended CI runs. Salesforce may challenge new IPs/browsers with an emailed verification code, which nothing in CI can read or enter.

Recommended fix (needs Salesforce admin access): use a dedicated CI/test user and allowlist the runner's IP so the challenge is skipped entirely —

- **Setup → Network Access → Trusted IP Ranges**, and/or
- that user's **Profile → Login IP Ranges**

GitHub-hosted runners use large, changing IP ranges, which makes this hard to pin down. A **self-hosted runner** with a fixed IP is much easier to allowlist. Until this is resolved, the `setup` step will hang/fail in CI exactly as it did locally before manual OTP entry was handled.

### 3. How the pipeline runs the tests

The workflow runs two steps in order, so a fresh session is generated on every CI run (no state persists between runs on a clean checkout):

```yaml
- name: Run auth setup
  run: npx playwright test --project=setup
- name: Run tests
  run: npx playwright test --project=chromium
```

`playwright.config.ts`'s `headless: !!process.env.CI` ensures both steps run headless automatically, since GitHub Actions sets the `CI` env var by default.

### 4. Test report artifact

On every run (pass, fail, or cancelled — except cancelled), the workflow uploads `playwright-report/` as a build artifact, downloadable from the Actions run summary, retained for 30 days.

### 5. Gmail OAuth – Salesforce Verification

Salesforce sends a verification code to Gmail when logging in from a new environment. To automate this step, the framework uses the Gmail API with Google OAuth 2.0.

How it works
Playwright logs in to Salesforce using the username and password.
Salesforce sends a verification code to Gmail.
The Gmail API automatically reads the Salesforce email.
The verification code is extracted and entered into Salesforce.
Login is completed without manual intervention.
Configuration
Gmail API is enabled through Google Cloud.
OAuth 2.0 credentials and a refresh token are configured.
Local credentials are stored in config/.env.
GitHub Actions credentials are stored securely as GitHub Secrets.
Xvfb is used in GitHub Actions to run the headed browser.
This allows Salesforce authentication and email verification to run automatically both locally and in GitHub Actions.
