import { Link } from '@tanstack/react-router';

export function SiteHeader() {
  return <header className="site-header page-width">
    <Link className="brand" to="/" aria-label="Figure home">
      <span className="brand-mark" aria-hidden="true"><img src="/assets/figure-square.svg" alt="" width="40" height="40" /><img src="/assets/figure-plus-minus.svg" alt="" width="40" height="40" /></span>
      <span>Figure</span>
    </Link>
    <nav aria-label="Main navigation"><Link className="explore-link" to="/" hash="demo">Explore</Link><Link to="/support">Support</Link><Link className="cta cta-small" to="/" hash="get-figure">Get Figure</Link></nav>
  </header>;
}

export function SiteFooter() {
  return <footer className="site-footer" id="get-figure" aria-label="Figure availability and support" tabIndex={-1}>
    <div className="footer-row page-width">
      <Link className="brand" to="/" aria-label="Figure home">Figure</Link>
      <p className="footer-status">Preparing for the App Store.</p>
      <nav aria-label="Footer"><Link to="/support">Support</Link><Link to="/privacy">Privacy</Link></nav>
    </div>
  </footer>;
}
