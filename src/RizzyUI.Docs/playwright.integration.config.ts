import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

// Browser tests against the real, server-rendered docs app: actual RizzyUI component markup,
// the packaged RizzyUI JavaScript, htmx 4 and Rizzy's client loaded through <RzScripts />.
// The static-fixture accessibility suite (playwright.config.ts) cannot cover any of these.
//
// Run: npm run test:integration (expects `dotnet build` to have been run first).
const chromiumExecutablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  || (process.platform === 'win32'
    ? [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe')
    ].find(path => path && existsSync(path))
    : undefined);

// Debug only: a Release build of the docs app generates the static site and exits on startup.
const configuration = 'Debug';

export default defineConfig({
  testDir: './tests/integration',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  // Retries hide flaky focus and lifecycle behavior; fail on the first error instead.
  retries: 0,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never', outputFolder: 'playwright-report-integration' }]] : [['list']],
  outputDir: 'test-results-integration',
  use: {
    baseURL: 'http://127.0.0.1:5150',
    trace: 'retain-on-failure',
    headless: true
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: /\.csp\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        ...(chromiumExecutablePath ? { launchOptions: { executablePath: chromiumExecutablePath } } : {})
      }
    },
    {
      // The same docs app in CSP mode: a Content Security Policy without 'unsafe-eval' and the
      // rizzyui-csp.js build, so these specs exercise the Alpine CSP build on real components.
      name: 'chromium-csp',
      testMatch: /\.csp\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:5151',
        ...(chromiumExecutablePath ? { launchOptions: { executablePath: chromiumExecutablePath } } : {})
      }
    }
  ],
  webServer: [
    {
      command: `dotnet run --no-build -c ${configuration} --launch-profile http -- --Docs:EnableTestPages=true`,
      url: 'http://127.0.0.1:5150',
      reuseExistingServer: !process.env.CI,
      timeout: 180_000
    },
    {
      command: `dotnet run --no-build -c ${configuration} --launch-profile http -- --urls http://127.0.0.1:5151 --Docs:UseContentSecurityPolicy=true --Docs:EnableTestPages=true`,
      url: 'http://127.0.0.1:5151',
      reuseExistingServer: !process.env.CI,
      timeout: 180_000
    }
  ]
});
