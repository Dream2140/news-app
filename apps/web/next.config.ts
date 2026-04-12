import { resolve } from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: resolve(__dirname, '../..'),
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'virtus-img.cdnvideo.ru' },
      { protocol: 'https', hostname: '*.theguardian.com' },
      { protocol: 'https', hostname: '*.currentsapi.services' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

export default nextConfig;
