import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { extname } from 'node:path';
import { gzipSync } from 'node:zlib';
import budgets from '../build-budgets.json' with { type: 'json' };

const directory = new URL('../dist/client/', import.meta.url);
const files = await readdir(directory, { recursive: true });
const assets = await Promise.all(
  files
    .filter((file) => file.startsWith('assets/') && /\.(js|css|woff2?|ttf|otf|webp)$/.test(file))
    .map(async (file) => {
      const data = await readFile(new URL(file, directory));
      return {
        file,
        extension: extname(file),
        raw: data.length,
        gzip: gzipSync(data, { level: 9 }).length,
      };
    }),
);

function check(name: string, bytes: number, maxKiB: number) {
  console.log(`${name}: ${(bytes / 1024).toFixed(2)} KiB / ${maxKiB} KiB`);
  assert.ok(
    bytes <= maxKiB * 1024,
    `${name} exceeds its budget; investigate before changing the limit.`,
  );
}
for (const [name, extensions, limit] of [
  ['JavaScript', ['.js'], budgets.javascript],
  ['CSS', ['.css'], budgets.css],
  ['Fonts', ['.woff2', '.woff', '.ttf', '.otf'], budgets.fonts],
] as const) {
  const selected = assets.filter((asset) =>
    (extensions as readonly string[]).includes(asset.extension),
  );
  assert.ok(selected.length, `No ${name} assets found.`);
  check(
    `${name} total raw`,
    selected.reduce((sum, asset) => sum + asset.raw, 0),
    limit.rawKiB,
  );
  if ('gzipKiB' in limit)
    check(
      `${name} total gzip`,
      selected.reduce((sum, asset) => sum + asset.gzip, 0),
      limit.gzipKiB,
    );
}
let maxRaw = 0;
let maxGzip = 0;
for (const file of files.filter((file) => file.endsWith('.html'))) {
  const html = await readFile(new URL(file, directory), 'utf8');
  const linked = new Set(
    [...html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"?#]+)[^"<>]*"[^>]*>/g)]
      .map((match) => match[1])
      .filter((href) => href?.endsWith('.js') || href?.endsWith('.css')),
  );
  const selected = assets.filter((asset) => linked.has(`/${asset.file}`));
  assert.ok(selected.length, `No initial code found for ${file}.`);
  maxRaw = Math.max(
    maxRaw,
    selected.reduce((sum, asset) => sum + asset.raw, 0),
  );
  maxGzip = Math.max(
    maxGzip,
    selected.reduce((sum, asset) => sum + asset.gzip, 0),
  );
}
check('Largest initial linked code raw', maxRaw, budgets.initialLinkedCode.rawKiB);
check('Largest initial linked code gzip', maxGzip, budgets.initialLinkedCode.gzipKiB);
const media = assets.filter((asset) => asset.file.startsWith('assets/demo/'));
assert.ok(media.length, 'No native demo media found.');
check(
  'Demo media total',
  media.reduce((sum, asset) => sum + asset.raw, 0),
  budgets.demoMedia.rawMiB * 1024,
);
check(
  'Largest demo image',
  Math.max(...media.map((asset) => asset.raw)),
  budgets.demoMedia.largestKiB,
);
