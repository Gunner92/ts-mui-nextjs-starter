import * as React from 'react';
import NextLink from 'next/link';
import type * as types from 'types';
import { Button } from '../../atoms/Button';
import { Markdown } from '../../atoms/Markdown';
import { fonts } from '../../../utils/theme';

import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import WestIcon from '@mui/icons-material/West';

export type Props = types.HeroSection & types.StackbitFieldPath;

// A curated 3×3 plate of real icons for the landing — a tactile "contact sheet".
const PLATE_ICONS = [
    'rightfood',
    'jet-lag-manager',
    'stresswatch',
    'matcha',
    'hearguard',
    'watch-id',
    'coin-identifier',
    'flower-identifier',
    'glowup'
];

// Names that drift across the hairline ticker.
const TICKER = [
    'Yuko',
    'Jet Lag',
    'Stress Watch',
    'GlowUp',
    'HearGuard',
    'Matcha',
    'Coin Identifier',
    'Stamp Snap',
    'Fossil Scan',
    'Flower ID',
    'Bird ID',
    'SnakeSnap',
    'Watch ID',
    'Signature Maker',
    'Meal Planner',
    'Level Tool',
    'Bill Organizer',
    'Mindful Minutes',
    'Gratitude Journal',
    'Mywellness'
];

const rise = (delay: number) => ({ className: 'rise', style: { animationDelay: `${delay}ms` } });

// Corner tick marks — the registration crops of a print plate.
const cornerTick = (pos: { top?: number; bottom?: number; left?: number; right?: number }) => ({
    content: '""',
    position: 'absolute' as const,
    width: 9,
    height: 9,
    borderColor: 'var(--ink-3)',
    ...pos
});

const IconPlate: React.FC = () => (
    <MuiBox {...rise(260)} sx={{ position: 'relative', maxWidth: 380, mx: 'auto' }}>
        <MuiBox
            sx={{
                position: 'relative',
                bgcolor: 'var(--paper-2)',
                border: '1px solid var(--line-strong)',
                p: { xs: 2, sm: 2.5 },
                // Tilt lives on this (non-animated) node — the riseIn fill-forwards on the
                // outer Box would otherwise overwrite a rotate set there.
                transform: { md: 'rotate(1.4deg)' },
                boxShadow: '14px 18px 0 -2px rgba(33,27,22,0.06)',
                '&::before': { ...cornerTick({ top: 7, left: 7 }), borderLeft: '1.5px solid', borderTop: '1.5px solid' },
                '&::after': { ...cornerTick({ bottom: 7, right: 7 }), borderRight: '1.5px solid', borderBottom: '1.5px solid' }
            }}
        >
            <MuiBox sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: { xs: 1.25, sm: 1.5 } }}>
                {PLATE_ICONS.map((slug, i) => (
                    <MuiBox
                        key={slug}
                        component="img"
                        src={`/images/icons/${slug}.png`}
                        alt=""
                        aria-hidden
                        width={512}
                        height={512}
                        sx={{
                            width: '100%',
                            height: 'auto',
                            aspectRatio: '1 / 1',
                            borderRadius: '22%',
                            border: '1px solid var(--line)',
                            transition: 'transform .45s cubic-bezier(.2,.7,.2,1)',
                            animation: 'riseIn .7s cubic-bezier(.2,.7,.2,1) backwards',
                            animationDelay: `${320 + i * 55}ms`,
                            '&:hover': { transform: 'scale(1.08) rotate(-2deg)' }
                        }}
                    />
                ))}
            </MuiBox>
        </MuiBox>
        <MuiBox sx={{ mt: 1.5, display: 'flex', justifyContent: 'space-between', fontFamily: fonts.mono, fontSize: '0.6rem', letterSpacing: '0.18em', color: 'var(--ink-3)' }}>
            <span>FIG. 01</span>
            <span>SELECTED WORKS</span>
        </MuiBox>
    </MuiBox>
);

const Ticker: React.FC = () => (
    <MuiBox
        aria-hidden
        sx={{
            mt: { xs: 5, md: 7 },
            py: 1.5,
            borderTop: '1px solid var(--line)',
            borderBottom: '1px solid var(--line)',
            overflow: 'hidden',
            position: 'relative',
            maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
            WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
            '&:hover .track': { animationPlayState: 'paused' }
        }}
    >
        <MuiBox className="track" sx={{ display: 'inline-flex', whiteSpace: 'nowrap', animation: 'ticker 48s linear infinite', willChange: 'transform' }}>
            {[0, 1].map((dup) => (
                <MuiBox key={dup} sx={{ display: 'inline-flex', alignItems: 'center' }}>
                    {TICKER.map((name, i) => (
                        <MuiBox key={`${dup}-${i}`} sx={{ display: 'inline-flex', alignItems: 'center' }}>
                            <MuiBox component="span" sx={{ fontFamily: fonts.display, fontSize: '1.05rem', color: 'var(--ink)', px: 2.25 }}>
                                {name}
                            </MuiBox>
                            <MuiBox component="span" sx={{ color: 'var(--ink-3)', fontSize: '0.6rem' }}>
                                ·
                            </MuiBox>
                        </MuiBox>
                    ))}
                </MuiBox>
            ))}
        </MuiBox>
    </MuiBox>
);

