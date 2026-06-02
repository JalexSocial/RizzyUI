import { expect, test, type Locator, type Page } from '@playwright/test';
import { expectActiveElement, pressKey, runAxeScan } from './helpers/accessibility-helpers';

const fixtures = ['/accessibility-overlay-regression.html', '/accessibility-overlay-regression-csp.html'];

async function expectAriaReferenceExists(locator: Locator, attributeName: 'aria-controls' | 'aria-labelledby' | 'aria-describedby' | 'aria-activedescendant'): Promise<void> {
  const value = await locator.getAttribute(attributeName);
  expect(value, `${attributeName} should be present`).toBeTruthy();

  for (const id of value!.split(/\s+/).filter(Boolean)) {
    const count = await locator.page().locator(`#${id}`).count();
    expect(count, `${attributeName} references missing id ${id}`).toBe(1);
  }
}

async function expectInitCount(page: Page, selector: string, expected: string): Promise<void> {
  await expect(page.locator(selector)).toHaveAttribute('data-init-count', expected);
}

test.describe('Overlay regression suite for Phase 2 components', () => {
  for (const fixture of fixtures) {
    test(`Dialog containing Dropdown keeps Escape scoped to the topmost dismissable layer: ${fixture}`, async ({ page }) => {
      await page.goto(fixture);

      const dialogTrigger = page.getByRole('button', { name: 'Open dialog regression' });
      await dialogTrigger.click();

      const dialog = page.getByRole('dialog', { name: 'Dialog overlay regression' });
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute('aria-modal', 'true');
      await expectAriaReferenceExists(dialog, 'aria-labelledby');
      await expectAriaReferenceExists(dialog, 'aria-describedby');

      const dropdownTrigger = page.getByRole('button', { name: 'Open dialog menu' });
      await expect(dropdownTrigger).toHaveAttribute('aria-haspopup', 'menu');
      await expect(dropdownTrigger).toHaveAttribute('aria-expanded', 'false');
      await expectAriaReferenceExists(dropdownTrigger, 'aria-controls');

      await dropdownTrigger.click();
      const menu = page.getByRole('menu', { name: 'Open dialog menu' });
      await expect(menu).toBeVisible();
      await expect(dropdownTrigger).toHaveAttribute('aria-expanded', 'true');
      await expectActiveElement(page, page.getByRole('menuitem', { name: 'Profile' }));

      await pressKey(page, 'Escape');
      await expect(menu).toBeHidden();
      await expect(dialog).toBeVisible();
      await expect(dropdownTrigger).toHaveAttribute('aria-expanded', 'false');
      await expectActiveElement(page, dropdownTrigger);

      await pressKey(page, 'Escape');
      await expect(dialog).toBeHidden();
      await expectActiveElement(page, dialogTrigger);
    });

    test(`Sheet containing Combobox preserves combobox focus and avoids duplicate enhanced-navigation init: ${fixture}`, async ({ page }) => {
      await page.goto(fixture);

      const sheetTrigger = page.getByRole('button', { name: 'Open sheet regression' });
      await sheetTrigger.click();

      const sheet = page.getByRole('dialog', { name: 'Sheet overlay regression' });
      await expect(sheet).toBeVisible();
      await expect(sheet).toHaveAttribute('aria-modal', 'true');
      await expectAriaReferenceExists(sheet, 'aria-labelledby');
      await expectInitCount(page, '#sheet-combobox', '1');

      await page.evaluate(() => window['simulateEnhancedNavigation']());
      await expectInitCount(page, '#sheet-combobox', '1');

      const input = page.getByRole('combobox', { name: 'Favorite fruit' });
      await expectAriaReferenceExists(input, 'aria-controls');
      await expectAriaReferenceExists(input, 'aria-labelledby');
      await expectAriaReferenceExists(input, 'aria-describedby');

      await input.focus();
      await expect(input).toHaveAttribute('aria-expanded', 'true');
      await expectAriaReferenceExists(input, 'aria-activedescendant');
      await expect(page.getByRole('listbox', { name: 'Favorite fruit options' })).toBeVisible();

      await page.getByRole('option', { name: 'Apple' }).click();
      await expect(page.getByRole('listbox', { name: 'Favorite fruit options' })).toBeHidden();
      await expect(sheet).toBeVisible();
      await expect(input).toHaveAttribute('aria-expanded', 'false');
      await expectActiveElement(page, input);

      await pressKey(page, 'Escape');
      await expect(sheet).toBeHidden();
      await expectActiveElement(page, sheetTrigger);
    });

    test(`Popover containing NativeSelect and Combobox keeps inner control dismissal separate from the popover layer: ${fixture}`, async ({ page }) => {
      await page.goto(fixture);

      const trigger = page.getByRole('button', { name: 'Open popover regression' });
      await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expectAriaReferenceExists(trigger, 'aria-controls');

      await trigger.click();
      const popover = page.getByRole('dialog', { name: 'Popover form controls' });
      await expect(popover).toBeVisible();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await expectAriaReferenceExists(popover, 'aria-labelledby');
      await expectActiveElement(page, page.locator('#popover-native-select'));

      const combobox = page.getByRole('combobox', { name: 'Popover combobox' });
      await combobox.focus();
      await expect(combobox).toHaveAttribute('aria-expanded', 'true');
      await expectAriaReferenceExists(combobox, 'aria-controls');
      await expectAriaReferenceExists(combobox, 'aria-activedescendant');
      await expect(page.getByRole('listbox', { name: 'Popover combobox options' })).toBeVisible();

      await page.getByRole('option', { name: 'Alpha' }).click();
      await expect(page.getByRole('listbox', { name: 'Popover combobox options' })).toBeHidden();
      await expect(popover).toBeVisible();
      await expectActiveElement(page, combobox);

      await pressKey(page, 'Escape');
      await expect(popover).toBeHidden();
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expectActiveElement(page, trigger);
    });

    test(`NavigationMenu inside Dialog preserves focus without duplicate initialization: ${fixture}`, async ({ page }) => {
      await page.goto(fixture);
      await expectInitCount(page, '#dialog-navigation', '1');

      await page.evaluate(() => window['simulateEnhancedNavigation']());
      await expectInitCount(page, '#dialog-navigation', '1');

      const dialogTrigger = page.getByRole('button', { name: 'Open dialog regression' });
      await dialogTrigger.click();

      const dialog = page.getByRole('dialog', { name: 'Dialog overlay regression' });
      const navTrigger = page.getByRole('button', { name: 'Products' });
      await expect(dialog).toBeVisible();
      await expectAriaReferenceExists(navTrigger, 'aria-controls');
      await navTrigger.focus();

      await pressKey(page, 'ArrowDown');
      await expect(navTrigger).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('#dialog-navigation-content')).toBeVisible();
      await expectActiveElement(page, page.getByRole('link', { name: 'Products overview' }));

      await navTrigger.click();
      await expect(page.locator('#dialog-navigation-content')).toBeHidden();
      await expect(dialog).toBeVisible();
      await expect(navTrigger).toHaveAttribute('aria-expanded', 'false');
      await expectActiveElement(page, navTrigger);

      await pressKey(page, 'Escape');
      await expect(dialog).toBeHidden();
      await expectActiveElement(page, dialogTrigger);
    });

    test(`Nested overlay fixture has no accessibility violations: ${fixture}`, async ({ page }) => {
      await page.goto(fixture);
      await page.getByRole('button', { name: 'Open dialog regression' }).click();
      await page.getByRole('button', { name: 'Open dialog menu' }).click();
      await runAxeScan(page);
    });
  }
});
