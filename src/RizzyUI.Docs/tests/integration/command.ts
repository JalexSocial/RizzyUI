import { expect, test } from '@playwright/test';
import { collectPageErrors } from './helpers';

// RzCommand's data-driven items on /_tests/command (Components/IntegrationTests/CommandHarness.razor).
// Summit SF-040: CommandItemTemplate reported its id after RzCommand had rendered, so data-template-id
// was always missing and Items/ItemsUrl rendered nothing ("No data template found").

export function defineCommandSpecs(runtime: string) {
  test.describe(`RzCommand data items (${runtime})`, () => {
    test('Items render through CommandItemTemplate and filter (SF-040)', async ({ page }) => {
      const errors = collectPageErrors(page);
      await page.goto('/_tests/command');
      const command = page.locator('#command-items');
      await expect(command.getByRole('option')).toHaveText(['Open file', 'Save file', 'Close window', 'Go to the harness']);
      await command.getByPlaceholder('Search static items').fill('save');
      await expect(command.getByRole('option')).toHaveText(['Save file']);
      expect(errors).toEqual([]);
    });

    test('Enter right after typing runs the match, not the item highlighted before (SF-025)', async ({ page }) => {
      const errors = collectPageErrors(page);
      await page.goto('/_tests/command');
      const command = page.locator('#command-items');
      await expect(command.getByRole('option').first()).toBeVisible();
      await page.evaluate(() => document.addEventListener('rz:command:execute', (e) => ((window as any).__executed = (e as CustomEvent).detail.value)));
      const input = command.getByPlaceholder('Search static items');
      await input.click();
      await page.keyboard.type('close', { delay: 0 });
      await page.keyboard.press('Enter');
      await expect.poll(() => page.evaluate(() => (window as any).__executed)).toBe('close');
      expect(errors).toEqual([]);
    });

    test('an item with Href navigates when chosen (SF-016)', async ({ page }) => {
      const errors = collectPageErrors(page);
      await page.goto('/_tests/command');
      const command = page.locator('#command-items');
      await command.getByRole('option', { name: 'Go to the harness' }).click();
      await expect(page).toHaveURL(/\/_tests\/harness$/);
      expect(errors).toEqual([]);
    });

    test('ItemsUrl items load and render through CommandItemTemplate (SF-040)', async ({ page }) => {
      const errors = collectPageErrors(page);
      await page.goto('/_tests/command');
      const command = page.locator('#command-remote');
      await expect(command.getByRole('option')).toHaveText(['Alpha', 'Bravo', 'Charlie', 'Delta']);
      await expect(command).not.toContainText('No data template found');
      expect(errors).toEqual([]);
    });
  });
}
