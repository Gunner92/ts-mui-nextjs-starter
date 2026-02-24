import * as React from 'react';
import NextLink from 'next/link';
import type * as types from 'types';

import MuiBox from '@mui/material/Box';
import MuiCard from '@mui/material/Card';
import MuiCardContent from '@mui/material/CardContent';
import MuiGrid from '@mui/material/Grid';
import MuiTypography from '@mui/material/Typography';
import MuiChip from '@mui/material/Chip';
import MuiButton from '@mui/material/Button';
import MuiStack from '@mui/material/Stack';
import AppleIcon from '@mui/icons-material/Apple';

export type Props = types.AppShowcaseSection & types.StackbitFieldPath;

export const AppShowcaseSection: React.FC<Props> = (props) => {
    const { title, subtitle, items = [], 'data-sb-field-path': fieldPath } = props;
    return (
        <MuiBox sx={{ py: { xs: 8, sm: 12 } }} data-sb-field-path={fieldPath}>
            {title && (
                <MuiTypography
                    component="h2"
                    variant="h3"
                    align="center"
                    sx={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #a0a0b8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1
                    }}
                    data-sb-field-path=".title"
                >
                    {title}
                </MuiTypography>
            )}
            {subtitle && (
                <MuiTypography
                    component="p"
                    variant="h6"
                    align="center"
                    color="text.secondary"
                    sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
                    data-sb-field-path=".subtitle"
                >
                    {subtitle}
                </MuiTypography>
            )}
            {items.length > 0 && (
                <MuiGrid container spacing={3} data-sb-field-path=".items">
                    {items.map((item, index) => (
                        <AppShowcaseItem key={index} {...item} data-sb-field-path={`.${index}`} />
                    ))}
                </MuiGrid>
            )}
        </MuiBox>
    );
};

const AppShowcaseItem: React.FC<types.AppCard & types.StackbitFieldPath> = (props) => {
    const { title, description, icon, category, appStoreUrl, pageUrl, 'data-sb-field-path': fieldPath } = props;

    const cardContent = (
        <MuiCard
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: pageUrl ? 'pointer' : 'default',
                p: 1
            }}
            data-sb-field-path={fieldPath}
        >
            <MuiCardContent sx={{ flexGrow: 1, p: 3 }}>
                {icon && (
                    <MuiBox
                        component="img"
                        src={icon}
                        alt={title}
                        sx={{
                            width: 72,
                            height: 72,
                            borderRadius: '18px',
                            mb: 2,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                        }}
                    />
                )}
                {category && (
                    <MuiChip
                        label={category}
                        size="small"
                        sx={{
                            mb: 1.5,
                            background: 'rgba(108, 99, 255, 0.15)',
                            color: '#6C63FF',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            border: '1px solid rgba(108, 99, 255, 0.3)'
                        }}
                    />
                )}
                {title && (
                    <MuiTypography
                        component="h3"
                        variant="h6"
                        color="text.primary"
                        sx={{ fontWeight: 600, mb: 1 }}
                        data-sb-field-path=".title"
                    >
                        {title}
                    </MuiTypography>
                )}
                {description && (
                    <MuiTypography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                        data-sb-field-path=".description"
                    >
                        {description}
                    </MuiTypography>
                )}
                <MuiStack direction="row" spacing={1} sx={{ mt: 'auto' }}>
                    {appStoreUrl && (
                        <MuiButton
                            component="a"
                            href={appStoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            variant="outlined"
                            startIcon={<AppleIcon />}
                            sx={{
                                borderColor: 'rgba(108, 99, 255, 0.3)',
                                color: '#6C63FF',
                                fontSize: '0.75rem',
                                '&:hover': {
                                    borderColor: '#6C63FF',
                                    background: 'rgba(108, 99, 255, 0.1)'
                                }
                            }}
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                            App Store
                        </MuiButton>
                    )}
                    {pageUrl && (
                        <MuiButton
                            component={NextLink}
                            href={pageUrl}
                            size="small"
                            variant="text"
                            sx={{ color: '#00D9FF', fontSize: '0.75rem' }}
                        >
                            Details
                        </MuiButton>
                    )}
                </MuiStack>
            </MuiCardContent>
        </MuiCard>
    );

    if (pageUrl) {
        return (
            <MuiGrid item xs={12} sm={6} md={4}>
                <NextLink href={pageUrl} style={{ textDecoration: 'none' }}>
                    {cardContent}
                </NextLink>
            </MuiGrid>
        );
    }

    return (
        <MuiGrid item xs={12} sm={6} md={4}>
            {cardContent}
        </MuiGrid>
    );
};
