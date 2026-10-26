import { useCallback, useEffect, useRef, useState } from 'react';
import { createDeck, drawCard, type DeckState } from '../lib/deck';
import { loadDeck, saveDeck } from '../lib/storage';

/** Total time from click to reveal; the travel + flip animation fills it exactly. */
export const DRAW_DURATION_MS = 1000;

export type DrawPhase = 'idle' | 'drawing';

export interface UseDeck {
  deck: DeckState | null;
  phase: DrawPhase;
  /** Increments on every draw made in this page lifetime; keys the reveal animation. */
  drawId: number;
  draw: () => void;
  newSession: (total: number) => void;
}

export function useDeck(): UseDeck {
  const [deck, setDeck] = useState<DeckState | null>(loadDeck);
  const [phase, setPhase] = useState<DrawPhase>('idle');
  const [drawId, setDrawId] = useState(0);

  // Refs give synchronous truth so rapid clicks in the same frame cannot double-draw.
  const deckRef = useRef(deck);
  const lockRef = useRef(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const commit = useCallback((next: DeckState | null) => {
    deckRef.current = next;
    saveDeck(next);
    setDeck(next);
  }, []);

  const draw = useCallback(() => {
    const current = deckRef.current;
    if (lockRef.current || !current || current.remaining.length === 0) return;
    lockRef.current = true;

    // The card leaves the deck immediately; only the reveal is delayed.
    commit(drawCard(current).state);
    setPhase('drawing');
    setDrawId((id) => id + 1);

    timerRef.current = window.setTimeout(() => {
      lockRef.current = false;
      setPhase('idle');
    }, DRAW_DURATION_MS);
  }, [commit]);

  const newSession = useCallback(
    (total: number) => {
      if (lockRef.current) return;
      commit(createDeck(total));
      setPhase('idle');
    },
    [commit],
  );

  return { deck, phase, drawId, draw, newSession };
}
