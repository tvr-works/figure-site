import { useCallback, useEffect, useState } from 'react';
import { DemoPhone } from './DemoPhone';
import { helpFrames, helpSteps } from './demo-content';
import { prefersReducedMotion, useDemoPlayback } from './useDemoPlayback';

export function HelpDemo() {
  const [index, setIndex] = useState(() => prefersReducedMotion() ? helpFrames.length - 1 : 0);
  const [phoneHovered, setPhoneHovered] = useState(false);
  const onAdvance = useCallback(() => {
    setIndex(current => (current + 1) % helpFrames.length);
    return true;
  }, []);
  const playback = useDemoPlayback(helpFrames, index, onAdvance, phoneHovered);
  const frame = helpFrames[index];
  const previousCue = helpFrames[index - 1]?.cue;
  const cue = frame.cue ?? previousCue;
  useEffect(() => {
    // The enhanced calculation above is taller than its static fallback on mobile.
    if (window.location.hash === '#help') document.getElementById('help')?.scrollIntoView();
  }, []);
  return (
    <div ref={playback.ref} onFocusCapture={playback.onFocusCapture} data-demo-kind="help" data-demo-frame={frame.image} data-demo-playing={playback.active}>
      <div className="help-layout">
        <div className="proof-copy">
          <h3>Find rise and run from a slant.</h3>
          <ol className="mode-instructions" aria-label="Help demo steps">
            {helpSteps.map((step, stepIndex) => <li key={step} data-current={frame.step === stepIndex} aria-current={frame.step === stepIndex ? 'step' : undefined}>{step}</li>)}
          </ol>
        </div>
        <DemoPhone onHoverChange={setPhoneHovered} cue={cue} previousCue={previousCue} frame={frame} resetKey="help" active={playback.active} reducedMotion={playback.reducedMotion} media={playback.media} />
      </div>
    </div>
  );
}