// ── Landing hero (no image) ──────────────────────────────────────────────────
const LandingHero: React.FC<Props> = (props) => {
    const { title, subtitle, text, actions = [], 'data-sb-field-path': fieldPath } = props;
    return (
        <MuiBox component="section" data-sb-field-path={fieldPath} sx={{ pt: { xs: 6, md: 9 }, pb: { xs: 2, md: 4 } }}>
            <MuiBox
                {...rise(0)}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: { xs: 3, md: 4 } }}
            >
                <MuiBox sx={{ width: 9, height: 9, bgcolor: 'var(--accent)', borderRadius: '1px' }} />
                <MuiBox component="span" sx={{ fontFamily: fonts.mono, fontSize: '0.72rem', letterSpacing: '0.22em', color: 'var(--ink-2)' }}>
                    INDEPENDENT iOS STUDIO
                </MuiBox>
                <MuiBox sx={{ flex: 1, height: '1px', bgcolor: 'var(--line)' }} />
                <MuiBox component="span" sx={{ fontFamily: fonts.mono, fontSize: '0.72rem', letterSpacing: '0.18em', color: 'var(--ink-3)', display: { xs: 'none', sm: 'block' } }}>
                    TWENTY-ONE APPS
                </MuiBox>
            </MuiBox>

            <MuiBox sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.15fr 0.85fr' }, gap: { xs: 5, md: 6 }, alignItems: 'center' }}>
                <MuiBox>
                    {title && (
                        <MuiTypography
                            component="h1"
                            data-sb-field-path=".title"
                            {...rise(80)}
                            sx={{
                                fontFamily: fonts.display,
                                fontWeight: 500,
                                fontSize: 'clamp(2.4rem, 8vw, 6rem)',
                                lineHeight: 1.0,
                                letterSpacing: '-0.02em',
                                overflowWrap: 'break-word',
                                color: 'var(--ink)',
                                fontVariationSettings: '"opsz" 144, "SOFT" 30',
                                '& em': { fontStyle: 'italic', color: 'var(--accent)' }
                            }}
                        >
                            {title}
                        </MuiTypography>
                    )}
                    {subtitle && (
                        <MuiTypography
                            component="p"
                            data-sb-field-path=".subtitle"
                            {...rise(160)}
                            sx={{ mt: 2.5, fontFamily: fonts.display, fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(1.25rem, 2.6vw, 1.7rem)', color: 'var(--ink-2)', maxWidth: '24ch' }}
                        >
                            {subtitle}
                        </MuiTypography>
                    )}
                    {text && (
                        <MuiTypography component="p" {...rise(220)} sx={{ mt: 3, fontSize: '1.08rem', lineHeight: 1.7, color: 'var(--ink-2)', maxWidth: '46ch' }}>
                            {text}
                        </MuiTypography>
                    )}
                    {actions.length > 0 && (
                        <MuiBox {...rise(300)} data-sb-field-path=".actions" sx={{ mt: 4.5, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            {actions.map((action, i) => (
                                <Button key={i} {...action} data-sb-field-path={`.${i}`} />
                            ))}
                        </MuiBox>
                    )}
                </MuiBox>

                <IconPlate />
            </MuiBox>

            <Ticker />
        </MuiBox>
    );
};

// ── App detail hero (icon present) ───────────────────────────────────────────
const DetailHero: React.FC<Props> = (props) => {
    const { title, subtitle, text, image, actions = [], 'data-sb-field-path': fieldPath } = props;
    return (
        <MuiBox component="section" data-sb-field-path={fieldPath} sx={{ pt: { xs: 4, md: 6 }, pb: { xs: 4, md: 7 } }}>
            <MuiBox
                component={NextLink}
                href="/#apps"
                {...rise(0)}
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: { xs: 4, md: 5 },
                    fontFamily: fonts.mono,
                    fontSize: '0.7rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-3)',
                    textDecoration: 'none',
                    transition: 'color .2s ease, gap .2s ease',
                    '&:hover': { color: 'var(--accent)', gap: 1.6 }
                }}
            >
                <WestIcon sx={{ fontSize: 15 }} /> The Index
            </MuiBox>

            <MuiBox sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '320px 1fr' }, gap: { xs: 4, md: 7 }, alignItems: 'start' }}>
                <MuiBox sx={{ position: { md: 'sticky' }, top: { md: 100 } }}>
                    {image?.url && (
                        <MuiBox {...rise(80)} sx={{ position: 'relative', width: { xs: 150, md: '100%' }, maxWidth: 300 }}>
                            <MuiBox
                                component="img"
                                src={image.url}
                                alt={image.altText || title || ''}
                                data-sb-field-path=".image .image.url#@src .image.altText#@alt"
                                sx={{ width: '100%', aspectRatio: '1 / 1', borderRadius: '23%', border: '1px solid var(--line-strong)', boxShadow: '0 24px 50px -22px rgba(33,27,22,0.45)' }}
                            />
                        </MuiBox>
                    )}
                    {actions.length > 0 && (
                        <MuiBox {...rise(160)} data-sb-field-path=".actions" sx={{ mt: 3.5, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 1.5, maxWidth: 300 }}>
                            {actions.map((action, i) => (
                                <Button key={i} {...action} sx={{ width: '100%' }} data-sb-field-path={`.${i}`} />
                            ))}
                            <MuiBox component="span" sx={{ fontFamily: fonts.mono, fontSize: '0.62rem', letterSpacing: '0.14em', color: 'var(--ink-3)', mt: 0.5 }}>
                                ↳ REQUIRES iOS · APP STORE
                            </MuiBox>
                        </MuiBox>
                    )}
                </MuiBox>

                <MuiBox sx={{ minWidth: 0 }}>
                    <MuiBox component="span" {...rise(60)} sx={{ display: 'block', fontFamily: fonts.mono, fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--accent-deep)', mb: 1.5 }}>
                        BG MOBILE DEV — APP
                    </MuiBox>
                    {title && (
                        <MuiTypography
                            component="h1"
                            data-sb-field-path=".title"
                            {...rise(120)}
                            sx={{ fontFamily: fonts.display, fontWeight: 500, fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)', lineHeight: 1.02, letterSpacing: '-0.02em', color: 'var(--ink)', overflowWrap: 'break-word', fontVariationSettings: '"opsz" 110, "SOFT" 20' }}
                        >
                            {title}
                        </MuiTypography>
                    )}
                    {subtitle && (
                        <MuiTypography component="p" data-sb-field-path=".subtitle" {...rise(180)} sx={{ mt: 2, fontSize: '1.2rem', lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: '52ch' }}>
                            {subtitle}
                        </MuiTypography>
                    )}

                    {actions.length > 0 && (
                        <MuiBox sx={{ mt: 3.5, display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
                            {actions.map((action, i) => (
                                <Button key={i} {...action} sx={{ width: '100%' }} />
                            ))}
                        </MuiBox>
                    )}

                    {text && (
                        <MuiBox
                            {...rise(240)}
                            sx={{
                                mt: { xs: 4, md: 5 },
                                pt: { xs: 4, md: 5 },
                                borderTop: '1px solid var(--line)',
                                fontSize: '1.02rem',
                                color: 'var(--ink-2)',
                                '& p': { lineHeight: 1.78, mb: 2.2 },
                                '& strong': { color: 'var(--ink)', fontWeight: 700, letterSpacing: '0.005em' },
                                '& h2': { fontFamily: fonts.display, color: 'var(--ink)', fontSize: '1.7rem', mt: 4.5, mb: 1.5, fontWeight: 500, letterSpacing: '-0.01em' },
                                '& h3': { fontFamily: fonts.display, color: 'var(--ink)', fontSize: '1.45rem', mt: 4, mb: 1.5, fontWeight: 500 },
                                '& ul, & ol': { pl: 0, listStyle: 'none', my: 2.5 },
                                '& li': { position: 'relative', pl: 3.5, mb: 1.4, lineHeight: 1.7, '&::before': { content: '"→"', position: 'absolute', left: 0, color: 'var(--accent)' } },
                                '& a': { color: 'var(--accent-deep)', textDecoration: 'underline', textUnderlineOffset: '3px', textDecorationColor: 'var(--line-strong)', '&:hover': { textDecorationColor: 'var(--accent)' } }
                            }}
                        >
                            <Markdown text={text} data-sb-field-path=".text" />
                        </MuiBox>
                    )}
                </MuiBox>
            </MuiBox>
        </MuiBox>
    );
};

export const HeroSection: React.FC<Props> = (props) => {
    return props.image?.url ? <DetailHero {...props} /> : <LandingHero {...props} />;
};
