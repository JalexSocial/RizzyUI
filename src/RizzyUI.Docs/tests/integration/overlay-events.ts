import { expect, test } from '@playwright/test';
import { collectPageErrors } from './helpers';

// Decision D-29 and Summit SF-002, SF-003, SF-032 on /_tests/overlay-events
// (Components/IntegrationTests/OverlayEventsHarness.razor).

export function defineOverlayEventSpecs(runtime: string) {
  test.describe(`Overlay events (${runtime})`, () => {
    const fire = (page: import('@playwright/test').Page, name: string, detail?: unknown) =>
      page.evaluate(([n, d]) => window.dispatchEvent(new CustomEvent(n as string, { detail: d })), [name, detail] as const);

    test.beforeEach(async ({ page }) => {
      await page.goto('/_tests/overlay-events');
      await expect.poll(() => page.evaluate(() => Boolean((document.getElementById('sheet-a') as any)?._x_dataStack))).toBe(true);
    });

    test('rz:dialog-close with an id closes only that dialog; without one it closes all (D-29)', async ({ page }) => {
      const errors = collectPageErrors(page);
      await fire(page, 'harness:open-a');
      await expect(page.getByRole('dialog', { name: 'Dialog A' })).toBeVisible();
      await fire(page, 'rz:dialog-close', { id: 'dialog-b' });
      await expect(page.getByRole('dialog', { name: 'Dialog A' })).toBeVisible();
      await fire(page, 'rz:dialog-close', { id: 'dialog-a' });
      await expect(page.getByRole('dialog', { name: 'Dialog A' })).toBeHidden();

      await fire(page, 'harness:open-a');
      await expect(page.getByRole('dialog', { name: 'Dialog A' })).toBeVisible();
      await fire(page, 'rz:dialog-close');
      await expect(page.getByRole('dialog', { name: 'Dialog A' })).toBeHidden();
      expect(errors).toEqual([]);
    });

    test('InitialFocus moves focus to the selected element when a dialog opens (SF-032)', async ({ page }) => {
      await fire(page, 'harness:open-b');
      await expect(page.locator('#b-second')).toBeFocused();
    });

    test('a sheet opens and closes from window events and reports both (SF-002, SF-032)', async ({ page }) => {
      const errors = collectPageErrors(page);
      await fire(page, 'harness:open-sheet');
      await expect(page.getByRole('dialog', { name: 'Sheet A' })).toBeVisible();
      await expect(page.locator('#sheet-save')).toBeFocused();
      await fire(page, 'rz:sheet-close', { id: 'another-sheet' });
      await expect(page.getByRole('dialog', { name: 'Sheet A' })).toBeVisible();
      await fire(page, 'rz:sheet-close', { id: 'sheet-a' });
      await expect(page.getByRole('dialog', { name: 'Sheet A' })).toBeHidden();
      await expect(page.locator('#sheet-events')).toHaveText('open:sheet-a,close:sheet-a');
      expect(errors).toEqual([]);
    });
  });
}
