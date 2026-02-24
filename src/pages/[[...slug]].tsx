import * as React from 'react';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import type * as types from 'types';
import { DynamicComponent } from '../components/DynamicComponent';
import { Header } from '../components/sections/Header';
import { Footer } from '../components/sections/Footer';
import { pagesByType, siteConfig, urlToContent } from '../utils/content';

import MuiBox from '@mui/material/Box';
import MuiContainer from '@mui/material/Container';

export type Props = { page: types.Page; siteConfig: types.Config };

const Page: React.FC<Props> = ({ page, siteConfig }) => {
    return (
        <MuiBox
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #0a0a1a 0%, #0d0d24 50%, #0a0a1a 100%)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(ellipse at 20% 20%, rgba(108, 99, 255, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(0, 217, 255, 0.04) 0%, transparent 50%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }
            }}
            data-sb-object-id={page.__id}
        >
            <MuiContainer maxWidth="lg" disableGutters sx={{ position: 'relative', zIndex: 1, px: { xs: 2, sm: 3 } }}>
                <Head>
                    <title>{page.title} | BG Mobile Dev</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta name="description" content="BG Mobile Dev - Innovative iOS applications crafted with care" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
                    {siteConfig.favicon && <link rel="icon" href={siteConfig.favicon} />}
                </Head>
                {siteConfig.header && <Header {...siteConfig.header} data-sb-object-id={siteConfig.__id} />}
                {(page.sections ?? []).length > 0 && (
                    <MuiBox component="main" data-sb-field-path="sections">
                        {(page.sections ?? []).map((section, index) => (
                            <DynamicComponent key={index} {...section} data-sb-field-path={`.${index}`} />
                        ))}
                    </MuiBox>
                )}
                {siteConfig.footer && <Footer {...siteConfig.footer} data-sb-object-id={siteConfig.__id} />}
            </MuiContainer>
        </MuiBox>
    );
};

export default Page;

export const getStaticPaths: GetStaticPaths = () => {
    const pages = pagesByType('Page');
    return {
        paths: Object.keys(pages),
        fallback: false
    };
};

export const getStaticProps: GetStaticProps<Props, { slug: string[] }> = ({ params }) => {
    const url = '/' + (params?.slug || []).join('/');
    const page = urlToContent(url) as types.Page;
    return { props: { page, siteConfig: siteConfig() } };
};
