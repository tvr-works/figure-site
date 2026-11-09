import { createHash } from 'node:crypto';

export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-Frame-Options': 'DENY',
};

export function inlineScriptHashes(html: string): string[] {
  return [
    ...new Set(
      [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
        .filter(([, attributes, content]) => !/\bsrc\s*=/.test(attributes!) && content)
        .map(
          ([, , content]) => `'sha256-${createHash('sha256').update(content!).digest('base64')}'`,
        ),
    ),
  ];
}

export function contentSecurityPolicy(
  html: string,
  delivery: 'header' | 'meta' = 'header',
): string {
  return [
    "default-src 'self'",
    `script-src 'self' ${inlineScriptHashes(html).join(' ')}`.trim(),
    "style-src 'self'",
    // The native demo sets inline CSS custom properties for touch coordinates.
    // Keep script execution hash-restricted while allowing these style attributes.
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    ...(delivery === 'header' ? ["frame-ancestors 'none'"] : []),
    "form-action 'self'",
  ].join('; ');
}

export function renderHeaderRules(
  pages: { path: string; html: string }[],
  preview = false,
): string {
  if (pages.length + 2 > 100)
    throw new Error(
      'Pages supports at most 100 header rules; review CSP routing before adding more pages.',
    );
  const output = [
    '/*',
    ...Object.entries(securityHeaders).map(([name, value]) => `  ${name}: ${value}`),
    ...(preview ? ['  X-Robots-Tag: noindex'] : []),
    '',
    '/build-info.json',
    '  Cache-Control: no-store',
    ...pages.flatMap(({ path, html }) => [
      '',
      path,
      `  Content-Security-Policy: ${contentSecurityPolicy(html)}`,
    ]),
    '',
  ].join('\n');
  if (output.split('\n').some((line) => line.length > 2000))
    throw new Error('Pages header line exceeds 2,000 characters.');
  return output;
}

// This parser intentionally supports only the exact-path + common wildcard rules
// generated above. Do not pretend to emulate unrelated Pages routing syntax.
export function responseHeaders(rules: string, pathname: string): Record<string, string> {
  const headers: Record<string, string> = {};
  let applies = false;
  for (const line of rules.split('\n')) {
    if (!line.trim()) continue;
    if (!line.startsWith(' ')) {
      applies = line === '/*' || line === pathname;
      continue;
    }
    const match = /^  ([\w-]+): (.+)$/.exec(line);
    if (applies && match?.[1] && match[2]) {
      if (headers[match[1]]) throw new Error(`Duplicate matching header: ${match[1]}`);
      headers[match[1]] = match[2];
    }
  }
  return headers;
}
