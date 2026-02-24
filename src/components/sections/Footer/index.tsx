import * as React from 'react';
import NextLink from 'next/link';
import type * as types from 'types';
import { Link } from '../../atoms/Link';

import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiDivider from '@mui/material/Divider';
import MuiGrid from '@mui/material/Grid';
import MuiStack from '@mui/material/Stack';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';

type Props = types.Footer & types.StackbitObjectId;

export const Footer: React.FC<Props> = (props) => {
    const { navLinks = [], copyrightText, 'data-sb-object-id': objectId } = props;
    const fieldPath = objectId ? `${objectId}:footer` : null;
    const currentYear = new Date().getFullYear();

    return (
        <MuiBox
            component="footer"
            sx={{
                mt: 8,
                pt: 6,
                pb: 4,
                borderTop: '1px solid rgba(108, 99, 255, 0.15)'
            }}
            data-sb-field-path={fieldPath}
        >
            <MuiGrid container spacing={4}>
                <MuiGrid item xs={12} md={4}>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PhoneIphoneIcon sx={{ mr: 1, color: '#6C63FF' }} />
                        <MuiTypography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #6C63FF 0%, #00D9FF 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            BG Mobile Dev
                        </MuiTypography>
                    </MuiBox>
                    <MuiTypography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                        Crafting innovative iOS applications that make a difference in people&#39;s daily lives.
                    </MuiTypography>
                </MuiGrid>

                <MuiGrid item xs={12} sm={6} md={4}>
                    <MuiTypography variant="subtitle2" color="text.primary" sx={{ mb: 2, fontWeight: 600 }}>
                        Quick Links
                    </MuiTypography>
                    <MuiStack spacing={1}>
                        <MuiTypography
                            component={NextLink}
                            href="/"
                            variant="body2"
                            sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: '#6C63FF' } }}
                        >
                            Home
                        </MuiTypography>
                        <MuiTypography
                            component={NextLink}
                            href="/privacy-policy"
                            variant="body2"
                            sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: '#6C63FF' } }}
                        >
                            Privacy Policy
                        </MuiTypography>
                    </MuiStack>
                </MuiGrid>

                <MuiGrid item xs={12} sm={6} md={4}>
                    <MuiTypography variant="subtitle2" color="text.primary" sx={{ mb: 2, fontWeight: 600 }}>
                        Connect
                    </MuiTypography>
                    {navLinks.length > 0 && (
                        <MuiStack spacing={1} data-sb-field-path=".navLinks">
                            {navLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    {...link}
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: '0.875rem',
                                        '&:hover': { color: '#6C63FF' }
                                    }}
                                    data-sb-field-path={`.${index}`}
                                />
                            ))}
                        </MuiStack>
                    )}
                </MuiGrid>
            </MuiGrid>

            <MuiDivider sx={{ my: 4, borderColor: 'rgba(108, 99, 255, 0.1)' }} />

            <MuiTypography variant="body2" color="text.secondary" align="center">
                &copy; {currentYear} BG Mobile Dev. All rights reserved.
            </MuiTypography>
        </MuiBox>
    );
};
