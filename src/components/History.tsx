import { PlayingCard } from './PlayingCard';

export function History({ cards }: { cards: number[] }) {
  return (
    <section className="panel history" aria-label="Draw history">
      <h2>History</h2>
      {cards.length === 0 ? (
        <p className="muted">No cards drawn yet.</p>
      ) : (
        <ol className="history-list">
          {cards.map((value, index) => (
            <li key={value} title={`Draw #${index + 1}: ${value}`}>
              <PlayingCard value={value} className="card-mini" />
              <span className="history-index">#{index + 1}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
