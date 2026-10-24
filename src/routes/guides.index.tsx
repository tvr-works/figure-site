import { ClientOnly, createFileRoute, Link, useHydrated } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { guideSummaries } from '../content/generated/summaries';
import { filterGuides, parseGuideSearch } from '../content/search-guides';
import { SiteHeader, SiteFooter } from '../components/SiteChrome';
import { GuideBreadcrumb } from '../components/guides/GuideBreadcrumb';
import { Field, FieldGroup, FieldLabel } from '../components/ui/field';
import { Input } from '../components/ui/input';
import { pageHead } from '../site';

export const Route = createFileRoute('/guides/')({
  validateSearch: parseGuideSearch,
  head: () => pageHead('/guides', 'Calculation guides · Figure', 'Understand the math, work through an example, and follow the steps in Figure for iPhone.'),
  component: GuideIndex,
});

function GuideIndex() {
  const { q = '' } = Route.useSearch();
  const navigate = Route.useNavigate();
  const hydrated = useHydrated();
  // Static hosting serves the same HTML for query URLs. Keep the full index for
  // SSR/first hydration, then enhance it with the browser's validated URL state.
  const guides = filterGuides(guideSummaries, hydrated ? q : '');
  const categories = [...new Map(guides.map(guide => [guide.categoryId, guide.categoryTitle])).entries()];
  return <><a className="skip-link" href="#main">Skip to content</a><SiteHeader />
    <main id="main" className="guide-shell"><div className="guide-main page-width">
      <GuideBreadcrumb />
      <header className="guide-header"><h1 className="guide-heading">Guides</h1><p className="guide-lede">Understand the math, work through an example, and follow the steps in Figure.</p></header>
      <ClientOnly><search className="guide-search" aria-label="Guide library"><FieldGroup><Field><FieldLabel htmlFor="guide-search">Search guides</FieldLabel><Input id="guide-search" type="search" value={q} maxLength={160} autoComplete="off" placeholder="Try brace angle, pipe wrap, or fan speed" aria-controls="guide-results" onChange={event => { void navigate({ search: event.target.value ? { q: event.target.value } : {}, replace: true, resetScroll: false }); }} /></Field></FieldGroup></search></ClientOnly>
      <output htmlFor={hydrated ? 'guide-search' : undefined} className="guide-search-status">{guides.length} {guides.length === 1 ? 'guide' : 'guides'}{hydrated && q.trim() ? ' found' : ` across ${categories.length} categories`}</output>
      {categories.length > 0 && <nav className="guide-category-nav" aria-label="Guide categories">{categories.map(([id, title]) => <a key={id} href={`#guide-category-${id}`}>{title}</a>)}</nav>}
      <div id="guide-results" className="guide-index">{categories.map(([id, title]) => <section key={id} aria-labelledby={`guide-category-${id}`}><h2 id={`guide-category-${id}`}>{title}</h2><ul>{guides.filter(guide => guide.categoryId === id).map(guide => <li key={guide.id}><Link to="/guides/$slug" params={{ slug: guide.slug }}><h3>{guide.title}<ArrowUpRight aria-hidden="true" /></h3><p>{guide.summary}</p></Link></li>)}</ul></section>)}</div>
      {guides.length === 0 && <p className="guide-no-results">No guides match this search. Try a subject, measurement, or application.</p>}
      <p className="guide-index-note">Figure also includes searchable Help inside the calculator. <Link to="/" hash="help">See how it works →</Link></p>
    </div></main><SiteFooter /></>;
}
