import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, User, ArrowLeft, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return {};

  return {
    title: post.seoTitle?.trim() || post.title,
    description: post.seoDescription?.trim() || post.excerpt,
    openGraph: {
      type: "article",
      images: post.coverImage ? [post.coverImage] : [],
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.authorName],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug, isPublished: true },
  });

  if (!post) notFound();

  const recentPosts = await prisma.blogPost.findMany({
    where: { isPublished: true, slug: { not: slug } },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: { title: true, slug: true, coverImage: true, publishedAt: true, readTimeMinutes: true },
  });

  return (
    <>
      {/* Breadcrumb */}
      <nav className="pt-24 pb-4 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ol className="flex items-center gap-2 text-sm text-stone-400">
            <li><Link href="/" className="hover:text-stone-600">Home</Link></li>
            <ChevronRight className="w-4 h-4" />
            <li><Link href="/resources/blog" className="hover:text-stone-600">Notes &amp; guides</Link></li>
            <ChevronRight className="w-4 h-4" />
            <li className="text-stone-700 font-medium truncate max-w-xs">{post.title}</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main */}
          <article className="lg:col-span-2">
            {post.category && (
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-brand-purple-100 text-brand-purple-600 mb-4">
                {post.category}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight mb-4">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-5 text-sm text-stone-500 mb-6 pb-6 border-b border-stone-200">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {post.authorName}
              </span>
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.publishedAt.toISOString()}>
                    {formatDate(post.publishedAt)}
                  </time>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readTimeMinutes} min read
              </span>
            </div>

            {/* Cover image — natural aspect ratio, no crop */}
            {post.coverImage && (
              <div className="rounded-2xl overflow-hidden mb-8 bg-stone-100 border border-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-auto block"
                />
              </div>
            )}

            {/* Body */}
            <div
              className="prose prose-stone max-w-none"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />

            {/* Back link */}
            <div className="mt-10 pt-8 border-t border-stone-200">
              <Link
                href="/resources/blog"
                className="inline-flex items-center gap-2 text-stone-500 hover:text-brand-purple-700 text-sm transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to all notes
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Author */}
            <div className="bg-brand-purple-50 border border-brand-purple-100 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-brand-purple-200 rounded-full flex items-center justify-center">
                  <span className="font-bold text-brand-purple-700">
                    {post.authorName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-stone-800 text-sm">{post.authorName}</p>
                  <p className="text-stone-400 text-xs">Shivashree Developers</p>
                </div>
              </div>
            </div>

            {/* Recent posts */}
            {recentPosts.length > 0 && (
              <div className="bg-white border border-stone-200 rounded-2xl p-5">
                <h3 className="font-bold text-stone-900 mb-4 text-sm">
                  Other notes
                </h3>
                <div className="space-y-4">
                  {recentPosts.map((rp) => (
                    <Link
                      key={rp.slug}
                      href={`/resources/blog/${rp.slug}`}
                      className="flex gap-3 group"
                    >
                      {rp.coverImage && (
                        <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-stone-100 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={rp.coverImage}
                            alt={rp.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-800 group-hover:text-brand-purple-600 transition line-clamp-2 leading-snug">
                          {rp.title}
                        </p>
                        <p className="text-xs text-stone-400 mt-1">
                          {rp.readTimeMinutes} min read
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-brand-purple-900 rounded-2xl p-5 text-white">
              <p className="text-white/70 text-xs uppercase tracking-wider font-semibold mb-2">
                In the meantime
              </p>
              <h3 className="font-bold mb-3 leading-snug">
                See what we&rsquo;re building right now.
              </h3>
              <Link
                href="/projects"
                className="block text-center bg-white text-brand-purple-700 font-semibold py-2.5 rounded-xl hover:bg-brand-purple-50 transition text-sm"
              >
                Current projects
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
