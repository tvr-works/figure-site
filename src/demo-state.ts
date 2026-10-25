import { framesForMode, modes } from './demo-content';

export interface DemoState { mode: number; frame: number }
export function initialState(reducedMotion: boolean): DemoState {
  return { mode: 0, frame: reducedMotion ? firstResult(0) : 0 };
}
export function firstResult(mode: number): number {
  return framesForMode(mode).findIndex(frame => frame.result);
}
export function advance(state: DemoState): DemoState {
  if (state.frame < framesForMode(state.mode).length - 1) return { ...state, frame: state.frame + 1 };
  return { ...state, frame: 0 };
}
export function selectMode(state: DemoState, mode: number, reducedMotion = false): DemoState {
  if (!modes[mode]) return state;
  return { mode, frame: reducedMotion ? firstResult(mode) : 0 };
}
export function nextResult(state: DemoState): DemoState {
  const frames = framesForMode(state.mode);
  const next = frames.findIndex((frame, index) => index > state.frame && frame.result);
  return { ...state, frame: next < 0 ? firstResult(state.mode) : next };
}

export function previousResult(state: DemoState): DemoState {
  const results = framesForMode(state.mode).flatMap((frame, index) => frame.result ? [index] : []).reverse();
  const previous = results.find(index => index < state.frame);
  return { ...state, frame: previous ?? results[0] };
}
