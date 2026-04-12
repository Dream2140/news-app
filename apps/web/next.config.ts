import type { NextConfig } from 'next';
import { join } from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: join(__dirname, '../..'),
  },
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
