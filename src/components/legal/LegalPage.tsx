import type { ReactNode } from 'react';
import { SiteHeader, SiteFooter } from '../SiteChrome';
import { SiteBreadcrumb } from '../SiteBreadcrumb';

interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

interface LegalPageProps {
  title: string;
  introduction: ReactNode;
  updated?: { dateTime: string; label: string };
  sections?: LegalSection[];
  children?: ReactNode;
}

export function LegalPage({ title, introduction, updated, sections = [], children }: LegalPageProps) {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader />
    <main id="main" className="legal-shell">
      <div className="guide-main page-width">
        <SiteBreadcrumb current={title} />
        <header className="guide-header">
          <h1 className="guide-heading">{title}</h1>
          {updated && <p className="legal-date">Last updated: <time dateTime={updated.dateTime}>{updated.label}</time></p>}
          <div className="guide-lede legal-lede">{introduction}</div>
        </header>
        <div className="guide-article-layout legal-layout">
          {sections.length > 0 && <aside className="guide-on-this-page"><nav aria-label="On this page"><h2>On this page</h2><ol>{sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol></nav></aside>}
          <article className="legal-content typeset typeset-figure-policy" aria-label={title}>
            {sections.map(section => <section id={section.id} key={section.id}><h2>{section.title}</h2>{section.content}</section>)}
            {children}
          </article>
        </div>
      </div>
    </main>
    <SiteFooter />
  </>;
}

export function SupportEmail() {
  // Cloudflare's documented exemption keeps the public address readable without JavaScript.
  return <span dangerouslySetInnerHTML={{ __html: '<!--email_off--><a href="mailto:support@figure.tvr.works">support@figure.tvr.works</a><!--/email_off-->' }} />;
}
