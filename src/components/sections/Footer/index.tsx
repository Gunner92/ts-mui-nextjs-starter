import * as React from 'react';
import NextLink from 'next/link';
import type * as types from 'types';
import { fonts } from '../../../utils/theme';

import MuiBox from '@mui/material/Box';
import MuiContainer from '@mui/material/Container';
import MuiTypography from '@mui/material/Typography';
import NorthEastIcon from '@mui/icons-material/NorthEast';

type Props = types.Footer & types.StackbitObjectId;

const isMailto = (url = '') => url.startsWith('mailto:');

const colLabelSx = { fontFamily: fonts.mono, fontSize: '0.62rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--ink-3)', mb: 2.5 } as const;

const footLinkSx = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.5,
    fontSize: '0.95rem',
    color: 'var(--ink-2)',
    textDecoration: 'none',
    width: 'fit-content',
    transition: 'color .2s ease, padding-left .2s ease',
    '&:hover, &:focus-visible': { color: 'var(--accent-deep)', pl: 0.5 }
} as const;

export const Footer: React.FC<Props> = (props) => {
    const { navLinks = [], 'data-sb-object-id': objectId } = props;
    const fieldPath = objectId ? `${objectId}:footer` : null;
    const cta = navLinks.find((l) => isMailto(l.url));

    return (
        <MuiBox component="footer" data-sb-field-path={fieldPath} sx={{ mt: { xs: 8, md: 14 }, borderTop: '1px solid var(--line-strong)', position: 'relative', overflow: 'hidden' }}>
            <MuiContainer maxWidth="lg" disableGutters sx={{ px: { xs: 2.5, sm: 4, md: 5 }, position: 'relative', zIndex: 1 }}>
                {/* CTA band */}
                <MuiBox sx={{ py: { xs: 7, md: 10 }, borderBottom: '1px solid var(--line)', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 4 }}>
                    <MuiBox>
                        <MuiBox component="span" sx={{ fontFamily: fonts.mono, fontSize: '0.7rem', letterSpacing: '0.22em', color: 'var(--accent-deep)' }}>
                            ✦ COLLABORATE
                        </MuiBox>
                        <MuiTypography sx={{ mt: 2, fontFamily: fonts.display, fontWeight: 500, fontSize: 'clamp(2rem, 5vw, 3.4rem)', lineHeight: 1.0, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
                            Got an idea worth
                            <br />
                            shipping? <MuiBox component="em" sx={{ fontStyle: 'italic', color: 'var(--accent)' }}>Let&rsquo;s talk.</MuiBox>
                        </MuiTypography>
                    </MuiBox>
                    {cta && (
                        <MuiBox
                            component="a"
                            href={cta.url}
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                fontFamily: fonts.body,
                                fontWeight: 600,
                                fontSize: '1rem',
                                color: 'var(--paper-2)',
                                bgcolor: 'var(--ink)',
                                px: 3.5,
                                py: 1.85,
                                borderRadius: '3px',
                                textDecoration: 'none',
                                transition: 'background-color .25s ease, transform .25s ease',
                                '&:hover': { bgcolor: 'var(--accent-deep)', transform: 'translateY(-2px)' }
                            }}
                        >
                            Start a conversation <NorthEastIcon sx={{ fontSize: 18 }} />
                        </MuiBox>
                    )}
                </MuiBox>

                {/* Columns */}
                <MuiBox sx={{ py: { xs: 6, md: 8 }, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1.6fr 1fr 1fr', md: '2fr 1fr 1fr 1.2fr' }, gap: { xs: 5, md: 4 } }}>
                    <MuiBox>
                        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
                            <MuiBox aria-hidden sx={{ width: 34, height: 34, display: 'grid', placeItems: 'center', bgcolor: 'var(--ink)', color: 'var(--paper-2)', borderRadius: '5px', fontFamily: fonts.display, fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1 }}>
                                bg
                            </MuiBox>
                            <MuiBox component="span" sx={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.16em', color: 'var(--ink)' }}>
                                BG MOBILE DEV
                            </MuiBox>
                        </MuiBox>
                        <MuiTypography sx={{ fontSize: '0.95rem', lineHeight: 1.65, color: 'var(--ink-2)', maxWidth: '34ch' }}>
                            An independent iOS studio crafting small, useful apps for health, travel, photography and everyday life.
                        </MuiTypography>
                    </MuiBox>

                    <MuiBox sx={{ display: 'flex', flexDirection: 'column' }}>
                        <MuiBox component="span" sx={colLabelSx}>Index</MuiBox>
                        <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <MuiBox component={NextLink} href="/" sx={footLinkSx}>Home</MuiBox>
                            <MuiBox component={NextLink} href="/#apps" sx={footLinkSx}>All Apps</MuiBox>
                            <MuiBox component={NextLink} href="/support" sx={footLinkSx}>Support</MuiBox>
                            <MuiBox component={NextLink} href="/privacy-policy" sx={footLinkSx}>Privacy Policy</MuiBox>
                        </MuiBox>
                    </MuiBox>

                    <MuiBox sx={{ display: 'flex', flexDirection: 'column' }} data-sb-field-path=".navLinks">
                        <MuiBox component="span" sx={colLabelSx}>Connect</MuiBox>
                        <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {navLinks.map((link, i) => (
                                <MuiBox
                                    key={i}
                                    component={isMailto(link.url) || link.url.startsWith('http') ? 'a' : NextLink}
                                    href={link.url}
                                    {...(link.url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                    sx={footLinkSx}
                                    data-sb-field-path={`.${i}`}
                                >
                                    {link.label} {(isMailto(link.url) || link.url.startsWith('http')) && <NorthEastIcon sx={{ fontSize: 12 }} />}
                                </MuiBox>
                            ))}
                        </MuiBox>
                    </MuiBox>

                    <MuiBox sx={{ display: 'flex', flexDirection: 'column' }}>
                        <MuiBox component="span" sx={colLabelSx}>Colophon</MuiBox>
                        <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 1.4, fontFamily: fonts.mono, fontSize: '0.72rem', letterSpacing: '0.04em', color: 'var(--ink-2)', lineHeight: 1.5 }}>
                            <span>Built in Swift &amp; SwiftUI</span>
                            <span>21 apps on the App Store</span>
                            <span>Design — Atelier Index</span>
                        </MuiBox>
                    </MuiBox>
                </MuiBox>

                {/* Baseline */}
                <MuiBox sx={{ py: 3.5, borderTop: '1px solid var(--line)', display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', justifyContent: 'space-between' }}>
                    <MuiBox component="span" sx={{ fontFamily: fonts.mono, fontSize: '0.66rem', letterSpacing: '0.12em', color: 'var(--ink-3)' }}>
                        © {new Date().getFullYear()} BG MOBILE DEV — ALL RIGHTS RESERVED
                    </MuiBox>
                    <MuiBox component="span" sx={{ fontFamily: fonts.mono, fontSize: '0.66rem', letterSpacing: '0.12em', color: 'var(--ink-3)' }}>
                        MADE WITH CARE · iOS
                    </MuiBox>
                </MuiBox>
            </MuiContainer>

            {/* Oversized signature watermark */}
            <MuiBox
                aria-hidden
                sx={{
                    position: 'absolute',
                    bottom: { xs: -8, md: -22 },
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '120%',
                    textAlign: 'center',
                    fontFamily: fonts.display,
                    fontWeight: 500,
                    fontStyle: 'italic',
                    fontSize: 'clamp(4rem, 17vw, 15rem)',
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                    color: 'var(--ink)',
                    opacity: 0.05,
                    pointerEvents: 'none',
                    userSelect: 'none'
                }}
            >
                bgmobiledev
            </MuiBox>
        </MuiBox>
    );
};
