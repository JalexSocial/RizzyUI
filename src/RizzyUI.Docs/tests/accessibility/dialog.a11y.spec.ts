import { expect, test } from '@playwright/test';
import { expectActiveElement, expectAriaRelationship, expectRoleAndAccessibleName, pressKey, pressShiftTab, pressTab, runAxeScan } from './helpers/accessibility-helpers';

test.describe('Dialog accessibility contract', () => {
  test('supports labelledby naming, focus trap, escape close, and focus restore', async ({ page }) => {
    await page.goto('/accessibility-dialog.html');

    const trigger = page.getByRole('button', { name: 'Open Account Preferences' });
    await trigger.click();

    const dialog = await expectRoleAndAccessibleName(page, 'dialog', 'Account Preferences');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expectAriaRelationship(dialog, 'aria-labelledby', 'dialog-title');
    await expectAriaRelationship(dialog, 'aria-describedby', 'dialog-description');

    const firstFocus = page.locator('#dialog-input');
    await expectActiveElement(page, firstFocus);

    await pressTab(page);
    await expectActiveElement(page, page.locator('#dialog-nested-popover'));

    await pressTab(page);
    await expectActiveElement(page, page.getByRole('button', { name: 'Close dialog' }));

    await pressTab(page);
    await expectActiveElement(page, firstFocus);

    await pressShiftTab(page);
    await expectActiveElement(page, page.getByRole('button', { name: 'Close dialog' }));

    await pressKey(page, 'Escape');
    await expect(dialog).toBeHidden();
    await expectActiveElement(page, trigger);
  });

  test('supports aria-label fallback and outside click dismissal for topmost layer', async ({ page }) => {
    await page.goto('/accessibility-dialog.html');

    const trigger = page.getByRole('button', { name: 'Open Support Details' });
    await trigger.click();

    const dialog = await expectRoleAndAccessibleName(page, 'dialog', 'Support details');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog).toHaveAttribute('aria-label', 'Support details');

    await page.mouse.click(10, 10);
    await expect(dialog).toBeHidden();
  });

  test('has no axe violations and no focus-stealing live region on open/close', async ({ page }) => {
    await page.goto('/accessibility-dialog.html');
    await runAxeScan(page);

    const trigger = page.getByRole('button', { name: 'Open Account Preferences' });
    await trigger.click();
    await expect(page.locator('[aria-live]')).toHaveCount(0);
    await expectActiveElement(page, page.locator('#dialog-input'));

    await pressKey(page, 'Escape');
    await expectActiveElement(page, trigger);
  });
});
