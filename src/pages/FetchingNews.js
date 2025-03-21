import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FetchingNews = () => {
  const navigate = useNavigate();

  // Automatically navigate after loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/article-view');
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'white',
        padding: '0 24px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <CircularProgress
          size={40}
          sx={{
            color: '#6C5CE7',
          }}
        />
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Fetching Your News
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            textAlign: 'center',
          }}
        >
          Exploring and curating the best news for you & your business
        </Typography>
      </Box>
    </Box>
  );
};

export default FetchingNews; 