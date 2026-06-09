import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

const chromiumExecutablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  || (process.platform === 'win32'
    ? [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe')
    ].find(path => path && existsSync(path))
    : join(tmpdir(), 'chromium'));

export default defineConfig({
  testDir: './tests/accessibility',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  globalSetup: './tests/accessibility/scripts/playwright-global-setup.ts',
  use: {
    baseURL: 'http://127.0.0.1:5150',
    trace: 'on-first-retry',
    headless: true
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          executablePath: chromiumExecutablePath
        }
      }
    }
  ],
  webServer: {
    command: 'node ./tests/accessibility/scripts/serve-static.mjs ./wwwroot',
    url: 'http://127.0.0.1:5150',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
