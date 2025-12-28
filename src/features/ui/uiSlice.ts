import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "dark" | "light";

interface UiState {
  themeMode: ThemeMode;
}

const STORAGE_KEY = "portfolio.themeMode";

const getStorage = (): Storage | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const readStoredTheme = (): ThemeMode | null => {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  const stored = storage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") {
    return stored;
  }

  return null;
};

const persistTheme = (themeMode: ThemeMode) => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(STORAGE_KEY, themeMode);
};

const initialState: UiState = {
  themeMode: readStoredTheme() ?? "dark",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.themeMode = state.themeMode === "dark" ? "light" : "dark";
      persistTheme(state.themeMode);
    },
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.themeMode = action.payload;
      persistTheme(state.themeMode);
    },
  },
});

export const { toggleTheme, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
