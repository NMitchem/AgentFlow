import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {},
    appDir: true
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        // Map root app directory to src/app
        "@/app": "/Users/noahmitchem/Documents/Agentic LLM/opensource/src/app"
      }
    };
    return config;
  }
};

export default nextConfig;
