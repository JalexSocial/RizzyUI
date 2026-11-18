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

    test('navigation menu: disclosure triggers that do not open on focus; Escape closes', async ({ page }) => {
      const errors = await open(page, 'navigation-menu');
      await expectNoAxeViolations(page);
      await expectNoDanglingAriaReferences(page);

      const products = page.getByRole('button', { name: 'Products' });
      await expect(products).toHaveAttribute('aria-expanded', 'false');

      // RZUI-059: moving focus onto a trigger must not open its panel.
      await products.focus();
      await page.waitForTimeout(300);
      await expect(products).toHaveAttribute('aria-expanded', 'false');

      await page.keyboard.press('Enter');
      await expect(products).toHaveAttribute('aria-expanded', 'true');
      await expect(page.getByRole('link', { name: 'Analytics' })).toBeVisible();
      await expectNoDanglingAriaReferences(page);

      await page.keyboard.press('Escape');
      await expect(products).toHaveAttribute('aria-expanded', 'false');
      await expect(products).toBeFocused();
      expect(errors).toEqual([]);
    });

    test('menubar: menubar of menu buttons with arrow-key navigation', async ({ page }) => {
      const errors = await open(page, 'menubar');
      await expectNoAxeViolations(page);
      await expectNoDanglingAriaReferences(page);

      const menubar = page.getByRole('menubar');
      await expect(menubar).toBeVisible();
      const file = menubar.getByRole('menuitem', { name: 'File' });
      const edit = menubar.getByRole('menuitem', { name: 'Edit' });

      await file.focus();
      await page.keyboard.press('ArrowRight');
      await expect(edit).toBeFocused();
      await page.keyboard.press('ArrowLeft');
      await expect(file).toBeFocused();

      await page.keyboard.press('ArrowDown');
      const menu = page.getByRole('menu');
      await expect(menu).toBeVisible();
      await expect(page.getByRole('menuitem', { name: 'New Tab' })).toBeFocused();

      await page.keyboard.press('Escape');
      await expect(menu).toBeHidden();
      await expect(file).toBeFocused();
      expect(errors).toEqual([]);
    });

    test('command: combobox input that controls a listbox with an active descendant', async ({ page }) => {
      const errors = await open(page, 'command');
      await expectNoAxeViolations(page);
      await expectNoDanglingAriaReferences(page);

      const input = page.getByRole('combobox');
      await expect(input).toBeVisible();
      const listbox = page.getByRole('listbox');
      await expect(listbox).toBeVisible();
      await expect(listbox.getByRole('option')).toHaveCount(3);

      await input.focus();
      await page.keyboard.press('ArrowDown');
      const active = await input.getAttribute('aria-activedescendant');
      expect(active).toBeTruthy();
      await expect(page.locator(`[id="${active}"]`)).toHaveAttribute('role', 'option');

      await input.fill('calc');
      await expect(listbox.getByRole('option')).toHaveCount(1);
      await expectNoDanglingAriaReferences(page);
      expect(errors).toEqual([]);
    });

    test('collapsible: trigger reports and controls its content', async ({ page }) => {
      const errors = await open(page, 'collapsible');
      await expectNoAxeViolations(page);
      await expectNoDanglingAriaReferences(page);

      const trigger = page.locator('#collapsible-trigger');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expect(page.locator('#collapsible-body')).toBeHidden();

      await trigger.focus();
      await page.keyboard.press('Enter');
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('#collapsible-body')).toBeVisible();
      const controls = await trigger.getAttribute('aria-controls');
      expect(controls).toBeTruthy();
      await expect(page.locator(`[id="${controls}"]`)).toContainText('rizzy, rizzyui');
      expect(errors).toEqual([]);
    });

    test('slider: labelled slider with value semantics and arrow, Home and End keys', async ({ page }) => {
      const errors = await open(page, 'slider');
      await expectNoAxeViolations(page);
      await expectNoDanglingAriaReferences(page);

      const slider = page.getByRole('slider', { name: 'Volume' });
      await expect(slider).toHaveAttribute('aria-valuenow', '35');
      await expect(slider).toHaveAttribute('aria-valuemin', '0');
      await expect(slider).toHaveAttribute('aria-valuemax', '100');

      await slider.focus();
      await page.keyboard.press('ArrowRight');
      await expect(slider).toHaveAttribute('aria-valuenow', '36');
      await page.keyboard.press('End');
      await expect(slider).toHaveAttribute('aria-valuenow', '100');
      await page.keyboard.press('Home');
      await expect(slider).toHaveAttribute('aria-valuenow', '0');
      expect(errors).toEqual([]);
    });

    test('radio group: one tab stop and arrow keys move the selection', async ({ page }) => {
      const errors = await open(page, 'radio-group');
      await expectNoAxeViolations(page);
      await expectNoDanglingAriaReferences(page);

      const group = page.getByRole('radiogroup');
      await expect(group).toBeVisible();
      const defaultRadio = group.getByRole('radio', { name: 'Default' });
      const comfortable = group.getByRole('radio', { name: 'Comfortable' });
      await expect(defaultRadio).toBeChecked();

      await defaultRadio.focus();
      await page.keyboard.press('ArrowDown');
      await expect(comfortable).toBeFocused();
      await expect(comfortable).toBeChecked();
      expect(errors).toEqual([]);
    });

    test('carousel: labelled carousel region with named previous and next controls', async ({ page }) => {
      const errors = await open(page, 'carousel');
      await expectNoAxeViolations(page);
      await expectNoDanglingAriaReferences(page);

      const carousel = page.getByRole('region', { name: 'Featured items' });
      await expect(carousel).toBeVisible();
      await expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
      await expect(carousel.getByRole('button', { name: /previous/i })).toBeVisible();
      await expect(carousel.getByRole('button', { name: /next/i })).toBeVisible();
      expect(errors).toEqual([]);
    });

    test('dialog and sheet without a title: named by aria-label, no dangling references (RZUI-048)', async ({ page }) => {
      const errors = await open(page, 'untitled-overlays');

      await page.locator('#untitled-dialog-trigger').click();
      const dialog = page.getByRole('dialog', { name: 'Quick settings' });
      await expect(dialog).toBeVisible();
      await expectNoDanglingAriaReferences(page);
      await expectNoAxeViolations(page);
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();

      await page.locator('#untitled-sheet-trigger').click();
      const sheet = page.getByRole('dialog', { name: 'Filters' });
      await expect(sheet).toBeVisible();
      await expectNoDanglingAriaReferences(page);
      await expectNoAxeViolations(page);
      expect(errors).toEqual([]);
    });

    test('tabs with spaces in their values keep valid id references (RZUI-049)', async ({ page }) => {
      const errors = await open(page, 'tabs-spaced-values');
      await expectNoDanglingAriaReferences(page);
      await expectNoAxeViolations(page);

      const second = page.getByRole('tab', { name: 'Second' });
      await second.click();
      await expect(page.getByRole('tabpanel', { name: 'Second' })).toBeVisible();
      expect(errors).toEqual([]);
    });

    test('combobox: named combobox that opens a listbox and selects with the keyboard', async ({ page }) => {
      const errors = await open(page, 'combobox');
      const combobox = page.getByRole('combobox', { name: 'Fruit' });
      await expect(combobox).toBeVisible();
      await expectNoAxeViolations(page);

      await combobox.focus();
      await page.keyboard.press('ArrowDown');
      const listbox = page.getByRole('listbox');
      await expect(listbox).toBeVisible();
      await expect(listbox.getByRole('option', { name: 'Cherry' })).toBeVisible();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await expect.poll(() => page.locator('select[name]').first().inputValue()).not.toBe('banana');
      await expectNoDanglingAriaReferences(page);
      expect(errors).toEqual([]);
    });

    test('data table: captioned table with column headers and rows', async ({ page }) => {
      // The table's row and cell templates are inline Alpine expressions, which the CSP build does
      // not run (documented on the DataTable page); the CSP variant is not applicable.
      test.skip(variant === 'CSP build', 'DataTable templates use inline Alpine expressions (standard runtime only).');
      const errors = await open(page, 'data-table');
      const table = page.getByRole('table', { name: 'Team members' });
      await expect(table).toBeVisible();
      await expect(table.getByRole('columnheader', { name: 'Name' })).toBeVisible();
      await expect(table.getByRole('columnheader', { name: 'Email' })).toBeVisible();
      await expect(table.getByRole('row')).toHaveCount(4);
      await expect(table.getByRole('cell', { name: 'Grace Hopper' })).toBeVisible();
      await expectNoAxeViolations(page);
      expect(errors).toEqual([]);
    });

    test('toast: a server toast is a named live region with a named close button', async ({ page }) => {
      const errors = await open(page, 'toast');
      await expectNoAxeViolations(page);

      await page.locator('#toast-success').click();
      const toast = page.locator('[data-rz-toast-item]').first();
      await expect(toast).toBeVisible();
      await expect(toast).toContainText('Sent from the server.');
      const live = await toast.evaluate(el => ({ role: el.getAttribute('role'), live: el.getAttribute('aria-live') }));
      expect(['status', 'alert']).toContain(live.role);
      expect(['polite', 'assertive']).toContain(live.live);
      await expect(toast.getByRole('button')).toHaveAccessibleName(/.+/);
      await expectNoDanglingAriaReferences(page);
      await expectNoAxeViolations(page);
      expect(errors).toEqual([]);
    });

    test('file input: the file control is keyboard reachable and named', async ({ page }) => {
      const errors = await open(page, 'file-input');
      await expectNoAxeViolations(page);
      await expectNoDanglingAriaReferences(page);

      await page.locator('#harness').focus();
      await page.keyboard.press('Tab');
      const focusedName = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        return el ? (el.getAttribute('aria-label') ?? el.getAttribute('aria-labelledby') ?? el.textContent ?? '').trim() : '';
      });
      expect(focusedName.length).toBeGreaterThan(0);
      expect(errors).toEqual([]);
    });

    test('input OTP: named input that accepts typed digits', async ({ page }) => {
      const errors = await open(page, 'input-otp');
      await expectNoAxeViolations(page);
      await expectNoDanglingAriaReferences(page);

      const input = page.getByRole('textbox').first();
      await input.focus();
      await page.keyboard.type('123456');
      await expect.poll(() => page.locator('input[name="VerificationCode"]').first().inputValue()).toBe('123456');
      expect(errors).toEqual([]);
    });

    test('switch: named switch toggled with Space', async ({ page }) => {
      const errors = await open(page, 'switch');
      await expectNoAxeViolations(page);

      const toggle = page.getByRole('switch', { name: 'Airplane Mode' });
      await expect(toggle).not.toBeChecked();
      await toggle.focus();
      await page.keyboard.press('Space');
      await expect(toggle).toBeChecked();
      expect(errors).toEqual([]);
    });

    test('checkbox group: named checkboxes in a labelled group, toggled with Space', async ({ page }) => {
      const errors = await open(page, 'checkbox-group');
      await expectNoAxeViolations(page);
      await expectNoDanglingAriaReferences(page);

      const push = page.getByRole('checkbox', { name: 'Push notifications' });
      const email = page.getByRole('checkbox', { name: 'Email notifications' });
      await expect(email).toBeChecked();
      await expect(push).not.toBeChecked();
      await push.focus();
      await page.keyboard.press('Space');
      await expect(push).toBeChecked();
      expect(errors).toEqual([]);
    });

    test('native select: labelled select with the model value selected', async ({ page }) => {
      const errors = await open(page, 'native-select');
      await expectNoAxeViolations(page);
      const select = page.getByRole('combobox', { name: 'Fruit' });
      await expect(select).toHaveValue('banana');
      expect(errors).toEqual([]);
    });

    test('alert: dismissible alert with a named close button', async ({ page }) => {
      const errors = await open(page, 'alert');
      await expectNoAxeViolations(page);
      await expect(page.getByText('Update available')).toBeVisible();

      const close = page.getByRole('button', { name: /close|dismiss/i });
      await close.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByText('Update available')).toBeHidden();
      expect(errors).toEqual([]);
    });

    test('back to top: named button that returns to the top of the page', async ({ page }) => {
      const errors = await open(page, 'back-to-top');
      await page.evaluate(() => window.scrollTo(0, 2000));
      const button = page.getByRole('button', { name: /top/i });
      await expect(button).toBeVisible();
      await expectNoAxeViolations(page);
      await button.click();
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(50);
      expect(errors).toEqual([]);
    });
  });
}
