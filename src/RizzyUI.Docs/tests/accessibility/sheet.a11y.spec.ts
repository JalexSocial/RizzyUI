import { expect, test } from '@playwright/test';
import {
  expectActiveElement,
  expectAriaRelationship,
  expectRoleAndAccessibleName,
  pressKey,
  pressShiftTab,
  pressTab,
  runAxeScan,
} from './helpers/accessibility-helpers';

test.describe('Sheet accessibility contract', () => {
  test.describe('modal mode', () => {
    test('moves focus inside, wraps tab order, closes on escape, restores trigger focus', async ({ page }) => {
      await page.goto('/accessibility-sheet.html');

      const trigger = page.getByRole('button', { name: 'Open modal sheet' });
      await trigger.click();

      const sheet = await expectRoleAndAccessibleName(page, 'dialog', 'Profile settings');
      await expect(sheet).toHaveAttribute('aria-modal', 'true');
      await expectAriaRelationship(sheet, 'aria-labelledby', 'modal-title');

      await expectActiveElement(page, page.locator('#modal-first'));

      await pressTab(page);
      await expectActiveElement(page, page.locator('#modal-last'));

      await pressTab(page);
      await expectActiveElement(page, page.getByRole('button', { name: 'Close modal sheet' }));

      await pressTab(page);
      await expectActiveElement(page, page.locator('#modal-first'));

      await pressShiftTab(page);
      await expectActiveElement(page, page.getByRole('button', { name: 'Close modal sheet' }));

      await pressKey(page, 'Escape');
      await expect(sheet).toBeHidden();
      await expectActiveElement(page, trigger);
    });

    test('supports outside click dismissal and keyboard close button activation', async ({ page }) => {
      await page.goto('/accessibility-sheet.html');

      await page.getByRole('button', { name: 'Open modal sheet' }).click();
      const sheet = await expectRoleAndAccessibleName(page, 'dialog', 'Profile settings');
      const closeButton = page.getByRole('button', { name: 'Close modal sheet' });

      await closeButton.focus();
      await pressKey(page, 'Enter');
      await expect(sheet).toBeHidden();

      await page.getByRole('button', { name: 'Open modal sheet' }).click();
      await page.mouse.click(5, 5);
      await expect(sheet).toBeHidden();
    });

    test('preserves semantics when side changes', async ({ page }) => {
      await page.goto('/accessibility-sheet.html');

      for (const sideTrigger of ['Open left modal sheet', 'Open right modal sheet']) {
        await page.getByRole('button', { name: sideTrigger }).click();
        const sheet = await expectRoleAndAccessibleName(page, 'dialog', 'Profile settings');
        await expect(sheet).toHaveAttribute('aria-modal', 'true');
        await pressKey(page, 'Escape');
        await expect(sheet).toBeHidden();
      }
    });
  });

  test.describe('non-modal mode', () => {
    test('does not trap focus, omits aria-modal, and closes on escape when configured', async ({ page }) => {
      await page.goto('/accessibility-sheet.html');

      const trigger = page.getByRole('button', { name: 'Open non-modal sheet' });
      await trigger.click();

      const sheet = await expectRoleAndAccessibleName(page, 'complementary', 'Navigation drawer');
      await expect(sheet).not.toHaveAttribute('aria-modal', 'true');
      await expectAriaRelationship(sheet, 'aria-labelledby', 'nonmodal-title');

      await pressTab(page);
      await expectActiveElement(page, page.getByRole('button', { name: 'Open non-modal label-only sheet' }));
      await pressTab(page);
      await expectActiveElement(page, page.getByRole('button', { name: 'Outside target' }));

      await pressKey(page, 'Escape');
      await expect(sheet).toBeHidden();
      await expectActiveElement(page, trigger);
    });

    test('supports aria-label naming fallback', async ({ page }) => {
      await page.goto('/accessibility-sheet.html');

      await page.getByRole('button', { name: 'Open non-modal label-only sheet' }).click();
      const sheet = await expectRoleAndAccessibleName(page, 'complementary', 'Quick links');
      await expect(sheet).toHaveAttribute('aria-label', 'Quick links');
      await expect(sheet).toBeVisible();

      await page.getByRole('button', { name: 'Close quick links sheet' }).click();
      await expect(sheet).toBeHidden();
    });
  });

  test('has no axe violations', async ({ page }) => {
    await page.goto('/accessibility-sheet.html');
    await runAxeScan(page);
  });
});
