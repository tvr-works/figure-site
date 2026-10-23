import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const calculation = '[data-demo-kind="calculation"]';
const help = '[data-demo-kind="help"]';
const frame = (page: import('@playwright/test').Page, selector = calculation) => page.locator(selector).getAttribute('data-demo-frame');

async function pickMode(page: import('@playwright/test').Page, label: string) {
  const compact = page.getByRole('combobox', { name: 'Choose a calculation mode' });
  if (await compact.isVisible()) await compact.selectOption({ label });
  else await page.getByRole('button', { name: label, exact: true }).click();
}

test('purchase status and static public routes are honest and reachable', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await page.locator('.hero-actions').getByRole('link', { name: 'Get Figure' }).click();
  await expect(page.getByText('Preparing for the App Store.')).toBeInViewport();
  for (const path of ['/support', '/privacy']) {
    expect((await page.goto(path))?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('a[href="mailto:support@figure.tvr.works"]').first()).toBeVisible();
  }
  expect((await request.get('/missing-page')).status()).toBe(404);
});

test('hero states the value and Help follows the complete calculation section without tabs', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Trade math.Made intuitive.');
  await expect(page.locator('.hero-description')).toHaveText('Helpful modes. Adaptive keys. Visual results. Easy conversions.');
  await expect(page.getByRole('tab')).toHaveCount(0);
  const calculationBox = await page.locator('#demo').boundingBox();
  const helpBox = await page.locator('#help').boundingBox();
  expect(helpBox!.y).toBeGreaterThanOrEqual(calculationBox!.y + calculationBox!.height);
  await page.locator('#help-title').scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { name: 'Help without losing your place.' })).toBeInViewport();
});

test('reduced motion shows completed examples and allows manual results in every mode', async ({ page }) => {
  await page.goto('/#demo');
  await expect(page.getByRole('button', { name: 'Play calculation demo', exact: true })).toHaveCount(0);
  const first = await frame(page);
  await page.waitForTimeout(1500);
  expect(await frame(page)).toBe(first);
  for (const [id, label] of [['oblique', 'Oblique Triangle'], ['circle', 'Circle'], ['cylinder', 'Cylinder'], ['cone', 'Cone'], ['ratios', 'Ratios'], ['offset', 'Offset'], ['roof', 'Roof'], ['stairs', 'Stairs'], ['right', 'Right Triangle']]) {
    await pickMode(page, label);
    await expect(page.locator(calculation)).toHaveAttribute('data-demo-frame', new RegExp(`worked-${id}-`));
    await expect.poll(() => page.locator(`${calculation} .native-screen img`).evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(720);
    const before = await frame(page);
    await page.locator(calculation).getByRole('button', { name: 'Next result', exact: true }).click();
    expect(await frame(page)).not.toBe(before);
    await expect(page.locator(calculation)).toHaveAttribute('data-demo-playing', 'false');
  }
});

test('specific mode steps track completed results and conversion boundaries', async ({ page }) => {
  await page.goto('/#demo');
  const current = page.locator(`${calculation} .mode-instructions [aria-current="step"]`);
  const cases = [
    { mode: 'Right Triangle', count: 6, highlights: ['Find the 5 ft diagonal.', 'Convert to inches or meters.', 'Convert to inches or meters.', 'Cycle through the sides and angles.'] },
    { mode: 'Oblique Triangle', count: 6, highlights: ['Find the three angles.', 'Find the three angles.', 'Find the three angles.', 'Cycle to the triangle’s area.'] },
    { mode: 'Circle', count: 6, highlights: ['Find the arc length.', 'Cycle to the chord length.', 'Cycle to the segment rise.'] },
    { mode: 'Cylinder', count: 5, highlights: ['Find the volume.', 'Cycle to the surface area.'] },
    { mode: 'Cone', count: 5, highlights: ['Find the volume.', 'Cycle to the lateral area.'] },
    { mode: 'Ratios', count: 6, highlights: ['Read the 12 ft result.', 'Read the updated 24 ft result.'] },
    { mode: 'Offset', count: 6, highlights: ['Find the centerline radius.', 'Compare wrapper length, heel radius, and throat radius.'] },
    { mode: 'Roof', count: 6, highlights: ['Compare common and hip/valley rafters.', 'Compare common and hip/valley rafters.', 'Compare common and hip/valley rafters.', 'Cycle to the jack rafter results.'] },
    { mode: 'Stairs', count: 6, highlights: ['Compare riser height and stair counts.', 'Compare riser height and stair counts.', 'Compare riser height and stair counts.', 'Compare riser height and stair counts.', 'Find the 12 ft 6 in required run.'] },
  ];
  for (const example of cases) {
    await pickMode(page, example.mode);
    await expect(page.locator(`${calculation} .mode-instructions li`)).toHaveCount(example.count);
    for (const [index, highlight] of example.highlights.entries()) {
      if (index) await page.locator(calculation).getByRole('button', { name: 'Next result', exact: true }).click();
      await expect(current).toHaveText(highlight);
    }
  }
});

test('manual results include unit conversion and the Help sequence retains its reading position', async ({ page }) => {
  await page.goto('/#demo');
  await expect(page.locator(`${calculation} figure`)).toHaveAttribute('aria-label', 'Right Triangle · Diagonal, 5 feet 0 inches');
  await page.locator(calculation).getByRole('button', { name: 'Next result', exact: true }).click();
  await expect(page.locator(`${calculation} figure`)).toHaveAttribute('aria-label', 'Right Triangle · Diagonal, 60 inches');
  await page.locator(calculation).getByRole('button', { name: 'Next result', exact: true }).click();
  await expect(page.locator(`${calculation} figure`)).toHaveAttribute('aria-label', 'Right Triangle · Diagonal, 1.524 meters');
  await page.locator('#help-title').scrollIntoViewIfNeeded();
  await expect(page.locator(help)).toHaveAttribute('data-demo-frame', 'help-resumed');
  await page.locator(help).getByRole('button', { name: 'Replay', exact: true }).click();
  for (const image of ['help-guide', 'help-reading', 'help-closed', 'help-applied', 'help-resumed']) {
    await page.getByRole('button', { name: 'Next Help step', exact: true }).click();
    await expect(page.locator(help)).toHaveAttribute('data-demo-frame', image);
  }
  await expect(page.getByRole('button', { name: 'Next Help step', exact: true })).toBeDisabled();
  await expect(page.getByRole('list', { name: 'Help demo steps' })).toContainText('saved reading position');
});

test('automatic playback pauses offscreen and explicit pause survives returning', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#demo');
  await expect(page.locator(calculation)).toHaveAttribute('data-demo-playing', 'true');
  await page.getByRole('button', { name: 'Pause calculation demo', exact: true }).click();
  const paused = await frame(page);
  await page.waitForTimeout(1800);
  expect(await frame(page)).toBe(paused);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator(calculation)).toHaveAttribute('data-demo-playing', 'false');
  await page.locator(calculation).scrollIntoViewIfNeeded();
  await expect(page.locator(calculation)).toHaveAttribute('data-demo-playing', 'false');
  await page.getByRole('button', { name: 'Play calculation demo', exact: true }).click();
  await expect(page.locator(calculation)).toHaveAttribute('data-demo-playing', 'true');
  await page.locator(help).scrollIntoViewIfNeeded();
  await expect(page.locator(calculation)).toHaveAttribute('data-demo-playing', 'false');
  await expect(page.locator(help)).toHaveAttribute('data-demo-playing', 'true');
  const offscreen = await frame(page);
  await page.waitForTimeout(2000);
  expect(await frame(page)).toBe(offscreen);
  await expect(page.locator(help)).not.toHaveAttribute('data-demo-frame', 'help-calculation-before');
});

