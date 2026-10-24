import type { CSSProperties } from 'react';
import type { Frame } from './demo-content';

interface DemoPhoneProps {
  frame: Frame;
  cue?: Frame['cue'];
  previousCue?: Frame['cue'];
  resetKey: string;
  active: boolean;
  reducedMotion: boolean;
  onHoverChange?: (hovered: boolean) => void;
  media: { src: string; failed: boolean; onLoad: () => void; onError: () => void };
}

export function DemoPhone({ frame, cue, resetKey, active, reducedMotion, media, onHoverChange, previousCue }: DemoPhoneProps) {
  const travel = {
    '--touch-duration': `${frame.duration}ms`,
    '--travel-from-x': `${previousCue?.to ? (previousCue.to.x - previousCue.x) / 440 * 100 : 0}cqw`,
    '--travel-from-y': `${previousCue?.to ? (previousCue.to.y - previousCue.y) / 440 * 100 : 0}cqw`,
    '--travel-to-x': `${cue?.to ? (cue.to.x - cue.x) / 440 * 100 : 0}cqw`,
    '--travel-to-y': `${cue?.to ? (cue.to.y - cue.y) / 440 * 100 : 0}cqw`,
  } as CSSProperties;
  return (
    <figure className="demo-phone-figure" aria-label={frame.caption} onPointerEnter={event => { if (event.pointerType === 'mouse') onHoverChange?.(true); }} onPointerLeave={() => onHoverChange?.(false)}>
      <div className="demo-phone">
        <div className="phone-aperture"><div className="native-screen">
          <img src={media.src} width="720" height="1564" alt="" loading="lazy" onLoad={media.onLoad} onError={media.onError} />
          {cue && !reducedMotion && !media.failed && <span key={resetKey} className="press-cue" aria-hidden="true" data-visible={Boolean(frame.cue)} style={{ '--touch-delay': `${frame.pauseBefore ?? 0}ms`, '--touch-x': `${cue.x / 440 * 100}cqw`, '--touch-y': `${cue.y / 440 * 100}cqw` } as CSSProperties}>
            <span key={frame.image} className="touch-path" data-travel={Boolean(frame.cue && (frame.cue.to || previousCue?.to))} data-playing={active} style={travel}>
              <span className="touch-contact" data-swipe={Boolean(frame.cue?.to)} data-playing={active && Boolean(frame.cue)} />
            </span>
          </span>}
          {media.failed && <p className="media-error">App image could not load. The steps explain the example.</p>}
        </div></div>
        <div className="phone-frame" aria-hidden="true">
          <img className="phone-frame-top" src="/assets/phone-frame.webp" width="862" height="1825" alt="" />
          <img className="phone-frame-bottom" src="/assets/phone-frame.webp" width="862" height="1825" alt="" />
        </div>
      </div>
    </figure>
  );
}
