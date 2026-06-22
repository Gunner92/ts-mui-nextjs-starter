import * as React from 'react';
import type * as types from 'types';
import { Markdown } from '../../atoms/Markdown';
import { fonts } from '../../../utils/theme';

import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';

export type Props = types.PrivacySection & types.StackbitFieldPath;

export const PrivacySection: React.FC<Props> = (props) => {
    const { title, content, lastUpdated, 'data-sb-field-path': fieldPath } = props;
    return (
        <MuiBox component="article" data-sb-field-path={fieldPath} sx={{ py: { xs: 6, md: 10 }, maxWidth: 760, mx: 'auto' }}>
            <MuiBox component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.25, mb: 3 }}>
                <MuiBox sx={{ width: 9, height: 9, bgcolor: 'var(--accent)', borderRadius: '1px' }} />
                <MuiBox component="span" sx={{ fontFamily: fonts.mono, fontSize: '0.7rem', letterSpacing: '0.22em', color: 'var(--ink-2)' }}>
                    LEGAL
                </MuiBox>
            </MuiBox>

            {title && (
                <MuiTypography component="h1" data-sb-field-path=".title" sx={{ fontFamily: fonts.display, fontWeight: 500, fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', lineHeight: 1.04, letterSpacing: '-0.02em', color: 'var(--ink)', mb: 1.5 }}>
                    {title}
                </MuiTypography>
            )}
            {lastUpdated && (
                <MuiTypography sx={{ fontFamily: fonts.mono, fontSize: '0.74rem', letterSpacing: '0.06em', color: 'var(--ink-3)', mb: 4, pb: 4, borderBottom: '1px solid var(--line)' }}>
                    LAST UPDATED — {lastUpdated}
                </MuiTypography>
            )}
            {content && (
                <MuiBox
                    sx={{
                        fontSize: '1rem',
                        color: 'var(--ink-2)',
                        '& h2': { fontFamily: fonts.display, color: 'var(--ink)', mt: 5, mb: 2, fontSize: '1.6rem', fontWeight: 500, letterSpacing: '-0.01em' },
                        '& h3': { fontFamily: fonts.display, color: 'var(--ink)', mt: 3.5, mb: 1.5, fontSize: '1.2rem', fontWeight: 500 },
                        '& p': { lineHeight: 1.78, mb: 2.2 },
                        '& ul, & ol': { pl: 0, listStyle: 'none', mb: 2.5 },
                        '& li': { position: 'relative', pl: 3.25, mb: 1.1, lineHeight: 1.7, '&::before': { content: '"—"', position: 'absolute', left: 0, color: 'var(--accent)' } },
                        '& strong': { color: 'var(--ink)', fontWeight: 700 },
                        '& a': { color: 'var(--accent-deep)', textDecoration: 'underline', textUnderlineOffset: '3px', textDecorationColor: 'var(--line-strong)', '&:hover': { textDecorationColor: 'var(--accent)' } }
                    }}
                >
                    <Markdown text={content} data-sb-field-path=".content" />
                </MuiBox>
            )}
        </MuiBox>
    );
};
