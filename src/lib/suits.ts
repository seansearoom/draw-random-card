export type Suit = 'spades' | 'hearts' | 'clubs' | 'diamonds';

const SUITS: Suit[] = ['spades', 'hearts', 'clubs', 'diamonds'];

export const SUIT_SYMBOL: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  clubs: '♣',
  diamonds: '♦',
};

/** Decorative suit for a numbered card, alternating black and red. */
export function suitFor(value: number): Suit {
  return SUITS[(value - 1) % SUITS.length];
}

export function isRedSuit(suit: Suit): boolean {
  return suit === 'hearts' || suit === 'diamonds';
}
