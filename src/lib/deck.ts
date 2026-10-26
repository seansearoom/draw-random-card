export const MIN_DECK_SIZE = 1;
export const MAX_DECK_SIZE = 500;

export interface DeckState {
  /** Size of the deck when it was created (cards 1..total). */
  total: number;
  /** Cards still available to draw. */
  remaining: number[];
  /** Cards already drawn, in draw order. */
  drawn: number[];
}

/** Returns a uniformly distributed integer in [0, maxExclusive). */
export type RandomInt = (maxExclusive: number) => number;

export type ValidationResult =
  | { ok: true; value: number }
  | { ok: false; error: string };

export function validateDeckSize(raw: string): ValidationResult {
  const text = raw.trim();
  if (text === '') {
    return { ok: false, error: 'Enter how many cards the deck should have.' };
  }
  if (!/^\d+$/.test(text)) {
    return { ok: false, error: 'Use a whole number with no decimals or signs.' };
  }
  const value = Number(text);
  if (value < MIN_DECK_SIZE || value > MAX_DECK_SIZE) {
    return { ok: false, error: `Choose a number from ${MIN_DECK_SIZE} to ${MAX_DECK_SIZE}.` };
  }
  return { ok: true, value };
}

export function createDeck(total: number): DeckState {
  if (!Number.isInteger(total) || total < MIN_DECK_SIZE || total > MAX_DECK_SIZE) {
    throw new RangeError(`Deck size must be an integer from ${MIN_DECK_SIZE} to ${MAX_DECK_SIZE}.`);
  }
  return {
    total,
    remaining: Array.from({ length: total }, (_, i) => i + 1),
    drawn: [],
  };
}

/**
 * Uniform random integer using the Web Crypto API with rejection sampling,
 * so there is no modulo bias. Falls back to Math.random only when crypto is
 * unavailable; the result is still clamped to the valid index range.
 */
export const secureRandomInt: RandomInt = (maxExclusive) => {
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
    throw new RangeError('maxExclusive must be a positive integer.');
  }
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.getRandomValues) {
    const range = 2 ** 32;
    const limit = range - (range % maxExclusive);
    const buffer = new Uint32Array(1);
    let value: number;
    do {
      cryptoApi.getRandomValues(buffer);
      value = buffer[0];
    } while (value >= limit);
    return value % maxExclusive;
  }
  return Math.min(Math.floor(Math.random() * maxExclusive), maxExclusive - 1);
};

/**
 * Draws one card from the remaining deck. Returns a new state in which the
 * card has been moved from `remaining` to `drawn`; the input is not mutated.
 */
export function drawCard(
  state: DeckState,
  randomInt: RandomInt = secureRandomInt,
): { card: number; state: DeckState } {
  if (state.remaining.length === 0) {
    throw new Error('Cannot draw from an empty deck.');
  }
  const index = randomInt(state.remaining.length);
  if (!Number.isInteger(index) || index < 0 || index >= state.remaining.length) {
    throw new RangeError(`Random index ${index} is outside the remaining deck.`);
  }
  const remaining = state.remaining.slice();
  const [card] = remaining.splice(index, 1);
  return {
    card,
    state: { total: state.total, remaining, drawn: [...state.drawn, card] },
  };
}

/** Checks that a value is a well-formed deck: remaining + drawn is exactly 1..total. */
export function isValidDeckState(value: unknown): value is DeckState {
  if (typeof value !== 'object' || value === null) return false;
  const { total, remaining, drawn } = value as Record<string, unknown>;
  if (!Number.isInteger(total) || (total as number) < MIN_DECK_SIZE || (total as number) > MAX_DECK_SIZE) {
    return false;
  }
  if (!Array.isArray(remaining) || !Array.isArray(drawn)) return false;
  if (remaining.length + drawn.length !== total) return false;
  const seen = new Set<number>();
  for (const card of [...remaining, ...drawn]) {
    if (!Number.isInteger(card) || card < 1 || card > (total as number) || seen.has(card)) {
      return false;
    }
    seen.add(card);
  }
  return true;
}
