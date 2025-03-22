import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, CircularProgress, InputBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { fetchIndustries } from '../services/api';

const getIndustryIconPath = (industryName) => {
  return `/industry-icons/${industryName.toLowerCase().replace(/[^a-z0-9]/g, '')}.png`;
};

const IndustriesSelection = () => {
  const navigate = useNavigate();
  const [industries, setIndustries] = useState([]);
  const [selectedSubIndustries, setSelectedSubIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [failedImages, setFailedImages] = useState(new Set());

  useEffect(() => {
    const loadIndustries = async () => {
      try {
        const data = await fetchIndustries();
        setIndustries(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load industries');
      } finally {
        setLoading(false);
      }
    };

    loadIndustries();
  }, []);

  const handleSubIndustryToggle = (subIndustry) => {
    setSelectedSubIndustries(prev => {
      if (prev.includes(subIndustry)) {
        return prev.filter(item => item !== subIndustry);
      } else {
        return [...prev, subIndustry];
      }
    });
  };

  const handleGetNews = () => {
    navigate('/fetching-news');
  };

  const handleImageError = (industryName) => {
    setFailedImages(prev => new Set([...prev, industryName]));
  };

  const filteredIndustries = industries.filter(industry => 
    industry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    industry.subIndustries.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#6C5CE7' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'error.main' }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Logo */}
      <Box sx={{ bgcolor: '#6C5CE7', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img 
          src="/splash_screen_logo.png" 
          alt="Buzzar Brief Logo" 
          style={{ height: '32px', objectFit: 'contain' }} 
        />
        <img 
          src="/language-icon.png" 
          alt="Language" 
          style={{ height: '24px', objectFit: 'contain' }} 
        />
      </Box>

      {/* Scrollable Content Container */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto',
        pb: '80px', // Add padding bottom to prevent content from being hidden behind the button
      }}>
        {/* Search Bar */}
        <Box sx={{ padding: '16px 24px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#F8F9FE',
              borderRadius: '12px',
              padding: '8px 16px',
            }}
          >
            <SearchIcon sx={{ color: '#6C5CE7', mr: 1 }} />
            <InputBase
              placeholder="Search for interests"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
              Customise Your News Feed ⭐
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Choose atleast 3 interests to get started
            </Typography>
          </Box>

          {/* Industries List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {filteredIndustries.map((industry) => (
              <Box key={industry.id}>
                {/* Industry Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <img 
                    src={failedImages.has(industry.name) ? 
                      '/default-industry-icon.png' : 
                      getIndustryIconPath(industry.name)
                    }
                    alt={industry.name}
                    style={{ width: '24px', height: '24px' }}
                    onError={() => handleImageError(industry.name)}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {industry.name}
                  </Typography>
                </Box>

                {/* Sub Industries */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {industry.subIndustries.map((subIndustry) => (
                    <Chip
                      key={subIndustry}
                      label={subIndustry}
                      onClick={() => handleSubIndustryToggle(subIndustry)}
                      sx={{
                        borderRadius: '20px',
                        backgroundColor: selectedSubIndustries.includes(subIndustry) ? '#EBE9FF' : '#F8F9FE',
                        border: '1px solid',
                        borderColor: selectedSubIndustries.includes(subIndustry) ? '#6C5CE7' : 'transparent',
                        color: selectedSubIndustries.includes(subIndustry) ? '#6C5CE7' : 'text.primary',
                        '&:hover': {
                          backgroundColor: selectedSubIndustries.includes(subIndustry) ? '#EBE9FF' : '#F8F9FE',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Get News Button - Sticky */}
      <Box sx={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px 24px',
        backgroundColor: 'white',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
        zIndex: 1000,
      }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleGetNews}
          disabled={selectedSubIndustries.length < 3}
          sx={{
            borderRadius: 28,
            backgroundColor: '#6C5CE7',
            py: 1.5,
            '&:hover': {
              backgroundColor: '#5849c4',
            },
          }}
        >
          GET NEWS
        </Button>
      </Box>
    </Box>
  );
};

export default IndustriesSelection; 