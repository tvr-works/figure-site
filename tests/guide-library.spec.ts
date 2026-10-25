import { indexingRobots, resolveSiteIndexing } from '../src/indexing';
const expectedRobots = indexingRobots(resolveSiteIndexing(process.env.VITE_SITE_INDEXING));
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
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
        for (const [index, step] of recipe.sections.entries()) {
          if (step.text) contains(step.text);
          if (step.result) contains(step.result);
          if (step.resultNote) contains(step.resultNote);
          for (const row of step.instructionRows) contains(`Press ${row.steps.map(key => key.spoken).join(', then ')}.`);
          if (step.diagram && ![...section!.querySelectorAll('svg[role="img"] title')].some(title => title.textContent === step.diagram!.explanation)) failures.push(`Missing accessible diagram: ${step.diagram.id}`);
          const renderedStep = section!.querySelectorAll('.guide-step-section')[index];
          const results = renderedStep.querySelector('.guide-results');
          if (step.result || step.cycle) {
            if (!results || results.closest('details')) failures.push(`Results require disclosure: ${step.id}`);
            const rows = [...(results?.querySelectorAll('.guide-result-line') ?? [])];
            const expected = [
              ...(step.result ? [{ value: step.result, name: step.resultLabel }] : []),
              ...(step.cycle?.jobNames ? step.cycle.jobNames.map(name => ({ name, value: undefined })) : step.cycle?.results ?? []),
            ];
            if (rows.length !== expected.length) failures.push(`Wrong result count: ${step.id}`);
            expected.forEach((result, i) => {
              if ((rows[i]?.querySelector('strong')?.textContent ?? undefined) !== result.value) failures.push(`Wrong result value/order: ${step.id}/${i}`);
              if (result.name && rows[i]?.querySelector('span')?.textContent !== result.name) failures.push(`Wrong result name/order: ${step.id}/${i}`);
              if (!rows[i]?.getClientRects().length) failures.push(`Hidden result: ${step.id}/${i}`);
            });
            if (step.cycle?.jobNote && !results?.textContent?.includes(step.cycle.jobNote)) failures.push(`Missing job note: ${step.id}`);
          } else if (results) failures.push(`Unexpected result: ${step.id}`);
          for (const setting of step.settings) { contains(setting.title); contains(setting.value); }
        }
        for (const setting of [...recipe.exampleSetup, ...recipe.exampleDisplay]) { contains(setting.title); contains(setting.value); }
      }
      for (const link of body.querySelectorAll<HTMLAnchorElement>('a[href^="/guides/"]')) {
        const url = new URL(link.href);
        const slug = url.pathname.split('/').at(-1)!;
        if (!destinations[slug] || (url.hash && !destinations[slug].includes(decodeURIComponent(url.hash.slice(1))))) failures.push(`Broken example link: ${link.getAttribute('href')}`);
      }
      const settingsKey = (settings: typeof article.recipes[number]['exampleDisplay']) => JSON.stringify([...settings].sort((a, b) => a.id.localeCompare(b.id)));
      const displaySets = new Set(article.recipes.filter(recipe => recipe.exampleDisplay.length).map(recipe => settingsKey(recipe.exampleDisplay)));
      if (body.querySelectorAll('.guide-footnotes > ol > li').length !== displaySets.size) failures.push('Wrong display-assumption grouping');
      const shared = displaySets.size === 1 && article.recipes.every(recipe => recipe.exampleDisplay.length);
      for (const recipe of article.recipes) {
        const reference = document.getElementById(`display-ref-${shared ? 'guide' : recipe.sectionId}`) as HTMLAnchorElement | null;
        if (!recipe.exampleDisplay.length) {
          if (reference) failures.push(`Undeclared display assumptions: ${recipe.sectionId}`);
          continue;
        }
        const note = reference?.hash ? document.getElementById(reference.hash.slice(1)) : null;
        const expected = recipe.exampleDisplay.map(setting => `${setting.title}: ${setting.value}`).join('; ') + '.';
        if (!note?.textContent?.startsWith(expected)) failures.push(`Wrong display assumptions: ${recipe.sectionId}`);
        if (!note?.querySelector(`a[href="#display-ref-${shared ? 'guide' : recipe.sectionId}"]`)) failures.push(`Missing assumption return link: ${recipe.sectionId}`);
      }
      const ids = [...document.querySelectorAll('[id]')].map(node => node.id);
      if (new Set(ids).size !== ids.length) failures.push('Duplicate DOM anchors');
      return failures;
    }, { article, destinations });
    expect(missing, article.slug).toEqual([]);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://figure.tvr.works/guides/${article.slug}`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', expectedRobots);
  }
  const sitemap = await (await request.get('/sitemap.xml')).text();
  for (const slug of published) expect(sitemap).toContain(`<loc>https://figure.tvr.works/guides/${slug}</loc>`);
  await page.goto(baseURL + '/guides');
  for (const article of library.articles) await expect(page.locator(`main a[href="/guides/${article.slug}"]`)).toBeVisible();
  await reading.close();
});

