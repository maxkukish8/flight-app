/**
 * Provides a React Context for theme mode (light/dark).
 *
 * Exports:
 * - ThemeModeContext: context object for accessing theme state.
 * - ThemeModeProvider: wraps children with theme mode logic.
 *
 * Handles:
 * - Current theme state ('light' | 'dark')
 * - Function to toggle between light and dark modes
 */


import { createContext, useContext } from 'react';

export type ColorMode = 'light' | 'dark';

export const ColorModeContext = createContext<{
    mode: ColorMode;
    toggle: () => void;
}>({ mode: 'light', toggle: () => {} });

export const useThemeMode = () => useContext(ColorModeContext);
