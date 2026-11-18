import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { collectPageErrors } from './helpers';

// Accessibility contracts on real RizzyUI components (RM-4.1). The components render on
// /_tests/a11y/{family} (Components/IntegrationTests/A11yHarness.razor). The same specs run under
// the standard runtime (real-components.a11y.spec.ts) and the CSP build
// (real-components.a11y.csp.spec.ts).

async function open(page: Page, family: string) {
  const errors = collectPageErrors(page);
  await page.goto(`/_tests/a11y/${family}`);
  await expect.poll(() => page.evaluate(() => typeof (window as any).Rizzy?.toast)).not.toBe('undefined');
  return errors;
}

// The release gate is WCAG 2.x A/AA. axe's best-practice rules are left out: "region" fires for
// every overlay, which RizzyUI teleports to <body> (outside the page's landmarks) by design.
const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function expectNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
  const violations = results.violations.map(v => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.map(n => `${n.target.join(' ')}: ${n.failureSummary?.split('\n').slice(1).join(' ').trim()}`),
  }));
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
}

// RZUI-048: every ID an aria-* relationship points at must exist.
async function expectNoDanglingAriaReferences(page: Page) {
  const dangling = await page.evaluate(() => {
    const attributes = ['aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-activedescendant', 'aria-owns'];
    const problems: string[] = [];
    for (const attribute of attributes) {
      for (const element of document.querySelectorAll(`[${attribute}]`)) {
        for (const id of (element.getAttribute(attribute) ?? '').split(/\s+/).filter(Boolean)) {
          if (!document.getElementById(id)) problems.push(`${element.tagName.toLowerCase()}[${attribute}="${id}"]`);
        }
      }
    }
    return problems;
  });
  expect(dangling).toEqual([]);
}

async function expectFocusStaysInside(page: Page, containerSelector: string, presses = 6) {
  for (let i = 0; i < presses; i++) {
    await page.keyboard.press('Tab');
    const inside = await page.evaluate(selector => {
      const container = document.querySelector(selector);
      return Boolean(container && container.contains(document.activeElement));
    }, containerSelector);
    expect(inside, `focus left ${containerSelector} after ${i + 1} Tab presses`).toBe(true);
  }
}

