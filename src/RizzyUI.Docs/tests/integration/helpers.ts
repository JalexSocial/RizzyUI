import type { Page } from '@playwright/test';

// Shared helpers for the integration specs (real docs app, real RizzyUI components).

/**
 * Collects uncaught page errors, console errors and failed responses. Failed resource loads are
 * reported by the response listener with their path. Responses the docs site expects to fail are
 * ignored: it has no favicon, and the "close via HX-Trigger" dialog demo posts to an endpoint that
 * only exists in a live backend (see DialogInfo.razor).
 */
export function collectPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource')) {
      errors.push(`console.error: ${message.text()}`);
    }
    // Alpine reports expression errors (including CSP-build parse errors) as warnings.
    if (message.type() === 'warning' && message.text().startsWith('Alpine Expression Error')) {
      errors.push(`console.warn: ${message.text()}`);
    }
  });
  page.on('response', response => {
    const url = new URL(response.url());
    if (url.pathname === '/favicon.ico' || url.pathname === '/api/dialog/htmx-close-action') return;
    if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${url.pathname}`);
  });
  return errors;
}

// The docs site's search widget (DocSearch) uses eval; it is not part of RizzyUI.
const docsSiteViolationSources = ['https://cdn.jsdelivr.net/npm/@docsearch/'];

/**
 * Records Content Security Policy violations in window.__cspViolations and returns a function that
 * reads them, without those caused by the docs site's own third-party scripts. Call before page.goto.
 */
export async function collectCspViolations(page: Page): Promise<() => Promise<string[]>> {
  await page.addInitScript(() => {
    (window as any).__cspViolations = [];
    document.addEventListener('securitypolicyviolation', event => {
      const source = event.sourceFile ? ` at ${event.sourceFile.replace(location.origin, '')}:${event.lineNumber}` : '';
      const sample = event.sample ? ` "${event.sample}"` : '';
      (window as any).__cspViolations.push(`${event.violatedDirective} ${event.blockedURI}${source}${sample}`);
    });
  });
  return async () => (await page.evaluate(() => (window as any).__cspViolations as string[]))
    .filter(violation => !docsSiteViolationSources.some(source => violation.includes(` at ${source}`)));
}

/** Number of event listeners the runtime has registered on window/document (Chromium CDP). */
export async function countGlobalListeners(page: Page): Promise<number> {
  const session = await page.context().newCDPSession(page);
  try {
    let total = 0;
    for (const expression of ['window', 'document']) {
      const { result } = await session.send('Runtime.evaluate', { expression });
      const { listeners } = await session.send('DOMDebugger.getEventListeners', { objectId: result.objectId! });
      total += listeners.length;
    }
    return total;
  } finally {
    await session.detach();
  }
}
