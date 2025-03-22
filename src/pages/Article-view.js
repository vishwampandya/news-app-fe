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
  Link,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShareIcon from '@mui/icons-material/Share';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { fetchArticles } from '../services/api';
import { PRIMARY_COLOR } from '../constants/constant';
import logo from '../assets/logo_v2.png';
import languageIcon from '../assets/language_v2.svg';
import bookmarkIcon from '../assets/save.svg';
import shareIcon from '../assets/share.svg';
import volumeIcon from '../assets/sound.svg';
import linkIcon from '../assets/link.svg';

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
        console.log(data);
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
      // Only allow swipe up or swipe down if not on first article
      if (event.dir === 'Up' || (event.dir === 'Down' && activeStep > 0)) {
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
            bgcolor: PRIMARY_COLOR,
            padding: '20px 24px',
            maxWidth: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'fixed',
            zIndex: 1000,
            width: '100%',
            top: 0,
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

      {/* Articles Container */}
      <Box sx={{ position: 'absolute', top: 50, left: 0, right: 0, bottom: 0 , overflow: 'hidden' }}>
        {/* All articles stacked on top of each other with proper z-index */}
        
        {/* Previous Article - comes from top when swiping down */}
        {prevArticle && (
          <ArticleCard
            article={prevArticle}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              // Start at -100% (above viewport) and move down when swiping down
              transform: `translateY(${swipeProgress < 0 ? -100 + Math.abs(swipeProgress) * 100 : -100}%)`,
              // Fade in when swiping down
              opacity: swipeProgress < 0 ? Math.abs(swipeProgress) : 0,
              transition: isAnimating ? 'transform 0.3s ease-out, opacity 0.3s ease-out' : 'none',
              zIndex: 3
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
            height: '100%',
            // When swiping up: move up; when swiping down: stay in place
            transform: `translateY(${swipeProgress > 0 ? -swipeProgress * 50 : 0}%)`,
            // Fade out in both directions
            opacity: 1 - Math.abs(swipeProgress),
            transition: isAnimating ? 'transform 0.3s ease-out, opacity 0.3s ease-out' : 'none',
            zIndex: 2
          }}
        />

        {/* Next Article - starts below and fades in when swiping up */}
        {nextArticle && (
          <ArticleCard
            article={nextArticle}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              // Always positioned underneath, move up slightly when being revealed
              transform: `translateY(${swipeProgress > 0 ? 50 - swipeProgress * 50 : 50}%)`,
              // Fade in when swiping up
              opacity: swipeProgress > 0 ? swipeProgress : 0,
              transition: isAnimating ? 'transform 0.3s ease-out, opacity 0.3s ease-out' : 'none',
              zIndex: 1
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
              color: PRIMARY_COLOR,
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


      {/* Action Buttons */}
      <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', padding: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Read More Link */}
        <Box sx={{ padding: '8px 16px', borderRadius: '30px',border: `1px solid ${PRIMARY_COLOR}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '125px' }}
         onClick={() => window.open(article.url, '_blank')} >
          <Typography
            sx={{
              color: PRIMARY_COLOR,
              fontWeight: 400,
              fontSize: '14px',
              fontFamily: 'Inter',
              cursor: 'pointer',
            }}
          >
            Read More
          </Typography>
          <img src={linkIcon} alt="arrow right" style={{ width: '12px', height: '12px' }}/>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box sx={{  borderRadius: '50%', boxShadow: '0px 0px 8px 3px rgba(0, 0, 0, 0.1)', backgroundColor:PRIMARY_COLOR ,width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={bookmarkIcon} alt="bookmark" style={{ width: '20px', height: '20px' }}/>
          </Box>
          <Box sx={{  borderRadius: '50%',boxShadow: '0px 0px 8px 3px rgba(0, 0, 0, 0.1)', backgroundColor:PRIMARY_COLOR ,width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={shareIcon} alt="bookmark" style={{ width: '20px', height: '20px' }}/>
          </Box>
          <Box sx={{  borderRadius: '50%',boxShadow: '0px 0px 8px 3px rgba(0, 0, 0, 0.1)', backgroundColor:PRIMARY_COLOR ,width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={volumeIcon} alt="bookmark" style={{ width: '20px', height: '20px' }}/>
          </Box>
        </Box>

        
      </Box>
    </Box>
  </Box>
);

export default ArticleView;