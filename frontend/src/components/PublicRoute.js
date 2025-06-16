import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { Box, CircularProgress } from '@mui/material';

const PublicRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/auth/login', {
          headers: {
            auth_token: `Bearer ${token}`,
          },
          withCredentials: true
        });

        // console.log('Public Route - Auth response:', response.data);

        // Check if we have a valid response
        if (response.data && response.data !== "Hello world") {
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

  if (isAuthenticated) {
    // console.log('Public Route - Redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute; 