import * as React from 'react';
import type * as types from 'types';
import { Markdown } from '../../atoms/Markdown';

import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';

export type Props = types.PrivacySection & types.StackbitFieldPath;

export const PrivacySection: React.FC<Props> = (props) => {
    const { title, content, lastUpdated, 'data-sb-field-path': fieldPath } = props;
    return (
        <MuiBox
            sx={{
                py: { xs: 6, sm: 10 },
                maxWidth: 800,
                mx: 'auto'
            }}
            data-sb-field-path={fieldPath}
        >
            {title && (
                <MuiTypography
                    component="h1"
                    variant="h3"
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                        background: 'linear-gradient(135deg, #ffffff 0%, #a0a0b8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                    data-sb-field-path=".title"
                >
                    {title}
                </MuiTypography>
            )}
            {lastUpdated && (
                <MuiTypography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    Last Updated: {lastUpdated}
                </MuiTypography>
            )}
            {content && (
                <MuiBox
                    sx={{
                        '& h2': {
                            color: '#6C63FF',
                            mt: 4,
                            mb: 2,
                            fontSize: '1.4rem',
                            fontWeight: 600
                        },
                        '& h3': {
                            color: '#ffffff',
                            mt: 3,
                            mb: 1.5,
                            fontSize: '1.15rem',
                            fontWeight: 600
                        },
                        '& p': {
                            color: '#a0a0b8',
                            lineHeight: 1.8,
                            mb: 2
                        },
                        '& ul, & ol': {
                            color: '#a0a0b8',
                            pl: 3,
                            mb: 2
                        },
                        '& li': {
                            mb: 0.5
                        },
                        '& a': {
                            color: '#00D9FF',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline'
                            }
                        }
                    }}
                >
                    <MuiTypography component="div" color="text.secondary">
                        <Markdown text={content} data-sb-field-path=".content" />
                    </MuiTypography>
                </MuiBox>
            )}
        </MuiBox>
    );
};
