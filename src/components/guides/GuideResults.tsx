import type { GuideRecipe } from '../../content/catalog';
import { Kbd } from '../ui/kbd';

type Section = GuideRecipe['sections'][number];

export function GuideResults({ section, usesExample }: { section: Section; usesExample: boolean }) {
  const cycle = section.cycle;
  if (!section.result && !cycle) return null;
  // A numeric cycle may explicitly name the first output when it returns to it.
  // Follow the app's named stages for job-summary cycles.
  const last = cycle && !cycle.jobNames ? cycle.results[cycle.results.length - 1] : undefined;
  const firstName = section.resultLabel ?? (last && last.value === section.result && /\bagain$|^Back to /i.test(last.name)
    ? last.name.replace(/^Back to /i, '').replace(/ again$/i, '')
    : usesExample ? 'Example result' : 'Result');
  const following = cycle?.jobNames
    ? cycle.jobNames.map((name, index) => ({ id: `stage-${index}`, name, value: undefined }))
    : cycle?.results ?? [];
  const rows = [...(section.result ? [{ id: 'first', name: firstName, value: section.result }] : []), ...following];
  return <div className="guide-results" data-not-typeset data-sequence={Boolean(cycle)}>
    {cycle && <p className="guide-results-header"><strong>Results in order</strong><span>Press <Kbd>{cycle.key}</Kbd> to continue</span></p>}
    <ol aria-label={cycle ? 'Results in calculation order' : 'Calculation result'}>{rows.map(row => <li key={row.id}>
      <div className="guide-result-line"><span>{row.name}</span>{row.value && <strong>{row.value}</strong>}</div>
    </li>)}</ol>
    {cycle?.jobNote && <p className="guide-results-note">{cycle.jobNote}</p>}
  </div>;
}
