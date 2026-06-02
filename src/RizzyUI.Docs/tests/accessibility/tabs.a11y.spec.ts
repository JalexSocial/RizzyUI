import { expect, test } from '@playwright/test';
import { expectActiveElement, expectAriaRelationship, pressKey, pressTab, runAxeScan } from './helpers/accessibility-helpers';

const fixtures = ['/accessibility-tabs.html', '/accessibility-tabs-csp.html'];

test.describe('Tabs accessibility contract', () => {
  for (const fixture of fixtures) {
    test(`semantics, roving tabindex, activation, and focus: ${fixture}`, async ({ page }) => {
      await page.goto(fixture);

      const tablist = page.getByRole('tablist', { name: 'Account sections' });
      await expect(tablist).toHaveAttribute('aria-orientation', 'horizontal');

      const account = page.getByRole('tab', { name: 'Account' });
      const disabled = page.getByRole('tab', { name: 'Disabled' });
      const password = page.getByRole('tab', { name: 'Password' });
      const billing = page.getByRole('tab', { name: 'Billing' });
      const accountPanel = page.locator('#settings-tabs-account-content');
      const passwordPanel = page.locator('#settings-tabs-password-content');
      const billingPanel = page.locator('#settings-tabs-billing-content');

      await expectAriaRelationship(account, 'aria-controls', 'settings-tabs-account-content');
      await expectAriaRelationship(accountPanel, 'aria-labelledby', 'settings-tabs-account-trigger');
      await expect(account).toHaveAttribute('aria-selected', 'true');
      await expect(account).toHaveAttribute('tabindex', '0');
      await expect(disabled).toHaveAttribute('aria-disabled', 'true');
      await expect(disabled).toHaveAttribute('tabindex', '-1');
      await expect(accountPanel).toBeVisible();
      await expect(accountPanel).toHaveAttribute('aria-hidden', 'false');
      await expect(passwordPanel).toBeHidden();
      await expect(passwordPanel).toHaveAttribute('aria-hidden', 'true');

      await account.focus();
      await pressKey(page, 'ArrowRight');
      await expectActiveElement(page, password);
      await expect(password).toHaveAttribute('aria-selected', 'true');
      await expect(password).toHaveAttribute('tabindex', '0');
      await expect(passwordPanel).toBeVisible();
      await expect(account).toHaveAttribute('tabindex', '-1');
      await expect(disabled).toHaveAttribute('tabindex', '-1');

      await pressKey(page, 'ArrowDown');
      await expectActiveElement(page, password);
      await expect(password).toHaveAttribute('aria-selected', 'true');

      await pressKey(page, 'End');
      await expectActiveElement(page, billing);
      await expect(billingPanel).toBeVisible();

      await pressKey(page, 'ArrowRight');
      await expectActiveElement(page, account);
      await expect(accountPanel).toBeVisible();

      await pressTab(page);
      await expectActiveElement(page, accountPanel);

      await expect(page.locator('[aria-live]')).toHaveCount(0);
      await expect.poll(() => page.evaluate(() => window['tabsEvents'])).toEqual(['password', 'billing', 'account']);
    });

    test(`vertical orientation and Home/End behavior: ${fixture}`, async ({ page }) => {
      await page.goto(fixture);

      const tablist = page.getByRole('tablist', { name: 'Profile sections' });
      await expect(tablist).toHaveAttribute('aria-orientation', 'vertical');

      const overview = page.getByRole('tab', { name: 'Overview' });
      const activity = page.getByRole('tab', { name: 'Activity' });
      const activityPanel = page.locator('#vertical-tabs-activity-content');

      await overview.focus();
      await pressKey(page, 'ArrowRight');
      await expectActiveElement(page, overview);
      await expect(overview).toHaveAttribute('aria-selected', 'true');

      await pressKey(page, 'ArrowDown');
      await expectActiveElement(page, activity);
      await expect(activity).toHaveAttribute('aria-selected', 'true');
      await expect(activityPanel).toBeVisible();

      await pressKey(page, 'Home');
      await expectActiveElement(page, overview);

      await pressKey(page, 'End');
      await expectActiveElement(page, activity);
    });

    test(`has no axe violations: ${fixture}`, async ({ page }) => {
      await page.goto(fixture);
      await runAxeScan(page);
    });
  }
});
