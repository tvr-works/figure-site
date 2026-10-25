import { Fragment } from 'react';
import { Link } from '@tanstack/react-router';
import type { GuideRecipe as Recipe } from '../../content/catalog';
import { Kbd, KbdGroup } from '../ui/kbd';
import { GuideDiagram } from './GuideDiagram';
import { GuideResults } from './GuideResults';
import { GuideDisplayReference, GuideSettings } from './GuideSettings';

export function GuideRecipe({ recipe, displayNote }: { recipe: Recipe; displayNote?: number }) {
  return <section id={recipe.sectionId} className="guide-example">
    {recipe.aliasSectionIds.map(id => <span key={id} id={id} className="guide-anchor" aria-hidden="true" />)}
    <h2>{recipe.title}</h2>
    <p>{recipe.introduction}{displayNote !== undefined && <GuideDisplayReference number={displayNote} context={recipe.sectionId} />}</p>
    <GuideSettings settings={recipe.exampleSetup} label="Settings for this example" />
    {recipe.sections.map(section => <section key={section.id} className="guide-step-section">
      {section.title && <h3>{section.title}{section.isOptional && ' (optional)'}</h3>}
      {section.text && <p>{section.text}</p>}
      {section.diagram && <GuideDiagram diagram={section.diagram} />}
      {section.settings.length > 0 && <GuideSettings settings={section.settings} />}
      {section.instructionRows.length > 0 && <ol className="guide-instructions" data-not-typeset>
        {section.instructionRows.map(row => <li key={row.id}>
          {row.title && <p className="guide-instruction-title">{row.title}</p>}
          {row.entryHint && <p>{row.entryHint}</p>}
          <span className="sr-only">Press {row.steps.map(step => step.spoken).join(', then ')}.</span>
          <KbdGroup aria-hidden="true" className="flex-wrap">{row.steps.flatMap(step => step.labels).map((label, index) => <Fragment key={index}>{index > 0 && <span className="guide-key-arrow">→</span>}<Kbd size="guide">{label}</Kbd></Fragment>)}</KbdGroup>
        </li>)}
      </ol>}
      <GuideResults section={section} usesExample={recipe.usesExample} />
      {section.resultNote && <p>{section.resultNote}</p>}
      {section.selection && <p>Use {section.selection.key} to select {section.selection.caption}{section.selection.alternateCaption && ` or ${section.selection.alternateCaption}`}.</p>}
    </section>)}
    {recipe.relatedGuides.length > 0 && <nav className="guide-example-related" aria-label={`Related examples for ${recipe.title}`}><h3>Related examples</h3><ul>{recipe.relatedGuides.map(link => <li key={`${link.topicId}/${link.recipeId}`}><Link to="/guides/$slug" params={{ slug: link.slug }} hash={link.sectionId}>{link.title}</Link></li>)}</ul></nav>}
  </section>;
}
