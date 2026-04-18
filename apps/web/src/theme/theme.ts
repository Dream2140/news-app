'use client';

import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ff2bd6', contrastText: '#05060c' },
    secondary: { main: '#2af5ff', contrastText: '#05060c' },
    error: { main: '#ff3b5c' },
    warning: { main: '#f5ff57' },
    success: { main: '#b9ff3d' },
    info: { main: '#2af5ff' },
    background: {
      default: '#05060c',
      paper: '#0b0e1a',
    },
    text: {
      primary: '#e8ecff',
      secondary: '#a0a8c8',
    },
    divider: 'rgba(42,245,255,0.14)',
  },
  typography: {
    fontFamily: '"Rajdhani", "Inter", "Roboto", sans-serif',
    h1: { fontFamily: '"Orbitron", sans-serif', fontWeight: 800, letterSpacing: '0.02em' },
    h2: { fontFamily: '"Orbitron", sans-serif', fontWeight: 700, letterSpacing: '0.02em' },
    h3: { fontFamily: '"Orbitron", sans-serif', fontWeight: 700, letterSpacing: '0.02em' },
    h4: { fontFamily: '"Orbitron", sans-serif', fontWeight: 700, letterSpacing: '0.03em' },
    h5: { fontFamily: '"Orbitron", sans-serif', fontWeight: 600, letterSpacing: '0.04em' },
    h6: { fontFamily: '"Orbitron", sans-serif', fontWeight: 600, letterSpacing: '0.06em' },
    button: { fontFamily: '"Rajdhani", sans-serif', fontWeight: 700, letterSpacing: '0.12em' },
  },
  shape: { borderRadius: 0 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'uppercase' as const,
          fontWeight: 700,
          letterSpacing: '0.14em',
          clipPath:
            'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
        },
        contained: {
          background: 'linear-gradient(135deg, #ff2bd6, #ff6ee0)',
          color: '#05060c',
          boxShadow: '0 0 24px rgba(255,43,214,0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #ff6ee0, #ff2bd6)',
            boxShadow: '0 0 32px rgba(255,43,214,0.55)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            background: 'rgba(6,9,18,0.9)',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 14,
            '& fieldset': {
              borderColor: 'rgba(42,245,255,0.3)',
              borderWidth: 1,
            },
            '&:hover fieldset': { borderColor: 'rgba(42,245,255,0.55)' },
            '&.Mui-focused fieldset': {
              borderColor: '#ff2bd6',
              boxShadow: '0 0 16px rgba(255,43,214,0.3)',
            },
          },
          '& label': {
            fontFamily: '"Rajdhani", sans-serif',
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            fontSize: 12,
            color: '#a0a8c8',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 0,
          border: '1px solid rgba(42,245,255,0.14)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontFamily: '"Rajdhani", sans-serif',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase' as const,
          fontSize: '0.7rem',
          border: '1px solid rgba(42,245,255,0.3)',
          background: 'rgba(6,9,18,0.8)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: '#0b0e1a',
          border: '1px solid rgba(42,245,255,0.28)',
          boxShadow: '0 0 48px rgba(255,43,214,0.15)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(42,245,255,0.14)',
        },
      },
    },
  },
});

export const lightTheme = darkTheme;
