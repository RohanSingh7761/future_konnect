'use client';

import { Background } from '@/components/common/Background';
import LoginForm from '@/app/components/LoginForm';
import { Box } from '@mui/material';

export default function LoginPage() {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <Background />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <LoginForm />
      </Box>
    </Box>
  );
}