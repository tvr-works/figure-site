import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const demo = '[data-demo-proof]';
const frame = (page: import('@playwright/test').Page) => page.locator(demo).getAttribute('data-demo-frame');

test('purchase status and static public routes are honest and reachable', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await page.locator('.hero-actions').getByRole('link', { name: 'Get Figure' }).click();
  await expect(page.getByText('Preparing for the App Store.')).toBeInViewport();
  for (const path of ['/support', '/privacy']) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('a[href="mailto:support@figure.tvr.works"]').first()).toBeVisible();
  }
  expect((await request.get('/missing-page')).status()).toBe(404);
  await page.goto('/404.html');
  await expect(page.locator('h1')).toBeVisible();
});

test('tabs use manual keyboard activation and keep the phone anchored', async ({ page }) => {
  await page.goto('/#demo');
  const adaptive = page.getByRole('tab', { name: 'Adaptive calculations' });
  const visual = page.getByRole('tab', { name: 'Visual results' });
  await adaptive.focus();
  const before = await page.locator('.demo-phone').boundingBox();
  await adaptive.press('ArrowRight');
  await expect(visual).toBeFocused();
  await expect(adaptive).toHaveAttribute('aria-selected', 'true');
  await visual.press('Enter');
  await expect(visual).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: 'See what each result measures.' })).toBeVisible();
  const after = await page.locator('.demo-phone').boundingBox();
  expect(Math.abs(before!.x - after!.x)).toBeLessThan(1);
  // On mobile the text stack may change height; the phone retains its size and horizontal position.
  expect(Math.abs(before!.width - after!.width)).toBeLessThan(1);
  if (page.viewportSize()!.width > 740) expect(Math.abs(before!.y - after!.y)).toBeLessThan(1);
});

test('reduced motion stays still and manual navigation covers every mode', async ({ page }) => {
  await page.goto('/#demo');
  await expect(page.getByRole('button', { name: 'Play demo', exact: true })).toHaveCount(0);
  await expect(page.locator(demo)).toHaveAttribute('data-demo-frame', 'right-assigned');
  await page.waitForTimeout(2600);
  expect(await frame(page)).toBe('right-assigned');
  for (const id of ['oblique', 'circle', 'cylinder', 'cone', 'ratios', 'offset', 'roof', 'stairs', 'right']) {
    await page.getByRole('button', { name: 'Next mode', exact: true }).click();
    await expect(page.locator(demo)).toHaveAttribute('data-demo-frame', `${id}-assigned`);
    await expect(page.locator('.native-screen img')).toBeVisible();
    await expect.poll(() => page.locator('.native-screen img').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(720);
  }
});

test('results preserve the native equals order and Help returns to its reading position', async ({ page }) => {
  await page.goto('/#demo');
  await page.getByRole('tab', { name: 'Visual results' }).click();
  for (let i = 0; i < 6; i++) {
    await expect(page.locator(demo)).toHaveAttribute('data-demo-frame', `results-${i}`);
    if (i < 5) await page.getByRole('button', { name: 'Next result', exact: true }).click();
  }
  await expect(page.getByRole('button', { name: 'Next result', exact: true })).toBeDisabled();
  await page.getByRole('tab', { name: 'Built-in Help' }).click();
  await expect(page.locator(demo)).toHaveAttribute('data-demo-frame', 'help-resumed');
  await page.getByRole('button', { name: 'Replay', exact: true }).click();
  for (const image of ['help-guide', 'help-reading', 'help-closed', 'help-applied', 'help-resumed']) {
    await page.getByRole('button', { name: 'Next step', exact: true }).click();
    await expect(page.locator(demo)).toHaveAttribute('data-demo-frame', image);
  }
  await page.getByText('Read demo steps', { exact: true }).click();
  await expect(page.getByText('Open Help again to return to the same article and reading position in this calculator session.')).toBeVisible();
});

test('automatic playback pauses offscreen and explicit pause survives returning', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#demo');
  await expect(page.locator(demo)).toHaveAttribute('data-demo-playing', 'true');
  await page.getByRole('button', { name: 'Pause demo', exact: true }).click();
  const paused = await frame(page);
  await page.waitForTimeout(2600);
  expect(await frame(page)).toBe(paused);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator(demo)).toHaveAttribute('data-demo-playing', 'false');
  await page.locator('.demo-phone').scrollIntoViewIfNeeded();
  await expect(page.locator(demo)).toHaveAttribute('data-demo-playing', 'false');
  expect(await frame(page)).toBe(paused);
  await page.getByRole('button', { name: 'Play demo', exact: true }).click();
  await expect(page.locator(demo)).toHaveAttribute('data-demo-playing', 'true');
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator(demo)).toHaveAttribute('data-demo-playing', 'false');
  const offscreen = await frame(page);
  await page.waitForTimeout(2600);
  expect(await frame(page)).toBe(offscreen);
});

