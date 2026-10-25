import { describe, expect, it } from 'vitest';
import { indexingRobots, resolveSiteIndexing } from './indexing';

describe('release indexing policy', () => {
  it('keeps ordinary builds and previews excluded', () => {
    expect(indexingRobots(resolveSiteIndexing(undefined))).toBe('noindex, follow');
    expect(indexingRobots(resolveSiteIndexing('preview', 'main'))).toBe('noindex, follow');
  });
  it('requires an explicit public build and allows the production branch', () => {
    expect(indexingRobots(resolveSiteIndexing('public'))).toBe('index, follow');
    expect(indexingRobots(resolveSiteIndexing('public', 'main'))).toBe('index, follow');
  });
  it('rejects unknown policy values and public indexing on preview branches', () => {
    expect(() => resolveSiteIndexing('true')).toThrow('preview or public');
    expect(() => resolveSiteIndexing('public', 'feature-preview')).toThrow('preview branches');
  });
});
