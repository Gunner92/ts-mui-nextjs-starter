import * as React from 'react';
import type * as types from 'types';
import { Button } from '../../atoms/Button';
import { Markdown } from '../../atoms/Markdown';

import MuiBox from '@mui/material/Box';
import MuiGrid from '@mui/material/Grid';
import MuiStack from '@mui/material/Stack';
import MuiTypography from '@mui/material/Typography';

export type Props = types.HeroSection & types.StackbitFieldPath;

export const HeroSection: React.FC<Props> = (props) => {
    const { title, subtitle, text, image, actions = [], 'data-sb-field-path': fieldPath } = props;
    const hasTextContent = !!title || !!subtitle || !!text || actions.length > 0;

    return (
        <MuiBox
            sx={{
                py: { xs: 8, sm: 12 },
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    left: '-20%',
                    width: '60%',
                    height: '100%',
                    background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)',
                    pointerEvents: 'none'
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-30%',
                    right: '-10%',
                    width: '50%',
                    height: '80%',
                    background: 'radial-gradient(circle, rgba(0,217,255,0.05) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }
            }}
            data-sb-field-path={fieldPath}
        >
            <MuiGrid container spacing={6} alignItems="center">
                {hasTextContent && (
                    <MuiGrid item xs={12} md={image?.url ? 6 : 12}>
                        {title && (
                            <MuiTypography
                                component="h1"
                                variant="h2"
                                data-sb-field-path=".title"
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #a0a0b8 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    lineHeight: 1.2
                                }}
                            >
                                {title}
                            </MuiTypography>
                        )}
                        {subtitle && (
                            <MuiTypography
                                component="p"
                                variant="h5"
                                sx={{
                                    mt: 2,
                                    color: '#6C63FF',
                                    fontWeight: 500
                                }}
                                data-sb-field-path=".subtitle"
                            >
                                {subtitle}
                            </MuiTypography>
                        )}
                        {text && (
                            <MuiTypography
                                component="div"
                                color="text.secondary"
                                sx={{
                                    mt: 3,
                                    maxWidth: 'md',
                                    '& p': { lineHeight: 1.8 },
                                    '& strong': { color: '#ffffff' },
                                    '& h3': { color: '#6C63FF', mt: 3, mb: 1 }
                                }}
                            >
                                <Markdown text={text} data-sb-field-path=".text" />
                            </MuiTypography>
                        )}
                        {actions.length > 0 && (
                            <MuiStack
                                sx={{ mt: 4 }}
                                direction="row"
                                alignItems="center"
                                justifyContent="flex-start"
                                flexWrap="wrap"
                                data-sb-field-path=".actions"
                            >
                                {actions.map((action, index) => (
                                    <Button
                                        key={index}
                                        {...action}
                                        sx={{ mr: 2, mb: 2 }}
                                        data-sb-field-path={`.${index}`}
                                    />
                                ))}
                            </MuiStack>
                        )}
                    </MuiGrid>
                )}
                {image?.url && (
                    <MuiGrid item xs={12} md={hasTextContent ? 6 : 12}>
                        <MuiBox
                            component="img"
                            sx={{
                                height: 'auto',
                                maxWidth: '100%',
                                width: '100%',
                                borderRadius: 4,
                                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                                border: '1px solid rgba(108, 99, 255, 0.15)'
                            }}
                            alt={image?.altText}
                            src={image?.url}
                            data-sb-field-path=".image .image.url#@src .image.altText#@alt"
                        />
                    </MuiGrid>
                )}
            </MuiGrid>
        </MuiBox>
    );
};
