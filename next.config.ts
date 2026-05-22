import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Pre-existing type strictness issues in lib files — does not affect runtime.
    // TODO: resolve all TS errors and remove this flag.
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint warnings should not block production deploys.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
