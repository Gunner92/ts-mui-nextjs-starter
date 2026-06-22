import * as React from 'react';
import NextLink from 'next/link';
import type * as types from 'types';
import { fonts } from '../../../utils/theme';

import MuiBox from '@mui/material/Box';
import MuiContainer from '@mui/material/Container';
import MuiIconButton from '@mui/material/IconButton';
import MuiDrawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import NorthEastIcon from '@mui/icons-material/NorthEast';

export type Props = types.Header & types.StackbitObjectId;

const isMailto = (url = '') => url.startsWith('mailto:');
const isExternal = (url = '') => url.startsWith('http');
const extProps = (url = '') => (isExternal(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {});
const linkComponent = (url = '') => (isMailto(url) || isExternal(url) ? ('a' as const) : NextLink);

// Animated hairline underline that draws from the left on hover.
const navLinkSx = {
    position: 'relative',
    fontFamily: fonts.mono,
    fontSize: '0.72rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--ink-2)',
    textDecoration: 'none',
    transition: 'color .2s ease',
    '&::after': {
        content: '""',
        position: 'absolute',
        left: 0,
        bottom: -5,
        height: '1.5px',
        width: '100%',
        background: 'var(--accent)',
        transform: 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform .3s cubic-bezier(.2,.7,.2,1)'
    },
    '&:hover': { color: 'var(--ink)' },
    '&:hover::after, &:focus-visible::after': { transform: 'scaleX(1)' }
} as const;

const Wordmark: React.FC = () => (
    <MuiBox component={NextLink} href="/" sx={{ display: 'flex', alignItems: 'center', gap: 1.25, textDecoration: 'none', color: 'inherit' }}>
        <MuiBox
            aria-hidden
            sx={{
                width: 38,
                height: 38,
                flexShrink: 0,
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'var(--ink)',
                color: 'var(--paper-2)',
                borderRadius: '5px',
                fontFamily: fonts.display,
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: '1.18rem',
                lineHeight: 1,
                transition: 'background-color .3s ease, transform .4s cubic-bezier(.2,.7,.2,1)',
                '.wm:hover &': { bgcolor: 'var(--accent)', transform: 'rotate(-4deg)' }
            }}
        >
            bg
        </MuiBox>
        <MuiBox sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <MuiBox component="span" sx={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: '0.74rem', letterSpacing: '0.18em', color: 'var(--ink)' }}>
                BG MOBILE DEV
            </MuiBox>
            <MuiBox component="span" sx={{ fontFamily: fonts.mono, fontSize: '0.56rem', letterSpacing: '0.34em', color: 'var(--ink-3)', mt: 0.4 }}>
                iOS STUDIO
            </MuiBox>
        </MuiBox>
    </MuiBox>
);

export const Header: React.FC<Props> = (props) => {
    const { navLinks = [], 'data-sb-object-id': objectId } = props;
    const fieldPath = objectId ? `${objectId}:header` : null;
    const [open, setOpen] = React.useState(false);

    const cta = navLinks.find((l) => isMailto(l.url));
    const textLinks = navLinks.filter((l) => l !== cta);

    return (
        <MuiBox
            component="header"
            data-sb-field-path={fieldPath}
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1100,
                bgcolor: 'rgba(244, 238, 226, 0.82)',
                backdropFilter: 'saturate(140%) blur(12px)',
                borderBottom: '1px solid var(--line)'
            }}
        >
            <MuiContainer maxWidth="lg" disableGutters sx={{ px: { xs: 2.5, sm: 4, md: 5 } }}>
                <MuiBox className="wm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: { xs: 66, md: 76 } }}>
                    <Wordmark />

                    <MuiBox component="nav" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }} data-sb-field-path=".navLinks">
                        {textLinks.map((link, i) => (
                            <MuiBox key={i} component={linkComponent(link.url)} href={link.url} {...extProps(link.url)} sx={navLinkSx}>
                                {link.label}
                            </MuiBox>
                        ))}
                        {cta && (
                            <MuiBox
                                component="a"
                                href={cta.url}
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 0.75,
                                    fontFamily: fonts.mono,
                                    fontSize: '0.72rem',
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    textDecoration: 'none',
                                    color: 'var(--paper-2)',
                                    bgcolor: 'var(--ink)',
                                    px: 2,
                                    py: 1.1,
                                    borderRadius: '3px',
                                    transition: 'background-color .25s ease, transform .25s ease',
                                    '&:hover': { bgcolor: 'var(--accent-deep)', transform: 'translateY(-1px)' }
                                }}
                            >
                                {cta.label}
                                <NorthEastIcon sx={{ fontSize: 14 }} />
                            </MuiBox>
                        )}
                    </MuiBox>

                    <MuiIconButton aria-label="Open menu" sx={{ display: { md: 'none' }, color: 'var(--ink)' }} onClick={() => setOpen(true)}>
                        <MenuIcon />
                    </MuiIconButton>
                </MuiBox>
            </MuiContainer>

            <MuiDrawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{ sx: { bgcolor: 'var(--paper)', width: 300, borderLeft: '1px solid var(--line-strong)', backgroundImage: 'none' } }}
            >
                <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2.5, borderBottom: '1px solid var(--line)' }}>
                    <MuiBox component="span" sx={{ fontFamily: fonts.mono, fontSize: '0.62rem', letterSpacing: '0.28em', color: 'var(--ink-3)' }}>
                        MENU
                    </MuiBox>
                    <MuiIconButton aria-label="Close menu" onClick={() => setOpen(false)} sx={{ color: 'var(--ink)' }}>
                        <CloseIcon />
                    </MuiIconButton>
                </MuiBox>
                <MuiBox sx={{ display: 'flex', flexDirection: 'column', p: 1 }}>
                    {navLinks.map((link, i) => (
                        <MuiBox
                            key={i}
                            component={linkComponent(link.url)}
                            href={link.url}
                            {...extProps(link.url)}
                            onClick={() => setOpen(false)}
                            sx={{
                                display: 'flex',
                                alignItems: 'baseline',
                                gap: 1.5,
                                px: 2,
                                py: 2,
                                textDecoration: 'none',
                                color: 'var(--ink)',
                                borderBottom: '1px solid var(--line)',
                                fontFamily: fonts.display,
                                fontSize: '1.5rem',
                                transition: 'color .2s ease, padding-left .2s ease',
                                '&:hover': { color: 'var(--accent)', pl: 3 }
                            }}
                        >
                            <MuiBox component="span" sx={{ fontFamily: fonts.mono, fontSize: '0.66rem', color: 'var(--ink-3)' }}>
                                {String(i + 1).padStart(2, '0')}
                            </MuiBox>
                            {link.label}
                        </MuiBox>
                    ))}
                </MuiBox>
            </MuiDrawer>
        </MuiBox>
    );
};
