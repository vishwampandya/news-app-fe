import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton,
  CircularProgress,
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { fetchArticles } from '../services/api';

const ArticleView = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const industry = searchParams.get('industry');
    const keyword = searchParams.get('keyword');

    const loadArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchArticles({ industry, keyword });
        setArticles(data.articles);
      } catch (err) {
        console.error('Error loading articles:', err);
        setError(err.message || 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [location]);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (activeStep < articles.length - 1) {
        setActiveStep(prev => prev + 1);
      }
    },
    onSwipedRight: () => {
      if (activeStep > 0) {
        setActiveStep(prev => prev - 1);
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const currentArticle = articles[activeStep];

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        py: 2, 
        px: 2,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
      }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {activeStep + 1} of {articles.length}
        </Typography>
      </Box>

      {/* Article Content */}
      {currentArticle && (
        <Box
          {...handlers}
          sx={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: 'white',
            padding: '20px',
            touchAction: 'pan-y pinch-zoom'
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            {currentArticle.title}
          </Typography>

          <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {currentArticle.categories.map((category) => (
              <Typography
                key={category}
                variant="caption"
                sx={{
                  backgroundColor: '#EBE9FF',
                  color: '#6C5CE7',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}
              >
                {category}
              </Typography>
            ))}
          </Box>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {currentArticle.summary || currentArticle.content.slice(0, 300) + '...'}
          </Typography>

          <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {new Date(currentArticle.published_date).toLocaleDateString()}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                • {currentArticle.source}
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={1}>
              <IconButton size="small">
                <ShareIcon />
              </IconButton>
              <IconButton size="small">
                <VolumeUpIcon />
              </IconButton>
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ArticleView; 