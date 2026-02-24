import * as React from 'react';
import type * as types from 'types';
import { Button } from '../../atoms/Button';
import { Markdown } from '../../atoms/Markdown';

import MuiBox from '@mui/material/Box';
import MuiCard from '@mui/material/Card';
import MuiCardActions from '@mui/material/CardActions';
import MuiCardContent from '@mui/material/CardContent';
import MuiCardMedia from '@mui/material/CardMedia';
import MuiGrid from '@mui/material/Grid';
import MuiTypography from '@mui/material/Typography';

export type Props = types.CardsSection & types.StackbitFieldPath;

export const CardsSection: React.FC<Props> = (props) => {
    const { title, subtitle, items = [], 'data-sb-field-path': fieldPath } = props;
    return (
        <MuiBox sx={{ py: { xs: 6, sm: 10 } }} data-sb-field-path={fieldPath}>
            {title && (
                <MuiTypography
                    component="h2"
                    variant="h3"
                    align="center"
                    sx={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #a0a0b8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 700
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
                    sx={{ ...(!!title && { mt: 1 }) }}
                    data-sb-field-path=".subtitle"
                >
                    {subtitle}
                </MuiTypography>
            )}
            {items.length > 0 && (
                <MuiGrid container spacing={4} sx={{ ...(!!(title || subtitle) && { pt: 6 }) }} data-sb-field-path=".items">
                    {items.map((item, index) => (
                        <CardsSectionItem key={index} {...item} titleTag={title ? 'h3' : 'h2'} data-sb-field-path={`.${index}`} />
                    ))}
                </MuiGrid>
            )}
        </MuiBox>
    );
};

const CardsSectionItem: React.FC<types.Card & types.StackbitFieldPath & { titleTag?: 'h3' | 'h2' }> = (props) => {
    const { title, text, image, actions = [], titleTag = 'h3', 'data-sb-field-path': fieldPath } = props;
    return (
        <MuiGrid item xs={12} sm={6} md={4}>
            <MuiCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} data-sb-field-path={fieldPath}>
                {image?.url && (
                    <MuiCardMedia
                        component="img"
                        image={image.url}
                        alt={image.altText}
                        sx={{
                            height: 200,
                            objectFit: 'cover'
                        }}
                        data-sb-field-path=".image .image.url#@src .image.altText#@alt"
                    />
                )}
                {(title || text) && (
                    <MuiCardContent sx={{ flexGrow: 1 }}>
                        {title && (
                            <MuiTypography
                                component={titleTag}
                                variant="h5"
                                color="text.primary"
                                sx={{ fontWeight: 600 }}
                                data-sb-field-path=".title"
                            >
                                {title}
                            </MuiTypography>
                        )}
                        {text && (
                            <MuiTypography
                                component="div"
                                color="text.secondary"
                                sx={{
                                    mt: 1,
                                    '& strong': { color: '#ffffff' }
                                }}
                            >
                                <Markdown text={text} data-sb-field-path=".text" />
                            </MuiTypography>
                        )}
                    </MuiCardContent>
                )}
                {actions.length > 0 && (
                    <MuiCardActions sx={{ px: 2, pb: 2 }} data-sb-field-path=".actions">
                        {actions.map((action, index) => (
                            <Button key={index} {...action} data-sb-field-path={`.${index}`} />
                        ))}
                    </MuiCardActions>
                )}
            </MuiCard>
        </MuiGrid>
    );
};
