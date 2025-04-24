'use client';

import { Box } from '@mui/material';

export const Background = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at top right, rgb(17, 24, 39), rgb(9, 13, 20))',
        zIndex: 0,
        overflow: 'hidden',
      }}
    />
  );
};