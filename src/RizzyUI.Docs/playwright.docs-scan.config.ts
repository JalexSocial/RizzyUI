import { defineConfig } from '@playwright/test';
import integration from './playwright.integration.config';

// The docs scan (tests/integration/docs-scan.ts): every docs page, both builds. It shares the
// integration suite's servers and browser settings but runs as its own CI job, so it does not slow
// the integration tests down. Run: npm run test:docs-scan (expects `dotnet build` first).
const [standard, csp] = integration.projects!;

export default defineConfig({
  ...integration,
  testMatch: /docs-scan(\.csp)?\.scan\.ts$/,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never', outputFolder: 'playwright-report-docs-scan' }]] : [['list']],
  outputDir: 'test-results-docs-scan',
  projects: [
    { ...standard, testIgnore: undefined, testMatch: /docs-scan\.scan\.ts$/ },
    { ...csp, testIgnore: undefined, testMatch: /docs-scan\.csp\.scan\.ts$/ },
  ],
});
