import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { collectCspViolations, collectPageErrors, countGlobalListeners } from './helpers';

// Real RzDataTable<TItem> components on /_tests/datatable (Components/IntegrationTests/
// DataTableHarness.razor, PeopleTable.razor): the shipped Razor components, the built runtime bundle
// and TanStack Table, composed the documented way. The same specs run under the standard runtime
// (datatable.spec.ts) and under rizzyui-csp.js with a Content Security Policy (datatable.csp.spec.ts).

const datatableEvents = [
  'rz:datatable:ready',
  'rz:datatable:state-changed',
  'rz:datatable:sort-changed',
  'rz:datatable:filter-changed',
  'rz:datatable:page-changed',
  'rz:datatable:selection-changed',
  'rz:datatable:column-visibility-changed',
  'rz:datatable:announcement',
  'rz:datatable:row-selection-input-changed',
];

type RecordedEvent = { name: string; componentId: string | null; detail: any };

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

export function defineDataTableSpecs(variant: 'standard runtime' | 'CSP build') {
  test.describe(`RzDataTable on real components (${variant})`, () => {
    let errors: string[];
    let readViolations: () => Promise<string[]>;

    test.beforeEach(async ({ page }) => {
      errors = collectPageErrors(page);
      readViolations = await collectCspViolations(page);
      await page.addInitScript(names => {
        (window as any).__dtEvents = [];
        for (const name of names) {
          document.addEventListener(name, event => {
            const detail = (event as CustomEvent).detail ?? {};
            (window as any).__dtEvents.push({ name, componentId: detail.componentId ?? null, detail: JSON.parse(JSON.stringify(detail)) });
          });
        }
      }, datatableEvents);
      await page.goto('/_tests/datatable');
      await expect(page.locator('#people-table tbody tr[data-row-id]')).toHaveCount(10);
      await expect(page.locator('#products-table tbody tr')).toHaveCount(5);
    });

    test.afterEach(async () => {
      expect(errors).toEqual([]);
      expect(await readViolations()).toEqual([]);
    });

    const events = (page: Page, name?: string, componentId?: string) =>
      page.evaluate(([n, id]) => ((window as any).__dtEvents as RecordedEvent[])
        .filter(e => (!n || e.name === n) && (!id || e.componentId === id)), [name, componentId] as const);

    const people = (page: Page) => page.locator('#people-table');
    const rowIds = (page: Page) => people(page).locator('tbody tr[data-row-id]').evaluateAll(rows => rows.map(r => r.getAttribute('data-row-id')));
    const announcement = (page: Page) => people(page).locator('[data-slot="announcement"]');
    const nameHeader = (page: Page) => people(page).locator('th[data-column-id="Name"]');
    const selectAll = (page: Page) => people(page).locator('[data-slot="data-table-select-all-checkbox"]');
    const indeterminate = (page: Page, selector: string) => page.locator(selector).evaluate(el => (el as HTMLInputElement).indeterminate);

    test('initializes from the configuration and renders the authored table', async ({ page }) => {
      const table = people(page).getByRole('table', { name: 'People' });
      await expect(table).toBeVisible();
      // Grouped columns: a "Person" group over Name and Email, so two header rows.
      await expect(table.locator('thead tr')).toHaveCount(2);
      await expect(table.locator('th[data-column-id="person"]')).toHaveAttribute('colspan', '2');
      for (const name of ['Name', 'Email', 'Role', 'Age']) {
        await expect(table.locator(`thead tr:last-child th[data-column-id="${name}"]`)).toHaveCount(1);
      }
      expect(await rowIds(page)).toEqual(Array.from({ length: 10 }, (_, i) => `person-${String(i + 1).padStart(2, '0')}`));
      // Custom cell presentation: the Role column is a badge, other columns use x-flexrender.
      await expect(table.locator('tbody tr[data-row-id]').first().locator('td[data-column-id="Role"] [data-slot="badge"]')).toHaveText('Editor');
      await expect(table.locator('tbody tr[data-row-id]').first().locator('td[data-column-id="Name"]')).toHaveText('Person 01');
      await expect(page.locator('#people-summary')).toHaveText('Showing 1–10 of 25');

      const ready = await events(page, 'rz:datatable:ready');
      expect(ready.map(e => e.componentId).sort()).toEqual(['people-table', 'products-table']);
      const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
      expect(results.violations.map(v => v.id)).toEqual([]);
    });

    test('sorts ascending, descending and back to unsorted with aria-sort and announcements', async ({ page }) => {
      const toggle = nameHeader(page).locator('[data-slot="data-table-sort-toggle"]');
      await expect(nameHeader(page)).toHaveAttribute('aria-sort', 'none');
      // SF-053: the toggle is named after its column (every toggle was "Sort ascending"); the
      // header's aria-sort carries the direction.
      await expect(toggle).not.toHaveAttribute('aria-label', /.*/);
      await expect(toggle).toHaveAccessibleName('Name');

      // Keyboard operation.
      await toggle.focus();
      await page.keyboard.press('Enter');
      await expect(nameHeader(page)).toHaveAttribute('aria-sort', 'ascending');
      await expect(toggle).toHaveAttribute('data-sort-direction', 'asc');
      await expect(toggle).toHaveAccessibleName('Name');
      await expect(announcement(page)).toHaveText('Sorted by Name ascending.');
      // "<img ..." sorts before "Person ..."; the hostile name stays text (see the security spec).
      expect((await rowIds(page))[0]).toBe('person-13');

      await toggle.click();
      await expect(nameHeader(page)).toHaveAttribute('aria-sort', 'descending');
      expect((await rowIds(page))[0]).toBe('person-25');
      await expect(announcement(page)).toHaveText('Sorted by Name descending.');

      await toggle.click();
      await expect(nameHeader(page)).toHaveAttribute('aria-sort', 'none');
      await expect(toggle).toHaveAttribute('data-sort-direction', 'none');
      expect((await rowIds(page))[0]).toBe('person-01');
      await expect(announcement(page)).toHaveText('Sorting cleared.');

      // Columns that cannot sort render no toggle and no aria-sort.
      await expect(people(page).locator('th[data-column-id="Email"] [data-slot="data-table-sort-toggle"]')).toHaveCount(0);
      await expect(people(page).locator('th[data-column-id="Email"]')).not.toHaveAttribute('aria-sort', /.*/);

      const sortEvents = await events(page, 'rz:datatable:sort-changed', 'people-table');
      expect(sortEvents.map(e => e.detail.sorting)).toEqual([[{ id: 'Name', desc: false }], [{ id: 'Name', desc: true }], []]);
      expect((await events(page, 'rz:datatable:state-changed', 'people-table')).length).toBeGreaterThanOrEqual(3);
    });

    test('filters globally, shows the empty state and announces the result', async ({ page }) => {
      const filter = page.getByLabel('Filter people');
      await filter.fill('Person 02');
      await expect.poll(() => rowIds(page)).toEqual(['person-02']);
      await expect(page.locator('#people-summary')).toHaveText('Showing 1–1 of 1');

      await filter.fill('no such person');
      await expect(page.locator('#people-empty')).toHaveText('No people match.');
      await expect(people(page).locator('tbody tr[data-row-id]')).toHaveCount(0);
      await expect(announcement(page)).toHaveText('Filters applied. 0 rows match.');
      await expect(selectAll(page)).toBeDisabled();

      await filter.fill('');
      await expect(people(page).locator('tbody tr[data-row-id]')).toHaveCount(10);
      await expect(page.locator('#people-empty')).toHaveCount(0);
      await expect(announcement(page)).toHaveText('Filters cleared. 25 rows available.');
      const filterEvents = await events(page, 'rz:datatable:filter-changed', 'people-table');
      expect(filterEvents.at(-1)!.detail.globalFilter).toBe('');
    });

    test('pages with previous, next and page buttons, with disabled states and announcements', async ({ page }) => {
      const prev = page.locator('#people-prev');
      const next = page.locator('#people-next');
      await expect(prev).toBeDisabled();
      await expect(next).toBeEnabled();
      await expect(page.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');

      await next.click();
      await expect(page.locator('#people-summary')).toHaveText('Showing 11–20 of 25');
      await expect(page.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
      await expect(page.getByRole('button', { name: 'Page 1' })).not.toHaveAttribute('aria-current', /.*/);
      await expect(prev).toBeEnabled();

      await page.getByRole('button', { name: 'Page 3' }).click();
      await expect(page.locator('#people-summary')).toHaveText('Showing 21–25 of 25');
      await expect(next).toBeDisabled();
      await expect(announcement(page)).toHaveText('Page 3 of 3. Showing rows 21 to 25 of 25.');

      await prev.click();
      await expect(page.locator('#people-summary')).toHaveText('Showing 11–20 of 25');
      const pageEvents = await events(page, 'rz:datatable:page-changed', 'people-table');
      expect(pageEvents.map(e => e.detail.pagination.pageIndex)).toEqual([1, 2, 1]);
    });

    test('selects rows, all rows on the page, and shows the indeterminate state', async ({ page }) => {
      const firstRowBox = people(page).locator('tbody tr[data-row-id]').first().locator('[data-slot="data-table-row-select-checkbox"]');
      await firstRowBox.focus();
      await page.keyboard.press('Space');
      await expect(firstRowBox).toBeChecked();
      await expect(page.locator('#people-selected')).toHaveText('1 selected');
      await expect(selectAll(page)).not.toBeChecked();
      await expect.poll(() => indeterminate(page, '#people-table [data-slot="data-table-select-all-checkbox"]')).toBe(true);
      await expect(announcement(page)).toHaveText('1 row selected.');

      let selectionEvents = await events(page, 'rz:datatable:selection-changed', 'people-table');
      expect(selectionEvents).toHaveLength(1);
      expect(selectionEvents[0].detail.selectedRowIds).toEqual(['person-01']);

      await selectAll(page).click();
      await expect(selectAll(page)).toBeChecked();
      await expect.poll(() => indeterminate(page, '#people-table [data-slot="data-table-select-all-checkbox"]')).toBe(false);
      await expect(people(page).locator('tbody [data-slot="data-table-row-select-checkbox"]:checked')).toHaveCount(10);
      await expect(page.locator('#people-selected')).toHaveText('10 selected');
      await expect(announcement(page)).toHaveText('10 rows selected.');

      // Selection is per page for the page-scoped select-all box.
      await page.locator('#people-next').click();
      await expect(page.locator('#people-summary')).toHaveText('Showing 11–20 of 25');
      await expect(selectAll(page)).not.toBeChecked();
      await expect.poll(() => indeterminate(page, '#people-table [data-slot="data-table-select-all-checkbox"]')).toBe(false);
      await expect(people(page).locator('tbody [data-slot="data-table-row-select-checkbox"]:checked')).toHaveCount(0);

      selectionEvents = await events(page, 'rz:datatable:selection-changed', 'people-table');
      expect(selectionEvents.at(-1)!.detail.selectedRowCount).toBe(10);
    });

    test('hides and shows columns without losing sorting or selection', async ({ page }) => {
      await nameHeader(page).locator('[data-slot="data-table-sort-toggle"]').click();
      await nameHeader(page).locator('[data-slot="data-table-sort-toggle"]').click();
      await expect(nameHeader(page)).toHaveAttribute('aria-sort', 'descending');
      await people(page).locator('tbody tr[data-row-id]').first().locator('[data-slot="data-table-row-select-checkbox"]').check();
      const sortedIds = await rowIds(page);

      const emailToggle = page.locator('[data-column-toggle="Email"]');
      await emailToggle.uncheck();
      await expect(people(page).locator('th[data-column-id="Email"]')).toHaveCount(0);
      await expect(people(page).locator('tbody tr[data-row-id]').first().locator('td')).toHaveCount(4);
      await expect(people(page).locator('th[data-column-id="person"]')).toHaveAttribute('colspan', '1');
      await expect.poll(() => indeterminate(page, '#people-columns-all')).toBe(true);
      await expect(announcement(page)).toHaveText('4 of 5 columns visible.');
      expect(await rowIds(page)).toEqual(sortedIds);
      await expect(page.locator('#people-selected')).toHaveText('1 selected');
      await expect(page.locator('[data-column-toggle="select"]')).toBeDisabled();

      await page.locator('#people-columns-all').check();
      await expect(people(page).locator('th[data-column-id="Email"]')).toHaveCount(1);
      await expect(people(page).locator('tbody tr[data-row-id]').first().locator('td')).toHaveCount(5);
      await expect.poll(() => indeterminate(page, '#people-columns-all')).toBe(false);
      const visibility = await events(page, 'rz:datatable:column-visibility-changed', 'people-table');
      expect(visibility.map(e => e.detail.visibleColumnCount)).toEqual([4, 5]);
    });

    test('two tables keep independent state and events', async ({ page }) => {
      const productBoxes = page.locator('#products-table input[data-rz-datatable-row-select]');
      await expect(productBoxes).toHaveCount(5);
      await productBoxes.first().check();
      await expect(page.locator('#products-selected')).toHaveText('1 selected');
      await expect(page.locator('#people-selected')).toHaveText('0 selected');

      await people(page).locator('tbody tr[data-row-id]').nth(1).locator('[data-slot="data-table-row-select-checkbox"]').check();
      await expect(page.locator('#people-selected')).toHaveText('1 selected');
      await expect(page.locator('#products-selected')).toHaveText('1 selected');

      const productSelections = await events(page, 'rz:datatable:selection-changed', 'products-table');
      const peopleSelections = await events(page, 'rz:datatable:selection-changed', 'people-table');
      expect(productSelections.map(e => e.detail.selectedRowIds)).toEqual([['p-1']]);
      expect(peopleSelections.map(e => e.detail.selectedRowIds)).toEqual([['person-02']]);
      expect(await events(page, 'rz:datatable:row-selection-input-changed', 'people-table')).toHaveLength(0);
      expect(await events(page, 'rz:datatable:row-selection-input-changed', 'products-table')).toHaveLength(1);
    });

    test('renders data as text and escapes generated cell attributes', async ({ page }) => {
      // A name containing markup is shown as text by flex.text: no element, no handler.
      await page.getByRole('button', { name: 'Page 2' }).click();
      const hostileCell = people(page).locator('tr[data-row-id="person-13"] td[data-column-id="Name"]');
      await expect(hostileCell).toContainText('<img src=x onerror=');
      await expect(people(page).locator('tbody img')).toHaveCount(0);

      // The generated rowSelection cell (flex.html) escapes the row id into its attributes.
      await expect(page.locator('#injected')).toHaveCount(0);
      const ids = await page.locator('#products-table input[data-rz-datatable-row-select]').evaluateAll(boxes => boxes.map(b => (b as HTMLInputElement).dataset.rowId));
      expect(ids).toContain('p-"><b id="injected">x</b>');
      await page.locator('#products-table input[data-rz-datatable-row-select]').nth(3).check();
      const selection = await events(page, 'rz:datatable:selection-changed', 'products-table');
      expect(selection.at(-1)!.detail.selectedRowIds).toEqual(['p-"><b id="injected">x</b>']);
      expect(await page.evaluate(() => (window as any).__rzXss)).toBeUndefined();
    });

    test('htmx insert, replace and remove: one initialization per swap, no duplicate handling or leaked listeners', async ({ page }) => {
      const listenersBefore = await countGlobalListeners(page);

      for (let round = 1; round <= 3; round++) {
        await page.locator('#replace-people').click();
        await expect(page.locator('#people-region')).not.toHaveAttribute('data-round', String(round - 1 === 0 ? 0 : -1));
        await expect.poll(async () => (await events(page, 'rz:datatable:ready', 'people-table')).length).toBe(round + 1);
        await expect(people(page).locator('tbody tr[data-row-id]')).toHaveCount(10);
      }
      await expect(page.locator('#people-table')).toHaveCount(1);

      // One click, one event: the replaced instances no longer handle anything.
      const before = (await events(page, 'rz:datatable:selection-changed', 'people-table')).length;
      await people(page).locator('tbody tr[data-row-id]').first().locator('[data-slot="data-table-row-select-checkbox"]').check();
      await expect(page.locator('#people-selected')).toHaveText('1 selected');
      await expect.poll(async () => (await events(page, 'rz:datatable:selection-changed', 'people-table')).length).toBe(before + 1);

      // Sorting still works on the replacement.
      await nameHeader(page).locator('[data-slot="data-table-sort-toggle"]').click();
      await expect(nameHeader(page)).toHaveAttribute('aria-sort', 'ascending');

      await page.locator('#remove-people').click();
      await expect(page.locator('#people-table')).toHaveCount(0);
      await page.locator('#replace-people').click();
      await expect(people(page).locator('tbody tr[data-row-id]')).toHaveCount(10);
      await expect(nameHeader(page)).toHaveAttribute('aria-sort', 'none');

      // The products table was never swapped and is unaffected.
      expect(await events(page, 'rz:datatable:ready', 'products-table')).toHaveLength(1);
      expect(await countGlobalListeners(page)).toBe(listenersBefore);
    });
  });

  test.describe(`RzDataTable documentation examples (${variant})`, () => {
    test('every example on the DataTable page runs and responds without errors or CSP violations', async ({ page }) => {
      const errors = collectPageErrors(page);
      const readViolations = await collectCspViolations(page);
      await page.goto('/components/datatable');
      const tables = page.locator('[data-slot="datatable"]');
      await expect(tables.first().locator('tbody tr').first()).toBeVisible();
      const count = await tables.count();
      expect(count).toBeGreaterThanOrEqual(8);
      for (let i = 0; i < count; i++) {
        await expect(tables.nth(i).locator('tbody tr').first()).toBeVisible();
      }

      // Exercise each example's documented controls: filter, sort toggles, selection, column
      // visibility, pagination. A few of each kind per table covers every expression used (row
      // checkboxes repeat the same markup) and keeps the run time bounded on slower CI runners.
      await page.locator('#datatable-filter').fill('a');
      const clickSome = async (table: ReturnType<typeof tables.nth>, selector: string, limit: number) => {
        const items = table.locator(selector);
        let clicked = 0;
        for (let i = 0; i < await items.count() && clicked < limit; i++) {
          const item = items.nth(i);
          // Skip what a user cannot click: disabled, aria-disabled and the active page link, which
          // the examples style with pointer-events: none.
          const clickable = await item.isVisible() && await item.isEnabled()
            && (await item.getAttribute('aria-disabled')) !== 'true'
            && await item.evaluate(el => getComputedStyle(el).pointerEvents !== 'none');
          if (clickable) {
            await item.click();
            clicked++;
          }
        }
      };
      for (let i = 0; i < count; i++) {
        const table = tables.nth(i);
        await clickSome(table, '[data-slot="data-table-sort-toggle"]', 4);
        await clickSome(table, 'input[type="checkbox"]', 4);
        await clickSome(table, 'nav a, nav button', 3);
      }

      expect(errors).toEqual([]);
      expect(await readViolations()).toEqual([]);
    });
  });
}
