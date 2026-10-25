import { createFileRoute } from '@tanstack/react-router';
import { NotFoundPage } from '../components/legal/NotFoundPage';
import { pageHead } from '../site';

export const Route = createFileRoute('/404')({
  head: () => pageHead('/404', "Page not found · Figure", "The requested Figure page could not be found.", { robots: 'noindex, nofollow' }),
  component: NotFoundPage,
});
