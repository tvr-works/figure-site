import { createFileRoute } from '@tanstack/react-router';
import { MarketingPage } from '../components/MarketingPage';
import { pageHead } from '../site';

const homeHead = pageHead('/', 'Figure · Construction calculator for iPhone', 'Construction, fabrication and DIY calculations with adaptive keys, visual results, feet, inches, fractions and metric. No subscription.');

export const Route = createFileRoute('/')({
  head: () => ({
    ...homeHead,
    links: [...homeHead.links, { rel: 'preload', as: 'image', href: '/assets/hero-phone.webp', fetchPriority: 'high' }],
  }),
  component: MarketingPage,
});
