'use client';

import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // You can customize this color
    },
    secondary: {
      main: '#dc004e', // You can customize this color
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans)',
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}