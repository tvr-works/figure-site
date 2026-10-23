import { useEffect, useRef, useState, type FocusEvent } from 'react';
import type { Frame } from './demo-content';

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Each section owns its playback; only browser/media synchronization is shared.
export function useDemoPlayback(frames: readonly Frame[], index: number, onAdvance: () => boolean) {
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const [loadedImage, setLoadedImage] = useState('');
  const [failedImage, setFailedImage] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const frame = frames[index];
  const src = `/assets/demo/${frame.image}.webp`;
  const failed = failedImage === src;
  const active = playing && inView && pageVisible && !reducedMotion && loadedImage === src && !failed;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) setPlaying(false);
    };
    const visibility = () => setPageVisible(!document.hidden);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    preference.addEventListener('change', update);
    document.addEventListener('visibilitychange', visibility);
    if (ref.current) observer.observe(ref.current);
    return () => {
      preference.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', visibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    for (const frame of frames) {
      const image = new Image();
      image.src = `/assets/demo/${frame.image}.webp`;
      void image.decode().catch(() => {});
    }
  }, [frames, inView, reducedMotion]);

  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(() => {
      if (!onAdvance()) setPlaying(false);
    }, frame.duration + (frame.pauseBefore ?? 0));
    return () => window.clearTimeout(timer);
  }, [active, frame.image, frame.duration, frame.pauseBefore, onAdvance]);

  function onFocusCapture(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget) && event.target instanceof HTMLElement && event.target.matches(':focus-visible')) setPlaying(false);
  }
  return {
    ref, reducedMotion, playing, active, onFocusCapture,
    start: () => setPlaying(!reducedMotion),
    pause: () => setPlaying(false),
    toggle: () => setPlaying(current => !reducedMotion && !current),
    media: { src, failed, onLoad: () => setLoadedImage(src), onError: () => { setFailedImage(src); setPlaying(false); } },
  };
}
