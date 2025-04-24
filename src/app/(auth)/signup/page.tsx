'use client';

import { Background } from '@/components/common/Background';
import SignupForm from '@/app/components/SignupForm';
import { Box } from '@mui/material';

export default function SignupPage() {
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
        <SignupForm />
      </Box>
    </Box>
  );
}