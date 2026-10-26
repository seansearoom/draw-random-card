import { isValidDeckState, type DeckState } from './deck';

const STORAGE_KEY = 'random-deck:session:v1';

function getStorage(): Storage | null {
  try {
    return globalThis.sessionStorage ?? null;
  } catch {
    return null;
  }
}

export function loadDeck(): DeckState | null {
  try {
    const raw = getStorage()?.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValidDeckState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveDeck(state: DeckState | null): void {
  try {
    const storage = getStorage();
    if (!storage) return;
    if (state) {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      storage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage can be full or blocked (private mode); the in-memory state still works.
  }
}
