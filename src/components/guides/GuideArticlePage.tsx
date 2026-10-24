import { Link } from '@tanstack/react-router';
import type { GuideArticle } from '../../content/catalog';
import { SiteHeader, SiteFooter } from '../SiteChrome';
import { GuideBreadcrumb } from './GuideBreadcrumb';
import { GuideRecipe } from './GuideRecipe';

export function GuideArticlePage({ article }: { article: GuideArticle }) {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <SiteHeader guides />
    <main id="main" className="guide-shell">
      <div className="guide-main page-width">
        <GuideBreadcrumb title={article.title} />
        <header className="guide-header"><p className="guide-category">{article.categoryTitle}</p><h1 className="guide-heading">{article.title}</h1><p className="guide-lede">{article.summary}</p></header>
        <div className="guide-article-layout">
          <article className="guide-article typeset typeset-figure-guide" aria-label={article.title}>
            {article.recipes.map(recipe => <GuideRecipe key={recipe.id} recipe={recipe} />)}
            <div className="guide-app-note"><h2>Keep the guide beside your calculation.</h2><p>These examples are built into Figure. Open Help while you calculate, then return to the same guide and reading position.</p><Link to="/" hash="help">See Help in Figure →</Link></div>
          </article>
          <aside className="guide-on-this-page"><nav aria-label="On this page"><h2>On this page</h2><ol>{article.recipes.map(recipe => <li key={recipe.sectionId}><a href={`#${recipe.sectionId}`}>{recipe.title}</a></li>)}</ol></nav><Link to="/guides">Browse guides →</Link></aside>
        </div>
      </div>
    </main>
    <SiteFooter />
  </>;
}
