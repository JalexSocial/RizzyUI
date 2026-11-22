import { expect, test } from '@playwright/test';
import { collectPageErrors } from './helpers';

// Decisions D-24 and D-27 on /_tests/directives (Components/IntegrationTests/DirectivesHarness.razor).

export function defineDirectiveSpecs(runtime: string) {
  test.describe(`Caller directives on components (${runtime})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/_tests/directives');
      await expect.poll(() => page.evaluate(() => Boolean((document.getElementById('toggle') as any)?._x_dataStack))).toBe(true);
    });

    test('a caller x-on:click on RzToggle runs and the toggle still toggles (SF-030)', async ({ page }) => {
      const errors = collectPageErrors(page);
      const toggle = page.locator('#toggle');
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('#toggle-clicks')).toHaveText('1');
      expect(errors).toEqual([]);
    });

    test('a caller x-on:click on a menubar item runs and the menu closes (SF-069)', async ({ page }) => {
      const errors = collectPageErrors(page);
      await page.locator('#file-menu').click();
      await page.locator('#publish-item').click();
      await expect(page.locator('#menu-clicks')).toHaveText('1');
      await expect(page.locator('#publish-item')).toBeHidden();
      expect(errors).toEqual([]);
    });

    test('x-syncprop on a component inside a dialog syncs with the app state, not the dialog (D-24)', async ({ page }) => {
      const errors = collectPageErrors(page);
      await page.locator('#open-dialog').click();
      const toggle = page.locator('#dialog-toggle');
      await expect(toggle).toBeVisible();
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('#app-bold')).toHaveText('true');
      expect(errors).toEqual([]);
    });

    test('x-syncprop on a component whose state is on an inner element reaches that state (D-24)', async ({ page }) => {
      const errors = collectPageErrors(page);
      const thumb = page.locator('#volume-slider [role="slider"]');
      await thumb.focus();
      await page.keyboard.press('ArrowRight');
      await expect(page.locator('#app-volume')).toHaveText('31');
      expect(errors).toEqual([]);
    });
  });
}
