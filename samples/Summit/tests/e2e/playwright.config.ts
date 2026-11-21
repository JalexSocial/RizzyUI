import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

// Browser tests for Summit. Every spec runs against two servers: the standard build and the strict
// CSP build (Summit:Csp:Enabled, rizzyui-csp.js). Specs tagged @mobile also run at phone size.
//
// Local: `dotnet build samples/Summit/Summit.slnx` first; the config starts both servers.
// CI and published builds: set SUMMIT_BASE_URL and SUMMIT_CSP_BASE_URL to servers that are already
// running (eng/summit-test.sh does) and no server is started here.

const externalStandard = process.env.SUMMIT_BASE_URL;
const externalCsp = process.env.SUMMIT_CSP_BASE_URL;
const standardUrl = externalStandard ?? 'http://127.0.0.1:5270';
const cspUrl = externalCsp ?? 'http://127.0.0.1:5271';

const chromiumExecutablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  || (process.platform === 'win32'
    ? [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
    ].find(path => path && existsSync(path))
    : undefined);
const launchOptions = chromiumExecutablePath ? { launchOptions: { executablePath: chromiumExecutablePath } } : {};

const webProject = resolve(import.meta.dirname, '../../src/Summit.Web');

function server(port: number, csp: boolean) {
  return {
    command: `dotnet run --no-build --no-launch-profile --project "${webProject}" --urls http://127.0.0.1:${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      ASPNETCORE_ENVIRONMENT: 'Testing',
      Summit__Csp__Enabled: String(csp),
      Summit__Database__Path: `App_Data/e2e-${csp ? 'csp' : 'standard'}.db`,
      // The nightly CDN run (SUMMIT_CDN=1) loads the widget libraries from RizzyUI's CDN defaults.
      Summit__Assets__UseCdnDefaults: process.env.SUMMIT_CDN ? 'true' : 'false',
    },
  };
}

export default defineConfig({
  testDir: '.',
  testMatch: /(specs|scenarios)\/.*\.spec\.ts$/,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  // The repository's policy: retries hide flaky focus and lifecycle bugs. Fix or quarantine instead.
  retries: 0,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never', outputFolder: 'playwright-report' }]] : [['list']],
  outputDir: 'test-results',
  use: {
    trace: 'retain-on-failure',
    headless: true,
    // Animations (typing, tickers, marquee, carousel autoplay) stop or jump to their end state.
    reducedMotion: 'reduce',
    locale: 'en-US',
    timezoneId: 'Europe/Berlin',
  },
  projects: [
    { name: 'setup-standard', testMatch: /auth\.setup\.ts$/, use: { baseURL: standardUrl, ...launchOptions }, metadata: { storage: '.auth/standard.json' } },
    { name: 'setup-csp', testMatch: /auth\.setup\.ts$/, use: { baseURL: cspUrl, ...launchOptions }, metadata: { storage: '.auth/csp.json' } },
    {
      name: 'standard',
      dependencies: ['setup-standard'],
      use: { ...devices['Desktop Chrome'], baseURL: standardUrl, ...launchOptions },
      metadata: { csp: false, storage: '.auth/standard.json' },
    },
    {
      name: 'csp',
      dependencies: ['setup-csp'],
      use: { ...devices['Desktop Chrome'], baseURL: cspUrl, ...launchOptions },
      metadata: { csp: true, storage: '.auth/csp.json' },
    },
    {
      name: 'mobile',
      dependencies: ['setup-csp'],
      grep: /@mobile/,
      use: { ...devices['Pixel 7'], baseURL: cspUrl, ...launchOptions },
      metadata: { csp: true, storage: '.auth/csp.json' },
    },
  ],
  webServer: externalStandard && externalCsp ? undefined : [server(5270, false), server(5271, true)],
});