test('missing screenshots retain readable calculation and Help guidance', async ({ page }) => {
  await page.route('**/assets/demo/**', route => route.abort());
  await page.goto('/#demo');
  await expect(page.locator(calculation).getByText('App image could not load. The steps explain the example.')).toBeVisible();
  await expect(page.getByRole('list', { name: 'How to use this mode' })).toContainText('Set the run to 3 ft.');
  await page.locator(help).scrollIntoViewIfNeeded();
  await expect(page.locator(help).getByText('App image could not load. The steps explain the example.')).toBeVisible();
  await expect(page.getByRole('list', { name: 'Help demo steps' })).toContainText('Your calculation stays in place');
});

test('no-JavaScript content retains the proposition, completed proof, Help and navigation', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.getByRole('heading', { name: 'Trade math. Made intuitive.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Help without losing your place.' })).toBeVisible();
  await expect(page.locator('#demo')).toContainText('5 ft diagonal');
  await page.locator('.hero-actions').getByRole('link', { name: 'Get Figure', exact: true }).click();
  await expect(page.getByText('Preparing for the App Store.')).toBeInViewport();
  await context.close();
});

test('responsive layouts and 200% text retain both sections and controls without overflow', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#demo');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator(calculation)).toBeVisible();
    await expect(page.locator(help)).toBeVisible();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => {
    const nodes = [...document.querySelectorAll<HTMLElement>('h1,h2,h3,p,a,button,select,summary,strong,small,li')];
    const sizes = nodes.map(node => [node, parseFloat(getComputedStyle(node).fontSize)] as const);
    sizes.forEach(([node, size]) => { node.style.fontSize = `${size * 2}px`; });
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole('combobox', { name: 'Choose a calculation mode' })).toBeVisible();
});

test('automated accessibility scans pass the mode gallery, Help and policies', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#demo');
  for (const mode of ['Right Triangle', 'Roof', 'Cone']) {
    await pickMode(page, mode);
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  }
  await page.locator(help).scrollIntoViewIfNeeded();
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  for (const path of ['/support', '/privacy']) {
    await page.goto(path);
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test('keyboard focus and visibility changes suspend a running calculation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#demo');
  await expect(page.locator(calculation)).toHaveAttribute('data-demo-playing', 'true');
  await page.keyboard.press('Tab');
  const compact = page.getByRole('combobox', { name: 'Choose a calculation mode' });
  if (await compact.isVisible()) await compact.focus();
  else await page.getByRole('button', { name: 'Right Triangle', exact: true }).focus();
  await expect(page.locator(calculation)).toHaveAttribute('data-demo-playing', 'false');
  await page.getByRole('button', { name: 'Play calculation demo', exact: true }).click();
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator(calculation)).toHaveAttribute('data-demo-playing', 'false');
  const hidden = await frame(page);
  await page.waitForTimeout(1800);
  expect(await frame(page)).toBe(hidden);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator(calculation)).toHaveAttribute('data-demo-playing', 'true');
});

