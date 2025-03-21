import React from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Button,
  Container,
  Stack,
  InputBase
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ShareIcon from '@mui/icons-material/Share';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useNavigate } from 'react-router-dom';

const ArticleView = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      {/* Header */}
      <Box sx={{ 
        py: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between'
      }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
        </Stack>
        
        <Stack direction="row" spacing={2} alignItems="center">
          <Box component="img" src="/lang.png" alt="Text size" sx={{ width: 24, height: 24 }} />
          <Button
            startIcon={<NotificationsOutlinedIcon />}
            sx={{
              background: 'linear-gradient(90deg, #6B4EFF 0%, #9B7BFF 100%)',
              color: 'white',
              borderRadius: '50px',
              textTransform: 'none',
              px: 2.5,
              '&:hover': {
                background: 'linear-gradient(90deg, #6B4EFF 0%, #9B7BFF 100%)',
              }
            }}
          >
            Subscribe
          </Button>
        </Stack>
      </Box>

      {/* Search Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#F8F9FB',
          borderRadius: '12px',
          p: 1,
          mb: 3
        }}
      >
        <SearchIcon sx={{ color: 'text.secondary', mx: 1 }} />
        <InputBase
          placeholder="Search Article"
          sx={{ ml: 1, flex: 1 }}
        />
      </Box>

      {/* Article Content */}
      <Box sx={{ mt: 2 }}>
        <img 
          src="/sample_article.png" 
          alt="Article header"
          style={{ 
            width: '100%',
            borderRadius: '8px',
            marginBottom: '20px'
          }}
        />
        
        <Typography variant="h4" sx={{ mb: 2 }}>
          Unmasking the Truth: Investigate report Exposes Widespread Political Cor...
        </Typography>

        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ 
            color: 'text.secondary',
            mb: 3
          }}
        >
          <Typography>5 mins read</Typography>
          <Typography>•</Typography>
          <Typography>3 day ago</Typography>
          <Typography>•</Typography>
          <Typography>245</Typography>
        </Stack>

        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          In a groundbreaking investigative report, a team of journalists has unveiled a web of political corruption that has been shrouded in secrecy for far too long. This in-depth exposé shines a light on the dark underbelly of power, revealing shocking revelations and implicating high-profile figures in a complex network of unethical practices.
        </Typography>

        {/* Read More Button */}
        <Button
          variant="outlined"
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            borderColor: '#6B4EFF',
            color: '#6B4EFF',
            px: 3,
            mb: 3
          }}
        >
          Read More
        </Button>

        {/* Action Buttons */}
        <Stack 
          direction="row" 
          spacing={2} 
          justifyContent="flex-end"
          sx={{ mt: 2 }}
        >
          <IconButton sx={{ bgcolor: '#6B4EFF', color: 'white' }}>
            <ShareIcon />
          </IconButton>
          <IconButton sx={{ bgcolor: '#6B4EFF', color: 'white' }}>
            <VolumeUpIcon />
          </IconButton>
        </Stack>
      </Box>
    </Container>
  );
};

export default ArticleView; 