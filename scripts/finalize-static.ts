import { readFile, writeFile, access } from 'node:fs/promises';
import { publicPages } from '../src/site-pages.ts';
import { contentSecurityPolicy, renderHeaderRules } from './lib/static-delivery.ts';
import { execFileSync } from 'node:child_process';
import { loadEnv } from 'vite';
import { resolveSiteIndexing } from '../src/indexing.ts';

const directory = new URL('../dist/client/', import.meta.url);
const environment = loadEnv('production', process.cwd(), 'VITE_SITE_');
const indexing = resolveSiteIndexing(environment.VITE_SITE_INDEXING, process.env.CF_PAGES_BRANCH);
const commit =
  process.env.CF_PAGES_COMMIT_SHA ??
  process.env.GITHUB_SHA ??
  execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (!/^[a-f0-9]{40}$/.test(commit))
  throw new Error('Expected an exact source commit for deployment identity.');
for (const forbidden of [
  '_worker.js',
  '_worker.bundle',
  'functions/',
  'server/',
  'content/native-help.json',
]) {
  if (
    await access(new URL(forbidden, directory)).then(
      () => true,
      () => false,
    )
  )
    throw new Error(`Unexpected static publication content: ${forbidden}`);
}
const pages = await Promise.all(
  [...publicPages.map((page) => page.path), '/404'].map(async (path) => {
    const file = new URL(path === '/' ? 'index.html' : `${path.slice(1)}.html`, directory);
    let html = await readFile(file, 'utf8');
    if (!html.includes('<h1') || !html.includes('Figure'))
      throw new Error(`Missing prerendered page: ${path}`);
    if (path === '/404') {
      // Pages serves this body for unknown request paths, which cannot each have an
      // exact _headers rule. A leading meta CSP protects fallback scripts; the
      // common X-Frame-Options header supplies the framing restriction.
      const policy = contentSecurityPolicy(html, 'meta')
        .replaceAll('&', '&amp;')
        .replaceAll('"', '&quot;');
      html = html.replace(
        '<head>',
        `<head><meta http-equiv="Content-Security-Policy" content="${policy}"/>`,
      );
      await writeFile(file, html);
    }
    return { path, html };
  }),
);
await writeFile(new URL('_headers', directory), renderHeaderRules(pages, indexing === 'preview'));
await writeFile(new URL('build-info.json', directory), JSON.stringify({ commit, indexing }) + '\n');
console.log(
  `Prepared ${pages.length} path-specific CSP rules and fallback 404 policy within Pages limits.`,
);
