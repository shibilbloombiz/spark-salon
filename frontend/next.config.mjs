import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  'http://localhost:5000';

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  transpilePackages: ['three'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 390, 414, 640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/hero/sequence/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/works/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/admin/:path*',
        destination: `${BACKEND_URL}/api/admin/:path*`,
      },
      {
        source: '/api/studios/:path*',
        destination: `${BACKEND_URL}/api/studios/:path*`,
      },
      {
        source: '/api/studios',
        destination: `${BACKEND_URL}/api/studios`,
      },
      {
        source: '/api/services/:path*',
        destination: `${BACKEND_URL}/api/services/:path*`,
      },
      {
        source: '/api/services',
        destination: `${BACKEND_URL}/api/services`,
      },
      {
        source: '/api/artists/:path*',
        destination: `${BACKEND_URL}/api/artists/:path*`,
      },
      {
        source: '/api/artists',
        destination: `${BACKEND_URL}/api/artists`,
      },
      {
        source: '/api/products/:path*',
        destination: `${BACKEND_URL}/api/products/:path*`,
      },
      {
        source: '/api/products',
        destination: `${BACKEND_URL}/api/products`,
      },
      {
        source: '/api/academy/:path*',
        destination: `${BACKEND_URL}/api/academy/:path*`,
      },
      {
        source: '/api/academy',
        destination: `${BACKEND_URL}/api/academy`,
      },
      {
        source: '/api/media',
        destination: `${BACKEND_URL}/api/media`,
      },
      {
        source: '/api/pages/:path*',
        destination: `${BACKEND_URL}/api/pages/:path*`,
      },
      {
        source: '/api/settings',
        destination: `${BACKEND_URL}/api/settings`,
      },
      {
        source: '/uploads/:path*',
        destination: `${BACKEND_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
