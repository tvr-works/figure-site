import { indexingRobots, resolveSiteIndexing } from '../src/indexing';
const expectedRobots = indexingRobots(resolveSiteIndexing(process.env.VITE_SITE_INDEXING));
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

const articlePath = '/guides/inverse-cosine';

test('guide content and native instructions are complete in the static artifact', async ({ browser, baseURL }) => {
  const file = await readFile(new URL('../dist/client/guides/inverse-cosine.html', import.meta.url), 'utf8');
  expect(file).toContain('Horizontal reach ÷ brace length');
  expect(file).toContain('about 36.87°');
  expect(file).toContain('86.12787°');
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  expect((await page.goto(baseURL + articlePath))?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Inverse cosine');
  await expect(page.getByRole('heading', { name: 'Find a brace’s angle', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Find an angle from a cosine ratio', exact: true })).toBeVisible();
  await expect(page.getByText('about 36.87°', { exact: true })).toBeVisible();
  await expect(page.getByRole('img', { name: /10 foot brace.*8 foot horizontal reach/ })).toBeVisible();
  await page.getByRole('navigation', { name: 'Breadcrumb', exact: true }).getByRole('link', { name: 'Guides', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Guides');
  await page.getByRole('link', { name: /Inverse cosine Find an angle/ }).click();
  await expect(page).toHaveURL(baseURL + articlePath);
  await context.close();
});

test('guide navigation, anchors and browser history work without hydration errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/guides');
  await expect(page).toHaveTitle('Calculation guides · Figure');
  await expect(page.getByRole('link', { name: /Inverse cosine Find an angle/ })).toHaveCount(1);
  await page.getByRole('link', { name: /Inverse cosine Find an angle/ }).click();
  await expect(page).toHaveURL(articlePath);
  await expect(page).toHaveTitle('Inverse cosine · Figure guide');
  const target = page.getByRole('navigation', { name: 'On this page' }).getByRole('link', { name: 'Find an angle from a cosine ratio', exact: true });
  await target.click();
  await expect(page).toHaveURL(articlePath + '#trig-inverse-cosine');
  await expect(page.locator('#trig-inverse-cosine')).toBeInViewport();
  await page.goBack();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Guides');
  expect(errors).toEqual([]);
});

test('guide metadata and sitemap match the public subject routes while indexing stays off', async ({ page, request }) => {
  await page.goto(articlePath);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', expectedRobots);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://figure.tvr.works' + articlePath);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://figure.tvr.works' + articlePath);
  const schema = await page.locator('#article-data').textContent();
  expect(JSON.parse(schema!)).toMatchObject({ '@type': 'TechArticle', headline: 'Inverse cosine', url: 'https://figure.tvr.works' + articlePath });
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).toContain('<loc>https://figure.tvr.works/guides/inverse-cosine</loc>');
  expect(sitemap).not.toContain('/404');
  expect(sitemap).not.toContain('/guides/not-a-guide');
});

test('guide layouts and enlarged text fit desktop and narrow browsers', async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(articlePath);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => {
    const nodes = [...document.querySelectorAll<HTMLElement>('h1,h2,h3,p,a,span,kbd,li,text')];
    const sizes = nodes.map(node => [node, parseFloat(getComputedStyle(node).fontSize)] as const);
    sizes.forEach(([node, size]) => { node.style.fontSize = `${size * 2}px`; });
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('guide index and article pass automated accessibility checks', async ({ page }) => {
  for (const path of ['/guides', articlePath]) {
    await page.goto(path);
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  }
});

test('unknown subjects return the static 404 instead of a homepage fallback', async ({ page }) => {
  expect((await page.goto('/guides/not-a-guide'))?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await expect(page.getByRole('link', { name: 'Figure', exact: true })).toBeVisible();
});