export function defineRealComponentA11ySpecs(variant: string) {
  test.describe(`Real-component accessibility (${variant})`, () => {
    test('dialog: named modal dialog, focus trap, Escape and focus return', async ({ page }) => {
      const errors = await open(page, 'dialog');
      await expectNoAxeViolations(page);

      const trigger = page.locator('#dialog-trigger');
      await trigger.focus();
      await page.keyboard.press('Enter');

      const dialog = page.getByRole('dialog', { name: 'Account Preferences' });
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute('aria-modal', 'true');
      await expect(dialog).toHaveAccessibleDescription(/Update your account preferences/);
      await expect.poll(() => dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
      await expectFocusStaysInside(page, '[role="dialog"][aria-modal="true"]');
      await expectNoDanglingAriaReferences(page);
      await expectNoAxeViolations(page);

      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
      expect(errors).toEqual([]);
    });

    test('alert dialog: named alertdialog that Escape does not dismiss; Cancel returns focus', async ({ page }) => {
      const errors = await open(page, 'alert-dialog');
      const trigger = page.locator('#alert-dialog-trigger');
      await trigger.focus();
      await page.keyboard.press('Enter');

      const dialog = page.getByRole('alertdialog', { name: 'Are you absolutely sure?' });
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAccessibleDescription(/cannot be undone/);
      await expectFocusStaysInside(page, '[role="alertdialog"]');
      await expectNoDanglingAriaReferences(page);
      await expectNoAxeViolations(page);

      await page.keyboard.press('Escape');
      await expect(dialog).toBeVisible();

      await dialog.getByRole('button', { name: 'Cancel' }).click();
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
      expect(errors).toEqual([]);
    });

    test('sheet: named dialog, Escape closes and focus returns', async ({ page }) => {
      const errors = await open(page, 'sheet');
      const trigger = page.locator('#sheet-trigger');
      await trigger.focus();
      await page.keyboard.press('Enter');

      const sheet = page.getByRole('dialog', { name: 'Edit Profile' });
      await expect(sheet).toBeVisible();
      await expect(sheet).toHaveAccessibleDescription(/Make changes to your profile/);
      await expectNoDanglingAriaReferences(page);
      await expectNoAxeViolations(page);

      await page.keyboard.press('Escape');
      await expect(sheet).toBeHidden();
      await expect(trigger).toBeFocused();
      expect(errors).toEqual([]);
    });

    test('popover: trigger reports its state; Escape closes and focus returns', async ({ page }) => {
      const errors = await open(page, 'popover');
      await expectNoAxeViolations(page);

      const trigger = page.locator('#popover-trigger');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await trigger.focus();
      await page.keyboard.press('Enter');

      const content = page.locator('[data-slot="popover-content"]');
      await expect(content).toBeVisible();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await expectNoDanglingAriaReferences(page);
      await expectNoAxeViolations(page);

      await page.keyboard.press('Escape');
      await expect(content).toBeHidden();
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expect(trigger).toBeFocused();
      expect(errors).toEqual([]);
    });

    test('dropdown menu: menu button pattern with arrow-key navigation', async ({ page }) => {
      const errors = await open(page, 'dropdown-menu');
      await expectNoAxeViolations(page);

      const trigger = page.locator('#dropdown-trigger');
      await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await trigger.focus();
      await page.keyboard.press('Enter');

      const menu = page.getByRole('menu');
      await expect(menu).toBeVisible();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await expect(menu.getByRole('menuitem')).toHaveCount(3);

      const focusedItem = () => page.evaluate(() => document.activeElement?.textContent?.trim());
      await expect.poll(focusedItem).toBe('Profile');
      await page.keyboard.press('ArrowDown');
      await expect.poll(focusedItem).toBe('Billing');
      await expectNoDanglingAriaReferences(page);
      await expectNoAxeViolations(page);

      await page.keyboard.press('Escape');
      await expect(menu).toBeHidden();
      await expect(trigger).toBeFocused();
      expect(errors).toEqual([]);
    });

    test('tabs: tablist with roving tabindex, arrow-key activation and linked panels', async ({ page }) => {
      const errors = await open(page, 'tabs');
      await expectNoAxeViolations(page);
      await expectNoDanglingAriaReferences(page);

      const account = page.getByRole('tab', { name: 'Account' });
      const password = page.getByRole('tab', { name: 'Password' });
      await expect(account).toHaveAttribute('aria-selected', 'true');
      await expect(account).toHaveAttribute('tabindex', '0');
      await expect(password).toHaveAttribute('tabindex', '-1');

      const panel = page.getByRole('tabpanel', { name: 'Account' });
      await expect(panel).toBeVisible();

      await account.focus();
      await page.keyboard.press('ArrowRight');
      await expect(password).toBeFocused();
      await expect(password).toHaveAttribute('aria-selected', 'true');
      await expect(page.getByRole('tabpanel', { name: 'Password' })).toBeVisible();

      await page.keyboard.press('End');
      await expect(page.getByRole('tab', { name: 'Billing' })).toBeFocused();
      await page.keyboard.press('Home');
      await expect(account).toBeFocused();
      expect(errors).toEqual([]);
    });

    test('tooltip: shown on focus, describes its trigger, Escape hides it', async ({ page }) => {
      const errors = await open(page, 'tooltip');
      await expectNoAxeViolations(page);

      const trigger = page.locator('#tooltip-trigger');
      await trigger.focus();
      const tooltip = page.getByRole('tooltip');
      await expect(tooltip).toBeVisible();
      await expect(trigger).toHaveAccessibleDescription('Save your current changes.');
      await expectNoDanglingAriaReferences(page);

      await page.keyboard.press('Escape');
      await expect(tooltip).toBeHidden();
      expect(errors).toEqual([]);
    });

    test('accordion: buttons report and toggle their sections', async ({ page }) => {
      const errors = await open(page, 'accordion');
      await expectNoAxeViolations(page);
      await expectNoDanglingAriaReferences(page);

      const first = page.getByRole('button', { name: 'What browsers are supported?' });
      await expect(first).toHaveAttribute('aria-expanded', 'false');
      await first.focus();
      await page.keyboard.press('Enter');
      await expect(first).toHaveAttribute('aria-expanded', 'true');
      await expect(page.getByText('The latest Chrome, Firefox, Safari and Edge.')).toBeVisible();
      await page.keyboard.press('Enter');
      await expect(first).toHaveAttribute('aria-expanded', 'false');
      expect(errors).toEqual([]);
    });
  });
}
