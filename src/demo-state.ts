import { helpFrames, modes, visualFrames, type Frame, type Proof } from './demo-content';
import captures from './capture-manifest.json';

export interface DemoState { proof: Proof; mode: number; frame: number; playing: boolean }
const captureByName = new Map(captures.map(capture => [capture.name, capture]));
export function adaptiveFrames(modeIndex: number): Frame[] {
  const mode = modes[modeIndex];
  const names = ['launcher', ...(mode.id === 'cone' ? ['choose'] : []), 'selected', 'one', 'number', 'unit', 'assigned'];
  return names.map((name, index) => {
    const nextCapture = captureByName.get(`${mode.id}-${names[index + 1]}`);
    // The cue belongs on the screen before the corresponding native action.
    const action = name === 'launcher' && mode.id === 'cone'
      ? { x: 61, y: 618 }
      : name === 'assigned' ? captureByName.get(`${mode.id}-assigned`)?.action : nextCapture?.action;
    const step = name === 'launcher' || name === 'choose' ? 0 : name === 'unit' || name === 'assigned' ? 2 : 1;
    const captions: Record<string, string> = {
      launcher: mode.id === 'cone' ? 'Tap 2nd to reveal Cone on the Cylinder key.' : `Choose ${mode.label} from the calculation modes.`,
      choose: 'Tap Cone. Its inputs replace the mode keys.',
      selected: `${mode.label} is open. Enter a measurement with the same numeric keys.`,
      one: 'Enter 1, then 2.',
      number: 'The entry is 12. Tap Inch to give it a unit.',
      unit: `12 in is ready. Tap ${mode.field} to assign it.`,
      assigned: `${mode.field} is now 12 in. The readout and diagram reflect the measurement.`,
    };
    return { image: `${mode.id}-${name}`, caption: captions[name], step, duration: name === 'assigned' ? 2300 : name === 'one' ? 600 : 1300, cue: action ? { x: action.x, y: action.y } : undefined };
  });
}
export function framesFor(state: DemoState): Frame[] {
  return state.proof === 'adaptive' ? adaptiveFrames(state.mode) : state.proof === 'visual' ? visualFrames : helpFrames;
}
export function initialState(reducedMotion: boolean): DemoState {
  return { proof: 'adaptive', mode: 0, frame: adaptiveFrames(0).length - 1, playing: !reducedMotion };
}
export function selectProof(state: DemoState, proof: Proof): DemoState {
  const next = { ...state, proof, playing: false };
  return { ...next, frame: proof === 'adaptive' ? adaptiveFrames(state.mode).length - 1 : proof === 'help' ? helpFrames.length - 1 : 0 };
}
export function advance(state: DemoState): DemoState {
  if (state.frame < framesFor(state).length - 1) return { ...state, frame: state.frame + 1 };
  if (state.proof === 'adaptive') return { ...state, mode: (state.mode + 1) % modes.length, frame: 0 };
  // Non-repeating proofs hold their ending and never change the selected tab.
  return { ...state, playing: false };
}
export function nextMode(state: DemoState): DemoState {
  return { ...state, mode: (state.mode + 1) % modes.length, frame: state.playing ? 0 : adaptiveFrames((state.mode + 1) % modes.length).length - 1 };
}

export function retreat(state: DemoState): DemoState {
  if (state.frame > 0) return { ...state, frame: state.frame - 1, playing: false };
  if (state.proof === 'adaptive') {
    const mode = (state.mode + modes.length - 1) % modes.length;
    return { ...state, mode, frame: adaptiveFrames(mode).length - 1, playing: false };
  }
  return { ...state, playing: false };
}
export function previousMode(state: DemoState): DemoState {
  const mode = (state.mode + modes.length - 1) % modes.length;
  return { ...state, mode, frame: state.playing ? 0 : adaptiveFrames(mode).length - 1 };
}

export function selectAdaptiveStep(state: DemoState, step: 0 | 1 | 2): DemoState {
  return { ...state, frame: adaptiveFrames(state.mode).findIndex(frame => frame.step === step), playing: false };
}
