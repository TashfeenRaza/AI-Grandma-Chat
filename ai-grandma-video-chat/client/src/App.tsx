import { Routes, Route } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import HomePage from './components/HomePage';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        backgroundImage: 'url(/images/vintage-paper-bg.jpg)',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      <Header />
      <Container 
        component="main" 
        maxWidth="lg" 
        sx={{ 
          flexGrow: 1, 
          py: 4,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Container>
      <Footer />
    </Box>
  );
}

export default App; 