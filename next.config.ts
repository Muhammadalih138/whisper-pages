import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NODE_ENV === "development" ? ".next" : ".next",
  experimental: {
    workerThreads: false,
  },
};

export default nextConfig;
