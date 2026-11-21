import { expect, resetDatabase, test, waitForRuntime } from '../support/summit';
import { seed } from '../support/fixtures';

// The public site: home, schedule, session, speakers, tickets, help, search.

test.beforeAll(async ({ baseURL }) => resetDatabase(baseURL!));

test.describe('home', () => {
  test('shows the hero, the countdown and the lazily loaded numbers @mobile', async ({ page }) => {
    await page.goto('/');
    await waitForRuntime(page);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(seed.conferenceName);
    // Fixed clock: 2027-06-14 08:00 UTC, opening keynote 2027-06-15 09:00 Berlin (07:00 UTC).
    const timer = page.getByRole('timer', { name: 'Time until the opening keynote' });
    await expect(timer).toContainText(/0\s*days/);
    // 23 hours exactly on the server; the browser ticks from there, so it may already read 22:59.
    await expect(timer).toContainText(/23\s*hours\s*00|22\s*hours\s*59/);

    const numbers = page.locator('#home-stats');
    await page.getByRole('region', { name: 'Summit in numbers' }).scrollIntoViewIfNeeded();
    await expect(numbers).toContainText('64');
    await expect(numbers).toContainText('speakers');
  });

  test('the speaker carousel moves with its buttons', async ({ page }) => {
    await page.goto('/');
    await waitForRuntime(page);
    const carousel = page.getByRole('region', { name: 'Featured speakers' });
    await carousel.scrollIntoViewIfNeeded();
    await expect(carousel.getByRole('button', { name: 'Next speakers' })).toBeEnabled();
    await carousel.getByRole('button', { name: 'Next speakers' }).click();
    await expect(carousel.getByRole('button', { name: 'Previous speakers' })).toBeEnabled();
  });
});

