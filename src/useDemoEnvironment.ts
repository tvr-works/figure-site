import { useSyncExternalStore } from 'react';

const serverSnapshot = () => 2; // Prerender a still with reduced motion until the browser is known.
function browserSnapshot() {
  return 4 | (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 2 : 0) | (document.hidden ? 0 : 1);
}
function subscribe(onChange: () => void) {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  motion.addEventListener('change', onChange);
  document.addEventListener('visibilitychange', onChange);
  return () => {
    motion.removeEventListener('change', onChange);
    document.removeEventListener('visibilitychange', onChange);
  };
}

export function useDemoEnvironment() {
  const snapshot = useSyncExternalStore(subscribe, browserSnapshot, serverSnapshot);
  return { hydrated: Boolean(snapshot & 4), reducedMotion: Boolean(snapshot & 2), pageVisible: Boolean(snapshot & 1) };
}
