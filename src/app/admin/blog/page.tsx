import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import BlogListActions from "@/components/admin/BlogListActions";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const { filter } = await searchParams;
  const isPublishedFilter =
    filter === "drafts" ? false : filter === "published" ? true : undefined;

  const posts = await prisma.blogPost.findMany({
    where: isPublishedFilter !== undefined ? { isPublished: isPublishedFilter } : undefined,
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Notes &amp; guides</h1>
          <p className="text-stone-500 text-sm mt-1">
            {posts.length === 0
              ? "Nothing written yet."
              : `${posts.length} ${posts.length === 1 ? "piece" : "pieces"} of writing — published and in progress.`}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-brand-purple-600 hover:bg-brand-purple-700 text-white font-semibold px-4 py-2.5 rounded-lg transition text-sm"
        >
          <Plus className="w-4 h-4" />
          Start a new note
        </Link>
      </div>

      <div className="flex gap-1 mb-5 bg-stone-100 rounded-lg p-1 w-fit">
        {[
          { label: "Everything", value: undefined },
          { label: "Live on the site", value: "published" },
          { label: "Still drafting", value: "drafts" },
        ].map((tab) => (
          <Link
            key={tab.label}
            href={tab.value ? `/admin/blog?filter=${tab.value}` : "/admin/blog"}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
              filter === tab.value || (!filter && !tab.value)
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-16 text-center">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-7 h-7 text-stone-400" />
          </div>
          <h3 className="text-stone-700 font-semibold mb-1">Nothing written yet</h3>
          <p className="text-stone-400 text-sm mb-4">
            Use this space for buyer guides, project updates, neighbourhood notes — anything you&rsquo;d normally explain over a phone call.
          </p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 bg-brand-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-purple-700 transition"
          >
            <Plus className="w-4 h-4" />
            Start the first note
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50 transition-colors">
              {post.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-16 h-12 object-cover rounded-lg shrink-0 border border-stone-200"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-semibold text-stone-900 text-sm truncate">{post.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    post.isPublished
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-stone-100 text-stone-500"
                  }`}>
                    {post.isPublished ? "Live" : "Draft"}
                  </span>
                  {post.category && (
                    <span className="text-xs px-2 py-0.5 bg-brand-blue-50 text-brand-blue-700 rounded-full">
                      {post.category}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-stone-400">
                  <span>By {post.authorName}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.updatedAt)}
                  </span>
                  <span>{post.readTimeMinutes} min read</span>
                </div>
              </div>
              <BlogListActions id={post.id} isPublished={post.isPublished} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
