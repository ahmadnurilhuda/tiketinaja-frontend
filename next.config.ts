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
      // {
      //   protocol: 'https',
      //   hostname: '1e12217678df.ngrok-free.app',
      //   port: '',
      //   pathname: '/**',
      // },
    ],
  },
  serverActions: {
    bodySizeLimit: '5mb',
  },
};

export default nextConfig;
