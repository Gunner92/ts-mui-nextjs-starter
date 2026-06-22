import { Html, Head, Main, NextScript } from 'next/document';

// Fonts and the base paper colour live here so the first paint is already on
// warm stock (no white flash) with the right type loaded.
export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta name="theme-color" content="#F4EEE2" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,400..600,0..100;1,9..144,400..500,0..100&family=Hanken+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body style={{ backgroundColor: '#F4EEE2' }}>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
