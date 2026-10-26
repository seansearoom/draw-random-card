interface StatsProps {
  total: number;
  drawn: number;
  remaining: number;
}

export function Stats({ total, drawn, remaining }: StatsProps) {
  const progress = total === 0 ? 0 : (drawn / total) * 100;
  return (
    <section className="panel stats" aria-label="Deck statistics">
      <dl className="stats-grid">
        <div>
          <dt>Total</dt>
          <dd>{total}</dd>
        </div>
        <div>
          <dt>Drawn</dt>
          <dd>{drawn}</dd>
        </div>
        <div>
          <dt>Remaining</dt>
          <dd>{remaining}</dd>
        </div>
      </dl>
      <div
        className="progress"
        role="progressbar"
        aria-label="Cards drawn"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={drawn}
      >
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}
