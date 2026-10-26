import { createFileRoute } from '@tanstack/react-router';
import { MarketingPage } from '../components/MarketingPage';
import { pageHead, site, structuredData } from '../site';

const homeHead = pageHead('/', 'Figure · Trade Calculator for iPhone', 'Trade math for construction, fabrication and DIY. Adaptive keys, visual results, feet, inches, yards, fractions and metric. No subscription.');

export const Route = createFileRoute('/')({
  head: () => ({
    ...homeHead,
    // The background is the largest painted element and otherwise waits for CSS.
    links: [...homeHead.links, { rel: 'preload', as: 'image', href: '/assets/hero-atmosphere.webp', fetchPriority: 'high' }],
    scripts: [structuredData('website-data', {
      '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${site.origin}/#website`,
      name: site.name, url: `${site.origin}/`, inLanguage: 'en',
      description: 'Figure is an iPhone trade calculator for construction, fabrication and DIY measurements.',
    })],
  }),
  component: MarketingPage,
});
