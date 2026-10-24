import { z } from 'zod';

const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const text = z.string().min(1);
const setting = z.strictObject({ id: text, title: text, value: text });
const diagram = z.strictObject({ id: text, explanation: text });
const step = z.strictObject({ kind: z.enum(['number', 'unit', 'action']), labels: z.array(text).min(1), spoken: text });
const instruction = z.strictObject({ id: z.number().int(), title: z.string(), entryHint: text.optional(), steps: z.array(step).min(1) });
const section = z.strictObject({
  id, title: z.string(), text: z.string(), instructionRows: z.array(instruction),
  result: text.optional(), resultLabel: text.optional(), resultNote: text.optional(),
  settings: z.array(setting), diagram: diagram.optional(), isOptional: z.boolean(),
  cycle: z.strictObject({ key: text, results: z.array(z.strictObject({ id, name: text, value: text })), jobNames: z.array(text).optional(), jobNote: text.optional() }).optional(),
  selection: z.strictObject({ key: text, caption: text, alternateCaption: text.optional() }).optional(),
});
const recipe = z.strictObject({
  id, title: text, introduction: text, searchAliases: z.array(text), usesExample: z.boolean(),
  exampleSetup: z.array(setting), exampleDisplay: z.array(setting), sections: z.array(section).min(1),
  relatedGuides: z.array(z.strictObject({ topicId: id, recipeId: id, title: text })),
});
const nativeCatalog = z.strictObject({
  schemaVersion: z.literal(1),
  source: z.strictObject({ revision: z.string().regex(/^[a-f0-9]{40}$/), contentDigest: z.string().regex(/^[a-f0-9]{64}$/) }),
  topics: z.array(z.strictObject({ id, title: text, subtitle: text, category: text, keywords: z.string(), recipes: z.array(recipe).min(1) })).min(1),
});
const reference = z.strictObject({ topicId: id, recipeId: id });
const guideMap = z.strictObject({
  schemaVersion: z.literal(1), status: z.literal('proposal'), routePrefix: z.literal('/guides/'),
  source: z.strictObject({ repository: text, commit: text, catalogPath: text, contentDirectory: text, topicCount: z.number().int(), recipeCount: z.number().int() }),
  categories: z.array(z.strictObject({ id, title: text })).min(1),
  guides: z.array(z.strictObject({
    id, slug: id, title: text, summary: text, categoryId: id, searchAliases: z.array(text),
    featuredSectionId: id, sourceRecipes: z.array(reference.extend({ sectionId: id })).min(1), relatedGuideIds: z.array(id),
  })).min(1),
  duplicateExampleCandidates: z.array(z.strictObject({ guideId: id, sources: z.array(reference).min(2), reason: text })),
});

function unique(values: string[], label: string) {
  if (new Set(values).size !== values.length) throw new Error(`Duplicate ${label}.`);
}

export function compileGuideLibrary(nativeInput: unknown, mapInput: unknown, publishedSlugs: readonly string[]) {
  const native = nativeCatalog.parse(nativeInput);
  const map = guideMap.parse(mapInput);
  unique(native.topics.map(topic => topic.id), 'native topic');
  unique(map.categories.map(category => category.id), 'category');
  unique(map.guides.map(guide => guide.id), 'guide identity');
  unique(map.guides.map(guide => guide.slug), 'guide slug');
  unique(publishedSlugs.slice(), 'published slug');
  const nativeRecipes = new Map<string, z.infer<typeof recipe>>(native.topics.flatMap(topic => {
    unique(topic.recipes.map(item => item.id), `recipe in ${topic.id}`);
    return topic.recipes.map(item => [`${topic.id}/${item.id}`, item] as const);
  }));
  const assigned = new Set<string>();
  const categoryIds = new Set(map.categories.map(category => category.id));
  const guidesById = new Map(map.guides.map(guide => [guide.id, guide]));
  for (const guide of map.guides) {
    if (!categoryIds.has(guide.categoryId)) throw new Error(`Unknown category: ${guide.categoryId}`);
    unique(guide.sourceRecipes.map(item => item.sectionId), `section anchor in ${guide.slug}`);
    if (!guide.sourceRecipes.some(item => item.sectionId === guide.featuredSectionId)) throw new Error(`Missing featured section: ${guide.slug}`);
    for (const related of guide.relatedGuideIds) {
      if (related === guide.id || !guidesById.has(related)) throw new Error(`Invalid related guide: ${related}`);
    }
    for (const ref of guide.sourceRecipes) {
      const key = `${ref.topicId}/${ref.recipeId}`;
      if (!nativeRecipes.has(key)) throw new Error(`Missing native recipe: ${key}`);
      if (assigned.has(key)) throw new Error(`Duplicate primary recipe: ${key}`);
      assigned.add(key);
    }
  }
  for (const key of nativeRecipes.keys()) if (!assigned.has(key)) throw new Error(`Unmapped native recipe: ${key}`);
  if (map.source.topicCount !== native.topics.length || map.source.recipeCount !== nativeRecipes.size) throw new Error('Catalog coverage counts changed; update the subject map.');
  for (const item of nativeRecipes.values()) {
    unique(item.sections.map(s => s.id), `native section in ${item.id}`);
    for (const related of item.relatedGuides) if (!nativeRecipes.has(`${related.topicId}/${related.recipeId}`)) throw new Error(`Missing native related recipe: ${related.recipeId}`);
  }
  for (const candidate of map.duplicateExampleCandidates) {
    const guide = guidesById.get(candidate.guideId);
    if (!guide || candidate.sources.some(ref => !guide.sourceRecipes.some(source => source.topicId === ref.topicId && source.recipeId === ref.recipeId))) throw new Error(`Invalid duplicate candidate: ${candidate.guideId}`);
  }
  const published = publishedSlugs.map(slug => {
    const guide = map.guides.find(item => item.slug === slug);
    if (!guide) throw new Error(`Unknown published guide: ${slug}`);
    return guide;
  });
  const summaries = published.map(guide => ({
    id: guide.id, slug: guide.slug, title: guide.title, summary: guide.summary,
    categoryId: guide.categoryId, categoryTitle: map.categories.find(category => category.id === guide.categoryId)!.title,
  }));
  const articles = published.map(guide => ({
    ...summaries.find(summary => summary.id === guide.id)!,
    featuredSectionId: guide.featuredSectionId,
    recipes: guide.sourceRecipes.map(ref => ({ ...nativeRecipes.get(`${ref.topicId}/${ref.recipeId}`)!, sectionId: ref.sectionId })),
    related: summaries.filter(summary => guide.relatedGuideIds.includes(summary.id)),
  }));
  return { source: native.source, summaries, articles, recipeCount: nativeRecipes.size, guideCount: map.guides.length };
}

export type GuideArticle = ReturnType<typeof compileGuideLibrary>['articles'][number];
export type GuideSummary = ReturnType<typeof compileGuideLibrary>['summaries'][number];
export type GuideRecipe = GuideArticle['recipes'][number];
