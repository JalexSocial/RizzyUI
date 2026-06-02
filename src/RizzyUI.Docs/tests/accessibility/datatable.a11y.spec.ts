import { expect, test } from '@playwright/test';
import { expectActiveElement, pressKey, runAxeScan } from './helpers/accessibility-helpers';

const fixtures = ['/accessibility-datatable.html', '/accessibility-datatable-csp.html'];

test.describe('DataTable accessibility contract', () => {
  for (const fixture of fixtures) {
    test(`uses semantic table controls without grid semantics: ${fixture}`, async ({ page }) => {
      await page.goto(fixture);

      const table = page.getByRole('table', { name: 'Team members' });
      await expect(table).toBeVisible();
      await expect(table).not.toHaveAttribute('role', 'grid');
      await expect(page.locator('[role="grid"]')).toHaveCount(0);

      await expect(page.locator('#name-header')).toHaveAttribute('aria-sort', 'none');
      await expect(page.getByRole('button', { name: 'Sort ascending' }).first()).toBeVisible();
      await expect(page.getByRole('checkbox', { name: 'Select visible rows' })).toBeVisible();
      await expect(page.getByRole('checkbox', { name: 'Select row Ada Lovelace' })).toBeVisible();
      await expect(page.getByRole('searchbox', { name: 'Filter users' })).toHaveAttribute('aria-controls', 'users-table');
      await expect(page.getByRole('navigation', { name: 'Users pages' })).toBeVisible();
      await expect(page.locator('#datatable-announcement')).toHaveAttribute('aria-live', 'polite');
    });

    test(`selection checkboxes activate from keyboard and preserve focus: ${fixture}`, async ({ page }) => {
      await page.goto(fixture);

      const adaCheckbox = page.getByRole('checkbox', { name: 'Select row Ada Lovelace' });
      await adaCheckbox.focus();
      await pressKey(page, 'Space');

      await expect(adaCheckbox).toBeChecked();
      await expectActiveElement(page, adaCheckbox);
      await expect(page.locator('#datatable-announcement')).toHaveText('1 row selected.');
      await expect.poll(() => page.evaluate(() => window['dataTableEvents'].map((event: { type: string }) => event.type))).toContain('rz:datatable:selection-changed');

      const selectVisible = page.getByRole('checkbox', { name: 'Select visible rows' });
      await selectVisible.focus();
      await pressKey(page, 'Space');

      await expect(selectVisible).toBeChecked();
      await expect(page.getByRole('checkbox', { name: 'Select row Grace Hopper' })).toBeChecked();
      await expectActiveElement(page, selectVisible);
    });

    test(`sort buttons activate with Enter and Space and expose aria-sort state: ${fixture}`, async ({ page }) => {
      await page.goto(fixture);

      const nameHeader = page.locator('#name-header');
      const sortName = page.locator('#sort-name');

      await sortName.focus();
      await pressKey(page, 'Enter');
      await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
      await expect(sortName).toHaveAttribute('aria-label', 'Sort descending');
      await expectActiveElement(page, sortName);
      await expect(page.locator('#datatable-announcement')).toHaveText('Sorted by name ascending.');

      await pressKey(page, 'Space');
      await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
      await expect(sortName).toHaveAttribute('aria-label', 'Clear sort');
      await expectActiveElement(page, sortName);
      await expect.poll(() => page.evaluate(() => window['dataTableEvents'].filter((event: { type: string }) => event.type === 'rz:datatable:sort-changed').length)).toBe(2);
    });

    test(`filtering updates result count, announcements, state events, and input focus: ${fixture}`, async ({ page }) => {
      await page.goto(fixture);

      const filter = page.getByRole('searchbox', { name: 'Filter users' });
      await filter.focus();
      await filter.fill('Grace');

      await expect(page.locator('#result-count')).toHaveText('Showing 1 to 1 of 1 results');
      await expect(page.getByRole('checkbox', { name: 'Select row Grace Hopper' })).toBeVisible();
      await expect(page.getByRole('checkbox', { name: 'Select row Ada Lovelace' })).toHaveCount(0);
      await expect(page.locator('#datatable-announcement')).toHaveText('Filters applied. 1 rows match.');
      await expectActiveElement(page, filter);
      await expect.poll(() => page.evaluate(() => window['dataTableEvents'].find((event: { type: string }) => event.type === 'rz:datatable:filter-changed')?.detail.globalFilter)).toBe('Grace');
    });

    test(`pagination controls activate from keyboard and preserve focus: ${fixture}`, async ({ page }) => {
      await page.goto(fixture);

      const next = page.getByRole('button', { name: 'Next page' });
      await next.focus();
      await pressKey(page, 'Enter');

      await expect(page.locator('#page-summary')).toHaveText('Page 2 of 2');
      await expect(page.locator('#result-count')).toHaveText('Showing 3 to 4 of 4 results');
      await expect(page.getByRole('checkbox', { name: 'Select row Katherine Johnson' })).toBeVisible();
      await expectActiveElement(page, next);
      await expect.poll(() => page.evaluate(() => window['dataTableEvents'].find((event: { type: string }) => event.type === 'rz:datatable:page-changed')?.detail.pagination.pageIndex)).toBe(1);

      const previous = page.getByRole('button', { name: 'Previous page' });
      await previous.focus();
      await pressKey(page, 'Space');
      await expect(page.locator('#page-summary')).toHaveText('Page 1 of 2');
      await expectActiveElement(page, previous);
    });

    test(`column visibility checkboxes update visible state and preserve focus: ${fixture}`, async ({ page }) => {
      await page.goto(fixture);

      const emailToggle = page.getByRole('checkbox', { name: 'Email column' });
      await emailToggle.focus();
      await pressKey(page, 'Space');

      await expect(emailToggle).not.toBeChecked();
      await expect(page.locator('#email-header')).toBeHidden();
      await expect(page.locator('tbody [data-column="email"]').first()).toBeHidden();
      await expect(page.locator('tbody [data-column="email"]').last()).toBeHidden();
      await expect(page.locator('#datatable-announcement')).toHaveText('3 of 4 columns visible.');
      await expectActiveElement(page, emailToggle);
      await expect.poll(() => page.evaluate(() => window['dataTableEvents'].find((event: { type: string }) => event.type === 'rz:datatable:column-visibility-changed')?.detail.visibleColumnIds)).toEqual(['select', 'name', 'role']);
    });

    test(`has no axe violations: ${fixture}`, async ({ page }) => {
      await page.goto(fixture);
      await runAxeScan(page);
    });
  }
});
