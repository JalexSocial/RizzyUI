import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

// Used by eng/consumer-smoke-test.sh, which builds, publishes and starts the consumer app and
// passes its URL in SMOKE_BASE_URL. Not meant to be run on its own.
const chromiumExecutablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  || (process.platform === 'win32'
    ? [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe')
    ].find(path => path && existsSync(path))
    : undefined);

export default defineConfig({
  testDir: './tests/consumer-smoke',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: 0,
  workers: 1,
  reporter: [['list']],
  outputDir: 'test-results-consumer-smoke',
  use: {
    baseURL: process.env.SMOKE_BASE_URL || 'http://127.0.0.1:5199',
    trace: 'retain-on-failure',
    headless: true
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(chromiumExecutablePath ? { launchOptions: { executablePath: chromiumExecutablePath } } : {})
      }
    }
  ]
});
