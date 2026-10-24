import { createFileRoute, notFound } from '@tanstack/react-router';
import type { GuideArticle } from '../content/catalog';

import { GuideArticlePage } from '../components/guides/GuideArticlePage';
import { pageHead, site } from '../site';

const articles = import.meta.glob<GuideArticle>('../content/generated/articles/*.json', { import: 'default' });

export const Route = createFileRoute('/guides/$slug')({
  loader: async ({ params }) => {
    const load = articles[`../content/generated/articles/${params.slug}.json`];
    if (!load) throw notFound();
    return load();
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const path = `/guides/${loaderData.slug}`;
    return {
      ...pageHead(path, `${loaderData.title} · Figure guide`, loaderData.summary),
      scripts: [{ type: 'application/ld+json', children: JSON.stringify({ '@context': 'https://schema.org', '@type': 'TechArticle', headline: loaderData.title, description: loaderData.summary, inLanguage: 'en', url: new URL(path, site.origin).href }) }],
    };
  },
  component: Article,
});

function Article() {
  return <GuideArticlePage article={Route.useLoaderData()} />;
}
