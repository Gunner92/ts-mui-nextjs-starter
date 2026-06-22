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

const SITE = 'https://bgmobiledev.com';
const STUDIO_BLURB =
    'BG Mobile Dev — an independent iOS studio. A working index of twenty-one apps for health, travel, photography, identification and everyday life, built in Swift & SwiftUI.';

const truncate = (s: string, n = 158) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

const Page: React.FC<Props> = ({ page, siteConfig }) => {
    const isHome = page.__url === '/';
    // Each detail page already carries a unique hero subtitle — use it so every
    // URL gets its own description/OG text instead of one shared studio blurb.
    const heroSub = (page.sections ?? []).find((s): s is types.HeroSection => s.type === 'HeroSection')?.subtitle;
    const description = isHome ? STUDIO_BLURB : truncate(heroSub || STUDIO_BLURB);
    const title = isHome ? 'BG Mobile Dev — Independent iOS Studio' : `${page.title} · BG Mobile Dev`;
    const canonical = `${SITE}${page.__url === '/' ? '' : page.__url}`;
    const ogImage = `${SITE}/images/og-default.png`;

    return (
        <MuiBox
            sx={{
                minHeight: '100vh',
                position: 'relative',
                overflowX: 'clip',
                backgroundColor: 'var(--paper)',
                // Soft top vignette + a faint warm bloom — atmosphere, not glow.
                backgroundImage:
                    'radial-gradient(120% 60% at 50% -10%, rgba(210,69,30,0.05) 0%, transparent 55%),' +
                    'radial-gradient(90% 50% at 100% 0%, rgba(33,27,22,0.035) 0%, transparent 60%)',
                backgroundAttachment: 'fixed'
            }}
            data-sb-object-id={page.__id}
        >
            <Head>
                <title>{title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content={description} />
                <meta name="author" content="BG Mobile Dev" />
                <link rel="canonical" href={canonical} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="BG Mobile Dev" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={canonical} />
                <meta property="og:image" content={ogImage} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={ogImage} />
                {siteConfig.favicon && <link rel="icon" href={siteConfig.favicon} />}
            </Head>

            {siteConfig.header && <Header {...siteConfig.header} data-sb-object-id={siteConfig.__id} />}

            <MuiContainer maxWidth="lg" disableGutters sx={{ position: 'relative', zIndex: 1, px: { xs: 2.5, sm: 4, md: 5 } }}>
                {(page.sections ?? []).length > 0 && (
                    <MuiBox component="main" data-sb-field-path="sections">
                        {(page.sections ?? []).map((section, index) => (
                            <DynamicComponent key={index} {...section} data-sb-field-path={`.${index}`} />
                        ))}
                    </MuiBox>
                )}
            </MuiContainer>

            {siteConfig.footer && <Footer {...siteConfig.footer} data-sb-object-id={siteConfig.__id} />}
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
