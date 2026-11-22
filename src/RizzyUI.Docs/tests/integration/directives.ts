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

    test('an AsChild trigger child keeps its handler and id; the trigger still opens (D-25, D-26)', async ({ page }) => {
      const errors = collectPageErrors(page);
      const button = page.locator('#share-button');
      await button.click();
      await expect(page.locator('#shares')).toHaveText('1');
      await expect(page.locator('#share-content')).toBeVisible();
      await expect(page.locator('[data-slot="popover-content"]', { has: page.locator('#share-content') })).toHaveAttribute('aria-labelledby', 'share-button');
      expect(errors).toEqual([]);
    });

    test('RzToggle dispatches rz:toggle:change and posts its value while pressed (SF-015)', async ({ page }) => {
      const errors = collectPageErrors(page);
      await page.evaluate(() => {
        (window as any).__toggleEvents = [];
        document.getElementById('events-section')!.addEventListener('rz:toggle:change', (e: any) => (window as any).__toggleEvents.push(e.detail));
      });
      const formValue = () => page.evaluate(() => new FormData(document.getElementById('toggle-form') as HTMLFormElement).get('featured'));
      expect(await formValue()).toBeNull();
      await page.locator('#named-toggle').click();
      await expect.poll(() => page.evaluate(() => (window as any).__toggleEvents)).toEqual([{ pressed: true, value: 'yes' }]);
      expect(await formValue()).toBe('yes');
      await page.locator('#named-toggle').click();
      expect(await formValue()).toBeNull();
      expect(errors).toEqual([]);
    });

    test('menubar checkbox and radio items dispatch rz:menubar:checked-change on the menubar (SF-067)', async ({ page }) => {
      const errors = collectPageErrors(page);
      await page.evaluate(() => {
        (window as any).__menuEvents = [];
        document.getElementById('view-menubar')!.addEventListener('rz:menubar:checked-change', (e: any) => (window as any).__menuEvents.push(e.detail));
      });
      await page.locator('#view-menu').click();
      await page.locator('#drafts-item').click();
      await page.locator('#compact-item').click();
      await expect.poll(() => page.evaluate(() => (window as any).__menuEvents)).toEqual([
        { type: 'checkbox', value: 'drafts', checked: true, group: null },
        { type: 'radio', value: 'compact', checked: true, group: 'density' },
      ]);
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
