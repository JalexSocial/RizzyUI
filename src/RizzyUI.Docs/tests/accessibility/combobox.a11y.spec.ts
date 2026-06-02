import { expect, test, type Locator, type Page } from '@playwright/test';

async function typeComboboxQuery(input: Locator, query: string) {
  await input.focus();
  await input.pressSequentially(query);
  await expect(input).toHaveValue(query);
}

async function expectActiveFilteredOption(page: Page, value: string) {
  const option = page.locator(`.ts-dropdown .option[data-value="${value}"]`);
  await expect(option).toBeVisible();
  await expect(page.locator('.ts-dropdown .option:visible')).toHaveCount(1);
  await expect(option).toHaveClass(/active/);
}

test.describe('Tom Select combobox accessibility baseline', () => {
  test('supports accessible name, search, keyboard navigation, selection, escape, and disabled options', async ({ page }) => {
    await page.goto('/accessibility-combobox.html');
    await page.waitForFunction(() => typeof window['TomSelect'] === 'function');
    await page.waitForFunction(() => !!window['__ts']);

    const input = page.locator('.ts-wrapper input').first();
    await expect(input).toHaveAttribute('aria-labelledby', 'fruit-label');
    await expect(input).toHaveAttribute('aria-describedby', 'fruit-help');

    await typeComboboxQuery(input, 'ora');
    await expectActiveFilteredOption(page, 'orange');
    await page.keyboard.press('Enter');

    await expect(page.locator('#fruit-select')).toHaveValue('orange');

    await typeComboboxQuery(input, 'cher');
    await expect(page.locator('.ts-dropdown .option[data-value="cherry"]')).toBeVisible();
    await expect(page.locator('.ts-dropdown .option:visible')).toHaveCount(1);
    await expect(page.locator('.ts-dropdown .option[data-value="cherry"]')).not.toHaveClass(/active/);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    await expect(page.locator('#fruit-select')).not.toHaveValue('cherry');

    await input.focus();
    await page.keyboard.press('Escape');
    await expect(page.locator('.ts-dropdown')).toBeHidden();
  });

  test('supports clean teardown and re-initialization', async ({ page }) => {
    await page.goto('/accessibility-combobox.html');
    await page.waitForFunction(() => typeof window['TomSelect'] === 'function');
    await page.waitForFunction(() => typeof window['replaceComboboxControl'] === 'function');

    await page.evaluate(() => {
      window['replaceComboboxControl']();
    });

    const input = page.locator('.ts-wrapper input').first();
    await expect(input).toBeVisible();
    await typeComboboxQuery(input, 'ban');
    await expectActiveFilteredOption(page, 'banana');
    await page.keyboard.press('Enter');

    await expect(page.locator('#fruit-select')).toHaveValue('banana');
  });
});
