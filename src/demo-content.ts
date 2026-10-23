import captures from './worked-examples.json';
import helpCaptures from './help-captures.json';

export interface Frame {
  image: string;
  caption: string;
  step: number;
  duration: number;
  pauseBefore?: number;
  cue?: { x: number; y: number; to?: { x: number; y: number } };
  result?: boolean;
}
export const modes = [
  { id: 'right', label: 'Right Triangle', summary: 'Run, rise & pitch', steps: ['Select Right Triangle.', 'Set the run to 3 ft.', 'Set the rise to 4 ft.', 'Find the 5 ft diagonal.', 'Convert to inches or meters.', 'Cycle through the sides and angles.'] },
  { id: 'oblique', label: 'Oblique Triangle', summary: 'Sides & angles', steps: ['Select Oblique Triangle.', 'Set side a to 5 ft.', 'Set side b to 6 ft.', 'Set side c to 7 ft.', 'Find the three angles.', 'Cycle to the triangle’s area.'] },
  { id: 'circle', label: 'Circle', summary: 'Arcs, chords & segments', steps: ['Select Circle.', 'Set the diameter to 5 ft.', 'Set the arc to 85°.', 'Find the arc length.', 'Cycle to the chord length.', 'Cycle to the segment rise.'] },
  { id: 'cylinder', label: 'Cylinder', summary: 'Volume & surface area', steps: ['Select Cylinder.', 'Set the diameter to 4 ft.', 'Set the height to 6 ft.', 'Find the volume.', 'Cycle to the surface area.'] },
  { id: 'cone', label: 'Cone', summary: 'Volume & lateral area', steps: ['Tap 2nd, then Cone.', 'Set the diameter to 6 ft.', 'Set the height to 4 ft.', 'Find the volume.', 'Cycle to the lateral area.'] },
  { id: 'ratios', label: 'Ratios', summary: 'Proportions & scaling', steps: ['Select Ratios.', 'Set the scale to 1 in : 4 ft.', 'Enter a 3 in drawing measurement.', 'Read the 12 ft result.', 'Change the drawing measurement to 6 in.', 'Read the updated 24 ft result.'] },
  { id: 'offset', label: 'Offset', summary: 'Duct offsets & wrappers', steps: ['Select Offset.', 'Set the length to 10 ft.', 'Set the offset to 5 ft.', 'Set the height to 7 ft.', 'Find the centerline radius.', 'Compare wrapper length, heel radius, and throat radius.'] },
  { id: 'roof', label: 'Roof', summary: 'Common, hip & jack rafters', steps: ['Select Roof.', 'Set the spacing to 16 in.', 'Set the run to 6 ft.', 'Set a 9-in-12 pitch.', 'Compare common and hip/valley rafters.', 'Cycle to the jack rafter results.'] },
  { id: 'stairs', label: 'Stairs', summary: 'Risers, treads & layout', steps: ['Select Stairs.', 'Set a 7½ in target riser.', 'Set a 10 in target tread.', 'Set the total rise to 9 ft 11 in.', 'Compare riser height and stair counts.', 'Find the 12 ft 6 in required run.'] },
] as const;

export function framesForMode(mode: number): readonly Frame[] {
  return captures[modes[mode].id];
}

export const helpSteps = [
  'Open Help without leaving your calculation.',
  'Close Help and try the steps. Your calculation stays in place.',
  'Reopen the same guide at your saved reading position.',
] as const;

export const helpFrames: readonly Frame[] = helpCaptures;
