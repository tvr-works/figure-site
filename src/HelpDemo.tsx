import { useCallback, useEffect, useState } from 'react';
import { DemoPlaybackControl } from './DemoPlaybackControl';
import { DemoPhone } from './DemoPhone';
import { helpFrames, helpSteps } from './demo-content';
import { useDemoPlayback } from './useDemoPlayback';
import { useDemoEnvironment } from './useDemoEnvironment';

export function HelpDemo() {
  const environment = useDemoEnvironment();
  const [position, setIndex] = useState<number | null>(null);
  const index = position ?? (environment.reducedMotion ? helpFrames.length - 1 : 0);
  const [phoneHovered, setPhoneHovered] = useState(false);
  const onAdvance = useCallback(() => {
    setIndex(current => ((current ?? 0) + 1) % helpFrames.length);
    return true;
  }, []);
  const { ref: demoRef, hydrated, reducedMotion, playing, active, onFocusCapture, togglePlayback, media } = useDemoPlayback(helpFrames, index, onAdvance, environment, phoneHovered);
  const frame = helpFrames[index];
  const previousCue = helpFrames[index - 1]?.cue;
  const cue = frame.cue ?? previousCue;
  useEffect(() => {
    // The enhanced calculation above is taller than its static fallback on mobile.
    if (window.location.hash === '#help') document.getElementById('help')?.scrollIntoView();
  }, []);
  return (
    <div ref={demoRef} onFocusCapture={onFocusCapture} data-demo-kind="help" data-demo-frame={frame.image} data-demo-playing={active}>
      <div className="help-layout">
        <div className="proof-copy">
          <h3>Find rise and run from a slant.</h3>
          <ol className="mode-instructions" aria-label="Help demo steps">
            {helpSteps.map((step, stepIndex) => <li key={step} data-current={frame.step === stepIndex} aria-current={frame.step === stepIndex ? 'step' : undefined}>{step}</li>)}
          </ol>
        </div>
        <div className="demo-phone-panel">
          <DemoPhone onHoverChange={setPhoneHovered} cue={cue} previousCue={previousCue} frame={frame} resetKey="help" active={active} reducedMotion={reducedMotion} media={media} />
          <div className="demo-controls">{hydrated && !reducedMotion && !media.failed && <DemoPlaybackControl label="Help" playing={playing} onToggle={togglePlayback} />}</div>
        </div>
      </div>
    </div>
  );
}
