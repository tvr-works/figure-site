import { createFileRoute } from '@tanstack/react-router';
import { MarketingPage } from '../components/MarketingPage';
import { pageHead } from '../site';

const homeHead = pageHead('/', 'Figure · Trade math. Made intuitive.', 'Trade math. Made intuitive. Figure for iPhone brings helpful modes, adaptive keys, visual results, and easy conversions to construction, fabrication, and DIY.');

export const Route = createFileRoute('/')({
  head: () => ({
    ...homeHead,
    links: [...homeHead.links, { rel: 'preload', as: 'image', href: '/assets/hero-phone.webp', fetchPriority: 'high' }],
  }),
  component: MarketingPage,
});
