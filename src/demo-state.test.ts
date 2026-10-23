import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { framesForMode, modes } from './demo-content';
import { advance, firstResult, initialState, nextResult, selectMode } from './demo-state';

describe('complete native examples', () => {
  it.each(modes)('$label has an input path, real results, and available screenshots', mode => {
    const index = modes.findIndex(item => item.id === mode.id);
    const frames = framesForMode(index);
    expect(new Set(frames.map(frame => frame.step))).toEqual(new Set(mode.steps.map((_, step) => step)));
    expect(frames.filter(frame => frame.result).length).toBeGreaterThanOrEqual(2);
    expect(frames[firstResult(index)].result).toBe(true);
    expect(frames.at(-1)?.cue).toBeUndefined();
    expect(frames[0].step).toBe(0);
    expect(frames.at(-1)?.step).toBe(mode.steps.length - 1);
    for (let i = 1; i < frames.length; i++) {
      expect(frames[i].step - frames[i - 1].step).toBeGreaterThanOrEqual(0);
      expect(frames[i].step - frames[i - 1].step).toBeLessThanOrEqual(1);
    }
    for (const frame of frames) {
      expect(existsSync(`public/assets/demo/${frame.image}.webp`)).toBe(true);
      expect(frame.duration).toBeGreaterThanOrEqual(850);
      if (frame.cue) {
        expect(frame.cue.x).toBeGreaterThanOrEqual(0);
        expect(frame.cue.x).toBeLessThanOrEqual(440);
        expect(frame.cue.y).toBeGreaterThanOrEqual(0);
        expect(frame.cue.y).toBeLessThanOrEqual(956);
      }
    }
  });
  it('includes native conversions and highlighted results in the right-triangle example', () => {
    const captions = framesForMode(0).filter(frame => frame.result).map(frame => frame.caption);
    expect(captions).toEqual(expect.arrayContaining([
      'Right Triangle · Diagonal, 5 feet 0 inches',
      'Right Triangle · Diagonal, 60 inches',
      'Right Triangle · Diagonal, 1.524 meters',
      'Right Triangle · Angle, 53.1301 degrees',
    ]));
  });
  it('uses a non-right triangle and carries the stair example through to the required run', () => {
    expect(framesForMode(1).filter(frame => frame.result).map(frame => frame.caption)).not.toContain('Oblique Triangle · Angle C, 90 degrees');
    expect(framesForMode(8).at(-1)?.caption).toBe('Stairs · Run needed, 12 feet 6 inches');
  });
});

describe('mode tour boundaries', () => {
  it('starts animation at mode selection and reduced motion at a completed result', () => {
    expect(initialState(false)).toEqual({ mode: 0, frame: 0 });
    const still = initialState(true);
    expect(framesForMode(still.mode)[still.frame].result).toBe(true);
  });
  it('keeps the selected mode until every captured frame has played', () => {
    let state = { mode: 0, frame: 0 };
    for (let i = 1; i < framesForMode(0).length; i++) {
      state = advance(state);
      expect(state).toEqual({ mode: 0, frame: i });
    }
    expect(advance(state)).toEqual({ mode: 1, frame: 0 });
  });
  it('wraps from the final mode to the first', () => {
    expect(advance({ mode: 8, frame: framesForMode(8).length - 1 })).toEqual({ mode: 0, frame: 0 });
  });
  it.each([false, true])('direct selection respects reduced motion: %s', reducedMotion => {
    const state = selectMode(initialState(false), 4, reducedMotion);
    expect(state).toEqual({ mode: 4, frame: reducedMotion ? firstResult(4) : 0 });
  });
  it('ignores an unavailable mode', () => {
    const state = initialState(true);
    expect(selectMode(state, -1)).toBe(state);
    expect(selectMode(state, modes.length)).toBe(state);
  });
  it('manual result navigation stays in the mode and wraps its results', () => {
    let state = initialState(true);
    const results = framesForMode(0).filter(frame => frame.result);
    for (let i = 0; i < results.length; i++) {
      expect(framesForMode(0)[state.frame]).toEqual(results[i]);
      state = nextResult(state);
      expect(state.mode).toBe(0);
    }
    expect(state.frame).toBe(firstResult(0));
  });
});
