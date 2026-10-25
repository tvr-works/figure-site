import { Pause, Play } from 'lucide-react';
import { Button } from './components/ui/button';

export function DemoPlaybackControl({ label, playing, onToggle, disabled = false, describedBy }: { label: string; playing: boolean; onToggle: () => void; disabled?: boolean; describedBy?: string }) {
  const Icon = playing ? Pause : Play;
  const name = `${playing ? 'Pause' : 'Play'} ${label} demo`;
  return <Button variant="control" size="control-icon" aria-label={name} title={name} aria-describedby={describedBy} disabled={disabled} onClick={onToggle}>
    <Icon aria-hidden="true" />
  </Button>;
}
