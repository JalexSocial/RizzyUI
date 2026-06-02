import { expect, test } from '@playwright/test';
import { expectActiveElement, pressKey, runAxeScan } from './helpers/accessibility-helpers';

const fixtures = ['/accessibility-dropdown-menu.html', '/accessibility-dropdown-menu-csp.html'];

test.describe('Dropdown menu widget accessibility contract', () => {
  for (const fixture of fixtures) {
    test(`semantics + keyboard + dismissal: ${fixture}`, async ({ page }) => {
      await page.goto(fixture);

      const trigger = page.getByRole('button', { name: 'Open menu' });
      await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expect(trigger).toHaveAttribute('aria-controls', 'menu');

      await trigger.focus();
      await pressKey(page, 'Enter');
      const menu = page.getByRole('menu');
      await expect(menu).toBeVisible();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');

      await expectActiveElement(page, page.getByRole('menuitem', { name: 'Profile' }));

      await pressKey(page, 'ArrowDown');
      await expectActiveElement(page, page.getByRole('menuitem', { name: 'Settings' }));

      await pressKey(page, 'Home');
      await expectActiveElement(page, page.getByRole('menuitem', { name: 'Profile' }));

      await pressKey(page, 'End');
      await expectActiveElement(page, page.getByRole('menuitem', { name: 'More' }));

      await pressKey(page, 'Escape');
      await expect(menu).toBeHidden();
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expectActiveElement(page, trigger);
    });

    test(`nested menu dismissable-layer behavior: ${fixture}`, async ({ page }) => {
      await page.goto(fixture);

      const trigger = page.getByRole('button', { name: 'Open menu' });
      await trigger.click();
      await pressKey(page, 'End');
      await expectActiveElement(page, page.getByRole('menuitem', { name: 'More' }));

      await pressKey(page, 'ArrowRight');
      const subMenu = page.locator('#submenu');
      await expect(subMenu).toBeVisible();
      await expect(page.getByRole('menuitem', { name: 'Message' })).toHaveAttribute('tabindex', '-1');

      await pressKey(page, 'Escape');
      await expect(subMenu).toBeHidden();
      await expect(page.getByRole('menu')).toBeVisible();
      await expectActiveElement(page, page.getByRole('menuitem', { name: 'More' }));

      await pressKey(page, 'Escape');
      await expect(page.getByRole('menu')).toBeHidden();
      await expectActiveElement(page, trigger);
    });

    test(`has no axe violations: ${fixture}`, async ({ page }) => {
      await page.goto(fixture);
      await page.getByRole('button', { name: 'Open menu' }).click();
      await runAxeScan(page);
    });
  }
});