test('mode navigation is keyboard accessible and starts from a completed still', async ({ page }) => {
  await page.goto('/#demo');
  const compact = page.getByRole('combobox', { name: 'Choose a calculation mode' });
  if (await compact.isVisible()) {
    await compact.focus();
    await compact.selectOption({ label: 'Cone' });
    await expect(compact).toBeFocused();
  } else {
    const cone = page.getByRole('button', { name: 'Cone', exact: true });
    await cone.focus();
    await cone.press('Enter');
    await expect(cone).toBeFocused();
    await expect(cone).toHaveAttribute('aria-pressed', 'true');
  }
  await expect(page.locator('#adaptive-mode-content h2')).toHaveText('Cone');
  await expect(page.locator(`${calculation} figure`)).toHaveAttribute('aria-label', /Cone · Volume/);
  await expect(page.locator(calculation)).toHaveAttribute('data-demo-playing', 'false');
});

test('the automatic tour completes the cylinder results before moving to Cone', async ({ page }) => {
  test.setTimeout(35000);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#demo');
  await pickMode(page, 'Cylinder');
  await expect(page.locator(calculation)).toHaveAttribute('data-demo-frame', 'worked-cylinder-00');
  await expect(page.locator(calculation)).toHaveAttribute('data-demo-playing', 'true');
  const current = page.locator(`${calculation} .mode-instructions [aria-current="step"]`);
  await expect(current).toHaveText('Select Cylinder.');
  await expect(current).toHaveText('Set the diameter to 4 ft.', { timeout: 5000 });
  await expect(current).toHaveText('Set the height to 6 ft.', { timeout: 5000 });
  await expect(current).toHaveText('Find the volume.', { timeout: 5000 });
  await expect(page.locator(`${calculation} figure`)).toHaveAttribute('aria-label', /Cylinder · Volume, 75.39822 cubic feet/, { timeout: 5000 });
  await expect(page.locator(`${calculation} figure`)).toHaveAttribute('aria-label', /Cylinder · Surface area, 100.531 square feet/, { timeout: 5000 });
  await expect(current).toHaveText('Cycle to the surface area.');
  await expect(page.locator(calculation)).toHaveAttribute('data-demo-frame', 'worked-cone-00', { timeout: 5000 });
  await expect(page.locator('#adaptive-mode-content h2')).toHaveText('Cone');
});

test('touch movement and contact remain smooth with a pause between stages', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#demo');
  await page.waitForFunction(() => document.querySelector('[data-demo-kind="calculation"]')?.getAttribute('data-demo-frame') === 'worked-right-01');
  await expect(page.locator(`${calculation} .mode-instructions [aria-current="step"]`)).toHaveText('Set the run to 3 ft.');
  const samples = await page.evaluate(async () => {
    const cue = document.querySelector<HTMLElement>('[data-demo-kind="calculation"] .press-cue')!;
    const contact = cue.querySelector<HTMLElement>('.touch-contact')!;
    const screen = cue.closest('.native-screen')!.getBoundingClientRect();
    const samples: { time: number; y: number; scale: number }[] = [];
    const start = performance.now();
    while (performance.now() - start < 1600 && contact.isConnected) {
      const bounds = cue.getBoundingClientRect();
      const transform = new DOMMatrix(getComputedStyle(contact).transform);
      samples.push({ time: performance.now() - start, y: (bounds.y + bounds.height / 2 - screen.y) / screen.height, scale: transform.a });
      await new Promise(requestAnimationFrame);
    }
    return samples;
  });
  expect(samples.filter(sample => sample.time < 180).every(sample => sample.y < .4)).toBe(true);
  expect(samples.some(sample => sample.y > .4 && sample.y < .75)).toBe(true);
  expect(samples.some(sample => Math.abs(sample.y - 777 / 956) < .01)).toBe(true);
  expect(samples.some(sample => sample.scale < .85)).toBe(true);
});

test('Help plays its own story on scroll and holds the resumed guide at the end', async ({ page }) => {
  test.setTimeout(30000);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#help');
  await expect.poll(() => page.locator('#help').evaluate(element => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(80);
  await expect(page.locator(help)).toHaveAttribute('data-demo-playing', 'true');
  await expect(page.locator(calculation)).toHaveAttribute('data-demo-playing', 'false');
  await expect(page.locator(help)).toHaveAttribute('data-demo-frame', 'help-resumed', { timeout: 18000 });
  await expect(page.locator(help)).toHaveAttribute('data-demo-playing', 'false', { timeout: 5000 });
  await expect(page.getByRole('button', { name: 'Play Help demo', exact: true })).toBeVisible();
});
