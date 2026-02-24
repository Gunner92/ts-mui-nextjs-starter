const themeStyle = require('../../content/data/style.json');
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
    palette: {
        mode: themeStyle.mode ?? 'dark',
        primary: {
            main: themeStyle.primaryColor ?? '#6C63FF'
        },
        secondary: {
            main: themeStyle.secondaryColor ?? '#00D9FF'
        },
        background: {
            default: '#0a0a1a',
            paper: '#12122a'
        },
        text: {
            primary: '#ffffff',
            secondary: '#a0a0b8'
        }
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            letterSpacing: '-0.02em'
        },
        h2: {
            fontWeight: 700,
            letterSpacing: '-0.01em'
        },
        h3: {
            fontWeight: 600
        },
        h4: {
            fontWeight: 600
        },
        h5: {
            fontWeight: 500
        },
        h6: {
            fontWeight: 500
        },
        body1: {
            lineHeight: 1.7
        },
        body2: {
            lineHeight: 1.6
        }
    },
    shape: {
        borderRadius: 16
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 12,
                    fontWeight: 600,
                    padding: '10px 24px'
                },
                contained: {
                    background: 'linear-gradient(135deg, #6C63FF 0%, #00D9FF 100%)',
                    boxShadow: '0 4px 20px rgba(108, 99, 255, 0.3)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5B52EE 0%, #00C4E6 100%)',
                        boxShadow: '0 6px 30px rgba(108, 99, 255, 0.5)'
                    }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    background: 'rgba(18, 18, 42, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(108, 99, 255, 0.15)',
                    borderRadius: 20,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        border: '1px solid rgba(108, 99, 255, 0.4)',
                        boxShadow: '0 20px 60px rgba(108, 99, 255, 0.15)'
                    }
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'rgba(10, 10, 26, 0.85)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(108, 99, 255, 0.1)'
                }
            }
        }
    }
});

theme = responsiveFontSizes(theme);

export default theme;
