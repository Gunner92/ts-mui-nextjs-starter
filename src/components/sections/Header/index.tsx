import * as React from 'react';
import type * as types from 'types';
import { Link } from '../../atoms/Link';

import MuiAppBar from '@mui/material/AppBar';
import MuiBox from '@mui/material/Box';
import MuiToolbar from '@mui/material/Toolbar';
import MuiTypography from '@mui/material/Typography';
import MuiIconButton from '@mui/material/IconButton';
import MuiDrawer from '@mui/material/Drawer';
import MuiList from '@mui/material/List';
import MuiListItem from '@mui/material/ListItem';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';

export type Props = types.Header & types.StackbitObjectId;

export const Header: React.FC<Props> = (props) => {
    const { title, navLinks = [], 'data-sb-object-id': objectId } = props;
    const fieldPath = objectId ? `${objectId}:header` : null;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    return (
        <>
            <MuiAppBar
                position="sticky"
                elevation={0}
                data-sb-field-path={fieldPath}
                sx={{
                    background: 'rgba(10, 10, 26, 0.85)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(108, 99, 255, 0.1)'
                }}
            >
                <MuiToolbar disableGutters sx={{ px: { xs: 2, sm: 3 } }}>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <PhoneIphoneIcon sx={{ mr: 1, color: '#6C63FF' }} />
                        {title && (
                            <MuiTypography
                                component="p"
                                variant="h6"
                                noWrap
                                data-sb-field-path=".title"
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #6C63FF 0%, #00D9FF 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                {title}
                            </MuiTypography>
                        )}
                    </MuiBox>

                    {/* Desktop nav */}
                    {navLinks.length > 0 && (
                        <MuiBox
                            component="nav"
                            sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}
                            data-sb-field-path=".navLinks"
                        >
                            {navLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    {...link}
                                    sx={{
                                        color: '#a0a0b8',
                                        transition: 'color 0.2s',
                                        '&:hover': { color: '#ffffff' }
                                    }}
                                    data-sb-field-path={`.${index}`}
                                />
                            ))}
                        </MuiBox>
                    )}

                    {/* Mobile hamburger */}
                    <MuiIconButton
                        sx={{ display: { md: 'none' }, color: '#a0a0b8' }}
                        onClick={() => setMobileOpen(true)}
                    >
                        <MenuIcon />
                    </MuiIconButton>
                </MuiToolbar>
            </MuiAppBar>

            {/* Mobile drawer */}
            <MuiDrawer
                anchor="right"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                PaperProps={{
                    sx: {
                        background: '#0a0a1a',
                        width: 280,
                        borderLeft: '1px solid rgba(108, 99, 255, 0.2)'
                    }
                }}
            >
                <MuiBox sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <MuiIconButton onClick={() => setMobileOpen(false)} sx={{ color: '#a0a0b8' }}>
                        <CloseIcon />
                    </MuiIconButton>
                </MuiBox>
                <MuiList>
                    {navLinks.map((link, index) => (
                        <MuiListItem key={index} sx={{ py: 1.5 }}>
                            <Link
                                {...link}
                                sx={{ fontSize: '1.1rem' }}
                                data-sb-field-path={`.navLinks.${index}`}
                            />
                        </MuiListItem>
                    ))}
                </MuiList>
            </MuiDrawer>
        </>
    );
};
