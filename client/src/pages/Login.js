import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../api';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '15px',
  background: 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)',
  boxShadow: '0 0 10px rgba(255, 87, 34, 0.1)',
  border: '1px solid rgba(255, 87, 34, 0.1)',
  maxWidth: '400px',
  margin: '0 auto',
}));

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await apiService.checkAuthStatus();

      if (response.user) {
        setIsAuthenticated(true);
        localStorage.setItem('userId', response.user.userId);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const response = await apiService.login({ email, password });

      if (response?.token && response?.userId) {
        // Store auth data
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);

        // // Debug logging
        // console.log('Login successful:', {
        //   token: response.token,
        //   userId: response.userId
        // });

        // Navigate to dashboard
        navigate('/dashboard', { replace: true });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
    if (error) setError('');
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress sx={{ color: '#ff5722' }} />
      </Box>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <StyledPaper>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          sx={{ color: '#ff5722', mb: 4 }}
        >
          Welcome Back
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={handleInputChange}
            required
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 87, 34, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 87, 34, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#ff5722' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 87, 34, 0.7)' },
              '& .MuiInputBase-input': { color: '#fff' },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={handleInputChange}
            required
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 87, 34, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 87, 34, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#ff5722' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 87, 34, 0.7)' },
              '& .MuiInputBase-input': { color: '#fff' },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              background: 'linear-gradient(45deg, #ff5722 30%, #ff9800 90%)',
              color: '#fff',
              '&:hover': {
                background: 'linear-gradient(45deg, #ff5722 40%, #ff9800 100%)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>

          <Box textAlign="center">
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              Don't have an account?{' '}
              <Button
                color="inherit"
                onClick={() => navigate('/signup')}
                sx={{
                  color: '#ff5722',
                  '&:hover': { color: '#ff9800' },
                }}
              >
                Sign Up
              </Button>
            </Typography>
          </Box>
        </form>
      </StyledPaper>
    </Container>
  );
};

export default Login; 