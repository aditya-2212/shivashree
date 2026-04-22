import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const baseUrl = process.env.NEXTAUTH_URL ?? "https://shivashreedev.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let properties: { slug: string; updatedAt: Date }[] = [];
  let blogPosts: { slug: string; publishedAt: Date | null; updatedAt: Date }[] = [];

  try {
    [properties, blogPosts] = await Promise.all([
      prisma.property.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.blogPost.findMany({
        where: { isPublished: true },
        select: { slug: true, publishedAt: true, updatedAt: true },
      }),
    ]);
  } catch {
    // Database unavailable at build time — return static routes only
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resources/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources/faqs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const propertyRoutes: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${baseUrl}/resources/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...propertyRoutes, ...blogRoutes];
}
