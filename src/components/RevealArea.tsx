import { useLayoutEffect, useRef, type RefObject } from 'react';
import { CardBack, PlayingCard } from './PlayingCard';

interface RevealAreaProps {
  current: number | null;
  previous: number | null;
  drawId: number;
  isDrawing: boolean;
  deckTopRef: RefObject<HTMLDivElement | null>;
}

export function RevealArea({ current, previous, drawId, isDrawing, deckTopRef }: RevealAreaProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Measure where the deck's top card sits so the new card starts its flight there.
  useLayoutEffect(() => {
    const slot = slotRef.current;
    const card = cardRef.current;
    const deckTop = deckTopRef.current;
    if (!isDrawing || !slot || !card || !deckTop) return;
    const from = deckTop.getBoundingClientRect();
    const to = slot.getBoundingClientRect();
    card.style.setProperty('--from-x', `${from.left - to.left}px`);
    card.style.setProperty('--from-y', `${from.top - to.top}px`);
  }, [drawId, isDrawing, deckTopRef]);

  return (
    <div className="reveal">
      <div className="reveal-slot" ref={slotRef}>
        {current === null && <span className="reveal-placeholder">Your card appears here</span>}
        {isDrawing && previous !== null && <PlayingCard value={previous} className="reveal-under" />}
        {current !== null && (
          <div
            key={drawId}
            ref={cardRef}
            className={`reveal-card ${drawId > 0 ? 'is-animated' : ''}`}
          >
            <div className="flip">
              <div className="flip-face flip-front">
                <PlayingCard value={current} />
              </div>
              <div className="flip-face flip-back">
                <CardBack />
              </div>
            </div>
          </div>
        )}
      </div>
      <p className="reveal-caption" aria-live="polite">
        {isDrawing ? 'Drawing…' : current !== null ? `You drew ${current}` : ' '}
      </p>
    </div>
  );
}
