import { indexingRobots, resolveSiteIndexing } from './indexing.ts';

export const site = {
  name: 'Figure',
  origin: 'https://figure.tvr.works',
  robots: indexingRobots(resolveSiteIndexing(import.meta.env?.VITE_SITE_INDEXING)),
};

interface PageHeadOptions {
  robots?: string;
  breadcrumbs?: readonly { name: string; path: string }[];
  type?: 'website' | 'article';
}

export function structuredData(id: string, value: Record<string, unknown>) {
  // Keep authored text inside the JSON script, even if it contains HTML syntax.
  return { id, type: 'application/ld+json', children: JSON.stringify(value).replace(/</g, '\\u003c') };
}

export function pageHead(path: string, title: string, description: string, options: PageHeadOptions = {}) {
  const url = new URL(path, site.origin).href;
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { name: 'robots', content: options.robots ?? site.robots },
      { property: 'og:type', content: options.type ?? 'website' },
      { property: 'og:site_name', content: site.name },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
    ],
    links: [{ rel: 'canonical', href: url }],
    scripts: options.breadcrumbs ? [structuredData('breadcrumb-data', {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [{ name: site.name, path: '/' }, ...options.breadcrumbs].map((item, index) => ({
        '@type': 'ListItem', position: index + 1, name: item.name, item: new URL(item.path, site.origin).href,
      })),
    })] : [],
  };
}
