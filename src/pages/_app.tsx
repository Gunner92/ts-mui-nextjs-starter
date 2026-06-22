import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { CacheProvider } from '@emotion/react';
import theme, { tokens } from '../utils/theme';
import createEmotionCache from '../utils/createEmotionCache';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

// Tactile paper grain — feTurbulence baked into a data-URI, laid over everything
// at a whisper of opacity so the page reads like printed stock, never a screen.
const GRAIN =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const globalStyles = (
    <GlobalStyles
        styles={{
            ':root': {
                '--paper': tokens.paper,
                '--paper-2': tokens.paper2,
                '--paper-3': tokens.paper3,
                '--ink': tokens.ink,
                '--ink-2': tokens.ink2,
                '--ink-3': tokens.ink3,
                '--line': tokens.line,
                '--line-strong': tokens.lineStrong,
                '--accent': tokens.accent,
                '--accent-deep': tokens.accentDeep,
                '--accent-soft': tokens.accentSoft,
                '--font-display': '"Fraunces", Georgia, serif',
                '--font-body': '"Hanken Grotesk", Helvetica, Arial, sans-serif',
                '--font-mono': '"JetBrains Mono", ui-monospace, monospace'
            },
            '*': { boxSizing: 'border-box' },
            html: { scrollBehavior: 'smooth', WebkitTextSizeAdjust: '100%' },
            body: {
                backgroundColor: 'var(--paper)',
                color: 'var(--ink)',
                fontFamily: 'var(--font-body)',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                // `clip` keeps horizontal overflow contained WITHOUT becoming a scroll
                // container — so descendant position:sticky still resolves to the viewport.
                overflowX: 'clip'
            },
            // Fixed grain overlay — sits above content but ignores the pointer.
            'body::after': {
                content: '""',
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                pointerEvents: 'none',
                backgroundImage: GRAIN,
                backgroundSize: '180px 180px',
                opacity: 0.05,
                mixBlendMode: 'multiply'
            },
            '::selection': { background: 'var(--accent)', color: 'var(--paper-2)' },
            a: { color: 'inherit', textDecorationColor: 'var(--line-strong)' },
            img: { display: 'block', maxWidth: '100%' },
            // Keyboard focus — a single visible ring for every interactive element.
            'a:focus-visible, button:focus-visible, [tabindex]:focus-visible, [role="button"]:focus-visible': {
                outline: '2px solid var(--accent-deep)',
                outlineOffset: '2px',
                borderRadius: '3px'
            },
            // Editorial scrollbar
            '::-webkit-scrollbar': { width: 11, height: 11 },
            '::-webkit-scrollbar-track': { background: 'var(--paper-3)' },
            '::-webkit-scrollbar-thumb': { background: 'var(--ink-3)', border: '3px solid var(--paper-3)', borderRadius: 8 },
            '::-webkit-scrollbar-thumb:hover': { background: 'var(--ink-2)' },
            // ── Keyframes ────────────────────────────────────────────────
            '@keyframes riseIn': {
                from: { opacity: 0, transform: 'translateY(26px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
            },
            '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 } },
            '@keyframes ticker': {
                from: { transform: 'translate3d(0,0,0)' },
                to: { transform: 'translate3d(-50%,0,0)' }
            },
            '.rise': { opacity: 0, animation: 'riseIn .9s cubic-bezier(.2,.7,.2,1) forwards' },
            '@media (prefers-reduced-motion: reduce)': {
                html: { scrollBehavior: 'auto' },
                '*': {
                    animationDuration: '0.001ms !important',
                    animationIterationCount: '1 !important',
                    animationDelay: '0ms !important',
                    transitionDuration: '0.001ms !important',
                    transitionDelay: '0ms !important'
                },
                '.rise': { opacity: 1 }
            }
        }}
    />
);

export default function App({ Component, pageProps, emotionCache = clientSideEmotionCache }: any) {
    return (
        <CacheProvider value={emotionCache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {globalStyles}
                <Component {...pageProps} />
            </ThemeProvider>
        </CacheProvider>
    );
}
