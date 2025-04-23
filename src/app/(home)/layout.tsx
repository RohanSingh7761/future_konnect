'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Sidebar from '../components/Sidebar';
import ThemeRegistry from '../components/ThemeRegistry';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeRegistry>
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ 
              mb: 4, 
              mt: 1,
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            Welcome to Future Konnect
          </Typography>
          {children}
        </Box>
      </Box>
    </ThemeRegistry>
  );
}