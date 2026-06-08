import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // experimental: {
  //   authInterrupts: true,
  // },
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
