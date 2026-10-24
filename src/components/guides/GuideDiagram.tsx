import { useId } from 'react';
import { guideDiagrams, hasGuideDiagram } from '../../content/diagrams';

export function GuideDiagram({ diagram }: { diagram: { id: string; explanation: string } }) {
  const titleId = useId();
  if (!hasGuideDiagram(diagram.id)) throw new Error(`The published guide needs a web diagram for ${diagram.id}.`);
  const drawing = guideDiagrams[diagram.id];
  return <figure className="guide-diagram" data-not-typeset>
    {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- Inline SVG needs a named image role; an HTML img cannot contain its vector geometry. */}
    <svg viewBox="0 0 500 240" role="img" aria-labelledby={titleId}>
      <title id={titleId}>{diagram.explanation}</title>
      <g className="guide-diagram-lines">{drawing.paths.map((path, index) => <path key={index} d={path.d} strokeDasharray={path.dashed ? '5 5' : undefined} />)}{drawing.circles?.map((circle, index) => <circle key={index} {...circle} />)}</g>
      <g className="guide-diagram-labels">{drawing.labels.map((label, index) => <text key={index} x={label.x} y={label.y} dominantBaseline="central">{label.text}</text>)}</g>
    </svg>
    <figcaption>Schematic, not to scale.</figcaption>
  </figure>;
}
