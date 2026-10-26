import { SUIT_SYMBOL, isRedSuit, suitFor } from '../lib/suits';

interface PlayingCardProps {
  value: number;
  className?: string;
}

export function PlayingCard({ value, className = '' }: PlayingCardProps) {
  const suit = suitFor(value);
  const symbol = SUIT_SYMBOL[suit];
  const digits = String(value).length;

  return (
    <div
      className={`card card-face ${isRedSuit(suit) ? 'is-red' : 'is-black'} digits-${digits} ${className}`}
      role="img"
      aria-label={`Card ${value}`}
    >
      <div className="card-corner card-corner-top" aria-hidden="true">
        <span className="card-corner-value">{value}</span>
        <span className="card-corner-suit">{symbol}</span>
      </div>
      <div className="card-center" aria-hidden="true">
        <span className="card-center-frame">
          <span className="card-center-value">{value}</span>
          <span className="card-center-suit">{symbol}</span>
        </span>
      </div>
      <div className="card-corner card-corner-bottom" aria-hidden="true">
        <span className="card-corner-value">{value}</span>
        <span className="card-corner-suit">{symbol}</span>
      </div>
    </div>
  );
}

export function CardBack({ className = '' }: { className?: string }) {
  return (
    <div className={`card card-back ${className}`} aria-hidden="true">
      <div className="card-back-pattern">
        <span className="card-back-emblem">♠</span>
      </div>
    </div>
  );
}
