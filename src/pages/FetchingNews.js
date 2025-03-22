import React from 'react';
import { Box, Typography } from '@mui/material';
import loader from '../assets/loader.svg';
import backgroundImage from '../assets/fetching.png';
import { GREY_COLOR } from '../constants/constant';
import { useLocation, useNavigate } from 'react-router-dom';

const FetchingNews = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Automatically navigate after loading
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const industries = searchParams.get('industries');
    const keywords = searchParams.get('keywords');

    const timer = setTimeout(() => {
      // Pass both industries and keywords to article view
      const articleParams = new URLSearchParams({
        industry: industries || '',
        keyword: keywords || '',
        india_focus: 'true',
        business_only: 'true'
      });
      navigate(`/article-view?${articleParams.toString()}`);
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
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img 
          src={loader} 
          alt="Buzzar Brief Logo" 
          style={{ 
            width: '130px',
            animation: 'spin 5s linear infinite'
          }} 
        />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <Typography
          sx={{
            fontSize: '24px',
            fontWeight: '700',
            fontFamily: 'Times',
            marginTop: '10px',
          }}
        >
          Fetching Your News
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            fontFamily: 'Inter',
            fontWeight: '400',
            fontSize: '12px',
            color: GREY_COLOR,
            marginTop: '16px',
          }}
        >
          Exploring and curating the best news for
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            fontFamily: 'Inter',
            fontWeight: '400',
            fontSize: '12px',
            color: GREY_COLOR,
          }}
        >
          you & your business
        </Typography>
      </Box>
    </Box>
  );
};

export default FetchingNews; 