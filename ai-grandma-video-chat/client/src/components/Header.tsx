import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import ElderlyWomanIcon from '@mui/icons-material/ElderlyWoman';

const Header = () => {
  return (
    <AppBar 
      position="static" 
      color="primary" 
      elevation={0}
      sx={{ 
        backgroundColor: 'rgba(123, 92, 61, 0.9)',
        borderBottom: '1px solid rgba(123, 92, 61, 0.2)'
      }}
    >
      <Toolbar>
        <ElderlyWomanIcon sx={{ mr: 2 }} />
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontFamily: 'Playfair Display, serif',
            fontWeight: 600,
            letterSpacing: '0.5px'
          }}
        >
          AI Grandma Video Chat
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 