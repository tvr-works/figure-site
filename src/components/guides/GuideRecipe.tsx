import { Fragment } from 'react';
import { Link } from '@tanstack/react-router';
import type { GuideRecipe as Recipe } from '../../content/catalog';
import { Kbd, KbdGroup } from '../ui/kbd';
import { GuideDiagram } from './GuideDiagram';

function Settings({ settings, label }: { settings: Recipe['exampleSetup']; label?: string }) {
  if (!settings.length) return null;
  return <div className="guide-settings">{label && <h3>{label}</h3>}<dl data-not-typeset>{settings.map(setting => <div key={setting.id}><dt>{setting.title}</dt><dd>{setting.value}</dd></div>)}</dl></div>;
}

export function GuideRecipe({ recipe }: { recipe: Recipe }) {
  return <section id={recipe.sectionId} className="guide-example">
    {recipe.aliasSectionIds.map(id => <span key={id} id={id} className="guide-anchor" aria-hidden="true" />)}
    <h2>{recipe.title}</h2>
    <p>{recipe.introduction}</p>
    <Settings settings={recipe.exampleSetup} label="Example setup" />
    <Settings settings={recipe.exampleDisplay} label="Example display" />
    {recipe.sections.map(section => <section key={section.id} className="guide-step-section">
      {section.title && <h3>{section.title}{section.isOptional && ' (optional)'}</h3>}
      {section.text && <p>{section.text}</p>}
      {section.diagram && <GuideDiagram diagram={section.diagram} />}
      {section.settings.length > 0 && <Settings settings={section.settings} />}
      {section.instructionRows.length > 0 && <ol className="guide-instructions" data-not-typeset>
        {section.instructionRows.map(row => <li key={row.id}>
          {row.title && <p className="guide-instruction-title">{row.title}</p>}
          {row.entryHint && <p>{row.entryHint}</p>}
          <span className="sr-only">Press {row.steps.map(step => step.spoken).join(', then ')}.</span>
          <KbdGroup aria-hidden="true" className="flex-wrap">{row.steps.flatMap(step => step.labels).map((label, index) => <Fragment key={index}>{index > 0 && <span className="guide-key-arrow">→</span>}<Kbd size="guide">{label}</Kbd></Fragment>)}</KbdGroup>
        </li>)}
      </ol>}
      {section.result && <p className="guide-result" data-not-typeset><span>{section.resultLabel ?? (recipe.usesExample ? 'Example result' : 'Result')}</span><strong>{section.result}</strong></p>}
      {section.resultNote && <p>{section.resultNote}</p>}
      {section.selection && <p>Use {section.selection.key} to select {section.selection.caption}{section.selection.alternateCaption && ` or ${section.selection.alternateCaption}`}.</p>}
      {section.cycle && <details className="guide-cycle" data-not-typeset>
        <summary>Other results · press {section.cycle.key}</summary>
        {section.cycle.jobNote && <p>{section.cycle.jobNote}</p>}
        {section.cycle.jobNames ? <ul>{section.cycle.jobNames.map(name => <li key={name}>{name}</li>)}</ul> : <dl>{section.cycle.results.map(result => <div key={result.id}><dt>{result.name}</dt><dd>{result.value}</dd></div>)}</dl>}
      </details>}
    </section>)}
    {recipe.relatedGuides.length > 0 && <nav className="guide-example-related" aria-label={`Related examples for ${recipe.title}`}><h3>Related examples</h3><ul>{recipe.relatedGuides.map(link => <li key={`${link.topicId}/${link.recipeId}`}><Link to="/guides/$slug" params={{ slug: link.slug }} hash={link.sectionId}>{link.title}</Link></li>)}</ul></nav>}
  </section>;
}
