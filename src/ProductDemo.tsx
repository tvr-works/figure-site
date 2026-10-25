import { useCallback, useState } from 'react';
import { StepForward } from 'lucide-react';
import { ModePicker } from './ModePicker';
import { DemoPlaybackControl } from './DemoPlaybackControl';
import { DemoPhone } from './DemoPhone';
import { Button } from './components/ui/button';
import { framesForMode, modes } from './demo-content';
import { advance, initialState, nextResult, selectMode } from './demo-state';
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
  function showNextResult() {
    const next = nextResult(state);
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
          <div className="demo-controls">
            {hydrated && !reducedMotion && !media.failed && <DemoPlaybackControl label="calculation" playing={playing} onToggle={togglePlayback} />}
            {hydrated && !playing && <Button variant="control" onClick={showNextResult}><StepForward data-icon="inline-start" />Next result</Button>}
          </div>
        </div>
        <DemoPhone onHoverChange={setPhoneHovered} frame={frame} cue={cue} resetKey={mode.id} active={active} reducedMotion={reducedMotion} media={media} />
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
    </div>
  );
}
