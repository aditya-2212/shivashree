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
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      {
        source: "/projects/shivashrees-mahalakshmi-swamimalai-kumbakonam",
        destination: "/projects/mahalakshmi-2-3-bhk-apartments-for-sale-in-kumbakonam",
        permanent: true,
      },
      {
        source: "/projects/shivashrees-aishwaryam-east-dabeer-kumbakonam",
        destination: "/projects/aishwaryam-2-3-bhk-apartments-for-sale-in-kumbakonam",
        permanent: true,
      },
      {
        source: "/projects/shivashrees-syamala-arumbakkam-chennai",
        destination: "/projects/syamala-3-bhk-apartments-for-sale-in-chennai",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
