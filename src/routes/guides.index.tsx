import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { guideSummaries } from '../content/generated/library';
import { SiteHeader, SiteFooter } from '../components/SiteChrome';
import { GuideBreadcrumb } from '../components/guides/GuideBreadcrumb';
import { pageHead } from '../site';

export const Route = createFileRoute('/guides/')({
  head: () => pageHead('/guides', 'Calculation guides · Figure', 'Understand the math, work through an example, and follow the steps in Figure for iPhone.'),
  component: GuideIndex,
});

function GuideIndex() {
  const categories = [...new Set(guideSummaries.map(guide => guide.categoryTitle))];
  return <><a className="skip-link" href="#main">Skip to content</a><SiteHeader guides />
    <main id="main" className="guide-shell"><div className="guide-main page-width">
      <GuideBreadcrumb />
      <header className="guide-header"><h1 className="guide-heading">Guides</h1><p className="guide-lede">Understand the math, work through an example, and follow the steps in Figure.</p></header>
      <div className="guide-index">{categories.map(category => <section key={category}><h2>{category}</h2><ul>{guideSummaries.filter(guide => guide.categoryTitle === category).map(guide => <li key={guide.id}><Link to="/guides/$slug" params={{ slug: guide.slug }}><h3>{guide.title}<ArrowUpRight aria-hidden="true" /></h3><p>{guide.summary}</p></Link></li>)}</ul></section>)}</div>
      <p className="guide-index-note">Figure also includes searchable Help inside the calculator. <Link to="/" hash="help">See how it works →</Link></p>
    </div></main><SiteFooter /></>;
}
