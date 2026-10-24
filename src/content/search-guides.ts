import type { GuideSummary } from './catalog';

export function parseGuideSearch(search: Record<string, unknown>): { q?: string } {
  // Router retains unvalidated search keys. Explicit undefined replaces a raw
  // array/object query instead of letting it reach the text filter.
  return { q: typeof search.q === 'string' && search.q.length ? search.q.slice(0, 160) : undefined };
}

function words(value: string) {
  return value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

export function filterGuides(guides: readonly GuideSummary[], query: string) {
  const terms = words(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return guides;
  return guides.filter(guide => {
    const searchable = words([guide.title, guide.summary, guide.categoryTitle, ...guide.searchAliases].join(' '));
    return terms.every(term => searchable.includes(term));
  });
}
