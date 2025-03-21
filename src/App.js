import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import Splash from './pages/Splash';
import ArticleView from './pages/Article-view';
import IndustriesSelection from './pages/IndustriesSelection';
import FetchingNews from './pages/FetchingNews';
import LanguageSelection from './pages/LanguageSelection';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6C5CE7',
    },
  },
  typography: {
    h4: {
      fontWeight: 700,
    },
  },
});

function App() {
  return (
    <React.StrictMode>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/splash" element={<Splash />} />
            <Route path="/language-selection" element={<LanguageSelection />} />
            <Route path="/fetching-news" element={<FetchingNews />} />
            <Route path="/article-view" element={<ArticleView />} />
            <Route path="/customize-feed" element={<IndustriesSelection />} />
            <Route path="/" element={<Navigate to="/splash" replace />} />
          </Routes>
        </ThemeProvider>
      </Router>
    </React.StrictMode>
  );
}

export default App;
