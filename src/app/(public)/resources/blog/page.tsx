import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import { blogListingDefaults as D } from "@/lib/site-defaults";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  return {
    title: s?.blogMetaTitle?.trim() || D.metaTitle,
    description: s?.blogMetaDescription?.trim() || D.metaDescription,
  };
}

export default async function BlogPage() {
  const [posts, s] = await Promise.all([
    prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        authorName: true,
        category: true,
        publishedAt: true,
        readTimeMinutes: true,
      },
    }),
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
  ]);

  return (
    <>
      {/* Header */}
      <section className="pt-36 pb-16 bg-brand-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-brand-blue-200 font-semibold text-sm uppercase tracking-widest mb-3">
            {s?.blogHeroEyebrow?.trim() || D.heroEyebrow}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {s?.blogHeroHeading?.trim() || D.heroHeading}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            {s?.blogHeroIntro?.trim() || D.heroIntro}
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-stone-400">
              <p className="text-lg">{s?.blogEmptyText?.trim() || D.emptyText}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/resources/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-stone-100"
                >
                  {/* Cover image */}
                  <div className="relative h-48 bg-stone-200 overflow-hidden">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-purple-100 to-brand-purple-50 flex items-center justify-center">
                        <span className="text-brand-purple-500 font-bold text-2xl">
                          {post.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    {post.category && (
                      <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-stone-700">
                        {post.category}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h2 className="font-bold text-stone-900 text-lg mb-2 leading-snug group-hover:text-brand-purple-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-stone-500 text-sm leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                      <div className="flex items-center gap-3 text-xs text-stone-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.authorName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTimeMinutes} min
                        </span>
                        {post.publishedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.publishedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {posts.length > 0 && (
        <section className="py-10 bg-stone-50 border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-stone-700">
              {s?.blogCtaText?.trim() || D.ctaText}{" "}
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-brand-purple-700 font-semibold hover:text-brand-purple-800 transition"
            >
              {s?.blogCtaButtonLabel?.trim() || D.ctaButtonLabel}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
