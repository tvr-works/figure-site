import published from '../content/published-guides.json' with { type: 'json' };
import updates from '../content/page-updates.json' with { type: 'json' };

const paths = ['/', '/guides', '/support', '/privacy', ...published.map(slug => `/guides/${slug}`)];
const dates: Record<string, string> = updates;
if (Object.keys(dates).length !== paths.length || Object.keys(dates).some(path => !paths.includes(path))) throw new Error('Page update records must match the public routes.');
for (const path of paths) {
  const date = dates[path];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? '') || new Date(date).toISOString().slice(0, 10) !== date) throw new Error(`Invalid update date for ${path}.`);
}

// These dates describe real content/metadata updates; builds must not refresh them.
export const publicPages = paths.map(path => ({ path, lastModified: dates[path] }));

export function pageLastModified(path: string) {
  const page = publicPages.find(page => page.path === path);
  if (!page) throw new Error(`Unknown public page: ${path}`);
  return page.lastModified;
}
