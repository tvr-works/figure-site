import { describe, expect, it } from 'vitest';
import { advance, adaptiveFrames, framesFor, initialState, nextMode, previousMode, retreat, selectProof } from './demo-state';
import { modes } from './demo-content';

describe('guided demonstration boundaries', () => {
  it('provides a meaningful still and no autoplay for reduced motion', () => {
    const state = initialState(true);
    expect(state.playing).toBe(false);
    expect(framesFor(state)[state.frame].image).toBe('right-assigned');
  });
  it('loops every mode without changing the selected proof', () => {
    let state = { ...initialState(false), mode: 8, frame: adaptiveFrames(8).length - 1 };
    state = advance(state);
    expect(state).toMatchObject({ proof: 'adaptive', mode: 0, frame: 0, playing: true });
  });
  it('manual mode selection preserves pause and shows the assigned still', () => {
    const state = nextMode(initialState(true));
    expect(state.playing).toBe(false);
    expect(framesFor(state)[state.frame].image).toBe('oblique-assigned');
  });
  it('stops the prior proof and shows the Help resume state on selection', () => {
    const state = selectProof(initialState(false), 'help');
    expect(state.playing).toBe(false);
    expect(framesFor(state)[state.frame].image).toBe('help-resumed');
  });
  it.each(['visual', 'help'] as const)('holds the end of %s without jumping to another tab', proof => {
    let state = { ...selectProof(initialState(false), proof), playing: true };
    for (let i = 0; i < 20; i++) state = advance(state);
    expect(state.proof).toBe(proof);
    expect(state.frame).toBe(framesFor(state).length - 1);
    expect(state.playing).toBe(false);
  });
  it('shows Cone through the real second-function key path', () => {
    const cone = adaptiveFrames(modes.findIndex(mode => mode.id === 'cone'));
    expect(cone.slice(0, 3).map(frame => frame.image)).toEqual(['cone-launcher', 'cone-choose', 'cone-selected']);
  });
});

describe('backward demonstration navigation', () => {
  it('steps back from an assignment and pauses the automatic loop', () => {
    const state = retreat(initialState(false));
    expect(framesFor(state)[state.frame].image).toBe('right-unit');
    expect(state.playing).toBe(false);
  });
  it('crosses an adaptive mode boundary using its actual frame count', () => {
    const state = retreat({ proof: 'adaptive', mode: 5, frame: 0, playing: false });
    expect(framesFor(state)[state.frame].image).toBe('cone-assigned');
  });
  it('wraps to the last mode without starting paused playback', () => {
    const state = previousMode(initialState(true));
    expect(framesFor(state)[state.frame].image).toBe('stairs-assigned');
    expect(state.playing).toBe(false);
  });
  it.each(['visual', 'help'] as const)('holds at the first %s frame when stepping back', proof => {
    const state = retreat({ ...initialState(false), proof, frame: 0 });
    expect(state).toMatchObject({ proof, frame: 0, playing: false });
  });
});
