import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from '@tanstack/react-router';
import { NotFoundPage } from '../components/legal/NotFoundPage';
import styles from '../styles.css?url';
import { site } from '../site';

export const Route = createRootRoute({
  head: () => ({
    meta: [{ charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { name: 'theme-color', content: '#101214' }, { name: 'robots', content: site.robots }],
    links: [{ rel: 'stylesheet', href: styles }, { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
  }),
  component: RootDocument,
  notFoundComponent: NotFoundPage,
});

function RootDocument() {
  const staticNotFound = useRouterState({ select: state => state.location.pathname === '/404' });
  return <html lang="en"><head><HeadContent /></head><body><Outlet />{!staticNotFound && <Scripts />}</body></html>;
}
