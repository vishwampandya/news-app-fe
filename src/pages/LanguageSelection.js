import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LanguageSelection = () => {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = React.useState('en');

  const handleConfirm = () => {
    // Here you can handle the language selection before navigation
    navigate('/customize-feed');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header with Logo */}
      <Box
        sx={{
          bgcolor: '#6C5CE7',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <img 
          src="/splash_screen_logo.png" 
          alt="Buzzar Brief Logo" 
          style={{ 
            height: '32px',
            objectFit: 'contain',
          }} 
        />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 'bold',
            textAlign: 'left',
          }}
        >
          Select Language
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
          }}
        >
          {/* English Option */}
          <Paper
            elevation={0}
            onClick={() => setSelectedLang('en')}
            sx={{
              flex: 1,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              bgcolor: selectedLang === 'en' ? '#EBE9FF' : '#F8F9FE',
              border: '1px solid',
              borderColor: selectedLang === 'en' ? '#6C5CE7' : 'transparent',
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: '#6C5CE7',
                fontWeight: 'bold',
              }}
            >
              A
            </Typography>
            <Typography>English</Typography>
          </Paper>

          {/* Hindi Option */}
          <Paper
            elevation={0}
            onClick={() => setSelectedLang('hi')}
            sx={{
              flex: 1,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              bgcolor: selectedLang === 'hi' ? '#EBE9FF' : '#F8F9FE',
              border: '1px solid',
              borderColor: selectedLang === 'hi' ? '#6C5CE7' : 'transparent',
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: '#6C5CE7',
                fontWeight: 'bold',
              }}
            >
              अ
            </Typography>
            <Typography>हिंदी</Typography>
          </Paper>
        </Box>
      </Box>

      {/* Confirm Button */}
      <Box
        sx={{
          padding: '16px 24px',
        }}
      >
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleConfirm}
          sx={{
            borderRadius: 28,
            backgroundColor: '#6C5CE7',
            py: 1.5,
            '&:hover': {
              backgroundColor: '#5849c4',
            },
          }}
        >
          CONFIRM
        </Button>
      </Box>
    </Box>
  );
};

export default LanguageSelection; 