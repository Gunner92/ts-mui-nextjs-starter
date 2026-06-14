/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Ensure every privacy-policy URL our apps reference on this domain resolves.
    // Apps link to /privacy and /privacy/<app>; consolidate them all to /privacy-policy.
    async redirects() {
        return [
            { source: '/privacy', destination: '/privacy-policy', permanent: false },
            { source: '/privacy/:path*', destination: '/privacy-policy', permanent: false },
            // Mywellness' App Store privacy URL points here (legacy path); keep it valid.
            { source: '/majoritygoals', destination: '/privacy-policy', permanent: false }
        ];
    }
};

module.exports = nextConfig;