import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9988',
        pathname: '/uploads/**',
      },
    ],
  },
  serverActions: {
    bodySizeLimit: '5mb',
  },
};

export default nextConfig;
