import * as React from 'react';
import NextLink from 'next/link';
import type * as types from 'types';
import { fonts } from '../../../utils/theme';

import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import EastIcon from '@mui/icons-material/East';

export type Props = types.AppShowcaseSection & types.StackbitFieldPath;

// A small muted palette gives each category a single spot of colour (the dot)
// without turning the index into confetti.
const DOTS = ['#C4502A', '#356158', '#B07A1E', '#4A5A6B', '#8A4B3B', '#5E6437'];
const dotFor = (cat = '') => DOTS[cat.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % DOTS.length];

export const AppShowcaseSection: React.FC<Props> = (props) => {
    const { title, subtitle, items = [], 'data-sb-field-path': fieldPath } = props;
    const [active, setActive] = React.useState<string>('All');

    const categories = React.useMemo(() => {
        const seen: string[] = [];
        items.forEach((it) => it.category && !seen.includes(it.category) && seen.push(it.category));
        return ['All', ...seen];
    }, [items]);

    // Keep the catalogue number (01..N) stable to original order; just filter.
    const numbered = items.map((item, i) => ({ item, n: i + 1 }));
    const visible = active === 'All' ? numbered : numbered.filter(({ item }) => item.category === active);

    return (
        <MuiBox component="section" id="apps" data-sb-field-path={fieldPath} sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 6, md: 8 }, scrollMarginTop: '90px' }}>
            {/* Section masthead */}
            <MuiBox sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap', mb: 1 }}>
                <MuiBox>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
                        <MuiBox sx={{ width: 9, height: 9, bgcolor: 'var(--accent)', borderRadius: '1px' }} />
                        <MuiBox component="span" sx={{ fontFamily: fonts.mono, fontSize: '0.72rem', letterSpacing: '0.22em', color: 'var(--ink-2)' }}>
                            THE INDEX
                        </MuiBox>
                    </MuiBox>
                    {title && (
                        <MuiTypography component="h2" data-sb-field-path=".title" sx={{ fontFamily: fonts.display, fontWeight: 500, fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', lineHeight: 1.02, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
                            {title}
                        </MuiTypography>
                    )}
                </MuiBox>
                <MuiBox component="span" sx={{ fontFamily: fonts.mono, fontSize: '0.78rem', letterSpacing: '0.1em', color: 'var(--ink-3)' }}>
                    {String(items.length).padStart(2, '0')} APPS · SHIPPED
                </MuiBox>
            </MuiBox>

            {subtitle && (
                <MuiTypography component="p" data-sb-field-path=".subtitle" sx={{ fontSize: '1.05rem', color: 'var(--ink-2)', maxWidth: '54ch', mb: 4 }}>
                    {subtitle}
                </MuiTypography>
            )}

            {/* Category filter */}
            {categories.length > 1 && (
                <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 5, pb: 4, borderBottom: '1px solid var(--line)' }}>
                    {categories.map((cat) => {
                        const on = cat === active;
                        return (
                            <MuiBox
                                key={cat}
                                component="button"
                                onClick={() => setActive(cat)}
                                aria-pressed={on}
                                sx={{
                                    cursor: 'pointer',
                                    fontFamily: fonts.mono,
                                    fontSize: '0.7rem',
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    px: 1.75,
                                    py: 0.85,
                                    minHeight: 40,
                                    borderRadius: '40px',
                                    border: '1px solid',
                                    borderColor: on ? 'var(--ink)' : 'var(--line-strong)',
                                    bgcolor: on ? 'var(--ink)' : 'transparent',
                                    color: on ? 'var(--paper-2)' : 'var(--ink-2)',
                                    transition: 'all .2s ease',
                                    '&:hover': { borderColor: 'var(--ink)', color: on ? 'var(--paper-2)' : 'var(--ink)' }
                                }}
                            >
                                {cat}
                            </MuiBox>
                        );
                    })}
                </MuiBox>
            )}

            {/* The grid */}
            <MuiBox data-sb-field-path=".items" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: { xs: 2, md: 2.5 } }}>
                {visible.map(({ item, n }, vi) => (
                    <AppCard key={item.pageUrl || item.title || n} {...item} n={n} delay={Math.min(vi, 8) * 55} data-sb-field-path={`.${n - 1}`} />
                ))}
            </MuiBox>

            {visible.length === 0 && (
                <MuiBox sx={{ py: 8, textAlign: 'center', fontFamily: fonts.mono, fontSize: '0.8rem', letterSpacing: '0.1em', color: 'var(--ink-3)' }}>
                    NO ENTRIES IN THIS CATEGORY
                </MuiBox>
            )}
        </MuiBox>
    );
};

