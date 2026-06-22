import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// ─────────────────────────────────────────────────────────────────────────────
//  ATELIER / INDEX  —  an editorial, warm-paper design system.
//  Dominant warm bone paper + deep warm ink, a single sharp vermilion accent.
//  Fraunces (display) · Hanken Grotesk (body/UI) · JetBrains Mono (meta).
//  Colour tokens are mirrored as CSS custom properties in _app.tsx GlobalStyles.
// ─────────────────────────────────────────────────────────────────────────────

export const tokens = {
    paper: '#F4EEE2', // page background — warm bone
    paper2: '#FBF7EF', // raised surfaces / cards
    paper3: '#ECE3D3', // sunken / alternate fills
    ink: '#211B16', // near-black, warm brown
    ink2: '#665B4E', // muted body text (~5.9:1 on paper)
    ink3: '#6E6354', // faint meta / captions — darkened to clear WCAG AA (~5.1:1) while staying lighter than ink2
    line: 'rgba(33, 27, 22, 0.14)', // hairline rule
    lineStrong: 'rgba(33, 27, 22, 0.30)',
    accent: '#D2451E', // vermilion — the one sharp accent
    accentDeep: '#A8330F', // hover / links (better contrast on paper)
    accentSoft: 'rgba(210, 69, 30, 0.10)'
};

const DISPLAY = '"Fraunces", "Georgia", "Times New Roman", serif';
const BODY = '"Hanken Grotesk", "Helvetica Neue", Arial, sans-serif';
const MONO = '"JetBrains Mono", "SFMono-Regular", ui-monospace, monospace';

let theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: tokens.accent, dark: tokens.accentDeep, contrastText: tokens.paper2 },
        secondary: { main: tokens.ink, contrastText: tokens.paper2 },
        background: { default: tokens.paper, paper: tokens.paper2 },
        text: { primary: tokens.ink, secondary: tokens.ink2 },
        divider: tokens.line
    },
    typography: {
        fontFamily: BODY,
        h1: { fontFamily: DISPLAY, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.02 },
        h2: { fontFamily: DISPLAY, fontWeight: 500, letterSpacing: '-0.018em', lineHeight: 1.06 },
        h3: { fontFamily: DISPLAY, fontWeight: 500, letterSpacing: '-0.012em', lineHeight: 1.1 },
        h4: { fontFamily: DISPLAY, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.15 },
        h5: { fontFamily: DISPLAY, fontWeight: 500, lineHeight: 1.2 },
        h6: { fontFamily: DISPLAY, fontWeight: 600, lineHeight: 1.25 },
        subtitle1: { fontWeight: 500 },
        subtitle2: { fontWeight: 600 },
        body1: { lineHeight: 1.65, letterSpacing: '0.002em' },
        body2: { lineHeight: 1.6 },
        button: { fontWeight: 600, letterSpacing: '0.01em' }
    },
    shape: { borderRadius: 4 },
    components: {
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontFamily: BODY,
                    fontWeight: 600,
                    borderRadius: 3,
                    padding: '12px 22px',
                    fontSize: '0.95rem',
                    transition: 'transform .25s cubic-bezier(.2,.7,.2,1), background-color .25s ease, color .25s ease, border-color .25s ease'
                },
                contained: {
                    backgroundColor: tokens.ink,
                    color: tokens.paper2,
                    boxShadow: 'none',
                    '&:hover': { backgroundColor: tokens.accentDeep, color: tokens.paper2, boxShadow: 'none' }
                },
                outlined: {
                    borderColor: tokens.lineStrong,
                    color: tokens.ink,
                    borderWidth: '1.5px',
                    '&:hover': { borderColor: tokens.ink, backgroundColor: tokens.ink, color: tokens.paper2, borderWidth: '1.5px' }
                },
                text: {
                    color: tokens.ink,
                    '&:hover': { backgroundColor: 'transparent', color: tokens.accentDeep }
                },
                sizeLarge: { padding: '15px 30px', fontSize: '1rem' },
                sizeSmall: { padding: '7px 14px', fontSize: '0.82rem' }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: tokens.paper2,
                    border: `1px solid ${tokens.line}`,
                    borderRadius: 6,
                    boxShadow: 'none',
                    backgroundImage: 'none'
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: { fontFamily: MONO, fontWeight: 500, letterSpacing: '0.04em' }
            }
        },
        MuiLink: {
            styleOverrides: {
                root: { transition: 'color .2s ease' }
            }
        },
        MuiCssBaseline: {
            styleOverrides: {
                body: { backgroundColor: tokens.paper }
            }
        }
    }
});

theme = responsiveFontSizes(theme, { factor: 2.2 });

export const fonts = { display: DISPLAY, body: BODY, mono: MONO };
export default theme;
