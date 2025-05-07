import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  assetPrefix: process.env.NODE_ENV === 'development' ? undefined : undefined,
  experimental: {
    optimizeFonts: true
  }
};

export default nextConfig;
