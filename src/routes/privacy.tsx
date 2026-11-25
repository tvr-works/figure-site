import { createFileRoute } from '@tanstack/react-router';
import { PrivacyPage, privacyTitle } from '../components/legal/PrivacyPage';
import { pageHead } from '../site';

export const Route = createFileRoute('/privacy')({
  head: () => pageHead('/privacy', "Privacy · Figure", "How Figure handles local calculator data, diagnostics, support email and visits to this website.", { breadcrumbs: [{ name: privacyTitle, path: '/privacy' }] }),
  component: PrivacyPage,
});
