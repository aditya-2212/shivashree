import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

/**
 * Cached site settings — shared across all public pages.
 * Tagged so admin saves can bust it immediately via revalidateTag("settings").
 */
export const getSettings = unstable_cache(
  async () => prisma.siteSettings.findUnique({ where: { id: 1 } }),
  ["site-settings"],
  { revalidate: 3600, tags: ["settings"] }
);

/**
 * Cached published property list for the Navbar and listings.
 * Tagged so admin saves can bust it immediately via revalidateTag("properties").
 */
export const getPublishedProperties = unstable_cache(
  async () =>
    prisma.property.findMany({
      where: { isPublished: true },
      select: { title: true, slug: true, status: true },
      orderBy: { title: "asc" },
    }),
  ["published-properties"],
  { revalidate: 3600, tags: ["properties"] }
);
