import { useCallback, useState } from 'react';
import { StepBack, StepForward } from 'lucide-react';
import { ModePicker } from './ModePicker';
import { DemoPlaybackControl } from './DemoPlaybackControl';
import { DemoPhone } from './DemoPhone';
import { Button } from './components/ui/button';
import { framesForMode, modes } from './demo-content';
import { advance, initialState, nextResult, previousResult, selectMode } from './demo-state';
import { useDemoPlayback } from './useDemoPlayback';
import { useDemoEnvironment } from './useDemoEnvironment';

export function ProductDemo() {
  const environment = useDemoEnvironment();
  const [selection, setState] = useState<ReturnType<typeof initialState> | null>(null);
  const state = selection ?? initialState(environment.reducedMotion);
  const [announcement, setAnnouncement] = useState('');
  const [phoneHovered, setPhoneHovered] = useState(false);
  const onAdvance = useCallback(() => { setState(current => advance(current ?? initialState(false))); return true; }, []);
  const frames = framesForMode(state.mode);
  const frame = frames[state.frame];
  const mode = modes[state.mode];
  const { ref: demoRef, hydrated, reducedMotion, playing, active, onFocusCapture, start, pause, togglePlayback, media } = useDemoPlayback(frames, state.frame, onAdvance, environment, phoneHovered);
  const cue = frame.cue ?? frames[state.frame - 1]?.cue;

  function changeMode(index: number) {
    const next = selectMode(state, index, reducedMotion);
    setState(next);
    start();
    setAnnouncement(`${modes[next.mode].label}. ${framesForMode(next.mode)[next.frame].caption}`);
  }
  function showResult(direction: 'previous' | 'next') {
    const next = direction === 'previous' ? previousResult(state) : nextResult(state);
    setState(next);
    pause();
    setAnnouncement(frames[next.frame].caption);
  }

  return (
    <div ref={demoRef} onFocusCapture={onFocusCapture} data-demo-kind="calculation" data-demo-frame={frame.image} data-demo-playing={active}>
      <div className="calculation-layout">
        <ModePicker disabled={!hydrated} selected={state.mode} onSelect={changeMode} />
        <div className="proof-copy" id="adaptive-mode-content">
          <h3>{mode.label}</h3>
          <ol className="mode-instructions" aria-label="How to use this mode">
            {mode.steps.map((step, index) => <li key={step} data-current={frame.step === index} aria-current={frame.step === index ? 'step' : undefined}>{step}</li>)}
          </ol>
        </div>
        <div className="demo-phone-panel">
          <DemoPhone onHoverChange={setPhoneHovered} frame={frame} cue={cue} resetKey={mode.id} active={active} reducedMotion={reducedMotion} media={media} />
          {hydrated && <fieldset className="demo-controls">
            <legend className="sr-only">{mode.label} demo controls</legend>
            <Button variant="control" size="control-icon" aria-label={`Previous result in ${mode.label}`} title="Previous result" onClick={() => showResult('previous')}><StepBack aria-hidden="true" /></Button>
            <DemoPlaybackControl label={mode.label} playing={playing} onToggle={togglePlayback} disabled={reducedMotion || media.failed} describedBy={reducedMotion || media.failed ? 'calculation-playback-note' : undefined} />
            <Button variant="control" size="control-icon" aria-label={`Next result in ${mode.label}`} title="Next result" onClick={() => showResult('next')}><StepForward aria-hidden="true" /></Button>
            {(reducedMotion || media.failed) && <p id="calculation-playback-note" className="sr-only">{reducedMotion ? 'Animation is off because you prefer reduced motion. Previous and next show still results.' : 'Animation is unavailable because an app image could not load.'}</p>}
          </fieldset>}
        </div>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
    </div>
  );
}
