import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "utfs.io",
        },
        {
          protocol: "https",
          hostname: "lh3.googleusercontent.com",
        },
        {
          protocol: "https",
          hostname: "googleusercontent.com",
        },
        {
          protocol: 'https',
          hostname: 'placehold.co',
          port: '',
          pathname: '/**',
        },
        {
          protocol: "https",
          hostname: "images.unsplash.com",
        },
      ],
    },
    turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
