'use client';

import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme } from './theme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MuiThemeProvider theme={darkTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export const useThemeMode = () => ({ mode: 'dark' as const, toggleTheme: () => {} });
