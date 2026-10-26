import { useState, type FormEvent } from 'react';
import { MAX_DECK_SIZE, MIN_DECK_SIZE, validateDeckSize } from '../lib/deck';

interface DeckSetupProps {
  initialSize: number;
  disabled: boolean;
  hasDeck: boolean;
  onCreate: (total: number) => void;
}

export function DeckSetup({ initialSize, disabled, hasDeck, onCreate }: DeckSetupProps) {
  const [value, setValue] = useState(String(initialSize));
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = validateDeckSize(value);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    onCreate(result.value);
  }

  return (
    <form className="panel setup" onSubmit={handleSubmit} noValidate>
      <label htmlFor="deck-size">Number of cards (N)</label>
      <div className="setup-row">
        <input
          id="deck-size"
          type="number"
          inputMode="numeric"
          min={MIN_DECK_SIZE}
          max={MAX_DECK_SIZE}
          step={1}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            if (error) setError(null);
          }}
          aria-invalid={error !== null}
          aria-describedby="deck-size-hint"
        />
        <button type="submit" className="btn btn-secondary" disabled={disabled}>
          {hasDeck ? 'New Deck' : 'Create Deck'}
        </button>
      </div>
      <p id="deck-size-hint" className={error ? 'field-error' : 'muted'} role={error ? 'alert' : undefined}>
        {error ?? `Cards numbered 1 to N, where N is ${MIN_DECK_SIZE}–${MAX_DECK_SIZE}.`}
      </p>
    </form>
  );
}
