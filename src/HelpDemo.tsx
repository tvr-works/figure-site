import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { DemoPhone } from './DemoPhone';
import { Button } from './components/ui/button';
import { helpFrames, helpSteps } from './demo-content';
import { prefersReducedMotion, useDemoPlayback } from './useDemoPlayback';

export function HelpDemo() {
  const [index, setIndex] = useState(() => prefersReducedMotion() ? helpFrames.length - 1 : 0);
  const [announcement, setAnnouncement] = useState('');
  const onAdvance = useCallback(() => {
    if (index === helpFrames.length - 1) return false;
    setIndex(current => current + 1);
    return true;
  }, [index]);
  const playback = useDemoPlayback(helpFrames, index, onAdvance);
  const frame = helpFrames[index];
  useEffect(() => {
    // The enhanced calculation above is taller than its static fallback on mobile.
    if (window.location.hash === '#help') document.getElementById('help')?.scrollIntoView();
  }, []);
  function showStep(next: number) {
    setIndex(next);
    playback.pause();
    setAnnouncement(helpFrames[next].caption);
  }
  function replay() {
    setIndex(0);
    playback.start();
    setAnnouncement('Help demo restarted.');
  }
  function togglePlayback() {
    if (!playback.playing && index === helpFrames.length - 1) setIndex(0);
    playback.toggle();
  }
  return (
    <div ref={playback.ref} onFocusCapture={playback.onFocusCapture} data-demo-kind="help" data-demo-frame={frame.image} data-demo-playing={playback.active}>
      <div className="help-layout">
        <div className="proof-copy">
          <p className="section-label">Built-in Help</p>
          <h2 id="help-title">Help without losing your place.</h2>
          <p className="proof-description">Worked examples, plain-language explanations, and practical uses, right alongside your calculation.</p>
          <ol className="mode-instructions help-instructions" aria-label="Help demo steps">
            {helpSteps.map((step, stepIndex) => <li key={step} data-current={frame.step === stepIndex} aria-current={frame.step === stepIndex ? 'step' : undefined}>{step}</li>)}
          </ol>
          <div className="demo-controls" role="group" aria-label="Help playback">
            {!playback.reducedMotion && <Button variant="control" onClick={togglePlayback} aria-label={playback.playing ? 'Pause Help demo' : 'Play Help demo'}>{playback.playing ? <Pause data-icon="inline-start" /> : <Play data-icon="inline-start" />}{playback.playing ? 'Pause' : 'Play'}</Button>}
            <Button variant="control" aria-label="Previous Help step" onClick={() => showStep(index - 1)} disabled={index === 0}><ArrowLeft data-icon="inline-start" />Back</Button>
            <Button variant="control" aria-label="Next Help step" onClick={() => showStep(index + 1)} disabled={index === helpFrames.length - 1}><StepForward data-icon="inline-start" />Next step</Button>
            <Button variant="control" onClick={replay}><RotateCcw data-icon="inline-start" />Replay</Button>
          </div>
        </div>
        <DemoPhone frame={frame} resetKey="help" active={playback.active} reducedMotion={playback.reducedMotion} media={playback.media} />
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
    </div>
  );
}
