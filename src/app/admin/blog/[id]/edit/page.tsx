import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BlogPostForm from "@/components/admin/BlogPostForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id: parseInt(id) } });
  if (!post) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <nav className="text-sm text-stone-400 mb-1">
          <a href="/admin/blog" className="hover:text-stone-600">Blog Posts</a> / Edit
        </nav>
        <h1 className="text-2xl font-bold text-stone-900">Edit Post</h1>
      </div>
      <BlogPostForm mode="edit" initialData={post} />
    </div>
  );
}
