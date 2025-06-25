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
      // console.log('ProtectedRoute - token:', token);

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/me`, {
          headers: {
            auth_token: `Bearer ${token}`,
          },
          withCredentials: true
        });
        // console.log('ProtectedRoute - /auth/me response:', response.data);

        // Only authenticate if userId is present in the response
        if (response.data && response.data.userId) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
        }
      } catch (error) {
        // console.error('ProtectedRoute - /auth/me error:', error.response ? error.response.data : error);
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