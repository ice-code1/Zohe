import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add your custom config options here
  typescript:{
    ignoreBuildErrors:true
  },
  experimental: {
    serverActions: {}, // Use an empty object for serverActions
    
  },

  serverExternalPackages: ["mongoose"], // Correct option for external packages

  webpack: (config) => {
    config.cache = false; // Disable Webpack caching
    return config;
  },

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
    domains: ['utfs.io']
  },
};

export default nextConfig;
