import { useId } from 'react';
import { Pause, Play } from 'lucide-react';
import { Button } from './components/ui/button';
import { NativeSelect, NativeSelectOption } from './components/ui/native-select';
import { modes } from './demo-content';

interface ModePickerProps {
  selected: number;
  playing: boolean;
  reducedMotion: boolean;
  onSelect: (mode: number) => void;
  onTogglePlayback: () => void;
}

export function ModePicker({ selected, playing, reducedMotion, onSelect, onTogglePlayback }: ModePickerProps) {
  const pickerId = useId();
  return (
    <aside className="mode-picker" aria-label="Calculation modes">
      <p className="mode-picker-title">Calculation modes</p>
      <div className="mode-list" role="group" aria-label="Choose a calculation mode">
        {modes.map((mode, index) => (
          <Button key={mode.id} variant="mode" size="mode" aria-label={mode.label} aria-pressed={selected === index} aria-controls="adaptive-mode-content" aria-describedby={`${pickerId}-${mode.id}`} onClick={() => onSelect(index)}>
            <span className="mode-option-copy"><strong>{mode.label}</strong><small id={`${pickerId}-${mode.id}`}>{mode.summary}</small></span>
          </Button>
        ))}
      </div>
      <div className="mode-compact">
        <NativeSelect aria-label="Choose a calculation mode" value={selected} onChange={event => onSelect(Number(event.target.value))} className="w-full">
          {modes.map((mode, index) => <NativeSelectOption key={mode.id} value={index}>{mode.label}</NativeSelectOption>)}
        </NativeSelect>
      </div>
      {!reducedMotion && <div className="mode-playback"><Button variant="control" onClick={onTogglePlayback} aria-label={playing ? 'Pause demo' : 'Play demo'}>{playing ? <Pause data-icon="inline-start" /> : <Play data-icon="inline-start" />}{playing ? 'Pause' : 'Play'}</Button></div>}
    </aside>
  );
}