type CardProps = types.AppCard & types.StackbitFieldPath & { n: number; delay: number };

const AppCard: React.FC<CardProps> = (props) => {
    const { title, description, icon, category, appStoreUrl, pageUrl, n, delay, 'data-sb-field-path': fieldPath } = props;

    return (
        <MuiBox
            className="rise"
            style={{ animationDelay: `${delay}ms` }}
            data-sb-field-path={fieldPath}
            sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'var(--paper-2)',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                p: { xs: 2.5, md: 3 },
                transition: 'transform .35s cubic-bezier(.2,.7,.2,1), border-color .35s ease, box-shadow .35s ease',
                '&:hover': { transform: 'translateY(-6px)', borderColor: 'var(--ink)', boxShadow: '0 26px 44px -28px rgba(33,27,22,0.5)' },
                '&:hover .idx': { color: 'var(--accent)' },
                '&:hover .ico': { transform: 'rotate(-3deg) scale(1.04)' },
                '&:hover .arrow': { transform: 'translateX(4px)', color: 'var(--ink)' },
                // The stretched details-link is a zero-area overlay, so wrap the focus ring
                // around the whole card when that link is keyboard-focused.
                '&:has(a:focus-visible)': { outline: '2px solid var(--accent-deep)', outlineOffset: '3px', borderColor: 'var(--ink)' }
            }}
        >
            {/* Top row: catalogue number + category */}
            <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                <MuiBox component="span" className="idx" sx={{ fontFamily: fonts.mono, fontSize: '0.8rem', fontWeight: 500, color: 'var(--ink-3)', transition: 'color .3s ease' }}>
                    {String(n).padStart(2, '0')}
                </MuiBox>
                {category && (
                    <MuiBox sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                        <MuiBox sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: dotFor(category) }} />
                        <MuiBox component="span" sx={{ fontFamily: fonts.mono, fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                            {category}
                        </MuiBox>
                    </MuiBox>
                )}
            </MuiBox>

            {icon && (
                <MuiBox
                    component="img"
                    className="ico"
                    src={icon}
                    alt={`${title || 'App'} icon`}
                    loading="lazy"
                    width={64}
                    height={64}
                    sx={{ width: 64, height: 64, borderRadius: '22%', border: '1px solid var(--line)', mb: 2.25, transition: 'transform .4s cubic-bezier(.2,.7,.2,1)' }}
                />
            )}

            {title && (
                <MuiTypography component="h3" sx={{ fontFamily: fonts.display, fontWeight: 500, fontSize: '1.32rem', lineHeight: 1.12, letterSpacing: '-0.01em', color: 'var(--ink)', mb: 1 }} data-sb-field-path=".title">
                    {/* Stretched link makes the whole card a target for "details" without nesting anchors. */}
                    {pageUrl ? (
                        <MuiBox
                            component={NextLink}
                            href={pageUrl}
                            sx={{ color: 'inherit', textDecoration: 'none', '&::after': { content: '""', position: 'absolute', inset: 0, zIndex: 1 } }}
                        >
                            {title}
                        </MuiBox>
                    ) : (
                        title
                    )}
                </MuiTypography>
            )}

            {description && (
                <MuiTypography component="p" sx={{ fontSize: '0.92rem', lineHeight: 1.55, color: 'var(--ink-2)', mb: 2.5 }} data-sb-field-path=".description">
                    {description}
                </MuiTypography>
            )}

            {/* Footer actions */}
            <MuiBox sx={{ mt: 'auto', pt: 2, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {appStoreUrl ? (
                    <MuiBox
                        component="a"
                        href={appStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            position: 'relative',
                            zIndex: 2,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            fontFamily: fonts.mono,
                            fontSize: '0.7rem',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: 'var(--ink)',
                            textDecoration: 'none',
                            transition: 'color .2s ease, gap .2s ease',
                            '&:hover': { color: 'var(--accent-deep)', gap: 0.9 }
                        }}
                    >
                        App Store <NorthEastIcon sx={{ fontSize: 13 }} />
                    </MuiBox>
                ) : (
                    <span />
                )}
                {pageUrl && <EastIcon className="arrow" sx={{ fontSize: 18, color: 'var(--ink-3)', transition: 'transform .25s ease, color .25s ease' }} />}
            </MuiBox>
        </MuiBox>
    );
};
