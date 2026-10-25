import { Pause, Play } from 'lucide-react';
import { Button } from './components/ui/button';

export function DemoPlaybackControl({ label, playing, onToggle }: { label: string; playing: boolean; onToggle: () => void }) {
  const Icon = playing ? Pause : Play;
  const action = playing ? 'Pause' : 'Resume';
  return <Button variant="control" aria-label={`${action} ${label} demo`} onClick={onToggle}>
    <Icon data-icon="inline-start" />{action} demo
  </Button>;
}
