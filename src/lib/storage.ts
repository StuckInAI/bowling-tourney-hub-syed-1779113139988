import type { AppState } from '@/types';

const STORAGE_KEY = 'bowling_app_state';

export function loadState(): AppState | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized) as AppState;
  } catch {
    return null;
  }
}

export function saveState(state: AppState): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // ignore
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
