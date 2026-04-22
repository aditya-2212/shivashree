import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import BlogPostForm from "@/components/admin/BlogPostForm";

export default async function NewBlogPostPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <nav className="text-sm text-stone-400 mb-1">
          <a href="/admin/blog" className="hover:text-stone-600">Blog Posts</a> / New Post
        </nav>
        <h1 className="text-2xl font-bold text-stone-900">Write New Post</h1>
        <p className="text-stone-500 text-sm mt-1">
          Save as a draft to review before publishing.
        </p>
      </div>
      <BlogPostForm mode="create" />
    </div>
  );
}
