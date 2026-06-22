import * as React from 'react';
import type * as types from 'types';
import { Button } from '../../atoms/Button';
import { Markdown } from '../../atoms/Markdown';
import { fonts } from '../../../utils/theme';

import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';

export type Props = types.CardsSection & types.StackbitFieldPath;

export const CardsSection: React.FC<Props> = (props) => {
    const { title, subtitle, items = [], 'data-sb-field-path': fieldPath } = props;
    return (
        <MuiBox component="section" data-sb-field-path={fieldPath} sx={{ py: { xs: 7, md: 11 } }}>
            {title && (
                <MuiTypography component="h2" align="center" data-sb-field-path=".title" sx={{ fontFamily: fonts.display, fontWeight: 500, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', letterSpacing: '-0.02em', color: 'var(--ink)' }}>
                    {title}
                </MuiTypography>
            )}
            {subtitle && (
                <MuiTypography component="p" align="center" data-sb-field-path=".subtitle" sx={{ mt: 1.5, fontSize: '1.05rem', color: 'var(--ink-2)', maxWidth: '52ch', mx: 'auto' }}>
                    {subtitle}
                </MuiTypography>
            )}
            {items.length > 0 && (
                <MuiBox
                    data-sb-field-path=".items"
                    sx={{ mt: { xs: 4, md: 6 }, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: { xs: 2.5, md: 3 } }}
                >
                    {items.map((item, index) => (
                        <CardsSectionItem key={index} {...item} data-sb-field-path={`.${index}`} />
                    ))}
                </MuiBox>
            )}
        </MuiBox>
    );
};

const CardsSectionItem: React.FC<types.Card & types.StackbitFieldPath> = (props) => {
    const { title, text, image, actions = [], 'data-sb-field-path': fieldPath } = props;
    return (
        <MuiBox
            data-sb-field-path={fieldPath}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                bgcolor: 'var(--paper-2)',
                border: '1px solid var(--line)',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'transform .35s cubic-bezier(.2,.7,.2,1), border-color .35s ease',
                '&:hover': { transform: 'translateY(-5px)', borderColor: 'var(--ink)' }
            }}
        >
            {image?.url && (
                <MuiBox
                    component="img"
                    src={image.url}
                    alt={image.altText}
                    data-sb-field-path=".image .image.url#@src .image.altText#@alt"
                    sx={{ width: '100%', height: 200, objectFit: 'cover', borderBottom: '1px solid var(--line)' }}
                />
            )}
            {(title || text) && (
                <MuiBox sx={{ p: 3, flexGrow: 1 }}>
                    {title && (
                        <MuiTypography component="h3" data-sb-field-path=".title" sx={{ fontFamily: fonts.display, fontWeight: 500, fontSize: '1.4rem', color: 'var(--ink)' }}>
                            {title}
                        </MuiTypography>
                    )}
                    {text && (
                        <MuiBox component="div" sx={{ mt: 1.25, color: 'var(--ink-2)', fontSize: '0.96rem', lineHeight: 1.6, '& strong': { color: 'var(--ink)' } }}>
                            <Markdown text={text} data-sb-field-path=".text" />
                        </MuiBox>
                    )}
                </MuiBox>
            )}
            {actions.length > 0 && (
                <MuiBox data-sb-field-path=".actions" sx={{ px: 3, pb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {actions.map((action, index) => (
                        <Button key={index} {...action} data-sb-field-path={`.${index}`} />
                    ))}
                </MuiBox>
            )}
        </MuiBox>
    );
};
