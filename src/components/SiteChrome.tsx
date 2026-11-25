import { Link } from '@tanstack/react-router';

export function SiteHeader() {
  return <header className="site-header page-width">
    <Link className="brand" to="/" aria-label="Figure home">
      <span className="brand-mark" aria-hidden="true"><img src="/assets/figure-square.svg" alt="" width="40" height="40" /><img src="/assets/figure-plus-minus.svg" alt="" width="40" height="40" /></span>
      <span>Figure</span>
    </Link>
    <nav aria-label="Main navigation"><Link to="/guides">Guides</Link><Link to="/support">Support</Link><Link className="cta cta-small" to="/" hash="get-figure">Get Figure</Link></nav>
  </header>;
}

export function SiteFooter() {
  return (
    <footer className="site-footer" id="get-figure" tabIndex={-1}>
      <div className="footer-row page-width">
        <div className="footer-legal">
          <small>© 2026 TVR Works LLC</small>{' '}
          <span className="footer-legal-links">
            <span aria-hidden="true">·</span>{' '}
            <a href="https://tvr.works/software">Software</a>{' '}
            <span aria-hidden="true">·</span>{' '}
            <Link to="/privacy">Privacy</Link>
          </span>
        </div>
        <nav aria-label="Footer">
          <Link to="/guides">Guides</Link>
          <Link to="/support">Support</Link>
        </nav>
      </div>
    </footer>
  );
}
