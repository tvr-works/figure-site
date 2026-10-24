import type { ReactNode } from 'react';

export function LegalPage({ children }: { children: ReactNode }) {
  return <div className="legal-shell"><div className="legal-page">{children}</div></div>;
}

export function SupportEmail() {
  // Cloudflare's documented exemption keeps the public address readable without JavaScript.
  return <span dangerouslySetInnerHTML={{ __html: '<!--email_off--><a href="mailto:support@figure.tvr.works">support@figure.tvr.works</a><!--/email_off-->' }} />;
}
