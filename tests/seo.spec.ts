import { expect, test } from '@playwright/test';
import { readFile, readdir, stat } from 'node:fs/promises';
import { site } from '../src/site';
import { indexingRobots, resolveSiteIndexing } from '../src/indexing';
import updates from '../content/page-updates.json' with { type: 'json' };
const expectedRobots = indexingRobots(resolveSiteIndexing(process.env.VITE_SITE_INDEXING));

const output = new URL('../dist/client/', import.meta.url);

test('every static page has complete unique metadata and valid internal destinations', async ({ page }) => {
  const files = (await readdir(output, { recursive: true })).filter(file => file.endsWith('.html'));
  const documents = await Promise.all(files.map(async file => ({
    path: file === 'index.html' ? '/' : `/${file.replace(/\.html$/, '')}`,
    html: await readFile(new URL(file, output), 'utf8'),
  })));
  const reports = await page.evaluate(({ documents, origin }) => documents.map(({ path, html }) => {
    const document = new DOMParser().parseFromString(html, 'text/html');
    const values = (selector: string, attribute?: string) => [...document.querySelectorAll(selector)].map(element => attribute ? element.getAttribute(attribute) : element.textContent?.trim());
    return {
      path,
      title: values('head title'),
      description: values('meta[name="description"]', 'content'),
      robots: values('meta[name="robots"]', 'content'),
      canonical: values('link[rel="canonical"]', 'href'),
      heading: values('h1'),
      openGraphUrl: values('meta[property="og:url"]', 'content'),
      ids: values('[id]', 'id'),
      links: [...document.querySelectorAll<HTMLAnchorElement>('a[href]')].map(element => new URL(element.getAttribute('href')!, origin + path).href),
      images: [...document.querySelectorAll<HTMLImageElement>('img')].map(element => ({ src: new URL(element.getAttribute('src')!, origin + path).href, alt: element.getAttribute('alt') })),
      breadcrumb: [...document.querySelectorAll('[aria-label="Breadcrumb"] a, [aria-label="Breadcrumb"] [aria-current="page"]')].map(element => element.textContent?.trim()),
      schemas: [...document.querySelectorAll('script[type="application/ld+json"]')].map(element => JSON.parse(element.textContent!)),
    };
  }), { documents, origin: site.origin });
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const byPath = new Map(reports.map(report => [report.path, report]));
  const localAssets = new Set<string>();
  for (const report of reports) {
    for (const key of ['title', 'description', 'robots', 'canonical', 'heading', 'openGraphUrl'] as const) {
      expect(report[key], `${report.path}: ${key}`).toHaveLength(1);
      expect(report[key][0], `${report.path}: empty ${key}`).toBeTruthy();
    }
    const title = report.title[0]!;
    const description = report.description[0]!;
    expect(titles.has(title), `Duplicate title at ${report.path}`).toBe(false);
    expect(descriptions.has(description), `Duplicate description at ${report.path}`).toBe(false);
    titles.add(title);
    descriptions.add(description);
    expect(report.canonical[0]).toBe(site.origin + report.path);
    expect(report.openGraphUrl[0]).toBe(report.canonical[0]);
    expect(report.robots[0]).toBe(report.path === '/404' ? 'noindex, nofollow' : expectedRobots);
    expect(new Set(report.ids).size, `${report.path}: duplicate IDs`).toBe(report.ids.length);
    if (report.path === '/') expect(report.schemas).toContainEqual(expect.objectContaining({ '@type': 'WebSite', name: 'Figure', url: site.origin + '/' }));
    if (report.path !== '/' && report.path !== '/404') {
      const breadcrumb = report.schemas.find(schema => schema['@type'] === 'BreadcrumbList');
      expect(breadcrumb?.itemListElement.map((item: { name: string }) => item.name), report.path).toEqual(report.breadcrumb);
      expect(breadcrumb.itemListElement.at(-1).item).toBe(report.canonical[0]);
    }
    if (report.path.startsWith('/guides/')) {
      const article = report.schemas.find(schema => schema['@type'] === 'TechArticle');
      expect(article?.dateModified).toBe((updates as Record<string, string>)[report.path]);
      expect(article?.mainEntityOfPage).toBe(report.canonical[0]);
    }
    for (const href of report.links) {
      const url = new URL(href);
      if (url.origin !== site.origin) continue;
      const target = byPath.get(url.pathname.replace(/\/$/, '') || '/');
      expect(target, `${report.path}: missing page ${href}`).toBeDefined();
      if (url.hash) expect(target!.ids, `${report.path}: missing anchor ${href}`).toContain(decodeURIComponent(url.hash.slice(1)));
    }
    for (const image of report.images) {
      expect(image.alt, `${report.path}: missing image alt`).not.toBeNull();
      const url = new URL(image.src);
      if (url.origin === site.origin) localAssets.add(url.pathname);
    }
  }
  for (const asset of localAssets) expect((await stat(new URL(`.${asset}`, output))).size, asset).toBeGreaterThan(0);
  const sitemap = await readFile(new URL('sitemap.xml', output), 'utf8');
  const entries = await page.evaluate(xml => [...new DOMParser().parseFromString(xml, 'application/xml').querySelectorAll('url')].map(element => ({ location: element.querySelector('loc')!.textContent!, modified: element.querySelector('lastmod')?.textContent })), sitemap);
  for (const entry of entries) expect(entry.modified, entry.location).toBe((updates as Record<string, string>)[new URL(entry.location).pathname]);
  const locations = entries.map(entry => entry.location);
  expect(locations.sort()).toEqual(reports.filter(report => report.path !== '/404').map(report => site.origin + report.path).sort());
});
