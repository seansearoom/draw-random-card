import { describe, expect, it } from 'vitest';
import {
  MAX_DECK_SIZE,
  createDeck,
  drawCard,
  isValidDeckState,
  secureRandomInt,
  validateDeckSize,
} from './deck';

describe('validateDeckSize', () => {
  it('accepts whole numbers in range', () => {
    expect(validateDeckSize('1')).toEqual({ ok: true, value: 1 });
    expect(validateDeckSize(' 52 ')).toEqual({ ok: true, value: 52 });
    expect(validateDeckSize(String(MAX_DECK_SIZE))).toEqual({ ok: true, value: MAX_DECK_SIZE });
  });

  it.each(['', '0', '-3', '2.5', '1e2', 'abc', '501'])('rejects %j', (input) => {
    expect(validateDeckSize(input).ok).toBe(false);
  });
});

describe('createDeck', () => {
  it('contains exactly 1..N', () => {
    const deck = createDeck(52);
    expect(deck.total).toBe(52);
    expect(deck.remaining).toEqual(Array.from({ length: 52 }, (_, i) => i + 1));
    expect(deck.drawn).toEqual([]);
  });

  it('rejects invalid sizes', () => {
    expect(() => createDeck(0)).toThrow(RangeError);
    expect(() => createDeck(MAX_DECK_SIZE + 1)).toThrow(RangeError);
    expect(() => createDeck(3.5)).toThrow(RangeError);
  });
});

describe('drawCard', () => {
  it('moves the selected card from remaining to drawn without mutating input', () => {
    const deck = createDeck(5);
    const { card, state } = drawCard(deck, () => 2);
    expect(card).toBe(3);
    expect(state.remaining).toEqual([1, 2, 4, 5]);
    expect(state.drawn).toEqual([3]);
    expect(deck.remaining).toEqual([1, 2, 3, 4, 5]);
  });

  it('never repeats a card and exhausts the deck', () => {
    let deck = createDeck(100);
    const seen = new Set<number>();
    for (let i = 0; i < 100; i++) {
      const result = drawCard(deck);
      expect(seen.has(result.card)).toBe(false);
      seen.add(result.card);
      deck = result.state;
      expect(isValidDeckState(deck)).toBe(true);
    }
    expect(deck.remaining).toEqual([]);
    expect(seen.size).toBe(100);
    expect(() => drawCard(deck)).toThrow();
  });

  it('rejects out-of-range indices from the random source', () => {
    const deck = createDeck(3);
    expect(() => drawCard(deck, () => 3)).toThrow(RangeError);
    expect(() => drawCard(deck, () => -1)).toThrow(RangeError);
  });

  it('draws each card with roughly equal probability', () => {
    const counts = new Array(6).fill(0);
    const trials = 60_000;
    for (let i = 0; i < trials; i++) {
      counts[drawCard(createDeck(6)).card - 1]++;
    }
    for (const count of counts) {
      expect(Math.abs(count - trials / 6)).toBeLessThan(trials * 0.01);
    }
  });
});

describe('secureRandomInt', () => {
  it('stays within bounds', () => {
    for (let i = 0; i < 1000; i++) {
      const value = secureRandomInt(7);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(7);
    }
  });
});

describe('isValidDeckState', () => {
  it('rejects duplicates, missing cards and malformed data', () => {
    expect(isValidDeckState({ total: 3, remaining: [1, 2], drawn: [2] })).toBe(false);
    expect(isValidDeckState({ total: 3, remaining: [1], drawn: [2] })).toBe(false);
    expect(isValidDeckState({ total: 3, remaining: [1, 2], drawn: [4] })).toBe(false);
    expect(isValidDeckState(null)).toBe(false);
    expect(isValidDeckState({ total: 3, remaining: [3, 1], drawn: [2] })).toBe(true);
  });
});
