import { useId } from 'react';
import { Button } from './components/ui/button';
import { NativeSelect, NativeSelectOption } from './components/ui/native-select';
import { modes } from './demo-content';

interface ModePickerProps {
  selected: number;
  onSelect: (mode: number) => void;
}

export function ModePicker({ selected, onSelect }: ModePickerProps) {
  const pickerId = useId();
  return (
    <aside className="mode-picker" aria-label="Calculation modes">
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
    </aside>
  );
}
