import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from './store';
import type { TypedUseSelectorHook } from 'react-redux';

// Typed hooks keep Redux usage consistent across the app.
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Sync theme from Redux into the <html data-theme=""> attribute.
export const useApplyTheme = () => {
  const themeMode = useAppSelector((state) => state.ui.themeMode);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    document.documentElement.dataset.theme = themeMode;
  }, [themeMode]);
};
