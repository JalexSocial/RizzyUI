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
      await expect(command.getByRole('option')).toHaveText(['Open file', 'Save file', 'Close window']);
      await command.getByPlaceholder('Search static items').fill('save');
      await expect(command.getByRole('option')).toHaveText(['Save file']);
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
