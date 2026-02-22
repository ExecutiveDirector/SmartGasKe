/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'https://aquagas-backend.onrender.com/api/v1'],
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://aquagas-backend.onrender.com/api/v1',
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
};

module.exports = nextConfig;
