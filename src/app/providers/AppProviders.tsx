/**
 * Global application providers wrapper.
 *
 * Wraps the entire app with all global contexts:
 * - Redux Provider (store state management)
 * - PersistGate (state persistence)
 * - ThemeModeContextProvider (light/dark theme switching)
 * - MUI ThemeProvider (Material UI theming)
 *
 * Usage:
 * Place <AppProviders> at the root of the app (main.tsx)
 * and render all application routes/components inside it.
 */

import { useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from '@/shared/theme/theme';
import { ColorModeContext, type ColorMode } from './ThemeModeContext';

const THEME_KEY = 'app_theme_mode';

export function AppProviders({ children }: PropsWithChildren) {
  // 1) Initialization from localStorage or from system theme (only on first login)
  const getInitialMode = (): ColorMode => {
    const saved = localStorage.getItem(THEME_KEY) as ColorMode | null;
    if (saved === 'light' || saved === 'dark') return saved;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' as const : 'light' as const;
  };

  const [mode, setMode] = useState<ColorMode>(getInitialMode);

  // 2) Save the selection in localStorage with each change
  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, mode);
    } catch { /* ignore */ }
  }, [mode]);

  // 3) Sync between tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        setMode(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);
  const toggle = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));

  return (
      <Provider store={store}>
        <ColorModeContext.Provider value={{ mode, toggle }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </ColorModeContext.Provider>
      </Provider>
  );
}

