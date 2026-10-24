import { LegalPage } from './LegalPage';

export function NotFoundPage() {
  return <LegalPage><main className="typeset typeset-figure-policy"><h1>Page not found</h1><p>This page is not available.</p></main>
  <nav aria-label="Site"><a href="/">Figure</a><a href="/support">Support</a><a href="/privacy">Privacy</a></nav></LegalPage>;
}
