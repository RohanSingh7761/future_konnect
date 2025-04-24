'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Sidebar from '../../components/Sidebar';
import ApolloWrapper from '../../components/ApolloWrapper';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4285F4',
    },
    background: {
      default: '#0A1929',
      paper: '#132F4C',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0A1929',
        },
      },
    },
  },
});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const username = "John doe";
  
  return (
    <ThemeProvider theme={darkTheme}>
      <ApolloWrapper>
        <Box sx={{ display: 'flex', bgcolor: '#0A1929', minHeight: '100vh' }}>
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
            {/* Top header */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                alignItems: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                p: 2
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body1" color="text.secondary">
                  {username}
                </Typography>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: '#FF3E00', 
                    bgcolor: 'rgba(255, 62, 0, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 62, 0, 0.2)',
                    }
                  }}
                >
                  <NotificationsIcon />
                </IconButton>
              </Stack>
            </Box>
            
            {/* Main content */}
            <Box sx={{ p: 3 }}>
              {children}
            </Box>
          </Box>
        </Box>
      </ApolloWrapper>
    </ThemeProvider>
  );
}