test('missing screenshots retain readable guidance', async ({ page }) => {
  await page.route('**/assets/demo/**', route => route.abort());
  await page.goto('/#demo');
  await expect(page.getByText('App image could not load. The demo steps describe the calculation.')).toBeVisible();
  await page.getByText('Read demo steps', { exact: true }).click();
  await expect(page.getByText('Enter 1, then 2, then Inch. The familiar numeric and unit keys stay in place.')).toBeVisible();
  await expect(page.locator(demo)).toHaveAttribute('data-demo-playing', 'false');
});

test('no-JavaScript content retains the proposition, proof and navigation', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.getByRole('heading', { name: 'Trade math. Designed for iPhone.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Help without losing your place.' })).toBeVisible();
  await page.getByText('All calculations', { exact: false }).click();
  await expect(page.getByRole('heading', { name: 'In your units' })).toBeVisible();
  await context.close();
});

test('responsive layouts and 200% text retain all controls without overflow', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#demo');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const label of ['Adaptive calculations', 'Visual results', 'Built-in Help']) await expect(page.getByRole('tab', { name: label })).toBeVisible();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  // Scale computed text once without compounding sizes on every ancestor.
  await page.evaluate(() => {
    const nodes = [...document.querySelectorAll<HTMLElement>('h1,h2,h3,p,a,button,summary,strong,small,.step-number')];
    const sizes = nodes.map(node => [node, parseFloat(getComputedStyle(node).fontSize)] as const);
    sizes.forEach(([node, size]) => { node.style.fontSize = `${size * 2}px`; });
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole('button', { name: 'Next mode', exact: true })).toBeVisible();
});

test('automated accessibility scan passes each proof and policies', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#demo');
  for (const name of ['Adaptive calculations', 'Visual results', 'Built-in Help']) {
    await page.getByRole('tab', { name }).click();
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations).toEqual([]);
  }
  for (const path of ['/support', '/privacy']) {
    await page.goto(path);
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test('larger screenshot view traps focus, closes with Escape, and restores its trigger', async ({ page }) => {
  await page.goto('/#demo');
  const trigger = page.getByRole('button', { name: 'View larger', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { name: 'Right Triangle' })).toBeVisible();
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('keyboard focus and visibility changes suspend a running demo', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#demo');
  await expect(page.locator(demo)).toHaveAttribute('data-demo-playing', 'true');
  await page.keyboard.press('Tab');
  await page.getByRole('tab', { name: 'Adaptive calculations' }).focus();
  await expect(page.locator(demo)).toHaveAttribute('data-demo-playing', 'false');
  await page.getByRole('button', { name: 'Play demo', exact: true }).click();
  await expect(page.locator(demo)).toHaveAttribute('data-demo-playing', 'true');
  // Dispatch the documented browser visibility event at the API boundary.
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator(demo)).toHaveAttribute('data-demo-playing', 'false');
  const hidden = await frame(page);
  await page.waitForTimeout(2600);
  expect(await frame(page)).toBe(hidden);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator(demo)).toHaveAttribute('data-demo-playing', 'true');
});
