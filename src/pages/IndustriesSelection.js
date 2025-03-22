import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, CircularProgress, InputBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchIndustries } from '../services/api';
import logo from '../assets/logo_v2.png';
import searchIcon from '../assets/search.svg';
import languageIcon from '../assets/language_v2.svg';
import { DARK_GREY_COLOR, GREY_COLOR, LIGHT_GREY_COLOR, LINE_COLOR, PRIMARY_COLOR, PRIMARY_COLOR_BORDER, PRIMARY_LIGHT_COLOR, SEARCH_BAR_COLOR } from '../constants/constant';
import { Factory, Star } from '@mui/icons-material';
import { capitalizeWords } from '../util/util';
import FetchingNews from './FetchingNews';

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
  const [isLoading, setIsLoading] = useState(false);
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
    // Get parent industries of selected sub-industries
    const selectedIndustriesMap = new Map();
    
    industries.forEach(industry => {
      industry.subIndustries.forEach(subIndustry => {
        if (selectedSubIndustries.includes(subIndustry)) {
          if (!selectedIndustriesMap.has(industry.name)) {
            selectedIndustriesMap.set(industry.name, []);
          }
          selectedIndustriesMap.get(industry.name).push(subIndustry);
        }
      });
    });

    // Create URL parameters
    const params = new URLSearchParams({
      q: searchQuery,
      industries: Array.from(selectedIndustriesMap.keys()).join(','),
      keywords: selectedSubIndustries.join(','),
    });

    // Navigate to fetching-news with these parameters
    navigate(`/fetching-news?${params.toString()}`);
  };

  const handleImageError = (industryName) => {
    setFailedImages(prev => new Set([...prev, industryName]));
  };

  const filteredIndustries = industries.filter(industry => {
    return industry
  });

  if (loading) {
    return (
      <Box sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'white',
        width: '100%',
      }}>
        <Box sx={{ width: '90%', height: '170px', borderRadius: '12px', animation: 'shimmer 1.5s infinite linear', background: 'linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)', backgroundSize: '1000px 100%' }} />
        <Box sx={{ width: '90%', mt: 3 }}>
          <Box sx={{ width: '100%', height: '24px', borderRadius: '4px', animation: 'shimmer 1.5s infinite linear', background: 'linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)', backgroundSize: '1000px 100%' }} />
          <Box sx={{ width: '100%', height: '16px', borderRadius: '4px', mt: 1, animation: 'shimmer 1.5s infinite linear', background: 'linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)', backgroundSize: '1000px 100%' }} />
          <Box sx={{ width: '100%', height: '16px', borderRadius: '4px', mt: 3, animation: 'shimmer 1.5s infinite linear', background: 'linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)', backgroundSize: '1000px 100%' }} />
          <Box sx={{ width: '100%', height: '16px', borderRadius: '4px', mt: 3, animation: 'shimmer 1.5s infinite linear', background: 'linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)', backgroundSize: '1000px 100%' }} />
          <Box sx={{ width: '100%', height: '16px', borderRadius: '4px', mt: 3, animation: 'shimmer 1.5s infinite linear', background: 'linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)', backgroundSize: '1000px 100%' }} />
          <Box sx={{ width: '100%', height: '16px', borderRadius: '4px', mt: 3, animation: 'shimmer 1.5s infinite linear', background: 'linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)', backgroundSize: '1000px 100%' }} />
          <Box sx={{ width: '100%', height: '16px', borderRadius: '4px', mt: 3, animation: 'shimmer 1.5s infinite linear', background: 'linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)', backgroundSize: '1000px 100%' }} />
          <Box sx={{ width: '100%', height: '16px', borderRadius: '4px', mt: 1, animation: 'shimmer 1.5s infinite linear', background: 'linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)', backgroundSize: '1000px 100%' }} />
          <Box sx={{ width: '100%', height: '16px', borderRadius: '4px', mt: 1, animation: 'shimmer 1.5s infinite linear', background: 'linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)', backgroundSize: '1000px 100%' }} />
          <Box sx={{ width: '100%', height: '16px', borderRadius: '4px', mt: 1, animation: 'shimmer 1.5s infinite linear', background: 'linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)', backgroundSize: '1000px 100%' }} />
          <Box sx={{ width: '100%', height: '16px', borderRadius: '4px', mt: 1, animation: 'shimmer 1.5s infinite linear', background: 'linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)', backgroundSize: '1000px 100%' }} />
          <Box sx={{ width: '100%', height: '16px', borderRadius: '4px', mt: 1, animation: 'shimmer 1.5s infinite linear', background: 'linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)', backgroundSize: '1000px 100%' }} />
          <Box sx={{ width: '100%', height: '16px', borderRadius: '4px', mt: 1, animation: 'shimmer 1.5s infinite linear', background: 'linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)', backgroundSize: '1000px 100%' }} />
          <Box sx={{ width: '100%', height: '16px', borderRadius: '4px', mt: 1, animation: 'shimmer 1.5s infinite linear', background: 'linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)', backgroundSize: '1000px 100%' }} />
          <Box sx={{ width: '100%', height: '16px', borderRadius: '4px', mt: 1, animation: 'shimmer 1.5s infinite linear', background: 'linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)', backgroundSize: '1000px 100%' }} />
        </Box>
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

  if (isLoading) {
    return (
      <FetchingNews />
    );
  }

  return (
    <Box sx={{ minHeight: '100vh',  display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Box sx={{ 
            bgcolor: PRIMARY_COLOR,
            padding: '16px 24px',
            maxWidth: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'fixed',
            zIndex: 1000,
            width: '100%',
            top: 5,
          }}>
        <img 
          src={logo} 
          alt="Buzzar Brief Logo" 
          style={{ width: '103px' }} 
        />
        <img 
          src={languageIcon} 
          alt="Language" 
          style={{ height: '22px', width: '22px', objectFit: 'contain' }} 
        /> 
      </Box>

      {/* Scrollable Content Container */}
      <Box sx={{
        top: '69px',
        position:"absolute",
        flex: 1,
        minWidth: '100%',
        minHeight: '100vh',
        backgroundColor: '#F9FAFB',
      }}>
        {/* Search Bar */}
        <Box sx={{ padding: '16px 24px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: SEARCH_BAR_COLOR,
              borderRadius: '100px',
              padding: '14px 38px 14px 20px',
              fontFamily: 'Inter',
              fontSize: '14px',
              fontWeight: '400',
            }}
          >
            <img 
              src={searchIcon} 
              alt="search" 
              style={{ width: '20px', height: '20px', objectFit: 'contain' }} 
            />
            <InputBase
              sx={{
                fontFamily: 'Inter',
                fontSize: '14px',
                fontWeight: '400',
                paddingLeft: '10px',
              }}
              placeholder="Search for interests"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ padding: '0 24px', display: 'flex', flexDirection: 'column' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: '900', fontSize: '24px', fontFamily: 'Times'}}>
                Customise Your News Feed&nbsp;<Star sx={{ color: '#EAB308', fontWeight: '400', fontSize: '15px' }} />
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: '400', fontSize: '12px', fontFamily: 'Inter',color: GREY_COLOR, paddingTop: '16px' ,paddingBottom: '24px'}}>
              Choose atleast 3 interests to get started
            </Typography>
          </Box>

          {/* Industries List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', }}>
            {filteredIndustries.map((industry) => (
              <Box key={industry.id}>
                <Box sx={{ display: 'block', flexDirection: 'column', width:"100%",height:"1px", backgroundColor: LINE_COLOR, padding:"0px",}}/>
                {/* Industry Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', padding:"24px 0px" }}>
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '100%',
                    border:"1px solid #EBE9FF",
                    padding:"8px",
                    marginRight:"10px",
                    backgroundColor:"#FFFFFD",
                    boxShadow: `0px 5px 5px ${LIGHT_GREY_COLOR}` }}
                  >
                    <Factory sx={{ color: '#EAB308', fontWeight: '600', fontSize: '14px' }} />
                  </Box>
                  <Typography sx={{ fontWeight: '600', fontSize: '16px', fontFamily: 'Inter' }}>
                    {industry.name}
                  </Typography>
                </Box>

                {/* Sub Industries */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', paddingBottom:"24px", gap:"16px" }}>
                  {industry.subIndustries.map((subIndustry) => (
                    <Chip
                      key={subIndustry}
                      label={capitalizeWords(subIndustry)}
                      onClick={() => handleSubIndustryToggle(subIndustry)}
                      sx={{
                        borderRadius: '30px',
                        fontSize: '12px',
                        fontWeight: '400',
                        fontFamily: 'Inter',
                        padding: '16px 12px',
                        backgroundColor: selectedSubIndustries.includes(subIndustry) ? PRIMARY_LIGHT_COLOR : LIGHT_GREY_COLOR,
                        border: '1px solid',
                        borderColor: selectedSubIndustries.includes(subIndustry) ? PRIMARY_COLOR_BORDER : 'transparent',
                        color: selectedSubIndustries.includes(subIndustry) ? DARK_GREY_COLOR : DARK_GREY_COLOR,
                        '&:hover': {
                          backgroundColor: selectedSubIndustries.includes(subIndustry) ? PRIMARY_LIGHT_COLOR :  LIGHT_GREY_COLOR,
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
      
        <Button
          onClick={handleGetNews}
          disabled={selectedSubIndustries.length < 3 && !searchQuery}
          sx={{
            position: 'fixed',
            bottom: 20,
            width: '80%',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '312px',
            borderRadius: 28,
            border: '1px solid',
            borderColor: selectedSubIndustries.length < 3 && !searchQuery ? '#EBE9FF' : PRIMARY_COLOR,
            backgroundColor: selectedSubIndustries.length < 3 && !searchQuery ? LIGHT_GREY_COLOR : PRIMARY_COLOR,
            zIndex: 1000,
            fontSize: '16px',
            fontWeight: '600',
            fontFamily: 'Inter',
            color: 'white',
            padding: '15px 0px',

          }}
        >
          GET NEWS
        </Button>
    </Box>
  );
};

export default IndustriesSelection; 