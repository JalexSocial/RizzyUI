import { expect, test, type Page } from '@playwright/test';

// Runs against the published consumer app built by eng/consumer-smoke-test.sh from the packed
// RizzyUI NuGet package (strict nonce CSP, CSP build of RizzyUI, htmx 4 served locally).

function watchProblems(page: Page) {
  const problems: string[] = [];
  page.on('pageerror', error => problems.push(`pageerror: ${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource')) {
      problems.push(`console.error: ${message.text()}`);
    }
  });
  page.on('response', response => {
    const url = new URL(response.url());
    if (url.pathname === '/favicon.ico') return;
    if (response.status() >= 400) problems.push(`HTTP ${response.status()}: ${url.pathname}`);
  });
  return problems;
}

async function collectCspViolations(page: Page) {
  await page.addInitScript(() => {
    (window as any).__cspViolations = [];
    document.addEventListener('securitypolicyviolation', event => {
      (window as any).__cspViolations.push(`${event.violatedDirective} ${event.blockedURI}`);
    });
  });
}

test('packaged RizzyUI renders, loads its runtime under a strict CSP, and is interactive', async ({ page }) => {
  const problems = watchProblems(page);
  await collectCspViolations(page);

  const runtime = page.waitForResponse(response => response.url().endsWith('/_content/RizzyUI/js/rizzyui-csp.min.js'));
  await page.goto('/');
  expect((await runtime).status()).toBe(200);

  // Runtime contract: htmx 4 and Rizzy 6 client loaded once; RizzyUI merged into window.Rizzy.
  await expect.poll(() => page.evaluate(() => typeof (window as any).Rizzy?.toast)).not.toBe('undefined');
  const state = await page.evaluate(() => ({
    htmx: (window as any).htmx?.version,
    diagnostics: typeof (window as any).Rizzy?.diagnostics?.report,
  }));
  expect(state.htmx).toMatch(/^4\./);
  expect(state.diagnostics).toBe('function');

  // Alpine code-behind from the package: the module (SmokeCounter.razor.js) loads with x-load-src
  // through a dynamic import, which 'strict-dynamic' allows; no inline script is rendered.
  const counter = page.locator('#smoke-counter-7');
  await expect(counter.getByTestId('count')).toHaveText('7');
  await counter.getByTestId('increment').click();
  await expect(counter.getByTestId('count')).toHaveText('8');
  expect(await page.locator('main script:not([src])').count()).toBe(0);

  // Dialog trigger works under CSP (no inline handler); hx-get swaps a fragment with an Alpine
  // component that initializes after the swap.
  const trigger = page.locator('button[hx-get="/fragments/alert"]');
  await expect(trigger).toHaveAccessibleName('Open dialog');
  await trigger.click();
  const alert = page.locator('#dialog-body [x-data="rzAlert"]');
  await expect(alert).toHaveCount(1);
  await expect.poll(() => alert.evaluate(el => Boolean((el as any)._x_dataStack))).toBe(true);
  // A code-behind component in the swapped fragment starts too.
  const swappedCounter = page.locator('#smoke-counter-40');
  await expect(swappedCounter.getByTestId('count')).toHaveText('40');
  await swappedCounter.getByTestId('increment').click();
  await expect(swappedCounter.getByTestId('count')).toHaveText('41');

  // A form inside the teleported dialog posts through htmx with the antiforgery token.
  const post = page.waitForResponse(response => response.url().endsWith('/fragments/echo'));
  await page.getByRole('button', { name: 'Send' }).click();
  expect((await post).status()).toBe(200);
  await expect(page.locator('#echo-result')).toHaveText('Echo: hello');

  // Escape closes the dialog and returns focus to the trigger.
  await page.keyboard.press('Escape');
  await expect(page.locator('#dialog-body')).toBeHidden();
  await expect(trigger).toBeFocused();

  // Tabs: roving focus with the arrow keys.
  const one = page.getByRole('tab', { name: 'One' });
  const two = page.getByRole('tab', { name: 'Two' });
  await one.focus();
  await page.keyboard.press('ArrowRight');
  await expect(two).toBeFocused();
  await expect(two).toHaveAttribute('aria-selected', 'true');

  expect(await page.evaluate(() => (window as any).__cspViolations)).toEqual([]);
  expect(problems).toEqual([]);
});
