import { createFileRoute } from '@tanstack/react-router';
import { SupportPage } from '../components/legal/SupportPage';
import { pageHead } from '../site';

export const Route = createFileRoute('/support')({
  head: () => pageHead('/support', "Support · Figure", "Get help with Figure, report a calculation or display problem, or contact support."),
  component: SupportPage,
});
