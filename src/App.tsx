import { useRef, useState } from 'react';
import { ConfirmDialog } from './components/ConfirmDialog';
import { DeckSetup } from './components/DeckSetup';
import { DeckStack } from './components/DeckStack';
import { History } from './components/History';
import { RevealArea } from './components/RevealArea';
import { Stats } from './components/Stats';
import { useDeck } from './hooks/useDeck';

const DEFAULT_DECK_SIZE = 52;

export default function App() {
  const { deck, phase, drawId, draw, newSession } = useDeck();
  const [pendingSize, setPendingSize] = useState<number | null>(null);
  const deckTopRef = useRef<HTMLDivElement>(null);

  const isDrawing = phase === 'drawing';
  const drawn = deck?.drawn ?? [];
  const remaining = deck?.remaining.length ?? 0;
  const isComplete = deck !== null && remaining === 0 && !isDrawing;
  // Hide the in-flight card from history until it has been revealed.
  const revealedHistory = isDrawing ? drawn.slice(0, -1) : drawn;

  function requestNewSession(total: number) {
    if (deck && deck.drawn.length > 0) {
      setPendingSize(total);
    } else {
      newSession(total);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>
          <span className="header-suit is-red" aria-hidden="true">♥</span> Random Card Draw{' '}
          <span className="header-suit" aria-hidden="true">♠</span>
        </h1>
        <p className="muted">Build a deck numbered 1 to N and draw cards one at a time, with no repeats.</p>
      </header>

      <DeckSetup
        initialSize={deck?.total ?? DEFAULT_DECK_SIZE}
        disabled={isDrawing}
        hasDeck={deck !== null}
        onCreate={requestNewSession}
      />

      {deck ? (
        <>
          <main className="table">
            <div className="table-felt">
              <DeckStack ref={deckTopRef} remaining={remaining} total={deck.total} />
              <RevealArea
                current={drawn.at(-1) ?? null}
                previous={drawn.at(-2) ?? null}
                drawId={drawId}
                isDrawing={isDrawing}
                deckTopRef={deckTopRef}
              />
            </div>

            <div className="controls">
              <button
                type="button"
                className="btn btn-primary btn-draw"
                onClick={draw}
                disabled={isDrawing || remaining === 0}
                aria-busy={isDrawing}
              >
                {isDrawing ? 'Drawing…' : 'Draw Card'}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => requestNewSession(deck.total)}
                disabled={isDrawing || deck.drawn.length === 0}
              >
                Reset Deck
              </button>
            </div>

            {isComplete && (
              <p className="complete" role="status">
                All cards have been drawn! Reset the deck or create a new one to play again.
              </p>
            )}
          </main>

          <div className="sidebar">
            <Stats total={deck.total} drawn={drawn.length} remaining={remaining} />
            <History cards={revealedHistory} />
          </div>
        </>
      ) : (
        <main className="table table-empty">
          <div className="table-felt">
            <p>Choose how many cards you want, then create your deck.</p>
          </div>
        </main>
      )}

      <ConfirmDialog
        open={pendingSize !== null}
        title="Start a new session?"
        message={`You've drawn ${drawn.length} of ${deck?.total ?? 0} cards. A fresh deck of ${pendingSize ?? 0} cards will replace the current one and the history will be cleared.`}
        confirmLabel="Start new session"
        onCancel={() => setPendingSize(null)}
        onConfirm={() => {
          if (pendingSize !== null) newSession(pendingSize);
          setPendingSize(null);
        }}
      />
    </div>
  );
}
