export type Proof = 'adaptive' | 'visual' | 'help';
export interface Frame {
  image: string;
  caption: string;
  step: number;
  duration: number;
  cue?: { x: number; y: number };
}
export const modes = [
  { id: 'right', label: 'Right Triangle', field: 'Run' },
  { id: 'oblique', label: 'Oblique Triangle', field: 'a' },
  { id: 'circle', label: 'Circle', field: 'Diameter' },
  { id: 'cylinder', label: 'Cylinder', field: 'Diameter' },
  { id: 'cone', label: 'Cone', field: 'Diameter' },
  { id: 'ratios', label: 'Ratios', field: 'A' },
  { id: 'offset', label: 'Offset', field: 'Length' },
  { id: 'roof', label: 'Roof', field: 'Run' },
  { id: 'stairs', label: 'Stairs', field: 'Rise' },
] as const;
export const proofs = {
  adaptive: {
    label: 'Adaptive calculations',
    steps: ['Select mode', 'Enter measurement', 'Assign'],
  },
  visual: {
    label: 'Visual results',
    title: 'See what each result measures.',
    description: 'Cycle related results from one setup. The diagram highlights the edge or angle behind the number.',
    steps: ['One setup', 'Related results', 'Matching highlight'],
    transcript: ['Enter a 3 ft run and 4 ft rise in Right Triangle mode.', 'Tap equals to find the 5 ft diagonal. Keep tapping equals to cycle Run, Rise, Angle, Other angle, and Pitch per 12 in that order.', 'The diagram and readout follow the selected result. The same input dimensions stay in place.'],
  },
  help: {
    label: 'Built-in Help',
    title: 'Help without losing your place.',
    description: 'Bring up worked examples, explanations, and practical uses alongside your calculation. Return to your guide where you left off.',
    steps: ['Find guidance', 'Try it', 'Resume reading'],
    transcript: ['Open More, then Help, and find “Find rise and run from a slant.” The guide explains how sine and cosine relate a slant to its vertical and horizontal measurements.', 'Close Help to apply the example: a 10 ft slant at 30°. Your calculation is still there.', 'Open Help again to return to the same article and reading position in this calculator session.'],
  },
} as const;

export const visualFrames: Frame[] = [
  { image: 'results-0', caption: 'Diagonal · 5 ft. The sloping edge is highlighted.', step: 2, duration: 2400 },
  { image: 'results-1', caption: 'Run · 3 ft. The horizontal edge is highlighted.', step: 2, duration: 1900 },
  { image: 'results-2', caption: 'Rise · 4 ft. The vertical edge is highlighted.', step: 2, duration: 1900 },
  { image: 'results-3', caption: 'Angle · 53.1301°. The angle at the base is highlighted.', step: 2, duration: 2400 },
  { image: 'results-4', caption: 'Other angle · 36.8699°. The opposite angle is highlighted.', step: 2, duration: 2400 },
  { image: 'results-5', caption: 'Pitch per 12 · 16 in. The same triangle, expressed as pitch.', step: 2, duration: 2400 },
];
export const helpFrames: Frame[] = [
  { image: 'help-calculation-before', caption: 'A 10 ft slant is entered. Help opens over the calculation.', step: 0, duration: 1800 },
  { image: 'help-guide', caption: 'Find rise and run from a slant: an explanation, not just a key sequence.', step: 0, duration: 3200 },
  { image: 'help-reading', caption: 'Read the worked example and where you can use it.', step: 0, duration: 3200 },
  { image: 'help-closed', caption: 'Close Help. The pending calculation stays in place.', step: 1, duration: 1600 },
  { image: 'help-applied', caption: 'Use the 30° angle to find the 5 ft rise of the same slant.', step: 1, duration: 2600 },
  { image: 'help-resumed', caption: 'Reopen Help at the same article and reading position.', step: 2, duration: 3600 },
];
