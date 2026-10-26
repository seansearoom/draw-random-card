import { forwardRef, type CSSProperties } from 'react';
import { CardBack } from './PlayingCard';

const MAX_LAYERS = 14;

interface DeckStackProps {
  remaining: number;
  total: number;
}

/** A face-down pile whose thickness tracks the share of cards remaining. */
export const DeckStack = forwardRef<HTMLDivElement, DeckStackProps>(function DeckStack(
  { remaining, total },
  topCardRef,
) {
  const layers = remaining === 0 ? 0 : Math.max(1, Math.ceil((remaining / total) * MAX_LAYERS));

  return (
    <div className="deck">
      <div className="deck-stack" style={{ '--layers': layers } as CSSProperties}>
        <div className="deck-slot" ref={layers === 0 ? topCardRef : undefined}>
          {layers === 0 && <span>Empty</span>}
        </div>
        {Array.from({ length: layers }, (_, i) => {
          const isTop = i === layers - 1;
          const style = { '--i': i } as CSSProperties;
          return isTop ? (
            <div key={i} className="deck-layer deck-layer-top" style={style} ref={topCardRef}>
              <CardBack />
            </div>
          ) : (
            <div key={i} className="deck-layer deck-layer-edge" style={style} />
          );
        })}
      </div>
      <p className="deck-count" aria-live="polite">
        <strong>{remaining}</strong> {remaining === 1 ? 'card' : 'cards'} left
      </p>
    </div>
  );
});
