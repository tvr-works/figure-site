import { createFileRoute } from '@tanstack/react-router';
import { MarketingPage } from '../components/MarketingPage';
import { pageHead, site, structuredData } from '../site';

const homeHead = pageHead('/', 'Figure · Construction calculator for iPhone', 'Construction, fabrication and DIY calculations with adaptive keys, visual results, feet, inches, fractions and metric. No subscription.');

export const Route = createFileRoute('/')({
  head: () => ({
    ...homeHead,
    scripts: [structuredData('website-data', {
      '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${site.origin}/#website`,
      name: site.name, url: `${site.origin}/`, inLanguage: 'en',
      description: 'Figure is an iPhone calculator for construction, fabrication and DIY measurements.',
    })],
    links: [...homeHead.links, { rel: 'preload', as: 'image', href: '/assets/hero-phone.webp', fetchPriority: 'high' }],
  }),
  component: MarketingPage,
});
