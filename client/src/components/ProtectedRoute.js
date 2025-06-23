import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      // console.log('Protected Route - Token:', token);

      if (!token) {
        // console.log('Protected Route - No token found');
        setIsAuthenticated(false);
        return;
      }

      try {
        // console.log('Protected Route - Checking auth with token');
        const response = await axios.get('http://localhost:3000/auth/login', {
          headers: {
            auth_token: `Bearer ${token}`,
          },
          withCredentials: true
        });

        // Check if we have a valid response
        if (response.data) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
        }
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
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

  if (!isAuthenticated) {
    // console.log('Protected Route - Redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 