import { createFileRoute } from '@tanstack/react-router';
import { PrivacyPage } from '../components/legal/PrivacyPage';
import { pageHead } from '../site';

export const Route = createFileRoute('/privacy')({
  head: () => pageHead('/privacy', "Privacy · Figure", "How Figure handles local calculator data, diagnostics, support email and visits to this website."),
  component: PrivacyPage,
});
