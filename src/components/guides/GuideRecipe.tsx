import { Fragment } from 'react';
import type { GuideRecipe as Recipe } from '../../content/catalog';
import { Kbd, KbdGroup } from '../ui/kbd';
import { GuideDiagram } from './GuideDiagram';

function Settings({ settings, label }: { settings: Recipe['exampleSetup']; label: string }) {
  if (!settings.length) return null;
  return <div className="guide-settings"><h3>{label}</h3><dl>{settings.map(setting => <div key={setting.id}><dt>{setting.title}</dt><dd>{setting.value}</dd></div>)}</dl></div>;
}

export function GuideRecipe({ recipe }: { recipe: Recipe }) {
  return <section id={recipe.sectionId} className="guide-example">
    <h2>{recipe.title}</h2>
    <p>{recipe.introduction}</p>
    <Settings settings={recipe.exampleSetup} label="Example setup" />
    <Settings settings={recipe.exampleDisplay} label="Example display" />
    {recipe.sections.map(section => <section key={section.id} className="guide-step-section">
      {section.title && <h3>{section.title}{section.isOptional && ' (optional)'}</h3>}
      {section.text && <p>{section.text}</p>}
      {section.diagram && <GuideDiagram diagram={section.diagram} />}
      {section.settings.length > 0 && <Settings settings={section.settings} label="Settings" />}
      {section.instructionRows.length > 0 && <ol className="guide-instructions">
        {section.instructionRows.map(row => <li key={row.id}>
          {row.title && <p className="guide-instruction-title">{row.title}</p>}
          {row.entryHint && <p>{row.entryHint}</p>}
          <span className="sr-only">Press {row.steps.map(step => step.spoken).join(', then ')}.</span>
          <KbdGroup aria-hidden="true" className="flex-wrap">{row.steps.flatMap(step => step.labels).map((label, index) => <Fragment key={index}>{index > 0 && <span className="guide-key-arrow">→</span>}<Kbd size="guide">{label}</Kbd></Fragment>)}</KbdGroup>
        </li>)}
      </ol>}
      {section.result && <p className="guide-result"><span>{section.resultLabel ?? 'Result'}</span><strong>{section.result}</strong></p>}
      {section.resultNote && <p>{section.resultNote}</p>}
      {section.selection && <p>Use {section.selection.key} to select {section.selection.caption}{section.selection.alternateCaption && ` or ${section.selection.alternateCaption}`}.</p>}
      {section.cycle && <div className="guide-cycle"><p>Press {section.cycle.key} to cycle through the related results.</p><dl>{section.cycle.results.map(result => <div key={result.id}><dt>{result.name}</dt><dd>{result.value}</dd></div>)}</dl>{section.cycle.jobNote && <p>{section.cycle.jobNote}</p>}</div>}
    </section>)}
  </section>;
}
