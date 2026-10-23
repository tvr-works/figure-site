import { useEffect, useRef, useState, type FocusEvent } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { Button } from './components/ui/button';
import { ImageViewer } from './ImageViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { modes, proofs, type Proof } from './demo-content';
import { advance, framesFor, initialState, nextMode, previousMode, retreat, selectProof } from './demo-state';

export function ProductDemo() {
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [state, setState] = useState(() => initialState(reducedMotion));
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [loadedImage, setLoadedImage] = useState('');
  const [failedImage, setFailedImage] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const stageRef = useRef<HTMLDivElement>(null);
  const frame = framesFor(state)[state.frame];
  const imageUrl = `/assets/demo/${frame.image}.webp`;
  const proof = proofs[state.proof];
  const mode = modes[state.mode];
  const activePlayback = state.playing && inView && pageVisible && !reducedMotion && loadedImage === imageUrl && failedImage !== imageUrl;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) setState(current => ({ ...current, playing: false }));
    };
    preference.addEventListener('change', update);
    const updateVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    if (stageRef.current) observer.observe(stageRef.current);
    return () => {
      preference.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', updateVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!activePlayback) return;
    const timer = window.setTimeout(() => setState(current => advance(current)), frame.duration);
    return () => window.clearTimeout(timer);
  }, [activePlayback, frame.image, frame.duration]);

  function pauseOnFocus(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget) && event.target instanceof HTMLElement && event.target.matches(':focus-visible')) setState(current => ({ ...current, playing: false }));
  }
  function stepForward() {
    const next = advance({ ...state, playing: false });
    setState(next);
    setAnnouncement(framesFor(next)[next.frame].caption);
  }
  function stepBackward() {
    const next = retreat(state);
    setState(next);
    setAnnouncement(framesFor(next)[next.frame].caption);
  }
  function changeMode(direction: 'previous' | 'next') {
    const next = direction === 'previous' ? previousMode(state) : nextMode(state);
    setState(next);
    setAnnouncement(`${modes[next.mode].label}. ${framesFor(next)[next.frame].caption}`);
  }
  function changeProof(value: string | number | null) {
    if (value !== 'adaptive' && value !== 'visual' && value !== 'help') return;
    setState(current => selectProof(current, value));
    setAnnouncement('');
  }
  function togglePlayback() {
    if (state.playing) setState(current => ({ ...current, playing: false }));
    else setState(current => ({ ...current, frame: current.frame === framesFor(current).length - 1 ? 0 : current.frame, playing: true }));
  }

  return (
    <div ref={stageRef} onFocusCapture={pauseOnFocus} data-demo-proof={state.proof} data-demo-frame={frame.image} data-demo-playing={activePlayback}>
      <Tabs value={state.proof} onValueChange={changeProof}>
        <TabsList variant="proof" activateOnFocus={false} aria-label="Explore Figure">
          {(Object.keys(proofs) as Proof[]).map(key => <TabsTrigger key={key} value={key}>{proofs[key].label}</TabsTrigger>)}
        </TabsList>
        <div className="proof-stage">
          <div className="proof-panels">
            {(Object.keys(proofs) as Proof[]).map(key => (
              <TabsContent key={key} value={key}>
                {state.proof === key && (
                <div className="proof-copy">
                  <h2>{state.proof === 'adaptive' ? mode.label : proofs[state.proof].title}</h2>
                  <p className="proof-description">{proof.description}</p>
                  <ol className="timeline" aria-label="Demo sequence">
                    {proof.steps.map((step, index) => (
                      <li key={step} data-current={frame.step === index} aria-current={frame.step === index ? 'step' : undefined}>
                        <span className="step-number" aria-hidden="true">0{index + 1}</span><strong>{step}</strong>
                        {state.proof === 'adaptive' && <small>{index === 0 ? mode.label : index === 1 ? '12 in' : mode.field}</small>}
                        {state.proof === 'visual' && <small>{['3 ft run · 4 ft rise', 'Tap equals to cycle', 'Edge or angle'][index]}</small>}
                      </li>
                    ))}
                  </ol>
                  {state.proof !== 'adaptive' && <p className="example-label">{state.proof === 'visual' ? <><strong>Right Triangle</strong> · Result {state.frame + 1} of 6</> : <><strong>Built-in guidance</strong> · Step {state.frame + 1} of {framesFor(state).length}</>}</p>}
                  <div className="demo-controls" aria-label="Demo playback">
                    {!reducedMotion && <Button variant="control" onClick={togglePlayback} aria-label={state.playing ? 'Pause demo' : 'Play demo'}>{state.playing ? <Pause data-icon="inline-start" /> : <Play data-icon="inline-start" />}{state.playing ? 'Pause' : 'Play'}</Button>}
                    <div className="demo-control-pair" role="group" aria-label="Step navigation">
                      <Button variant="control" aria-label={state.proof === 'visual' ? 'Previous result' : 'Previous step'} onClick={stepBackward} disabled={state.proof !== 'adaptive' && state.frame === 0}><ArrowLeft data-icon="inline-start" />Back</Button>
                      <Button variant="control" onClick={stepForward} disabled={state.proof !== 'adaptive' && state.frame === framesFor(state).length - 1}><StepForward data-icon="inline-start" />{state.proof === 'visual' ? 'Next result' : 'Next step'}</Button>
                    </div>
                    {state.proof === 'adaptive' ? <div className="demo-control-pair" role="group" aria-label="Mode navigation">
                      <Button variant="control" onClick={() => changeMode('previous')}><ArrowLeft data-icon="inline-start" />Previous mode</Button>
                      <Button variant="control" onClick={() => changeMode('next')}>Next mode<ArrowRight data-icon="inline-end" /></Button>
                    </div> : <Button variant="control" onClick={() => { setState(current => ({ ...current, frame: 0, playing: !reducedMotion })); setAnnouncement('Demo restarted.'); }}><RotateCcw data-icon="inline-start" />Replay</Button>}
                  </div>
                  <p className="demo-caption">{frame.caption}</p>
                  <details className="transcript" onToggle={event => { if (event.currentTarget.open) setState(current => ({ ...current, playing: false })); }}>
                    <summary>Read demo steps</summary><ol>{proof.transcript.map(text => <li key={text}>{text}</li>)}</ol>
                  </details>
                </div>
                )}
              </TabsContent>
            ))}
          </div>
                <figure className="demo-phone-figure" aria-label={`${proof.label}: ${frame.caption}`}>
                  <div className="demo-phone">
                    <div className="phone-aperture"><div className="native-screen">
                      <img src={imageUrl} width="720" height="1564" alt="" onLoad={() => setLoadedImage(imageUrl)} onError={() => { setFailedImage(imageUrl); setState(current => ({ ...current, playing: false })); }} />
                      {frame.cue && failedImage !== imageUrl && <span className="press-cue" aria-hidden="true" style={{ left: `${frame.cue.x / 440 * 100}%`, top: `${frame.cue.y / 956 * 100}%` }} />}
                      {failedImage === imageUrl && <p className="media-error">App image could not load. The demo steps describe the calculation.</p>}
                    </div></div>
                    <img className="phone-frame" src="/assets/phone-frame.webp" width="862" height="1825" alt="" aria-hidden="true" />
                  </div>
                  <ImageViewer imageUrl={imageUrl} title={state.proof === 'adaptive' ? mode.label : proof.label} caption={frame.caption} onOpen={() => setState(current => ({ ...current, playing: false }))} />
                </figure>
        </div>
      </Tabs>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
    </div>
  );
}
