'use client';

import { LOGIN_USER } from '@/graphql/auth';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { useLazyQuery } from '@apollo/client';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import bcrypt from 'bcryptjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { showSnackbar } = useSnackbar();
  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    fetchPolicy: 'no-cache'
  });

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      showSnackbar('Please fill in all fields', 'error');
      return;
    }

    try {
      const { data } = await loginUser({ 
        variables: { _eq: email }
      });

      if (!data?.Users || data.Users.length === 0) {
        showSnackbar('Invalid email or password', 'error');
        return;
      }

      const user = data.Users[0];
      
      try {
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
          showSnackbar('Invalid email or password', 'error');
          return;
        }

        const userToStore = {
          id: user.id,
          username: user.username,
          email: user.email
        };
        
        localStorage.setItem('user', JSON.stringify(userToStore));
        localStorage.setItem('token', user.id);
        showSnackbar('Login successful. Redirecting to dashboard...', 'success');
        
        router.push('/home/dashboard');
      } catch (bcryptError) {
        console.error('Password verification error:', bcryptError);
        showSnackbar('Login failed. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Login error:', err);
      showSnackbar('Login failed. Please try again.', 'error');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          background: 'linear-gradient(145deg, #0f1115, #14161a)',
          padding: 4,
          width: '100%',
          maxWidth: 500,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#fff' }}
        >
          future<span style={{ color: '#0ab4ff' }}>konnect</span>
        </Typography>

        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            variant="outlined"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: '#1c1c24',
                color: '#fff',
              },
              '& .MuiInputLabel-root': {
                color: '#aaa',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#444',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0ab4ff',
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            variant="outlined"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: '#1c1c24',
                color: '#fff',
              },
              '& .MuiInputLabel-root': {
                color: '#aaa',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#444',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0ab4ff',
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                    sx={{ color: '#aaa' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link 
              href="/forgot-password" 
              style={{ 
                color: '#0ab4ff', 
                textDecoration: 'none',
                fontSize: '0.875rem',
                marginTop: '8px',
                marginBottom: '8px',
                transition: 'all 0.2s ease-in-out'
              }}
              className="hover:text-[#0899db]"
            >
              Forgot Password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.5,
              bgcolor: '#0ab4ff',
              color: '#fff',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#0899db' },
            }}
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
