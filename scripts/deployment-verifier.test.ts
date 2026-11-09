import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { verifyDeployment } from './verify-deployment';
import { contentSecurityPolicy, securityHeaders } from './lib/static-delivery';
import { publicPages } from '../src/site-pages';

const sha = 'a'.repeat(40);
const canonical = 'https://figure.tvr.works';
const options = {
  url: 'https://candidate.figure-site.pages.dev',
  mode: 'preview' as const,
  expectedCommit: sha,
};
const request = vi.fn<typeof fetch>();
function fixture(url: string, mode: 'production' | 'preview' = 'preview'): Response {
  const path = new URL(url).pathname;
  if (path === '/build-info.json')
    return Response.json({ commit: sha, indexing: mode === 'production' ? 'public' : 'preview' });
  if (path === '/sitemap.xml')
    return new Response(publicPages.map((page) => `<loc>${canonical}${page.path}</loc>`).join(''));
  if (path === '/robots.txt')
    return new Response(`User-agent: *\nAllow: /\nSitemap: ${canonical}/sitemap.xml\n`);
  if (path === '/social-card.png') {
    const png = Buffer.alloc(24);
    png.write('PNG', 1);
    png.writeUInt32BE(1200, 16);
    png.writeUInt32BE(630, 20);
    return new Response(png);
  }
  const missing = path === '/missing-deployment-check';
  const html = `<meta name="robots" content="${missing ? 'noindex, nofollow' : mode === 'production' ? 'index, follow' : 'noindex, follow'}"><link rel="canonical" href="${canonical}${path}"><meta property="og:image" content="${canonical}/social-card.png"><script>window.example=1</script>`;
  return new Response(html, {
    status: missing ? 404 : 200,
    headers: {
      ...securityHeaders,
      'Content-Type': 'text/html',
      'Content-Security-Policy': contentSecurityPolicy(html),
      ...(mode === 'preview' ? { 'X-Robots-Tag': 'noindex' } : {}),
    },
  });
}
beforeEach(() => {
  request.mockReset();
  vi.stubGlobal('fetch', request);
});
afterEach(() => vi.unstubAllGlobals());

describe('supplied deployment verification', () => {
  it.each(['production', 'preview'] as const)(
    'checks the exact commit and %s policy only on the supplied origin',
    async (mode) => {
      request.mockImplementation((url) => Promise.resolve(fixture(String(url), mode)));
      await expect(verifyDeployment({ ...options, mode })).resolves.toBeUndefined();
      expect(request.mock.calls.length).toBe(publicPages.length + 5);
      for (const [url] of request.mock.calls) expect(new URL(String(url)).origin).toBe(options.url);
    },
  );
  it.each([
    { commit: 'b'.repeat(40), indexing: 'preview' },
    { commit: sha, indexing: 'public' },
  ])('rejects an older artifact or wrong environment before page checks: %j', async (identity) => {
    request.mockResolvedValue(Response.json(identity));
    await expect(verifyDeployment(options)).rejects.toThrow(/commit|indexing/);
    expect(request).toHaveBeenCalledTimes(1);
  });
  it.each(['https://example.com/guide', 'https://user:secret@example.com/', 'ftp://example.com/'])(
    'rejects ambiguous deployment origins: %s',
    async (url) => {
      await expect(verifyDeployment({ ...options, url })).rejects.toThrow('deployment origin');
      expect(request).not.toHaveBeenCalled();
    },
  );
  it('does not accept a matching ordinary link instead of the canonical metadata', async () => {
    request.mockImplementation((url) => {
      const response = fixture(String(url));
      if (new URL(String(url)).pathname !== '/') return Promise.resolve(response);
      return response.text().then(
        (html) =>
          new Response(html.replace('rel="canonical"', 'rel="alternate"'), {
            headers: response.headers,
          }),
      );
    });
    await expect(verifyDeployment(options)).rejects.toThrow('canonical');
  });
  it('rejects a production response blocked by an edge noindex header', async () => {
    request.mockImplementation((url) => {
      const response = fixture(String(url), 'production');
      if (new URL(String(url)).pathname === '/') response.headers.set('x-robots-tag', 'noindex');
      return Promise.resolve(response);
    });
    await expect(verifyDeployment({ ...options, mode: 'production' })).rejects.toThrow(
      'edge indexing',
    );
  });
  it('rejects a redirect or a healthy homepage substituted for a missing page', async () => {
    request.mockImplementation((url) => {
      if (new URL(String(url)).pathname === '/missing-deployment-check')
        return Promise.resolve(new Response('healthy homepage'));
      return Promise.resolve(fixture(String(url)));
    });
    await expect(verifyDeployment(options)).rejects.toThrow('missing-deployment-check');
    expect(request.mock.calls.every(([, init]) => init?.redirect === 'error')).toBe(true);
  });
});
