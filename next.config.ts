import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
  // output: "standalone" is only needed for VPS / Docker deploys.
  // Vercel manages its own bundling, so we leave this unset.
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
