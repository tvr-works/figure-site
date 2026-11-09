import { describe, expect, it } from 'vitest';
import {
  contentSecurityPolicy,
  inlineScriptHashes,
  renderHeaderRules,
  responseHeaders,
  securityHeaders,
} from './static-delivery';

const home = '<script>window.example=1</script><script src="/app.js"></script>';
const article = '<script type="application/ld+json">{"name":"Figure"}</script>';

describe('static delivery boundary', () => {
  it('restricts each page to its own exact inline scripts and allows native touch styles', () => {
    const policy = contentSecurityPolicy(home);
    expect(inlineScriptHashes(home)).toHaveLength(1);
    expect(policy).toContain(inlineScriptHashes(home)[0]);
    expect(policy).not.toContain(inlineScriptHashes(article)[0]);
    expect(policy).toContain("style-src-attr 'unsafe-inline'");
    expect(policy.match(/script-src[^;]*/)?.[0]).not.toMatch(/unsafe-inline|unsafe-eval/);
    expect(contentSecurityPolicy(home, 'meta')).not.toContain('frame-ancestors');
  });
  it('keeps path policies independent and gives unknown paths common response protections', () => {
    const rules = renderHeaderRules([
      { path: '/', html: home },
      { path: '/guides/example', html: article },
    ]);
    expect(responseHeaders(rules, '/')).toEqual({
      ...securityHeaders,
      'Content-Security-Policy': contentSecurityPolicy(home),
    });
    expect(responseHeaders(rules, '/guides/example')['Content-Security-Policy']).toBe(
      contentSecurityPolicy(article),
    );
    expect(responseHeaders(rules, '/missing')).toEqual(securityHeaders);
  });
  it('rejects policies that exceed Pages line and routing limits', () => {
    const manyScripts = Array.from(
      { length: 50 },
      (_, i) => `<script>window.example=${i}</script>`,
    ).join('');
    expect(() => renderHeaderRules([{ path: '/', html: manyScripts }])).toThrow('2,000');
    expect(() =>
      renderHeaderRules(Array.from({ length: 100 }, () => ({ path: '/', html: home }))),
    ).toThrow('100 header rules');
  });
});
