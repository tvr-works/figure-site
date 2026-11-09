import assert from 'node:assert/strict';
import { setTimeout } from 'node:timers/promises';
import { publicPages } from '../src/site-pages.ts';
import { securityHeaders, inlineScriptHashes } from './lib/static-delivery.ts';

type DeploymentMode = 'production' | 'preview';
type DeploymentOptions = { url: string; mode: DeploymentMode; expectedCommit: string };
const canonicalOrigin = 'https://figure.tvr.works';

// Inspect generated quoted attributes; do not accept a matching ordinary link as
// proof that a canonical/robots tag is correct.
function metadata(html: string): Map<string, string>[] {
  return [...html.matchAll(/<(?:meta|link)\b[^>]*>/g)].map(
    (tag) =>
      new Map(
        [...tag[0].matchAll(/([\w:-]+)=(['"])(.*?)\2/g)].map((attribute) => [
          attribute[1]!,
          attribute[3]!.replaceAll('&quot;', '"').replaceAll('&amp;', '&'),
        ]),
      ),
  );
}

export async function verifyDeployment({
  url,
  mode,
  expectedCommit,
}: DeploymentOptions): Promise<void> {
  const target = new URL(url);
  assert.ok(
    (target.protocol === 'https:' ||
      (target.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(target.hostname))) &&
      !target.username &&
      !target.password &&
      target.pathname === '/' &&
      !target.search &&
      !target.hash,
    'Expected an HTTPS deployment origin (or local test server).',
  );
  assert.match(expectedCommit, /^[a-f0-9]{40}$/, 'Expected the exact deployed commit SHA.');
  assert.ok(mode === 'production' || mode === 'preview', 'Expected production or preview mode.');
  const origin = target.origin;
  const expectedIndexing = mode === 'production' ? 'public' : 'preview';
  const expectedRobots = mode === 'production' ? 'index, follow' : 'noindex, follow';
  const get = (path: string) =>
    fetch(origin + path, { redirect: 'error', signal: AbortSignal.timeout(15_000) });
  const identityResponse = await get('/build-info.json');
  assert.equal(identityResponse.status, 200, 'Deployment identity response');
  const identity: unknown = await identityResponse.json();
  assert.ok(
    identity && typeof identity === 'object' && 'commit' in identity && 'indexing' in identity,
    'Deployment identity',
  );
  assert.equal(identity.commit, expectedCommit, 'Supplied deployment has the intended commit');
  assert.equal(identity.indexing, expectedIndexing, 'Deployment indexing identity');

  let cursor = 0;
  const paths = [...publicPages.map((page) => page.path), '/missing-deployment-check'];
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (cursor < paths.length) {
        const path = paths[cursor++]!;
        const missing = path === '/missing-deployment-check';
        const response = await get(path);
        assert.equal(response.status, missing ? 404 : 200, path);
        assert.match(response.headers.get('content-type') ?? '', /text\/html/, path);
        const html = await response.text();
        const tags = metadata(html);
        const robots = tags
          .filter((tag) => tag.get('name') === 'robots')
          .map((tag) => tag.get('content'));
        assert.deepEqual(
          robots,
          [missing ? 'noindex, nofollow' : expectedRobots],
          `${path}: indexing`,
        );
        if (!missing) {
          assert.deepEqual(
            tags.filter((tag) => tag.get('rel') === 'canonical').map((tag) => tag.get('href')),
            [canonicalOrigin + path],
            `${path}: canonical`,
          );
          assert.equal(
            /\bnoindex\b|\bnone\b/i.test(response.headers.get('x-robots-tag') ?? ''),
            mode === 'preview',
            `${path}: edge indexing`,
          );
          assert.deepEqual(
            tags
              .filter((tag) => tag.get('property') === 'og:image')
              .map((tag) => tag.get('content')),
            [canonicalOrigin + '/social-card.png'],
            `${path}: social image`,
          );
        }
        for (const [name, value] of Object.entries(securityHeaders))
          assert.equal(response.headers.get(name), value, `${path}: ${name}`);
        const policy =
          response.headers.get('content-security-policy') ||
          tags.find((tag) => tag.get('http-equiv') === 'Content-Security-Policy')?.get('content') ||
          '';
        assert.ok(
          policy.includes("object-src 'none'") && policy.includes("base-uri 'none'"),
          `${path}: CSP`,
        );
        assert.ok(
          !/unsafe-inline|unsafe-eval/.test(
            policy.match(/script-src[^;]*/)?.[0] ?? 'unsafe-inline',
          ),
          `${path}: script restrictions`,
        );
        for (const hash of inlineScriptHashes(html))
          assert.ok(policy.includes(hash), `${path}: inline script hash`);
      }
    }),
  );
  const sitemap = await get('/sitemap.xml');
  assert.equal(sitemap.status, 200, 'Sitemap response');
  const entries = [...(await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(
    entries.sort(),
    publicPages.map((page) => canonicalOrigin + page.path).sort(),
    'Exact production-canonical sitemap',
  );
  // Both variants retain the canonical production sitemap; preview exclusion is
  // asserted above in HTML and response headers, independently of crawler files.
  const robotsResponse = await get('/robots.txt');
  assert.equal(robotsResponse.status, 200, 'Robots response');
  const robots = await robotsResponse.text();
  assert.match(robots, /^Allow: \/\s*$/m, 'Canonical crawler access');
  assert.ok(!/^Disallow: \/\s*$/m.test(robots), 'Unexpected root crawler block');
  assert.ok(
    robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`),
    'Canonical sitemap declaration',
  );
  const image = await get('/social-card.png');
  assert.equal(image.status, 200, 'Social image response');
  const png = Buffer.from(await image.arrayBuffer());
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
}

async function main() {
  const url = process.env.DEPLOYMENT_URL;
  const expectedCommit = process.env.EXPECTED_COMMIT_SHA;
  const mode = process.env.DEPLOYMENT_MODE;
  assert.ok(url && expectedCommit, 'DEPLOYMENT_URL and EXPECTED_COMMIT_SHA are required.');
  assert.ok(
    mode === 'production' || mode === 'preview',
    'DEPLOYMENT_MODE must be production or preview.',
  );
  for (let attempt = 1; ; attempt++) {
    try {
      await verifyDeployment({ url, mode, expectedCommit });
      console.log(`Verified ${mode} deployment ${expectedCommit} at ${url}`);
      return;
    } catch (error) {
      if (attempt === 3) throw error;
      console.warn(
        `Deployment check ${attempt} failed; retrying this same supplied origin.`,
        error,
      );
      await setTimeout(5000);
    }
  }
}

if (import.meta.main) await main();
