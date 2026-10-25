import { indexingRobots, resolveSiteIndexing } from './indexing.ts';

export const site = {
  name: 'Figure',
  origin: 'https://figure.tvr.works',
  robots: indexingRobots(resolveSiteIndexing(import.meta.env?.VITE_SITE_INDEXING)),
};

export function pageHead(path: string, title: string, description: string, robots = site.robots) {
  const url = new URL(path, site.origin).href;
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { name: 'robots', content: robots },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: site.name },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
    ],
    links: [{ rel: 'canonical', href: url }],
  };
}
