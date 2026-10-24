import { createFileRoute, notFound } from '@tanstack/react-router';
import { guideArticles } from '../content/generated/library';
import { GuideArticlePage } from '../components/guides/GuideArticlePage';
import { pageHead, site } from '../site';

export const Route = createFileRoute('/guides/$slug')({
  loader: ({ params }) => {
    const article = guideArticles.find(guide => guide.slug === params.slug);
    if (!article) throw notFound();
    return article;
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