test('result sequences remain visible and duplicate example anchors still reach the example', async ({ page }) => {
  await page.goto('/guides/roof-pitch#pitch-inches');
  const sequence = page.locator('#pitch-inches').getByRole('list', { name: 'Results in calculation order' }).first();
  await expect(sequence.getByRole('listitem')).toHaveText([
    'Pitch8 inches', 'Angle33.69007°', 'Percent grade66.66667', 'Slope ratio0.6666667', 'Pitch again8 inches',
  ]);
  for (const row of await sequence.getByRole('listitem').all()) await expect(row).toBeVisible();
  await expect(page.locator('details')).toHaveCount(0);
  await page.goto('/guides/irregular-roofs');
  await expect(page.getByText('Pitch 2 jack lengths', { exact: true }).first()).toBeVisible();
  await page.goto('/guides/squares-and-square-roots#power-square-area');
  await expect(page.locator('#power-square-area')).toBeAttached();
  await expect(page.getByRole('heading', { level: 2, name: 'Square area', exact: true })).toBeInViewport();
  await expect(page.locator('.guide-example')).toHaveCount(3);
});

test('shared and example-specific assumption footnotes support keyboard round trips', async ({ page }) => {
  await page.goto('/guides/roof-pitch');
  await expect(page.locator('.guide-note-reference')).toHaveCount(1);
  const shared = page.getByRole('link', { name: 'Display assumptions, note 1', exact: true });
  await shared.focus();
  await shared.press('Enter');
  await expect(page.locator('#display-note-1')).toBeFocused();
  await expect(page.locator('#display-note-1')).toContainText('1/16');
  const returnToGuide = page.getByRole('link', { name: 'Return to guide description', exact: true });
  await returnToGuide.focus();
  await returnToGuide.press('Enter');
  await expect(shared).toBeFocused();
  await page.goto('/guides/area-and-volume-units');
  await expect(page.locator('.guide-footnotes > ol > li')).toHaveCount(2);
  for (const [example, number, setting] of [
    ['square-entry', 1, 'Area units'], ['square-mm-entry', 1, 'Area units'],
    ['cubic-entry', 2, 'Volume units'], ['cubic-mm-entry', 2, 'Volume units'],
  ] as const) {
    const reference = page.locator(`#display-ref-${example}`);
    await expect(reference).toHaveAccessibleName(`Display assumptions, note ${number}`);
    await reference.focus();
    await reference.press('Enter');
    const note = page.locator(`#display-note-${number}`);
    await expect(note).toBeFocused();
    await expect(note).toContainText(setting);
    const back = note.locator(`a[href="#display-ref-${example}"]`);
    await back.focus();
    await back.press('Enter');
    await expect(reference).toBeFocused();
  }
});


test('guide search supports direct query URLs, native application terms and browser history', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/guides?q=fan%20speed');
  const search = page.getByRole('searchbox', { name: 'Search guides' });
  await expect(search).toHaveValue('fan speed');
  await expect(page.locator('.guide-index a')).toHaveCount(1);
  await expect(page.locator('.guide-index a')).toContainText('Fan laws');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://figure.tvr.works/guides');
  await search.fill('pipe wrap');
  await expect(page.locator('.guide-index a[href="/guides/circles"]')).toBeVisible();
  await page.locator('.guide-index a[href="/guides/circles"]').click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Circle measurements');
  await page.goBack();
  await expect(search).toHaveValue('pipe wrap');
  await search.fill('unrelatedword');
  await expect(page.getByRole('status')).toHaveText('0 guides found');
  await expect(page.getByText('No guides match this search. Try a subject, measurement, or application.')).toBeVisible();
  await search.fill('');
  await expect(page.locator('.guide-index a')).toHaveCount(50);
  await page.getByRole('navigation', { name: 'Guide categories' }).getByRole('link', { name: 'HVAC', exact: true }).click();
  await expect(page.locator('#guide-category-hvac')).toBeInViewport();
  await page.goto('/guides?q=%5B%22fan%22%5D');
  await expect(search).toHaveValue('');
  await expect(page.locator('.guide-index a')).toHaveCount(50);
  expect(errors).toEqual([]);
});

test('expanded guide types retain accessible and responsive reading layouts', async ({ page }) => {
  for (const slug of ['roof-pitch', 'area-and-volume-units', 'circles', 'stairs', 'duct-offsets', 'right-angle-duct-offsets', 'fan-laws', 'calculator-messages']) {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(`/guides/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), slug).toBe(true);
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations, slug).toEqual([]);
    await page.evaluate(() => {
      const sizes = [...document.querySelectorAll<HTMLElement>('h1,h2,h3,h4,p,a,span,kbd,li,dt,dd,summary,text')].map(node => [node, parseFloat(getComputedStyle(node).fontSize)] as const);
      for (const [node, size] of sizes) node.style.fontSize = `${size * 2}px`;
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${slug} at 200% text`).toBe(true);
  }
});
