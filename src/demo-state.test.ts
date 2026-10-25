import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { framesForMode, modes } from './demo-content';
import { advance, firstResult, initialState, nextResult, previousResult, selectMode } from './demo-state';

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

describe('selected-mode playback boundaries', () => {
  it('starts animation at mode selection and reduced motion at a completed result', () => {
    expect(initialState(false)).toEqual({ mode: 0, frame: 0 });
    const still = initialState(true);
    expect(framesForMode(still.mode)[still.frame].result).toBe(true);
  });
  it.each(modes)('$label plays every frame then repeats without changing modes', mode => {
    const index = modes.indexOf(mode);
    let state = { mode: index, frame: 0 };
    for (let i = 1; i < framesForMode(index).length; i++) {
      state = advance(state);
      expect(state).toEqual({ mode: index, frame: i });
    }
    expect(advance(state)).toEqual({ mode: index, frame: 0 });
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
  it.each(modes)('$label navigates completed results in both directions and wraps within the mode', mode => {
    const index = modes.indexOf(mode);
    const results = framesForMode(index).flatMap((frame, i) => frame.result ? [i] : []);
    let state = { mode: index, frame: results[0] };
    for (const result of results) {
      expect(state).toEqual({ mode: index, frame: result });
      state = nextResult(state);
    }
    expect(state).toEqual({ mode: index, frame: results[0] });
    for (const result of [...results].reverse()) {
      state = previousResult(state);
      expect(state).toEqual({ mode: index, frame: result });
    }
    expect(nextResult({ mode: index, frame: 0 }).frame).toBe(results[0]);
    expect(previousResult({ mode: index, frame: 0 }).frame).toBe(results.at(-1));
  });
});
