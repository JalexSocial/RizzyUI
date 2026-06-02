import { expect, test } from '@playwright/test';
import { expectActiveElement, expectRoleAndAccessibleName, pressKey, pressTab, runAxeScan } from './helpers/accessibility-helpers';

test.describe('Popover accessibility contract', () => {
  test('sets aria-haspopup/expanded/controls and toggles state via click and keyboard', async ({ page }) => {
    await page.goto('/accessibility-popover.html');

    const trigger = page.getByRole('button', { name: 'Open popover' });
    await expect(trigger).toHaveAttribute('aria-haspopup', 'true');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveAttribute('aria-controls', 'popover-content');

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#popover-content')).toBeVisible();

    await pressKey(page, 'Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#popover-content')).toBeHidden();

    await trigger.focus();
    await pressKey(page, 'Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await page.mouse.click(5, 5);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#popover-content')).toBeHidden();
  });

  test('does not trap focus and supports dialog role when configured', async ({ page }) => {
    await page.goto('/accessibility-popover.html');

    const trigger = page.getByRole('button', { name: 'Open popover' });
    await trigger.click();

    await pressTab(page);
    await expectActiveElement(page, page.locator('#popover-input'));

    await pressTab(page);
    await expectActiveElement(page, page.locator('#popover-action'));

    await pressTab(page);
    await expectActiveElement(page, page.getByRole('button', { name: 'Outside before' }));

    await pressKey(page, 'Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    const dialogTrigger = page.getByRole('button', { name: 'Open dialog popover' });
    await dialogTrigger.click();

    await expect(dialogTrigger).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(dialogTrigger).toHaveAttribute('aria-expanded', 'true');
    const dialogPopover = page.locator('#dialog-popover-content');
    await expect(dialogPopover).toBeVisible();
    await expect(dialogPopover).toHaveAttribute('role', 'dialog');
    await expect(dialogPopover).toHaveAttribute('aria-label', 'Dialog popover content');
  });

  test('has no axe violations', async ({ page }) => {
    await page.goto('/accessibility-popover.html');
    await runAxeScan(page);
  });
});
