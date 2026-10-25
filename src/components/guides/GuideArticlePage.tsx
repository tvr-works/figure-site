import { Link } from '@tanstack/react-router';
import type { GuideArticle } from '../../content/catalog';
import { SiteHeader, SiteFooter } from '../SiteChrome';
import { SiteBreadcrumb } from '../SiteBreadcrumb';
import { GuideRecipe } from './GuideRecipe';
import { GuideDisplayNotes, GuideDisplayReference, groupDisplaySettings } from './GuideSettings';

export function GuideArticlePage({ article }: { article: GuideArticle }) {
  const displayNotes = groupDisplaySettings(article.recipes);
  const sharedDisplayNote = displayNotes.length === 1 && displayNotes[0].examples.length === article.recipes.length ? displayNotes[0] : undefined;
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader />
    <main id="main" className="guide-shell">
      <div className="guide-main page-width">
        <SiteBreadcrumb current={article.title} section={{ title: 'Guides', to: '/guides' }} />
        <header className="guide-header"><p className="guide-category">{article.categoryTitle}</p><h1 className="guide-heading">{article.title}</h1><p className="guide-lede">{article.summary}{sharedDisplayNote && <GuideDisplayReference number={sharedDisplayNote.number} context="guide" />}</p></header>
        <div className="guide-article-layout">
          <article className="guide-article typeset typeset-figure-guide" aria-label={article.title}>
            <div className="guide-concept">{article.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
            {article.recipes.map(recipe => <GuideRecipe key={recipe.id} recipe={recipe} displayNote={sharedDisplayNote ? undefined : displayNotes.find(note => note.examples.some(example => example.sectionId === recipe.sectionId))?.number} />)}
            <GuideDisplayNotes notes={displayNotes} shared={Boolean(sharedDisplayNote)} />
            {article.references.length > 0 && <section className="guide-references"><h2>References</h2><ul>{article.references.map(reference => <li key={reference.url}><a href={reference.url}>{reference.title}</a></li>)}</ul></section>}
            {article.related.length > 0 && <nav className="guide-related" aria-labelledby="related-guides-title"><h2 id="related-guides-title">Related guides</h2><ul>{article.related.map(guide => <li key={guide.id}><Link to="/guides/$slug" params={{ slug: guide.slug }}>{guide.title}</Link></li>)}</ul></nav>}
            <div className="guide-app-note"><h2>Keep the guide beside your calculation.</h2><p>These examples are built into Figure. Open Help while you calculate, then return to the same guide and reading position.</p><Link to="/" hash="help">See Help in Figure →</Link></div>
          </article>
          <aside className="guide-on-this-page"><nav aria-label="On this page"><h2>On this page</h2><ol>{article.recipes.map(recipe => <li key={recipe.sectionId}><a href={`#${recipe.sectionId}`}>{recipe.title}</a></li>)}</ol></nav><Link to="/guides">Browse guides →</Link></aside>
        </div>
      </div>
    </main>
    <SiteFooter />
  </>;
}
