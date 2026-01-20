import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'dark' | 'light';

interface UiState {
  themeMode: ThemeMode;
}

const STORAGE_KEY = 'portfolio.themeMode';

// LocalStorage is optional (SSR/private mode), so we guard access.
const getStorage = (): Storage | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

// Try to read a saved theme so refresh keeps the same look.
const readStoredTheme = (): ThemeMode | null => {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  const stored = storage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }

  return null;
};

// Persist the choice so theme survives reloads.
const persistTheme = (themeMode: ThemeMode) => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(STORAGE_KEY, themeMode);
};

// Default to saved theme, or dark if nothing is stored.
const initialState: UiState = {
  themeMode: readStoredTheme() ?? 'dark',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Toggle flips mode and syncs to localStorage.
    toggleTheme(state) {
      state.themeMode = state.themeMode === 'dark' ? 'light' : 'dark';
      persistTheme(state.themeMode);
    },
    // Direct set is used when we want a specific mode.
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.themeMode = action.payload;
      persistTheme(state.themeMode);
    },
  },
});

export const { toggleTheme, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
