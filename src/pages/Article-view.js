import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton,
  Button,
  CircularProgress,
  Stack,
  InputBase,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShareIcon from '@mui/icons-material/Share';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { fetchArticles } from '../services/api';

// Placeholder image for articles without images
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80';

const ArticleView = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all query parameters
        const params = {
          industry: new URLSearchParams(location.search).get('industry'),
          keyword: new URLSearchParams(location.search).get('keyword'),
          india_focus: new URLSearchParams(location.search).get('india_focus'),
          business_only: new URLSearchParams(location.search).get('business_only')
        };

        const data = await fetchArticles(params);
        if (data && data.articles) {
          setArticles(data.articles);
        } else {
          setError('No articles found');
        }
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
    onSwiping: (event) => {
      if (event.dir === 'Up' || event.dir === 'Down') {
        // Calculate swipe progress (0 to 1)
        const progress = Math.min(Math.abs(event.deltaY) / 200, 1);
        setSwipeProgress(event.dir === 'Up' ? progress : -progress);
      }
    },
    onSwipedUp: () => {
      if (activeStep < articles.length - 1 && swipeProgress > 0.5) {
        setIsAnimating(true);
        setSwipeProgress(1);
        setTimeout(() => {
          setActiveStep(prev => prev + 1);
          setSwipeProgress(0);
          setIsAnimating(false);
        }, 300);
      } else {
        setSwipeProgress(0);
      }
    },
    onSwipedDown: () => {
      if (activeStep > 0 && swipeProgress < -0.5) {
        setIsAnimating(true);
        setSwipeProgress(-1);
        setTimeout(() => {
          setActiveStep(prev => prev - 1);
          setSwipeProgress(0);
          setIsAnimating(false);
        }, 300);
      } else {
        setSwipeProgress(0);
      }
    },
    onTouchEndOrOnMouseUp: () => {
      if (Math.abs(swipeProgress) <= 0.5) {
        setSwipeProgress(0);
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    delta: 10
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
  const nextArticle = articles[activeStep + 1];
  const prevArticle = articles[activeStep - 1];

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: '#6C5CE7',
        p: 2,
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2
        }}>
          <img 
            src="/splash_screen_logo.png" 
            alt="Buzzar Brief Logo" 
            style={{ height: '32px' }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#FFD93D',
                color: 'black',
                borderRadius: 28,
                px: 3,
                '&:hover': { bgcolor: '#FFD93D' }
              }}
            >
              Subscribe
            </Button>
            <img 
              src="/lang.png" 
              alt="Language" 
              style={{ 
                height: '28px',
                width: '28px',
                objectFit: 'contain',
                cursor: 'pointer'
              }}
            />
          </Box>
        </Box>

        {/* Search Bar */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          p: '8px 16px',
        }}>
          <SearchIcon sx={{ color: 'white', mr: 1 }} />
          <InputBase
            placeholder="Search Article"
            sx={{ 
              flex: 1,
              color: 'white',
              '&::placeholder': { color: 'rgba(255, 255, 255, 0.7)' }
            }}
          />
        </Box>
      </Box>

      {/* Articles Container */}
      <Box sx={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        {/* Previous Article */}
        {prevArticle && (
          <ArticleCard
            article={prevArticle}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              transform: `translateY(${-100 + (swipeProgress < 0 ? Math.abs(swipeProgress) * 100 : 0)}%)`,
              transition: isAnimating ? 'transform 0.3s ease-out' : 'none',
              zIndex: swipeProgress < 0 ? 2 : 0
            }}
          />
        )}

        {/* Current Article */}
        <ArticleCard
          article={currentArticle}
          handlers={handlers}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${swipeProgress * 100}%)`,
            transition: isAnimating ? 'transform 0.3s ease-out' : 'none',
            zIndex: 1
          }}
        />

        {/* Next Article */}
        {nextArticle && (
          <ArticleCard
            article={nextArticle}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              transform: `translateY(${100 - (swipeProgress > 0 ? swipeProgress * 100 : 0)}%)`,
              transition: isAnimating ? 'transform 0.3s ease-out' : 'none',
              zIndex: swipeProgress > 0 ? 2 : 0
            }}
          />
        )}
      </Box>
    </Box>
  );
};

// Separate ArticleCard component for better organization
const ArticleCard = ({ article, handlers = {}, sx = {} }) => (
  <Box
    {...handlers}
    sx={{
      height: '100%',
      overflow: 'auto',
      bgcolor: 'white',
      ...sx
    }}
  >
    {/* Article Image */}
    <Box sx={{
      width: '100%',
      height: '240px',
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
      }
    }}>
      <img 
        src={DEFAULT_IMAGE} 
        alt={article.title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      {/* Categories on image */}
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: 16, 
          left: 16, 
          zIndex: 1,
          display: 'flex',
          gap: 1
        }}
      >
        {article.categories.map((category) => (
          <Chip
            key={category}
            label={category}
            size="small"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              color: '#6C5CE7',
              fontWeight: 500
            }}
          />
        ))}
      </Box>
    </Box>

    {/* Article Content */}
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {Math.ceil(article.content.length / 1000)} mins read
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          • {new Date(article.published_date).toLocaleDateString()}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          • {article.source}
        </Typography>
      </Box>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', lineHeight: 1.4 }}>
        {article.title}
      </Typography>

      <Typography 
        variant="body1" 
        sx={{ 
          color: 'text.secondary',
          lineHeight: 1.6,
          mb: 3
        }}
      >
        {article.summary || article.content.slice(0, 300) + '...'}
      </Typography>

      {/* Read More Link */}
      <Typography
        component="a"
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: '#6C5CE7',
          textDecoration: 'none',
          fontWeight: 500,
          display: 'block',
          mb: 3,
          cursor: 'pointer',
          '&:hover': {
            textDecoration: 'underline'
          }
        }}
      >
        Read More →
      </Typography>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <IconButton sx={{ color: '#6C5CE7' }}>
          <BookmarkBorderIcon />
        </IconButton>
        <IconButton sx={{ color: '#6C5CE7' }}>
          <ShareIcon />
        </IconButton>
        <IconButton sx={{ color: '#6C5CE7' }}>
          <VolumeUpIcon />
        </IconButton>
      </Stack>
    </Box>
  </Box>
);

export default ArticleView; 