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
      // --- Legacy domain: sivasree.com -> shivashreedevelopers.com ---
      // sivasree.com (and www) is served by this same Vercel project; these
      // host-conditioned redirects fire only for requests to that domain.
      // Specific mapping must come first (Next returns the first match).
      {
        source: "/flats-for-sale-in-kumbakonam",
        has: [{ type: "host", value: "(www\\.)?sivasree\\.com" }],
        destination:
          "https://www.shivashreedevelopers.com/projects/mahalakshmi-2-3-bhk-apartments-for-sale-in-kumbakonam",
        permanent: true,
      },
      {
        // Everything else on the old domain -> new homepage.
        source: "/:path*",
        has: [{ type: "host", value: "(www\\.)?sivasree\\.com" }],
        destination: "https://www.shivashreedevelopers.com",
        permanent: true,
      },
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
