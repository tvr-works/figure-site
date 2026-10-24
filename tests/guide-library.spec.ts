import { expect, test } from '@playwright/test';
import native from '../content/native-help.json' with { type: 'json' };
import map from '../docs/design/guide-subject-map.json' with { type: 'json' };
import context from '../content/guide-context.json' with { type: 'json' };
import published from '../content/published-guides.json' with { type: 'json' };
import { compileGuideLibrary } from '../src/content/catalog';

const library = compileGuideLibrary(native, map, published, context);

test('every published subject has complete static content, accessible diagrams and valid example links without JavaScript', async ({ browser, baseURL, request }) => {
  const reading = await browser.newContext({ javaScriptEnabled: false });
  const page = await reading.newPage();
  const destinations = Object.fromEntries(library.articles.map(article => [article.slug, article.recipes.flatMap(recipe => [recipe.sectionId, ...recipe.aliasSectionIds])]));
  for (const article of library.articles) {
    expect((await page.goto(`${baseURL}/guides/${article.slug}`))?.status(), article.slug).toBe(200);
    const missing = await page.evaluate(({ article, destinations }) => {
      const failures: string[] = [];
      const body = document.querySelector('main')!;
      const text = body.textContent!;
      const contains = (value: string) => { if (!text.includes(value)) failures.push(`Missing text: ${value}`); };
      if (body.querySelector('h1')?.textContent !== article.title) failures.push('Wrong subject heading');
      article.paragraphs.forEach(contains);
      for (const recipe of article.recipes) {
        const section = document.getElementById(recipe.sectionId);
        if (section?.querySelector('h2')?.textContent !== recipe.title) failures.push(`Missing example: ${recipe.sectionId}`);
        for (const alias of recipe.aliasSectionIds) if (!document.getElementById(alias)) failures.push(`Missing alias: ${alias}`);
        contains(recipe.introduction);
        for (const step of recipe.sections) {
          if (step.text) contains(step.text);
          if (step.result) contains(step.result);
          if (step.resultNote) contains(step.resultNote);
          for (const row of step.instructionRows) contains(`Press ${row.steps.map(key => key.spoken).join(', then ')}.`);
          if (step.diagram && ![...section!.querySelectorAll('svg[role="img"] title')].some(title => title.textContent === step.diagram!.explanation)) failures.push(`Missing accessible diagram: ${step.diagram.id}`);
          if (step.cycle) {
            if (step.cycle.jobNames) step.cycle.jobNames.forEach(contains);
            else for (const result of step.cycle.results) { contains(result.name); contains(result.value); }
            if (step.cycle.jobNote) contains(step.cycle.jobNote);
          }
          for (const setting of step.settings) { contains(setting.title); contains(setting.value); }
        }
        for (const setting of [...recipe.exampleSetup, ...recipe.exampleDisplay]) { contains(setting.title); contains(setting.value); }
      }
      for (const link of body.querySelectorAll<HTMLAnchorElement>('a[href^="/guides/"]')) {
        const url = new URL(link.href);
        const slug = url.pathname.split('/').at(-1)!;
        if (!destinations[slug] || (url.hash && !destinations[slug].includes(decodeURIComponent(url.hash.slice(1))))) failures.push(`Broken example link: ${link.getAttribute('href')}`);
      }
      const ids = [...document.querySelectorAll('[id]')].map(node => node.id);
      if (new Set(ids).size !== ids.length) failures.push('Duplicate DOM anchors');
      return failures;
    }, { article, destinations });
    expect(missing, article.slug).toEqual([]);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://figure.tvr.works/guides/${article.slug}`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  }
  const sitemap = await (await request.get('/sitemap.xml')).text();
  for (const slug of published) expect(sitemap).toContain(`<loc>https://figure.tvr.works/guides/${slug}</loc>`);
  await page.goto(baseURL + '/guides');
  for (const article of library.articles) await expect(page.locator(`main a[href="/guides/${article.slug}"]`)).toBeVisible();
  await reading.close();
});

test('native result disclosures and duplicate example anchors work with the keyboard', async ({ page }) => {
  await page.goto('/guides/common-rafters');
  const cycle = page.locator('details').first();
  await cycle.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(cycle).toHaveAttribute('open', '');
  await expect(cycle.getByText('30.25644°', { exact: true })).toBeVisible();
  await page.goto('/guides/irregular-roofs');
  await page.locator('details').first().locator('summary').click();
  await expect(page.getByText('Pitch 2 jack lengths', { exact: true }).first()).toBeVisible();
  await page.goto('/guides/squares-and-square-roots#power-square-area');
  await expect(page.locator('#power-square-area')).toBeAttached();
  await expect(page.getByRole('heading', { level: 2, name: 'Square area', exact: true })).toBeInViewport();
  await expect(page.locator('.guide-example')).toHaveCount(3);
});
