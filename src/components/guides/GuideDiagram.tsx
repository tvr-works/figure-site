import { useId } from 'react';

export function GuideDiagram({ diagram }: { diagram: { id: string; explanation: string } }) {
  const titleId = useId();
  if (diagram.id !== 'braceAngle') throw new Error(`The published guide needs a web diagram for ${diagram.id}.`);
  return <figure className="guide-diagram">
    {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- Inline SVG needs a named image role; an HTML img cannot contain its vector geometry. */}
    <svg viewBox="0 0 500 240" role="img" aria-labelledby={titleId}>
      <title id={titleId}>{diagram.explanation}</title>
      <g className="guide-diagram-lines"><path d="M80 197H420V43Z" /><path d="M395 197V182H420" /></g>
      <g className="guide-diagram-labels"><text x="250" y="228">8 ft</text><text x="225" y="89">10 ft</text><text x="150" y="180">θ</text></g>
    </svg>
    <figcaption>Schematic, not to scale.</figcaption>
  </figure>;
}
