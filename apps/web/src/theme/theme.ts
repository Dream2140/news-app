'use client';

import { createTheme } from '@mui/material/styles';

const sharedTypography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: { fontWeight: 800, letterSpacing: '-0.02em' },
  h2: { fontWeight: 700, letterSpacing: '-0.01em' },
  h3: { fontWeight: 700 },
  h4: { fontWeight: 700 },
  h5: { fontWeight: 600 },
  h6: { fontWeight: 600 },
};

const sharedComponents = {
  MuiButton: {
    styleOverrides: {
      root: { borderRadius: 8, textTransform: 'none' as const, fontWeight: 600 },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: { borderRadius: 12, transition: 'transform 0.2s, box-shadow 0.2s' },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { borderRadius: 6, fontWeight: 600, fontSize: '0.75rem' },
    },
  },
};

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#e94560' },
    secondary: { main: '#0f3460' },
    background: {
      default: '#0a0a1a',
      paper: '#141428',
    },
    text: {
      primary: '#e8e8f0',
      secondary: '#9898b0',
    },
  },
  typography: sharedTypography,
  components: {
    ...sharedComponents,
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: '#0e0e20', borderBottom: '1px solid rgba(233, 69, 96, 0.15)' },
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#e94560' },
    secondary: { main: '#0f3460' },
    background: {
      default: '#f5f5f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#555580',
    },
  },
  typography: sharedTypography,
  components: {
    ...sharedComponents,
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: '#1a1a2e' },
      },
    },
  },
});
