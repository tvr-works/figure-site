import { describe, expect, it } from 'vitest';
import native from '../../content/native-help.json';
import map from '../../docs/design/guide-subject-map.json';
import context from '../../content/guide-context.json';
import { compileGuideLibrary } from './catalog';

const published = ['inverse-cosine'];
describe('native Help publication boundary', () => {
  it('covers the entire real export and publishes only explicit subjects', () => {
    const result = compileGuideLibrary(native, map, published, context);
    expect(result.recipeCount).toBe(147);
    expect(result.guideCount).toBe(50);
    expect(result.summaries.map(guide => guide.slug)).toEqual(published);
    expect(result.articles[0].recipes.map(recipe => recipe.id)).toEqual(['math-brace-angle', 'trig-inverse-cosine']);
    const rows = result.articles[0].recipes[0].sections.flatMap(section => section.instructionRows);
    expect(rows.at(-1)?.steps[0].labels).toEqual(['2nd', 'cos⁻¹']);
  });
  it('rejects incompatible exports and empty native instruction labels', () => {
    expect(() => compileGuideLibrary({ ...native, schemaVersion: 2 }, map, published, context)).toThrow();
    const broken = structuredClone(native);
    broken.topics[0].recipes[0].sections.find(section => section.instructionRows.length)!.instructionRows[0].steps[0].labels = [];
    expect(() => compileGuideLibrary(broken, map, published, context)).toThrow();
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
    expect(() => compileGuideLibrary(native, broken, published, context)).toThrow();
  });
  it('preserves all source associations, alias anchors and native related examples across the full library', () => {
    const result = compileGuideLibrary(native, map, map.guides.map(guide => guide.slug), context);
    expect(result.articles).toHaveLength(50);
    expect(result.articles.flatMap(article => article.recipes.flatMap(recipe => recipe.sourceRecipes))).toHaveLength(147);
    const squares = result.articles.find(article => article.slug === 'squares-and-square-roots')!;
    expect(squares.recipes).toHaveLength(3);
    expect(squares.recipes.find(recipe => recipe.id === 'square-area')?.aliasSectionIds).toEqual(['power-square-area']);
    expect(result.articles.flatMap(article => article.recipes.flatMap(recipe => recipe.relatedGuides)).every(link => result.articles.some(article => article.slug === link.slug && article.recipes.some(recipe => [recipe.sectionId, ...recipe.aliasSectionIds].includes(link.sectionId))))).toBe(true);
  });
  it('rejects changed duplicate actions rather than silently removing a distinct example', () => {
    const broken = structuredClone(native);
    const duplicate = broken.topics.find(topic => topic.recipes.some(recipe => recipe.id === 'power-square-area'))!.recipes.find(recipe => recipe.id === 'power-square-area')!;
    duplicate.sections.find(section => section.result)!.result = 'different result';
    expect(() => compileGuideLibrary(broken, map, published, context)).toThrow('Duplicate examples diverged');
  });
  it('requires concept copy and renderable diagrams before publication', () => {
    expect(() => compileGuideLibrary(native, map, published, {})).toThrow('Missing guide context');
    expect(() => compileGuideLibrary(native, map, published, { ...context, unknown: { paragraphs: ['Unknown subject'] } })).toThrow('Unknown guide context');
    const broken = structuredClone(native);
    const brace = broken.topics.find(topic => topic.recipes.some(recipe => recipe.id === 'math-brace-angle'))!.recipes.find(recipe => recipe.id === 'math-brace-angle')!;
    const schematic = brace.sections.find(section => 'diagram' in section && section.diagram);
    if (!schematic || !('diagram' in schematic) || !schematic.diagram) throw new Error('Missing brace fixture');
    schematic.diagram.id = 'unknown';
    expect(() => compileGuideLibrary(broken, map, published, context)).toThrow('Missing web diagram');
  });
  it('rejects nonexistent or repeated publication slugs', () => {
    expect(() => compileGuideLibrary(native, map, ['unknown'], context)).toThrow();
    expect(() => compileGuideLibrary(native, map, [...published, ...published], context)).toThrow();
  });
});
