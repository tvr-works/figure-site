import { describe, expect, it } from 'vitest';
import native from '../../content/native-help.json';
import map from '../../docs/design/guide-subject-map.json';
import { compileGuideLibrary } from './catalog';

const published = ['inverse-cosine'];
describe('native Help publication boundary', () => {
  it('covers the entire real export and publishes only explicit subjects', () => {
    const result = compileGuideLibrary(native, map, published);
    expect(result.recipeCount).toBe(147);
    expect(result.guideCount).toBe(50);
    expect(result.summaries.map(guide => guide.slug)).toEqual(published);
    expect(result.articles[0].recipes.map(recipe => recipe.id)).toEqual(['math-brace-angle', 'trig-inverse-cosine']);
    const rows = result.articles[0].recipes[0].sections.flatMap(section => section.instructionRows);
    expect(rows.at(-1)?.steps[0].labels).toEqual(['2nd', 'cos⁻¹']);
  });
  it('rejects incompatible exports and empty native instruction labels', () => {
    expect(() => compileGuideLibrary({ ...native, schemaVersion: 2 }, map, published)).toThrow();
    const broken = structuredClone(native);
    broken.topics[0].recipes[0].sections.find(section => section.instructionRows.length)!.instructionRows[0].steps[0].labels = [];
    expect(() => compileGuideLibrary(broken, map, published)).toThrow();
  });
  it.each(['missing', 'duplicate', 'unmapped', 'slug', 'related', 'anchor', 'featured', 'category'] as const)('rejects %s mappings', kind => {
    const broken = structuredClone(map);
    const guide = broken.guides[0];
    if (kind === 'missing') guide.sourceRecipes[0].recipeId = 'unknown';
    if (kind === 'duplicate') guide.sourceRecipes.push({ ...guide.sourceRecipes[0], sectionId: 'another-anchor' });
    if (kind === 'unmapped') guide.sourceRecipes.pop();
    if (kind === 'slug') broken.guides[1].slug = guide.slug;
    if (kind === 'related') guide.relatedGuideIds.push('unknown');
    if (kind === 'anchor') guide.sourceRecipes[1].sectionId = guide.sourceRecipes[0].sectionId;
    if (kind === 'featured') guide.featuredSectionId = 'unknown';
    if (kind === 'category') guide.categoryId = 'unknown';
    expect(() => compileGuideLibrary(native, broken, published)).toThrow();
  });
  it('rejects nonexistent or repeated publication slugs', () => {
    expect(() => compileGuideLibrary(native, map, ['unknown'])).toThrow();
    expect(() => compileGuideLibrary(native, map, [...published, ...published])).toThrow();
  });
});
