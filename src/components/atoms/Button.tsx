import * as React from 'react';
import NextLink from 'next/link';
import type * as types from 'types';

import MuiButton from '@mui/material/Button';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import EastIcon from '@mui/icons-material/East';

export type Props = types.Button & types.StackbitFieldPath & { className?: string; sx?: { [key: string]: any } };

export const Button: React.FC<Props> = (props) => {
    const { className, label, url, size = 'medium', variant = 'text', color = 'primary', sx, 'data-sb-field-path': fieldPath } = props;
    const annotations = fieldPath ? [fieldPath, `${fieldPath}.url#@href`].join(' ').trim() : null;

    const external = /^(https?:|mailto:)/.test(url || '');
    const linkProps = external ? { component: 'a' as const, href: url, target: url.startsWith('http') ? '_blank' : undefined, rel: url.startsWith('http') ? 'noopener noreferrer' : undefined } : { component: NextLink, href: url };

    // A trailing mark keeps CTAs feeling like signposts; subtle, not loud.
    const arrow = external ? <NorthEastIcon sx={{ fontSize: 17, ml: 0.75 }} /> : <EastIcon sx={{ fontSize: 18, ml: 0.75, transition: 'transform .25s ease', '.MuiButton-root:hover &': { transform: 'translateX(3px)' } }} />;

    return (
        <MuiButton {...linkProps} className={className} variant={variant} size={size} color={color} sx={{ ...sx }} data-sb-field-path={annotations}>
            <span data-sb-field-path=".label">{label}</span>
            {(variant === 'contained' || variant === 'outlined') && arrow}
        </MuiButton>
    );
};
