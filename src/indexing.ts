export type SiteIndexing = 'preview' | 'public';

// Public indexing is an explicit build choice, independent of Vite production mode.
export function resolveSiteIndexing(value: string | undefined, cloudflareBranch?: string): SiteIndexing {
  if (value !== undefined && value !== 'preview' && value !== 'public') throw new Error('VITE_SITE_INDEXING must be preview or public.');
  const indexing = value ?? 'preview';
  if (indexing === 'public' && cloudflareBranch && cloudflareBranch !== 'main') throw new Error('Cloudflare preview branches must keep preview indexing.');
  return indexing;
}

export function indexingRobots(indexing: SiteIndexing) {
  return indexing === 'public' ? 'index, follow' : 'noindex, follow';
}
