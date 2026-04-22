import { MetadataRoute } from "next";

const baseUrl = process.env.NEXTAUTH_URL ?? "https://shivashreedev.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
