import captures from './worked-examples.json';

export interface Frame {
  image: string;
  caption: string;
  step: number;
  duration: number;
  pauseBefore?: number;
  cue?: { x: number; y: number };
  result?: boolean;
}
export const modes = [
  { id: 'right', label: 'Right Triangle', summary: 'Run, rise & pitch', steps: ['Select Right Triangle.', 'Assign a 3 ft run and a 4 ft rise.', 'Find the 5 ft diagonal; convert it or cycle related results.'] },
  { id: 'oblique', label: 'Oblique Triangle', summary: 'Sides & angles', steps: ['Select Oblique Triangle.', 'Assign 5 ft, 6 ft, and 7 ft to the three sides.', 'Cycle through the three angles and the area.'] },
  { id: 'circle', label: 'Circle', summary: 'Arcs, chords & segments', steps: ['Select Circle.', 'Assign a 5 ft diameter and an 85° arc.', 'Find the arc length, then compare its chord and segment rise.'] },
  { id: 'cylinder', label: 'Cylinder', summary: 'Volume & surface area', steps: ['Select Cylinder.', 'Assign a 4 ft diameter and a 6 ft height.', 'Cycle volume and surface area from the same setup.'] },
  { id: 'cone', label: 'Cone', summary: 'Volume & lateral area', steps: ['Tap 2nd, then Cone.', 'Assign a 6 ft diameter and a 4 ft height.', 'Find the volume, then cycle to lateral area.'] },
  { id: 'ratios', label: 'Ratios', summary: 'Proportions & scaling', steps: ['Select Ratios.', 'Set 1 in : 4 ft, then enter a 3 in drawing measurement.', 'Read 12 ft; change the drawing measurement to 6 in and see 24 ft.'] },
  { id: 'offset', label: 'Offset', summary: 'Duct offsets & wrappers', steps: ['Select Offset.', 'Assign 10 ft length, 5 ft offset, and 7 ft height.', 'Cycle centerline radius, wrapper length, heel radius, and throat radius.'] },
  { id: 'roof', label: 'Roof', summary: 'Common, hip & jack rafters', steps: ['Select Roof.', 'Set 6 ft run, 9-in-12 pitch, and 16 in spacing.', 'Compare the common rafter, hip/valley, and jack results.'] },
  { id: 'stairs', label: 'Stairs', summary: 'Risers, treads & layout', steps: ['Select Stairs.', 'Set 7½ in target risers, 10 in treads, and a 9 ft 11 in rise.', 'Compare actual riser height, counts, and the required run.'] },
] as const;

export function framesForMode(mode: number): readonly Frame[] {
  return captures[modes[mode].id];
}

export const helpSteps = [
  'Open Help without leaving your calculation.',
  'Close Help and try the steps. Your calculation stays in place.',
  'Reopen the same guide at your saved reading position.',
] as const;

export const helpFrames: Frame[] = [
  { image: 'help-calculation-before', caption: 'A 10 ft slant is entered. Help opens over the calculation.', step: 0, duration: 1800 },
  { image: 'help-guide', caption: 'Find rise and run from a slant: an explanation, not just a key sequence.', step: 0, duration: 3200 },
  { image: 'help-reading', caption: 'Read the worked example and where you can use it.', step: 0, duration: 3200 },
  { image: 'help-closed', caption: 'Close Help. The pending calculation stays in place.', step: 1, duration: 1600 },
  { image: 'help-applied', caption: 'Use the 30° angle to find the 5 ft rise of the same slant.', step: 1, duration: 2600 },
  { image: 'help-resumed', caption: 'Reopen Help at the same article and reading position.', step: 2, duration: 3600 },
];
