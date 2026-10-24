import { Link } from '@tanstack/react-router';
import { ProductDemo } from '../ProductDemo';
import { HelpDemo } from '../HelpDemo';
import { SiteHeader, SiteFooter } from './SiteChrome';

export function MarketingPage() {
  return (<><a className="skip-link" href="#main">Skip to content</a>
  <SiteHeader />
  <main id="main">
    <div className="hero-shell">
      <section className="hero-grid page-width" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Construction · Fabrication · DIY</p>
          <h1 id="hero-title">Trade math.<br />Made intuitive.</h1>
          <p className="hero-description">Helpful modes. Adaptive keys. Visual results. Easy conversions.</p>
          <div className="hero-actions"><a className="cta" href="#get-figure">Get Figure</a><a className="hero-demo-link" href="#demo">See it work <img src="/assets/arrow-down.svg" alt="" width="18" height="18" aria-hidden="true" /></a></div>
          <p className="purchase-model">No subscription. No account. No ads.</p>
          <p className="compatibility">For iPhone · iOS 26 or later</p>
        </div>
        <img className="hero-phone" src="/assets/hero-phone.webp" width="852" height="1846" alt="Figure’s dark Circle calculator on iPhone, showing an arc-length result with feet, inches, and fractions." fetchPriority="high" />
      </section>
    </div>
  <section id="demo" className="demo-section" aria-labelledby="demo-title">
    <div className="page-width">
      <h2 id="demo-title" className="demo-section-title">See how Figure works.</h2>
      <p className="demo-section-intro">Choose a mode and follow a complete calculation. Watch the keys adapt to the task and the diagram highlight what each result measures.</p>
      <div id="product-demo"><ProductDemo /></div>
    </div>
  </section>
  <section id="help" className="help-section" aria-labelledby="help-title">
    <div className="page-width">
      <h2 id="help-title" className="demo-section-title">Help without losing your place.</h2>
      <p className="demo-section-intro">Worked examples, plain-language explanations, and practical uses, right alongside your calculation. <Link className="help-guides-link" to="/guides">Browse the guides →</Link></p>
      <div id="help-demo"><HelpDemo /></div>
    </div>
  </section>
  </main>
  <SiteFooter /></>);
}
