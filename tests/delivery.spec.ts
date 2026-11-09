import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { inlineScriptHashes, securityHeaders } from '../scripts/lib/static-delivery';
import { publicPages } from '../src/site-pages';
import budgets from '../build-budgets.json' with { type: 'json' };

test(
  'static delivery applies independent CSP rules within Pages limits',
  { tag: '@artifact' },
  async ({ request, page }) => {
    const rules = await readFile(new URL('../dist/client/_headers', import.meta.url), 'utf8');
    expect(rules.split('\n').filter((line) => line.startsWith('/')).length).toBeLessThanOrEqual(
      100,
    );
    for (const line of rules.split('\n')) expect(line.length).toBeLessThanOrEqual(2000);
    for (const path of [...publicPages.map((p) => p.path), '/404', '/missing-delivery-check']) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(path === '/missing-delivery-check' ? 404 : 200);
      const html = await response.text();
      const headers = response.headers();
      for (const [key, value] of Object.entries(securityHeaders))
        expect(headers[key.toLowerCase()], path).toBe(value);
      const meta = await page.evaluate(
        (html) =>
          new DOMParser()
            .parseFromString(html, 'text/html')
            .querySelector('meta[http-equiv="Content-Security-Policy"]')
            ?.getAttribute('content'),
        html,
      );
      const policy = headers['content-security-policy'] || meta;
      expect(policy, path).toBeTruthy();
      for (const hash of inlineScriptHashes(html)) expect(policy, path).toContain(hash);
      expect(policy?.match(/script-src[^;]*/)?.[0], path).not.toMatch(/unsafe-inline|unsafe-eval/);
      expect(policy, path).toContain("object-src 'none'");
      expect(policy, path).toContain("base-uri 'none'");
      expect(policy, path).toContain("style-src-attr 'unsafe-inline'");
      if (path !== '/missing-delivery-check')
        expect(headers['content-security-policy'], path).toContain("frame-ancestors 'none'");
    }
  },
);

for (const path of ['/', '/guides/stairs']) {
  test(
    `initial delivered code stays within its budget at ${path}`,
    { tag: '@artifact' },
    async ({ page }) => {
      const responses: Buffer[] = [];
      const pending: Promise<void>[] = [];
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      page.on('response', (response) => {
        if (['script', 'stylesheet'].includes(response.request().resourceType()))
          pending.push(
            response.body().then((body) => {
              responses.push(body);
            }),
          );
      });
      await page.goto(path);
      await expect(page.locator('h1')).toBeVisible();
      if (path === '/') {
        const next = page.getByRole('button', {
          name: 'Next result in Right Triangle',
          exact: true,
        });
        await next.click();
        await expect(page.locator('[data-demo-kind="calculation"] figure')).toHaveAttribute(
          'aria-label',
          /60 inches/,
        );
      } else {
        await page
          .getByRole('navigation', { name: 'Breadcrumb', exact: true })
          .getByRole('link', { name: 'Guides', exact: true })
          .click();
        await expect(page.getByRole('searchbox', { name: 'Search guides' })).toBeVisible();
      }
      await page.waitForLoadState('networkidle');
      await Promise.all(pending);
      const raw = responses.reduce((sum, body) => sum + body.length, 0);
      const gzip = responses.reduce((sum, body) => sum + gzipSync(body, { level: 9 }).length, 0);
      console.log(
        `${path}: delivered JS/CSS ${Math.ceil(raw / 1024)} KiB raw, ${Math.ceil(gzip / 1024)} KiB gzip`,
      );
      expect(raw).toBeLessThanOrEqual(budgets.initialBrowserCode.rawKiB * 1024);
      expect(gzip).toBeLessThanOrEqual(budgets.initialBrowserCode.gzipKiB * 1024);
      expect(errors).toEqual([]);
    },
  );
}
