/**
 * Defines application-wide MUI theme configurations.
 *
 * Exports:
 * - lightTheme: Material UI theme with light palette.
 * - darkTheme:  Material UI theme with dark palette.
 *
 * These themes are used together with ThemeModeContext
 * to provide dynamic light/dark mode switching.
 */

import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        mainTheme?: Palette['primary'];
    }
    interface PaletteOptions {
        mainTheme?: PaletteOptions['primary'];
    }
}

export const lightTheme = createTheme({ palette: { mode: 'light', mainTheme: { main: '#05203c' } } });
export const darkTheme  = createTheme({ palette: { mode: 'dark' } });
