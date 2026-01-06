/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'api.aquagas.com'],
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.aquagas.com',
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/account/login',
        permanent: true,
      },
      {
        source: '/register',
        destination: '/account/login',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    // Ensure the base API URL includes the protocol
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://api.aquagas.com').replace(/\/$/, ''); // optional: trim trailing slash

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`, // This should now be e.g., https://api.aquagas.com/:path*
      },
    ];
  },
};

module.exports = nextConfig;