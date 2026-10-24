import { useId } from 'react';
import { Button } from './components/ui/button';
import { NativeSelect, NativeSelectOption } from './components/ui/native-select';
import { modes } from './demo-content';

interface ModePickerProps {
  selected: number;
  disabled?: boolean;
  onSelect: (mode: number) => void;
}

export function ModePicker({ selected, onSelect, disabled }: ModePickerProps) {
  const pickerId = useId();
  return (
    <aside className="mode-picker" aria-label="Calculation modes">
      <fieldset className="mode-list" aria-label="Choose a calculation mode">
        {modes.map((mode, index) => (
          <Button disabled={disabled} key={mode.id} variant="mode" size="mode" aria-label={mode.label} aria-pressed={selected === index} aria-controls="adaptive-mode-content" aria-describedby={`${pickerId}-${mode.id}`} onClick={() => onSelect(index)}>
            <span className="mode-option-copy"><strong>{mode.label}</strong><small id={`${pickerId}-${mode.id}`}>{mode.summary}</small></span>
          </Button>
        ))}
      </fieldset>
      <div className="mode-compact">
        <NativeSelect disabled={disabled} aria-label="Choose a calculation mode" value={selected} onChange={event => onSelect(Number(event.target.value))} className="w-full">
          {modes.map((mode, index) => <NativeSelectOption key={mode.id} value={index}>{mode.label}</NativeSelectOption>)}
        </NativeSelect>
      </div>
    </aside>
  );
}