test.describe('schedule', () => {
  test('filters by track on the server and keeps the URL in sync @mobile', async ({ page }) => {
    await page.goto('/schedule');
    await waitForRuntime(page);
    await page.getByRole('group', { name: 'Tracks' }).getByText('AI in Practice').click();
    await expect(page).toHaveURL(/tracks=ai/);
    const cards = page.locator('#schedule-grid [data-session-card]');
    await expect(cards.first()).toBeVisible();
    await expect(cards.filter({ hasNot: page.locator('text=AI in Practice') })).toHaveCount(0);

    await page.goBack();
    await expect(page).toHaveURL(/\/schedule$/);
  });

  test('level toggles filter the cards in the browser and announce the result', async ({ page }) => {
    await page.goto('/schedule');
    await waitForRuntime(page);
    const visibleCards = page.locator('#schedule-grid [data-session-card]:not([hidden])');
    const before = await visibleCards.count();

    await page.locator('[data-level-toggle="Advanced"]').click();
    await expect(page.locator('[data-level-toggle="Advanced"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText(/advanced sessions shown/)).toBeAttached();
    const after = await visibleCards.count();
    expect(after).toBeLessThan(before);
    for (const level of await visibleCards.evaluateAll(cards => cards.map(c => c.getAttribute('data-level'))))
      expect(level).toBe('Advanced');
  });

  test('a server filter keeps the selected day tab', async ({ page }) => {
    await page.goto('/schedule');
    await waitForRuntime(page);
    await page.getByRole('tab', { name: /Day 3/ }).click();
    await page.getByRole('group', { name: 'Tracks' }).getByText('Cloud & Platforms').click();
    await expect(page).toHaveURL(/day=3/);
    await expect(page.getByRole('tab', { name: /Day 3/ })).toHaveAttribute('aria-selected', 'true');
  });

  test('saving a session updates the header count out of band and shows a toast @mobile', async ({ page }) => {
    await page.goto('/schedule');
    await waitForRuntime(page);
    const firstCard = page.locator('#schedule-grid [data-session-card]').first();
    // The switch's input is visually hidden; its label is what people click.
    await firstCard.getByText('Add to my agenda').click();

    await expect(page.locator('#agenda-count')).toHaveText('1');
    await expect(page.getByText('Added to my agenda').first()).toBeVisible();
    await expect(firstCard.getByText('In my agenda')).toBeVisible();

    // "Only my agenda" shows just that session.
    await page.getByText('Only my agenda').click();
    await expect(page.locator('#schedule-grid [data-session-card]')).toHaveCount(1);
  });

  test('details open in a sheet that Escape closes', async ({ page }) => {
    await page.goto('/schedule');
    await waitForRuntime(page);
    await page.getByRole('button', { name: /^Details: Opening keynote/ }).click();
    const sheet = page.getByRole('dialog', { name: /Opening keynote/ });
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole('link', { name: 'Open the session page' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(sheet).toBeHidden();
  });
});

test.describe('session page', () => {
  test('renders untrusted Markdown as text, not HTML', async ({ page }) => {
    let dialogs = 0;
    page.on('dialog', async dialog => { dialogs++; await dialog.dismiss(); });
    await page.goto(`/sessions/${seed.unsafeMarkdownSessionSlug}`);
    await waitForRuntime(page);
    const main = page.locator('main');
    await expect(main.getByText("<script>alert('If you can see this dialog")).toBeVisible();
    await expect(main.locator('script')).toHaveCount(0);
    await expect(main.locator('a[href^="javascript:"]')).toHaveCount(0);
    await expect(main.locator('[onerror]')).toHaveCount(0);
    expect(dialogs).toBe(0);
  });

  test('has a quick reference, a slide preview and a copy-link button @mobile', async ({ page }, testInfo) => {
    await page.goto(`/sessions/${seed.unsafeMarkdownSessionSlug}`);
    await waitForRuntime(page);
    // RzArticle hides its side column (the quick reference) at phone width.
    if (testInfo.project.name !== 'mobile')
      await expect(page.getByRole('navigation', { name: 'On this page' }).getByRole('link', { name: 'Slides' })).toBeVisible();
    await expect(page.frameLocator('iframe[title^="Title slide"]').getByText('Rendering untrusted Markdown safely')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy link to this session' })).toBeVisible();
  });
});

test.describe('speakers', () => {
  test('search updates the results and the count, and history restores them @mobile', async ({ page }) => {
    await page.goto('/speakers');
    await waitForRuntime(page);
    await expect(page.getByRole('status').filter({ hasText: 'speakers' })).toHaveText('64 speakers');

    await page.getByRole('searchbox', { name: 'Search speakers' }).fill('okafor');
    await expect(page).toHaveURL(/q=okafor/);
    await expect(page.locator('#speaker-count')).toHaveText('1 speaker matches “okafor”');
    await expect(page.locator('#speaker-results').getByText('Amara Okafor')).toBeVisible();

    await page.getByRole('searchbox', { name: 'Search speakers' }).fill('zzzz');
    await expect(page.getByText('No speakers match “zzzz”')).toBeVisible();

    await page.goBack();
    await expect(page.locator('#speaker-results').getByText('Amara Okafor')).toBeVisible();
  });

  test('pages with htmx and pushes the page number', async ({ page }) => {
    await page.goto('/speakers');
    await waitForRuntime(page);
    const pager = page.getByRole('navigation', { name: 'Speaker pages' });
    await pager.getByRole('link', { name: '2', exact: true }).click();
    await expect(page).toHaveURL(/page=2/);
    await expect(pager.getByRole('link', { name: '2', exact: true })).toHaveAttribute('aria-current', 'page');
  });
});

test.describe('search palette', () => {
  test('Ctrl+K searches the server and navigates with the keyboard', async ({ page }) => {
    await page.goto('/');
    await waitForRuntime(page);
    await page.keyboard.press('Control+k');
    const dialog = page.getByRole('dialog', { name: 'Search Summit' });
    await expect(dialog).toBeVisible();
    await page.keyboard.type('okafor');
    const option = dialog.getByRole('option', { name: /Amara Okafor/ });
    await expect(option).toBeVisible();
    await expect(option).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/speakers\?q=Amara/);
    await expect(dialog).toBeHidden();
  });
});

test.describe('tickets', () => {
  test('shows sold-out and not-yet-on-sale tickets correctly @mobile', async ({ page }) => {
    await page.goto('/tickets');
    await waitForRuntime(page);
    const student = page.getByRole('listitem').filter({ has: page.getByRole('heading', { name: 'Student' }) });
    await expect(student.getByRole('button', { name: 'Sold out' })).toBeDisabled();
    await expect(page.getByText(/Supporter tickets go on sale/)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Choose Conference Pass' })).toBeVisible();
  });
});

test.describe('help', () => {
  test('the contact form returns 422 with errors and keeps the typed values', async ({ page, summit }) => {
    summit.allowStatus(422);
    await page.goto('/help');
    await waitForRuntime(page);
    const form = page.locator('#contact-form');
    await form.getByLabel('Name').fill('Robin Example');
    await form.getByLabel('Email').fill('not-an-email');
    await form.getByRole('button', { name: 'Send message' }).click();

    await expect(form.getByText('Enter a valid email address.')).toBeVisible();
    await expect(form.getByText('Choose a topic.')).toBeVisible();
    await expect(form.getByLabel('Name')).toHaveValue('Robin Example');
  });

  test('rejects an attachment of the wrong type, then sends a valid message', async ({ page, summit }) => {
    summit.allowStatus(422);
    await page.goto('/help');
    await waitForRuntime(page);
    const form = page.locator('#contact-form');
    await form.getByLabel('Name').fill('Robin Example');
    await form.getByLabel('Email').fill('robin@example.com');
    await form.getByLabel('Topic').selectOption('Accessibility');
    await form.getByRole('textbox', { name: 'Message' }).fill('Is there step-free access to the Workshop Lab?');
    await form.locator('input[type=file]').setInputFiles({ name: 'notes.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('MZ') });
    await form.getByRole('button', { name: 'Send message' }).click();
    await expect(form.getByText('Attach a PNG, JPG or PDF file.')).toBeVisible();

    await form.locator('input[type=file]').setInputFiles({ name: 'map.png', mimeType: 'image/png', buffer: Buffer.from('89504e47', 'hex') });
    await form.getByRole('button', { name: 'Send message' }).click();
    await expect(form.getByText('Thanks, your message is on its way')).toBeVisible();
    await expect(page.getByText('Message sent').first()).toBeVisible();
  });
});
