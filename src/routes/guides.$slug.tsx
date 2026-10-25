import { createFileRoute, notFound } from '@tanstack/react-router';
import type { GuideArticle } from '../content/catalog';

import { GuideArticlePage } from '../components/guides/GuideArticlePage';
import { pageHead, site, structuredData } from '../site';

import { pageLastModified } from '../site-pages';

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
    const url = new URL(path, site.origin).href;
    const head = pageHead(path, `${loaderData.title} · Figure guide`, loaderData.summary, {
      type: 'article', breadcrumbs: [{ name: 'Guides', path: '/guides' }, { name: loaderData.title, path }],
    });
    return {
      ...head,
      scripts: [...head.scripts, structuredData('article-data', {
        '@context': 'https://schema.org', '@type': 'TechArticle', '@id': `${url}#article`,
        headline: loaderData.title, description: loaderData.summary, inLanguage: 'en', url,
        mainEntityOfPage: url, isPartOf: { '@id': `${site.origin}/#website` }, dateModified: pageLastModified(path),
      })],
    };
  },
  component: Article,
});

function Article() {
  return <GuideArticlePage article={Route.useLoaderData()} />;
}
