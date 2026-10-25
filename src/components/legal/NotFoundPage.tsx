import { Link } from '@tanstack/react-router';
import { LegalPage } from './LegalPage';

export function NotFoundPage() {
  return <LegalPage title="Page not found" introduction={<p>This page is not available.</p>}>
    <p><Link to="/">Return to Figure</Link> or visit <Link to="/support">Support</Link>.</p>
  </LegalPage>;
}
