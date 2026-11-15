import { expect, test, type Page } from '@playwright/test';

// Integration tests against the real docs app (server-rendered RizzyUI components, the packaged
// RizzyUI runtime, htmx 4 and Rizzy 6's client). See playwright.integration.config.ts.

function collectPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('console', message => {
    // Failed resource loads are reported with their URL by the response listener below.
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource')) {
      errors.push(`console.error: ${message.text()}`);
    }
  });
  page.on('response', response => {
    const url = new URL(response.url());
    // Expected failures: the docs site has no favicon, and the "close via HX-Trigger" demo
    // posts to an endpoint that only exists in a live backend (see DialogInfo.razor).
    if (url.pathname === '/favicon.ico' || url.pathname === '/api/dialog/htmx-close-action') return;
    if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${url.pathname}`);
  });
  return errors;
}

async function openHtmxDialog(page: Page) {
  // Located by CSS: while the dialog is open, x-trap.inert hides the rest of the page from the
  // accessibility tree, so a role-based locator would not find the trigger again.
  const trigger = page.locator('button[hx-get="/demo/htmx-dialog-sample"]');
  await expect(trigger).toHaveAccessibleName('Open & Load Content via HTMX');
  const target = await trigger.getAttribute('hx-target');
  expect(target).toBeTruthy();
  await trigger.focus();
  await page.keyboard.press('Enter');
  const body = page.locator(target!);
  await expect(body).toContainText('loaded dynamically via an HTMX request');
  return { trigger, body };
}

test.describe('Rizzy 6 / htmx 4 runtime', () => {
  test('loads htmx 4 once, Rizzy 6 client and extensions, and shares window.Rizzy', async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.goto('/components/dialog');

    const state = await page.evaluate(() => {
      const w = window as any;
      const scripts = [...document.querySelectorAll('script[src]')] as HTMLScriptElement[];
      const meta = document.querySelector('meta[name="htmx-config"]')?.getAttribute('content');
      return {
        htmxVersion: w.htmx?.version,
        htmxScriptCount: scripts.filter(s => /htmx(\.min)?\.js$/.test(s.getAttribute('src') ?? '')).length,
        scriptsWithoutNonce: scripts.filter(s => !s.nonce).map(s => s.getAttribute('src')),
        extensions: [...(w.Rizzy?.diagnostics?.registeredExtensions ?? [])],
        rizzyHasDiagnostics: typeof w.Rizzy?.diagnostics?.report === 'function',
        rizzyHasConfirm: typeof w.Rizzy?.confirm === 'function',
        rizzyUiHasToast: typeof w.Rizzy?.toast === 'function' || typeof w.Rizzy?.toast === 'object',
        rizzyVersion: meta ? JSON.parse(meta).rizzyVersion : null,
        antiforgeryToken: meta ? JSON.parse(meta).antiforgery?.requestToken : null,
      };
    });

    expect(state.htmxVersion).toMatch(/^4\./);
    expect(state.htmxScriptCount).toBe(1);
    expect(state.scriptsWithoutNonce).toEqual([]);
    expect(state.extensions).toEqual(expect.arrayContaining(['rizzy-nonce', 'rizzy-streaming', 'rizzy-antiforgery', 'rizzy-confirm']));
    // RizzyUI must add its API to Rizzy's window.Rizzy object, not replace it.
    expect(state.rizzyHasDiagnostics).toBe(true);
    expect(state.rizzyHasConfirm).toBe(true);
    expect(state.rizzyUiHasToast).toBe(true);
    expect(state.rizzyVersion).toMatch(/^6\./);
    expect(state.antiforgeryToken).toBeTruthy();
    expect(errors).toEqual([]);
  });

  test('htmx 4 swaps into an open dialog and Alpine initializes the swapped content, repeatedly', async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.goto('/components/dialog');

    for (let round = 1; round <= 3; round++) {
      const { trigger, body } = await openHtmxDialog(page);

      // The swapped-in RzAlert is an Alpine component; it must be initialized after the swap.
      const alert = body.locator('[x-data="rzAlert"]');
      await expect(alert).toHaveCount(1);
      await expect.poll(() => alert.evaluate(el => Boolean((el as any)._x_dataStack))).toBe(true);

      // Escape closes the dialog and focus returns to the trigger (rzModal + x-trap).
      await page.keyboard.press('Escape');
      await expect(body).toBeHidden();
      await expect(trigger).toBeFocused();
    }

    expect(errors).toEqual([]);
  });

  test('unsafe htmx requests carry the antiforgery token from the htmx-config meta tag', async ({ page }) => {
    await page.goto('/components/dialog');
    const token = await page.evaluate(() => JSON.parse(document.querySelector('meta[name="htmx-config"]')!.getAttribute('content')!).antiforgery.requestToken);

    await page.evaluate(() => { (window as any).__notReloaded = true; });

    await page.getByRole('button', { name: 'Open HTMX Close Example' }).click();
    const requestPromise = page.waitForRequest(request => request.url().endsWith('/api/dialog/htmx-close-action'));
    // The form is inside the teleported dialog panel; htmx must have processed it, otherwise the
    // browser would submit it natively (a full page POST without htmx headers).
    await page.getByRole('button', { name: 'Submit & Close' }).click();
    const request = await requestPromise;
    expect(await page.evaluate(() => (window as any).__notReloaded)).toBe(true);

    expect(request.method()).toBe('POST');
    expect(await request.headerValue('RequestVerificationToken')).toBe(token);
    expect(await request.headerValue('HX-Request')).toBe('true');
  });

  test('boosted navigation swaps #content, initializes Alpine in the new content, and survives back navigation', async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.goto('/components/dialog');
    await page.evaluate(() => { (window as any).__notReloaded = true; });

    await page.locator('a[href="/components/tabs"][hx-boost]').first().click();
    await expect(page).toHaveURL(/\/components\/tabs$/);
    expect(await page.evaluate(() => (window as any).__notReloaded)).toBe(true);

    // Alpine components in the swapped #content are initialized after the htmx swap.
    await expect.poll(() => page.evaluate(() =>
      [...document.querySelectorAll('#content [x-data]')]
        .filter(el => !el.closest('template') && !el.hasAttribute('x-ignore'))
        .filter(el => !(el as any)._x_dataStack).length)).toBe(0);

    // The tabs demo (rendered into a preview iframe) is interactive with the keyboard.
    const preview = page.frameLocator('iframe').first();
    const account = preview.getByRole('tab', { name: 'Account' });
    const password = preview.getByRole('tab', { name: 'Password' });
    await expect(account).toHaveAttribute('aria-selected', 'true');
    await account.focus();
    await page.keyboard.press('ArrowRight');
    await expect(password).toBeFocused();
    await expect(password).toHaveAttribute('aria-selected', 'true');

    // htmx 4 re-fetches on back navigation (no history cache); the restored page must work.
    await page.goBack();
    await expect(page).toHaveURL(/\/components\/dialog$/);
    const { trigger, body } = await openHtmxDialog(page);
    await page.keyboard.press('Escape');
    await expect(body).toBeHidden();
    await expect(trigger).toBeFocused();

    expect(errors).toEqual([]);
  });

  test('sheet closes on Escape (teleported panel is resolved) inside the preview layout', async ({ page }) => {
    await page.goto('/components/sheet');
    const frame = page.frameLocator('iframe').first();

    await frame.getByRole('button', { name: 'Open Sheet' }).click();
    const panel = frame.locator('[data-rz-sheet-panel]').first();
    await expect(panel).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
  });
});
