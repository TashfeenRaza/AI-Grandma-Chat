import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        px: 2, 
        mt: 'auto',
        backgroundColor: 'rgba(123, 92, 61, 0.1)',
        borderTop: '1px solid rgba(123, 92, 61, 0.2)'
      }}
    >
      <Typography 
        variant="body2" 
        color="text.secondary" 
        align="center"
        sx={{ fontFamily: 'Georgia, serif' }}
      >
        {'© '}
        <Link color="inherit" href="#">
          AI Grandma Video Chat
        </Link>{' '}
        {new Date().getFullYear()}
        {'. All rights reserved.'}
      </Typography>
    </Box>
  );
};

export default Footer; 