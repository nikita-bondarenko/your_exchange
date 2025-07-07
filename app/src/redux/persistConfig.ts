import { RootState } from "./store";

const PERSIST_KEY = 'cryptus_store';

const isLocalStorageAvailable = () => {
  try {
    return typeof window !== 'undefined' && window.localStorage;
  } catch (e) {
    return false;
  }
};

export const loadState = (): Partial<RootState> | undefined => {
  if (!isLocalStorageAvailable()) {
    return undefined;
  }

  try {
    const serializedState = localStorage.getItem(PERSIST_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

export const saveState = (state: Partial<RootState>) => {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(PERSIST_KEY, serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
}; 