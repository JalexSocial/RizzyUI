import { test } from '@playwright/test';
import { expectActiveElement, expectRoleAndAccessibleName, pressTab, runAxeScan } from './helpers/accessibility-helpers';

test('accessibility smoke test validates focus, role/name, and axe baseline', async ({ page }) => {
  await page.goto('/accessibility-smoke.html');

  await pressTab(page);
  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await expectActiveElement(page, skipLink);

  await pressTab(page);
  const button = await expectRoleAndAccessibleName(page, 'button', 'Smoke Action');
  await expectActiveElement(page, button);

  await runAxeScan(page);
});
