import { useCallback, useEffect, useRef, useState, type FocusEvent } from 'react';
import type { Frame } from './demo-content';
import type { useDemoEnvironment } from './useDemoEnvironment';

// Each section owns its playback; only browser/media synchronization is shared.
export function useDemoPlayback(frames: readonly Frame[], index: number, onAdvance: () => boolean, environment: ReturnType<typeof useDemoEnvironment>, suspended = false) {
  const { hydrated, reducedMotion, pageVisible } = environment;
  const [playing, setPlaying] = useState(true);
  const [pausedByUser, setPausedByUser] = useState(false);
  const [inView, setInView] = useState(false);
  const [loadedImage, setLoadedImage] = useState('');
  const [failedImage, setFailedImage] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const frame = frames[index];
  const src = `/assets/demo/${frame.image}.webp`;
  const failed = failedImage === src;
  const active = hydrated && !suspended && playing && !pausedByUser && inView && pageVisible && !reducedMotion && loadedImage === src && !failed;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
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

  // A prerendered image may finish loading or fail before React attaches event handlers.
  const onMount = useCallback((image: HTMLImageElement | null) => {
    if (!image?.complete) return;
    if (image.naturalWidth > 0) setLoadedImage(src);
    else { setFailedImage(src); setPlaying(false); }
  }, [src]);

  function onFocusCapture(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget) && event.target instanceof HTMLElement && event.target.matches(':focus-visible')) setPlaying(false);
  }
  return {
    ref, hydrated, reducedMotion, playing: playing && !pausedByUser && !reducedMotion, active, onFocusCapture,
    start: () => setPlaying(!reducedMotion),
    pause: () => setPlaying(false),
    togglePlayback: () => {
      if (pausedByUser || !playing) { setPausedByUser(false); setPlaying(!reducedMotion); }
      else setPausedByUser(true);
    },
    media: { src, failed, onMount, onLoad: () => setLoadedImage(src), onError: () => { setFailedImage(src); setPlaying(false); } },
  };
}
