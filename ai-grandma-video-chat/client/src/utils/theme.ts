import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7b5c3d', // Vintage brown
      light: '#a48868',
      dark: '#533f2a',
      contrastText: '#fff',
    },
    secondary: {
      main: '#a7925d', // Gold/sepia tint
      light: '#c0af8b',
      dark: '#776839',
      contrastText: '#000',
    },
    background: {
      default: '#f5f2e9', // Cream colored paper
      paper: '#fffaf0',   // Floral white for cards/containers
    },
    text: {
      primary: '#3e2f1a',
      secondary: '#5e5142',
    },
  },
  typography: {
    fontFamily: [
      'Playfair Display',
      'Georgia',
      'serif',
    ].join(','),
    h1: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: 'Georgia, serif',
    },
    button: {
      fontFamily: 'Georgia, serif',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 3px 15px rgba(0,0,0,0.1)',
          border: '1px solid rgba(123, 92, 61, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 10px rgba(0,0,0,0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(rgba(255, 250, 240, 0.9), rgba(245, 242, 233, 0.8))',
          border: '1px solid rgba(123, 92, 61, 0.2)',
          padding: '16px',
        },
      },
    },
  },
});

export default theme; 