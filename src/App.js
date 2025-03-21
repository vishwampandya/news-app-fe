import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Splash from './pages/Splash';
import ArticleView from './pages/Article-view';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
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
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/splash" element={<Splash />} />
            <Route path="/article-view" element={<ArticleView />} />
            <Route path="/" element={<Navigate to="/splash" replace />} />
          </Routes>
        </ThemeProvider>
      </Router>
    </React.StrictMode>
  );
}

export default App;
