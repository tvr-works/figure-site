import { describe, expect, it } from 'vitest';
import native from '../../content/native-help.json';
import map from '../../docs/design/guide-subject-map.json';
import context from '../../content/guide-context.json';
import { compileGuideLibrary } from './catalog';
import { filterGuides, parseGuideSearch } from './search-guides';

const summaries = compileGuideLibrary(native, map, map.guides.map(guide => guide.slug), context).summaries;
describe('guide discovery', () => {
  it.each([['brace angle', 'inverse-cosine'], ['PIPE—wrap', 'circles'], ['fan speed', 'fan-laws'], ['1/32', 'fraction-precision']])('finds %s by its application or native example', (query, slug) => {
    expect(filterGuides(summaries, query).map(guide => guide.slug)).toContain(slug);
  });
  it('matches all query words and handles empty or unmatched queries', () => {
    expect(filterGuides(summaries, '  ')).toBe(summaries);
    expect(filterGuides(summaries, 'fan speed').every(guide => guide.slug === 'fan-laws')).toBe(true);
    expect(filterGuides(summaries, 'unrelatedword')).toEqual([]);
  });
  it('bounds URL input without removing spaces needed while typing', () => {
    expect(parseGuideSearch({ q: 'fan ' })).toEqual({ q: 'fan ' });
    expect(parseGuideSearch({ q: ['fan'] })).toStrictEqual({ q: undefined });
    expect(parseGuideSearch({ q: 4 })).toStrictEqual({ q: undefined });
    expect(parseGuideSearch({ q: 'x'.repeat(200) }).q).toHaveLength(160);
  });
});
