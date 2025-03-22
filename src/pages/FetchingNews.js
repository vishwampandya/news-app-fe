import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const FetchingNews = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Automatically navigate after loading
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const industries = searchParams.get('industries');

    const timer = setTimeout(() => {
      // Pass the industries as a single string
      const params = new URLSearchParams({
        industry: industries || '',
        keyword: 'startup',
        india_focus: 'true',
        business_only: 'true'
      });
      navigate(`/article-view?${params.toString()}`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, location]);

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